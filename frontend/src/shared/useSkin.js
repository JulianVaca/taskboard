import { useEffect, useState } from "react";

const KEY = "taskboard-skin";
export const SKINS = ["classic", "comic", "brutal"];

const THEME_COLOR = {
  classic: { light: "#7c3aed", dark: "#7c3aed" },
  comic: { light: "#29c5f6", dark: "#170c34" },
  brutal: { light: "#F5AB99", dark: "#351C4D" },
};

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    if (SKINS.includes(v)) return v;
  } catch {
    /* almacenamiento no disponible */
  }
  return "comic";
}

/** Estilo visual de la interfaz (clásico, cómic o neo-brutalista), recordado en este navegador. */
export function useSkin(theme) {
  const [skin, setSkinState] = useState(readStored);

  useEffect(() => {
    document.documentElement.dataset.skin = skin;
  }, [skin]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLOR[skin][theme === "dark" ? "dark" : "light"];
  }, [skin, theme]);

  const setSkin = (next) => {
    setSkinState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* el estilo dura solo esta sesión */
    }
  };

  return { skin, setSkin };
}
