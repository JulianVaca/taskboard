// Cliente de la API REST. VITE_API_URL se incrusta al compilar (ver README).
const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const TIMEOUT_MS = 70_000; // el plan gratuito de Render puede tardar ~1 min en despertar
const TOKEN_KEY = "taskboard-token";

// El token de sesión se guarda en este navegador para no pedir login en cada visita.
let token = (() => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
})();

export const getToken = () => token;

export function setToken(next) {
  token = next;
  try {
    if (next) localStorage.setItem(TOKEN_KEY, next);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* almacenamiento no disponible: la sesión dura solo mientras la pestaña esté abierta */
  }
}

// Se llama cuando la API rechaza el token (expiró o es inválido).
let sessionExpired = () => {};
export const onSessionExpired = (fn) => {
  sessionExpired = fn;
};

/** code: "timeout" | "network" | "http"; la interfaz lo traduce al idioma activo. */
export class ApiError extends Error {
  constructor(message, status, code = "http") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = "GET", body, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => controller.abort());

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new ApiError(
      controller.signal.aborted
        ? "La API tardó demasiado en responder. Intenta de nuevo."
        : "No se pudo conectar con la API. Revisa tu conexión o intenta en unos segundos.",
      0,
      controller.signal.aborted ? "timeout" : "network"
    );
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401 && headers.Authorization) sessionExpired();
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error || `Error ${res.status}`, res.status);
  return data;
}

export const api = {
  url: API,
  health: (opts) => request("/api/health", opts),
  register: (name, email, password) => request("/api/auth/register", { method: "POST", body: { name, email, password } }),
  login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
  forgotPassword: (email) => request("/api/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (email, code, password) => request("/api/auth/reset-password", { method: "POST", body: { email, code, password } }),
  list: (opts) => request("/api/tasks", opts),
  create: (title) => request("/api/tasks", { method: "POST", body: { title } }),
  setDone: (id, done) => request(`/api/tasks/${id}`, { method: "PATCH", body: { done } }),
  rename: (id, title) => request(`/api/tasks/${id}`, { method: "PATCH", body: { title } }),
  remove: (id) => request(`/api/tasks/${id}`, { method: "DELETE" }),
};