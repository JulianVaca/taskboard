import { motion } from "motion/react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";

const FILTERS = ["all", "pending", "done"];

/** Filtros como fichas: la activa es una plancha Paradise que salta con resorte. */
export default function FilterTabs({ value, onChange, counts }) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={t("filters.label")} className="slab flex w-full gap-1 rounded-[12px] p-1 shadow-[4px_4px_0_var(--b-ink)] sm:inline-flex sm:w-auto">
      {FILTERS.map((id) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={clsx(
              "relative min-h-11 min-w-0 flex-1 cursor-pointer rounded-[8px] px-1 py-1.5 text-xs font-black uppercase [font-stretch:75%] sm:min-h-0 sm:flex-none sm:px-3 sm:text-sm sm:[font-stretch:108%]",
              active ? "text-b-on-para" : "text-b-text hover:bg-b-sun hover:text-b-on-accent"
            )}
          >
            {active && (
              <motion.span
                layoutId="brutal-filter"
                className="absolute inset-0 rounded-[8px] border-[3px] border-b-ink bg-b-para"
                transition={{ type: "spring", stiffness: 520, damping: 26 }}
              />
            )}
            <span className="relative flex items-center justify-center gap-1 sm:gap-1.5">
              {t(`filters.${id}`)}
              <span className={clsx("min-w-4 rounded-full border-2 border-b-ink px-1 text-xs tabular-nums sm:min-w-5 sm:px-1.5", active ? "bg-b-heat text-b-on-accent" : "bg-b-paper text-b-text")}>
                {counts[id]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
