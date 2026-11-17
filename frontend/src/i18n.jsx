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
    "skin.label": "Estilo",
    "skin.classic": "Clásico",
    "skin.comic": "Cómic",
    "skin.brutal": "Brutal",
    "marquee": (pending, done) => ["Tu tablero", `${pending} ${plural(pending, "pendiente", "pendientes")}`, `${done} ${plural(done, "completada", "completadas")}`, "Una tarea a la vez"],
    "badge.pending": (n) => plural(n, "pendiente", "pendientes"),
    "sticker.go": "¡Vamos!",
    "sticker.todo": "Por hacer",
    "sticker.drag": "Arrástrame",
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
    "toast.reopened": "Tarea marcada como pendiente",
    "toast.renamed": "Tarea renombrada",
    "auth.tabs": "Acceso",
    "auth.login": "Iniciar sesión",
    "auth.register": "Crear cuenta",
    "auth.title.login": "Qué bueno verte de nuevo",
    "auth.title.register": "Crea tu cuenta",
    "auth.subtitle.login": "Entra para ver y organizar tus tareas.",
    "auth.subtitle.register": "Tu tablero personal, listo en segundos.",
    "auth.name": "Nombre",
    "auth.namePh": "¿Cómo te llamas?",
    "auth.email": "Correo",
    "auth.emailPh": "tu@correo.com",
    "auth.password": "Contraseña",
    "auth.passwordPh": "Tu contraseña",
    "auth.passwordHint": "Mínimo 8 caracteres",
    "auth.show": "Mostrar contraseña",
    "auth.hide": "Ocultar contraseña",
    "auth.submitting": "Un momento…",
    "auth.waking": "Despertando el servidor gratuito, puede tardar hasta un minuto…",
    "auth.noAccount": "¿No tienes cuenta?",
    "auth.haveAccount": "¿Ya tienes cuenta?",
    "auth.secure": "Contraseñas cifradas con bcrypt · Sesión con token JWT",
    "auth.expired": "Tu sesión expiró. Inicia sesión de nuevo.",
    "auth.welcome": (name) => `¡Hola de nuevo, ${name}!`,
    "auth.welcomeNew": (name) => `¡Te damos la bienvenida, ${name}!`,
    "auth.account": "Tu cuenta",
    "auth.logout": "Cerrar sesión",
    "auth.err.name": "Escribe tu nombre (mínimo 2 letras).",
    "auth.err.email": "Escribe un correo válido.",
    "auth.err.password": "La contraseña debe tener mínimo 8 caracteres.",
    "auth.err.credentials": "Correo o contraseña incorrectos.",
    "auth.err.taken": "Ese correo ya está registrado. Inicia sesión.",
    "auth.err.tooMany": "Demasiados intentos. Espera 15 minutos e intenta de nuevo.",
    "auth.forgot": "¿Olvidaste tu contraseña?",
    "auth.title.forgot": "Recupera tu contraseña",
    "auth.subtitle.forgot": "Te enviaremos un código de 6 dígitos a tu correo.",
    "auth.title.reset": "Crea una nueva contraseña",
    "auth.subtitle.reset": "Ingresa el código de 6 dígitos que enviamos a tu correo.",
    "auth.sendCode": "Enviar código",
    "auth.code": "Código de 6 dígitos",
    "auth.codePh": "123456",
    "auth.newPassword": "Nueva contraseña",
    "auth.resetSubmit": "Cambiar contraseña",
    "auth.backToLogin": "Volver a iniciar sesión",
    "auth.codeSent": "Si el correo está registrado, enviamos un código de 6 dígitos.",
    "auth.err.code": "Escribe el código de 6 dígitos que recibiste en tu correo.",
    "notif.title": "Notificaciones",
    "notif.open": (n) => (n > 0 ? `Notificaciones, ${n} sin leer` : "Notificaciones"),
    "notif.empty": "Aquí verás todo lo que pase en tu tablero.",
    "notif.clear": "Borrar todo",
    "notif.new": "Nueva",
    "burst": ["¡ZAS!", "¡PUM!", "¡HECHO!", "¡BAM!"],
    "loading.sr": "Cargando tareas…",
    "waking.title": "Mientras tanto, en el servidor…",
    "waking.text": "El plan gratuito de Render suspende la API tras un rato sin uso. La primera carga puede tardar hasta un minuto.",
    "error.sfx": "¡RAYOS!",
    "error.title": "No pudimos cargar tus tareas",
    "error.retry": "Reintentar",
    "empty.all.title": "Página en blanco",
    "empty.classic.title": "Aún no hay tareas",
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
    "skin.label": "Style",
    "skin.classic": "Classic",
    "skin.comic": "Comic",
    "skin.brutal": "Brutal",
    "marquee": (pending, done) => ["Your board", `${pending} pending`, `${done} completed`, "One task at a time"],
    "badge.pending": () => "pending",
    "sticker.go": "Let's go!",
    "sticker.todo": "To-do",
    "sticker.drag": "Drag me",
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
    "toast.reopened": "Task marked as pending",
    "toast.renamed": "Task renamed",
    "auth.tabs": "Access",
    "auth.login": "Log in",
    "auth.register": "Sign up",
    "auth.title.login": "Good to see you again",
    "auth.title.register": "Create your account",
    "auth.subtitle.login": "Log in to see and organize your tasks.",
    "auth.subtitle.register": "Your personal board, ready in seconds.",
    "auth.name": "Name",
    "auth.namePh": "What's your name?",
    "auth.email": "Email",
    "auth.emailPh": "you@email.com",
    "auth.password": "Password",
    "auth.passwordPh": "Your password",
    "auth.passwordHint": "At least 8 characters",
    "auth.show": "Show password",
    "auth.hide": "Hide password",
    "auth.submitting": "One moment…",
    "auth.waking": "Waking up the free server, this can take up to a minute…",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.secure": "Passwords hashed with bcrypt · JWT session",
    "auth.expired": "Your session expired. Please log in again.",
    "auth.welcome": (name) => `Welcome back, ${name}!`,
    "auth.welcomeNew": (name) => `Welcome, ${name}!`,
    "auth.account": "Your account",
    "auth.logout": "Log out",
    "auth.err.name": "Enter your name (at least 2 letters).",
    "auth.err.email": "Enter a valid email.",
    "auth.err.password": "Password must be at least 8 characters.",
    "auth.err.credentials": "Wrong email or password.",
    "auth.err.taken": "That email is already registered. Log in instead.",
    "auth.err.tooMany": "Too many attempts. Wait 15 minutes and try again.",
    "auth.forgot": "Forgot your password?",
    "auth.title.forgot": "Reset your password",
    "auth.subtitle.forgot": "We'll send a 6-digit code to your email.",
    "auth.title.reset": "Create a new password",
    "auth.subtitle.reset": "Enter the 6-digit code we sent to your email.",
    "auth.sendCode": "Send code",
    "auth.code": "6-digit code",
    "auth.codePh": "123456",
    "auth.newPassword": "New password",
    "auth.resetSubmit": "Update password",
    "auth.backToLogin": "Back to log in",
    "auth.codeSent": "If that email is registered, we sent a 6-digit code.",
    "auth.err.code": "Enter the 6-digit code sent to your email.",
    "notif.title": "Notifications",
    "notif.open": (n) => (n > 0 ? `Notifications, ${n} unread` : "Notifications"),
    "notif.empty": "Everything that happens on your board shows up here.",
    "notif.clear": "Clear all",
    "notif.new": "New",
    "burst": ["POW!", "BAM!", "DONE!", "ZAP!"],
    "loading.sr": "Loading tasks…",
    "waking.title": "Meanwhile, at the server…",
    "waking.text": "Render's free plan puts the API to sleep after a while without use. The first load can take up to a minute.",
    "error.sfx": "RATS!",
    "error.title": "We couldn't load your tasks",
    "error.retry": "Try again",
    "empty.all.title": "Blank page",
    "empty.classic.title": "No tasks yet",
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