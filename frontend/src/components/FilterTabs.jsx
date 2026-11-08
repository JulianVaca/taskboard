import { motion } from "motion/react";
import clsx from "clsx";

export const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "pending", label: "Pendientes" },
  { id: "done", label: "Completadas" },
];

/** Control segmentado con un indicador que se desliza entre opciones. */
export default function FilterTabs({ value, onChange, counts }) {
  return (
    <div role="tablist" aria-label="Filtrar tareas" className="flex w-full rounded-xl border sm:inline-flex sm:w-auto border-zinc-200 bg-white/60 p-1 backdrop-blur dark:border-white/10 dark:bg-white/5">
      {FILTERS.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(f.id)}
            className={clsx(
              "relative flex-1 cursor-pointer rounded-lg px-2 py-1.5 text-sm font-medium transition-colors sm:flex-none sm:px-3",
              active ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-zinc-900/5 dark:bg-white/10 dark:ring-white/10"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative flex items-center justify-center gap-1.5">
              {f.label}
              <span className="rounded-md bg-zinc-100 px-1.5 text-xs tabular-nums text-zinc-500 dark:bg-white/10 dark:text-zinc-400">{counts[f.id]}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
