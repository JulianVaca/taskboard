import { motion } from "motion/react";
import { CircleCheckBig, CloudOff, Coffee, ListTodo, RotateCw } from "lucide-react";

/** Filas fantasma mientras cargan las tareas, con aviso si el servidor gratuito está despertando. */
export function LoadingState({ slow }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">Cargando tareas…</span>
      {slow && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200"
        >
          <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <Coffee className="size-5 shrink-0" />
          </motion.span>
          <div className="flex-1">
            <p className="font-medium">Despertando el servidor…</p>
            <p className="mt-0.5 text-amber-800/80 dark:text-amber-200/70">
              El plan gratuito de Render suspende la API tras un rato sin uso. La primera carga puede tardar hasta un minuto.
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-amber-200/70 dark:bg-amber-500/20">
              <motion.div
                className="h-full w-1/3 rounded-full bg-amber-500"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-zinc-200/70 bg-white/60 px-4 py-4 dark:border-white/5 dark:bg-white/3">
          <div className="skeleton size-6 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 rounded-full" style={{ width: `${70 - i * 15}%` }} />
            <div className="skeleton h-2.5 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50/70 px-6 py-10 text-center dark:border-rose-500/20 dark:bg-rose-500/5"
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
        <CloudOff className="size-6" />
      </span>
      <p className="mt-4 font-semibold">No pudimos cargar tus tareas</p>
      <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onRetry}
        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <RotateCw className="size-4" /> Reintentar
      </motion.button>
    </motion.div>
  );
}

const EMPTY = {
  all: { icon: ListTodo, title: "Aún no hay tareas", text: "Escribe arriba tu primera tarea y presiona Enter." },
  pending: { icon: CircleCheckBig, title: "¡Todo al día!", text: "No tienes tareas pendientes." },
  done: { icon: ListTodo, title: "Nada completado todavía", text: "Marca una tarea para verla aquí." },
};

export function EmptyState({ filter }) {
  const { icon: Icon, title, text } = EMPTY[filter];
  return (
    <motion.div
      key={filter}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-white/10"
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-violet-500/15 to-indigo-500/15 text-violet-600 dark:text-violet-400"
      >
        <Icon className="size-7" />
      </motion.span>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{text}</p>
    </motion.div>
  );
}
