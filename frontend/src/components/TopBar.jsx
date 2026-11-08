import { AnimatePresence, motion } from "motion/react";
import { CheckCheck, Moon, Sun } from "lucide-react";
import clsx from "clsx";

const STATUS = {
  online: { label: "API en línea", dot: "bg-emerald-500", ping: "bg-emerald-400" },
  checking: { label: "Conectando…", dot: "bg-zinc-400", ping: "bg-zinc-300" },
  waking: { label: "Despertando servidor", dot: "bg-amber-500", ping: "bg-amber-400" },
  offline: { label: "API sin conexión", dot: "bg-rose-500", ping: "bg-rose-400" },
};

export default function TopBar({ apiStatus, theme, onToggleTheme }) {
  const s = STATUS[apiStatus];
  return (
    <header className="flex items-center justify-between gap-3">
      <a href="/" className="group flex items-center gap-2.5" aria-label="TaskBoard, inicio">
        <motion.span
          whileHover={{ rotate: -8, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
        >
          <CheckCheck className="size-5" strokeWidth={2.5} />
        </motion.span>
        <span className="text-lg font-semibold tracking-tight">TaskBoard</span>
      </a>

      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
          role="status"
          aria-live="polite"
        >
          <span className="relative flex size-2">
            {apiStatus !== "offline" && (
              <span className={clsx("absolute inline-flex size-full animate-ping rounded-full opacity-60", s.ping)} />
            )}
            <span className={clsx("relative inline-flex size-2 rounded-full", s.dot)} />
          </span>
          <span className="hidden sm:inline">{s.label}</span>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          className="relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-zinc-200/80 bg-white/70 text-zinc-700 backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ y: 14, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -14, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
