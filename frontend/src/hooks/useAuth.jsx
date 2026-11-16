import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, onSessionExpired, setToken } from "../api.js";

const AuthContext = createContext(null);

/** Lee el nombre y el id guardados dentro del token (sin pedirlos al servidor). */
function userFromToken(token) {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    if (payload.exp * 1000 < Date.now()) return null; // token vencido
    return { id: Number(payload.sub), name: payload.name };
  } catch {
    return null;
  }
}

/** Sesión de la persona: quién es, entrar, registrarse y salir. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => userFromToken(getToken()));
  const [notice, setNotice] = useState(null); // mensaje para la pantalla de login

  useEffect(() => {
    if (!user) setToken(null); // limpia tokens vencidos o dañados
    onSessionExpired(() => {
      setToken(null);
      setUser(null);
      setNotice("auth.expired");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback((data, fresh) => {
    setToken(data.token);
    setNotice(null);
    setUser({ ...data.user, fresh });
  }, []);

  const login = useCallback(async (email, password) => start(await api.login(email, password), "login"), [start]);

  const register = useCallback(
    async (name, email, password) => start(await api.register(name, email, password), "register"),
    [start]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, notice, login, register, logout }), [user, notice, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}