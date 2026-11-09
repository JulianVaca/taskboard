import { motion } from "motion/react";
import { useI18n } from "../../i18n.jsx";

/** Medidor de progreso impreso: barra entintada con relleno de trama magenta (usa transform scaleX en GPU). */
export default function ProgressMeter({ done, all }) {
  const { t } = useI18n();
  const pct = all ? Math.round((done / all) * 100) : 0;
  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9, opacity: 0 }}
      animate={{ rotate: 2, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      className="inked w-full shrink-0 rounded-[3px] px-4 pt-3 pb-4 sm:w-52"
      role="img"
      aria-label={t("meter.label", done, all)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-comic text-4xl leading-none tabular-nums">
          {done}
          <span className="text-ink-soft">/{all}</span>
        </span>
        <span className="text-xs font-extrabold uppercase tracking-wide text-ink-soft [font-stretch:85%]">
          {t("meter.caption")}
        </span>
      </div>
      <div className="mt-3 h-5 overflow-hidden rounded-[3px] border-[2.5px] border-ink bg-paper">
        <div
          className="halftone h-full origin-left border-r-[2.5px] border-ink bg-magenta transition-transform duration-300 ease-[steps(6)] [--tone-size:6px] [--tone:rgb(255_255_255/0.35)]"
          style={{
            transform: `scaleX(${pct / 100})`,
            borderRightWidth: pct === 0 || pct === 100 ? 0 : undefined,
          }}
        />
      </div>
    </motion.div>
  );
}
