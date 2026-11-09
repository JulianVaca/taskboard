import { motion } from "motion/react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";

export const FILTERS = ["all", "pending", "done"];

/** Grupo de botones entintado; el filtro activo es una plancha magenta que salta entre opciones. */
export default function FilterTabs({ value, onChange, counts }) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={t("filters.label")} className="inked flex w-full rounded-[3px] p-1 [--depth:3px] sm:inline-flex sm:w-auto">
      {FILTERS.map((id) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={clsx(
              "relative min-w-0 flex-1 cursor-pointer rounded-[2px] px-1.5 py-1.5 text-xs font-extrabold uppercase tracking-wide [font-stretch:78%] transition-colors sm:flex-none sm:px-3 sm:text-sm sm:[font-stretch:85%]",
              active ? "text-white dark:text-[#14101f]" : "text-ink-text hover:bg-yellow hover:text-[#14101f]"
            )}
          >
            {active && (
              <motion.span
                layoutId="filter-plate"
                className="absolute inset-0 rounded-[2px] border-2 border-ink bg-magenta"
                transition={{ type: "spring", stiffness: 520, damping: 34 }}
              />
            )}
            <span className="relative flex items-center justify-center gap-1">
              {t(`filters.${id}`)}
              <span
                className={clsx(
                  "min-w-5 rounded-[2px] px-1 font-comic text-sm tracking-wider tabular-nums",
                  active ? "bg-white text-[#14101f]" : "bg-ink text-white dark:bg-white/15"
                )}
              >
                {counts[id]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
