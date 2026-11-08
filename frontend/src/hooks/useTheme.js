import { useEffect, useState } from "react";

const KEY = "taskboard-theme";
const query = () => window.matchMedia("(prefers-color-scheme: dark)");

function readStored() {
  try {
    return localStorage.getItem(KEY) || "system";
  } catch {
    return "system";
  }
}

/** Tema claro/oscuro: sigue al sistema hasta que la persona elige uno. */
export function useTheme() {
  const [theme, setTheme] = useState(readStored);
  const [systemDark, setSystemDark] = useState(() => query().matches);

  useEffect(() => {
    const mq = query();
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  }, [resolved]);

  const toggle = () => {
    const next = resolved === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* almacenamiento no disponible: el tema dura solo esta sesión */
    }
  };

  return { theme: resolved, toggle };
}
