import { motion } from "motion/react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";

const FILTERS = ["all", "pending", "done"];

/** Control segmentado con un indicador que se desliza entre opciones. */
export default function FilterTabs({ value, onChange, counts }) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={t("filters.label")} className="flex w-full rounded-xl border border-zinc-200 bg-white/60 p-1 backdrop-blur sm:inline-flex sm:w-auto dark:border-white/10 dark:bg-white/5">
      {FILTERS.map((id) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={clsx(
              "relative min-w-0 flex-1 cursor-pointer rounded-lg px-1.5 py-1.5 text-[0.8125rem] font-medium transition-colors sm:flex-none sm:px-3 sm:text-sm",
              active ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {active && (
              <motion.span
                layoutId="classic-filter-pill"
                className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-zinc-900/5 dark:bg-white/10 dark:ring-white/10"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative flex items-center justify-center gap-1 sm:gap-1.5">
              {t(`filters.${id}`)}
              <span className="rounded-md bg-zinc-100 px-1.5 text-xs tabular-nums text-zinc-600 dark:bg-white/10 dark:text-zinc-300">{counts[id]}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
