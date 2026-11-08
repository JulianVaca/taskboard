// Cliente de la API REST. VITE_API_URL se incrusta al compilar (ver README).
const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const TIMEOUT_MS = 70_000; // el plan gratuito de Render puede tardar ~1 min en despertar

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => controller.abort());

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new ApiError(
      controller.signal.aborted
        ? "La API tardó demasiado en responder. Intenta de nuevo."
        : "No se pudo conectar con la API. Revisa tu conexión o intenta en unos segundos.",
      0
    );
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error || `Error ${res.status}`, res.status);
  return data;
}

export const api = {
  url: API,
  health: (opts) => request("/api/health", opts),
  list: (opts) => request("/api/tasks", opts),
  create: (title) => request("/api/tasks", { method: "POST", body: { title } }),
  setDone: (id, done) => request(`/api/tasks/${id}`, { method: "PATCH", body: { done } }),
  rename: (id, title) => request(`/api/tasks/${id}`, { method: "PATCH", body: { title } }),
  remove: (id) => request(`/api/tasks/${id}`, { method: "DELETE" }),
};
