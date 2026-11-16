import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const MAX = 30; // cuántas notificaciones se guardan en el historial
const NotificationsContext = createContext(null);

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento: el historial dura solo esta sesión */
  }
}

/**
 * Notificaciones: muestra el aviso flotante (toast) y además lo guarda en un historial
 * por usuario, que se ve en la campanita. "seenAt" marca hasta cuándo ya se leyeron.
 */
export function NotificationsProvider({ userId, children }) {
  const key = `taskboard-notifs-${userId}`;
  const [items, setItems] = useState(() => read(key, []));
  const [seenAt, setSeenAt] = useState(() => read(`${key}-seen`, 0));

  useEffect(() => write(key, items), [key, items]);
  useEffect(() => write(`${key}-seen`, seenAt), [key, seenAt]);

  /** type: "success" | "info" | "error" */
  const notify = useCallback((type, title, description) => {
    const show = type === "success" ? toast.success : type === "error" ? toast.error : toast;
    show(title, description ? { description } : undefined);
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      title,
      description: description || "",
      at: new Date().toISOString(),
    };
    setItems((prev) => [item, ...prev].slice(0, MAX));
  }, []);

  const markRead = useCallback(() => setSeenAt(Date.now()), []);
  const clear = useCallback(() => setItems([]), []);
  const unread = items.filter((n) => Date.parse(n.at) > seenAt).length;

  const value = useMemo(
    () => ({ items, unread, seenAt, notify, markRead, clear }),
    [items, unread, seenAt, notify, markRead, clear]
  );
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de <NotificationsProvider>");
  return ctx;
}