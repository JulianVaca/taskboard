import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "taskboard-lang";

const plural = (n, one, many) => (n === 1 ? one : many);

const DICT = {
  es: {
    "brand.home": "TaskBoard, inicio",
    "status.online": "API en línea",
    "status.checking": "Conectando…",
    "status.waking": "Despertando servidor",
    "status.offline": "API sin conexión",
    "status.short.online": "En línea",
    "status.short.checking": "Conectando",
    "status.short.waking": "Despertando",
    "status.short.offline": "Sin conexión",
    "lang.label": "Idioma",
    "theme.toLight": "Cambiar a tema claro",
    "theme.toDark": "Cambiar a tema oscuro",
    "greet.morning": "¡Buenos días!",
    "greet.afternoon": "¡Buenas tardes!",
    "greet.night": "¡Buenas noches!",
    "hero.loading": "Cargando tu tablero…",
    "hero.empty": "Tu tablero está en blanco. Dibuja la primera viñeta: agrega una tarea.",
    "hero.allDone": "Completaste todo. ¡Fin del episodio!",
    "hero.pending": (n) => `Tienes ${n} ${plural(n, "tarea pendiente", "tareas pendientes")}.`,
    "meter.label": (done, all) => `${done} de ${all} tareas completadas`,
    "meter.caption": "completadas",
    "composer.label": "Nueva tarea",
    "composer.placeholder": "¿Qué necesitas hacer?",
    "composer.add": "¡Agregar!",
    "composer.saving": "Guardando",
    "composer.empty": "Escribe un título para la tarea.",
    "composer.shortcut": "Atajo: tecla /",
    "toast.created": "Tarea creada",
    "toast.completed": "Tarea completada",
    "toast.deleted": "Tarea eliminada",
    "toast.updateFail": "No se pudo actualizar la tarea",
    "toast.renameFail": "No se pudo renombrar la tarea",
    "toast.deleteFail": "No se pudo eliminar la tarea",
    "filters.label": "Filtrar tareas",
    "filters.all": "Todas",
    "filters.pending": "Pendientes",
    "filters.done": "Completadas",
    "list.label": "Lista de tareas",
    "list.hint": "Doble clic para editar",
    "task.complete": (t) => `Completar "${t}"`,
    "task.uncomplete": (t) => `Marcar "${t}" como pendiente`,
    "task.edit": (t) => `Editar "${t}"`,
    "task.editTitle": "Editar título",
    "task.editShort": "Editar",
    "task.delete": (t) => `Eliminar "${t}"`,
    "task.deleteShort": "Eliminar",
    "task.created": "Creada",
    "task.doneAt": "Completada",
    "task.justNow": "justo ahora",
    "burst": ["¡ZAS!", "¡PUM!", "¡HECHO!", "¡BAM!"],
    "loading.sr": "Cargando tareas…",
    "waking.title": "Mientras tanto, en el servidor…",
    "waking.text": "El plan gratuito de Render suspende la API tras un rato sin uso. La primera carga puede tardar hasta un minuto.",
    "error.sfx": "¡RAYOS!",
    "error.title": "No pudimos cargar tus tareas",
    "error.retry": "Reintentar",
    "empty.all.title": "Página en blanco",
    "empty.all.text": "Escribe arriba tu primera tarea y presiona Enter.",
    "empty.pending.title": "¡Todo al día!",
    "empty.pending.text": "No tienes tareas pendientes.",
    "empty.done.title": "Nada completado todavía",
    "empty.done.text": "Marca una tarea para verla aquí.",
    "footer.code": "Código en GitHub",
    "footer.api": "Estado de la API",
    "err.timeout": "La API tardó demasiado en responder. Intenta de nuevo.",
    "err.network": "No se pudo conectar con la API. Revisa tu conexión o intenta en unos segundos.",
    "err.http": (s) => `Error ${s} del servidor.`,
  },
  en: {
    "brand.home": "TaskBoard, home",
    "status.online": "API online",
    "status.checking": "Connecting…",
    "status.waking": "Waking server",
    "status.offline": "API offline",
    "status.short.online": "Online",
    "status.short.checking": "Connecting",
    "status.short.waking": "Waking",
    "status.short.offline": "Offline",
    "lang.label": "Language",
    "theme.toLight": "Switch to light theme",
    "theme.toDark": "Switch to dark theme",
    "greet.morning": "Good morning!",
    "greet.afternoon": "Good afternoon!",
    "greet.night": "Good evening!",
    "hero.loading": "Loading your board…",
    "hero.empty": "Your board is blank. Draw the first panel: add a task.",
    "hero.allDone": "All done. That's a wrap!",
    "hero.pending": (n) => `You have ${n} ${plural(n, "pending task", "pending tasks")}.`,
    "meter.label": (done, all) => `${done} of ${all} tasks completed`,
    "meter.caption": "completed",
    "composer.label": "New task",
    "composer.placeholder": "What do you need to do?",
    "composer.add": "Add!",
    "composer.saving": "Saving",
    "composer.empty": "Write a title for the task.",
    "composer.shortcut": "Shortcut: / key",
    "toast.created": "Task created",
    "toast.completed": "Task completed",
    "toast.deleted": "Task deleted",
    "toast.updateFail": "Couldn't update the task",
    "toast.renameFail": "Couldn't rename the task",
    "toast.deleteFail": "Couldn't delete the task",
    "filters.label": "Filter tasks",
    "filters.all": "All",
    "filters.pending": "Pending",
    "filters.done": "Completed",
    "list.label": "Task list",
    "list.hint": "Double-click to edit",
    "task.complete": (t) => `Complete "${t}"`,
    "task.uncomplete": (t) => `Mark "${t}" as pending`,
    "task.edit": (t) => `Edit "${t}"`,
    "task.editTitle": "Edit title",
    "task.editShort": "Edit",
    "task.delete": (t) => `Delete "${t}"`,
    "task.deleteShort": "Delete",
    "task.created": "Created",
    "task.doneAt": "Completed",
    "task.justNow": "just now",
    "burst": ["POW!", "BAM!", "DONE!", "ZAP!"],
    "loading.sr": "Loading tasks…",
    "waking.title": "Meanwhile, at the server…",
    "waking.text": "Render's free plan puts the API to sleep after a while without use. The first load can take up to a minute.",
    "error.sfx": "RATS!",
    "error.title": "We couldn't load your tasks",
    "error.retry": "Try again",
    "empty.all.title": "Blank page",
    "empty.all.text": "Type your first task above and press Enter.",
    "empty.pending.title": "All caught up!",
    "empty.pending.text": "You have no pending tasks.",
    "empty.done.title": "Nothing completed yet",
    "empty.done.text": "Check off a task to see it here.",
    "footer.code": "Code on GitHub",
    "footer.api": "API status",
    "err.timeout": "The API took too long to respond. Please try again.",
    "err.network": "Couldn't reach the API. Check your connection or try again in a few seconds.",
    "err.http": (s) => `Server error ${s}.`,
  },
};

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "es" || v === "en") return v;
  } catch {
    /* almacenamiento no disponible */
  }
  return "es";
}

const I18nContext = createContext(null);

/** Idioma de la interfaz (español por defecto, inglés opcional), recordado en este navegador. */
export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readStored);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* el idioma dura solo esta sesión */
    }
  }, []);

  const value = useMemo(() => {
    const dict = DICT[lang];
    const t = (key, ...args) => {
      const entry = dict[key] ?? DICT.es[key] ?? key;
      return typeof entry === "function" ? entry(...args) : entry;
    };
    /** Mensaje legible para un ApiError en el idioma activo. */
    const describeError = (err) => {
      if (!err) return "";
      if (err.code === "timeout") return t("err.timeout");
      if (err.code === "network") return t("err.network");
      // El backend responde en español; en inglés usamos un mensaje genérico.
      if (lang === "es" && err.message) return err.message;
      return t("err.http", err.status ?? "");
    };
    return { lang, setLang, t, describeError };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de <LangProvider>");
  return ctx;
}
