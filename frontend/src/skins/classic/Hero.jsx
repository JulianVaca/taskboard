import { motion } from "motion/react";
import ProgressRing from "./ProgressRing.jsx";
import { useI18n } from "../../i18n.jsx";
import { boardSummary, dateLabel, greetingKey } from "../../shared/format.js";

export default function Hero({ counts, ready }) {
  const { t, lang } = useI18n();
  const now = new Date();
  const progress = counts.all ? Math.round((counts.done / counts.all) * 100) : 0;
  // El saludo original usaba "Buenos días" sin signos; aquí se quitan para conservar ese tono.
  const greeting = t(greetingKey(now)).replace(/[¡!]/g, "");

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between gap-6"
    >
      <div className="min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {greeting}{" "}
          <span aria-hidden="true" className="inline-block origin-[70%_70%] animate-wave motion-reduce:animate-none">👋</span>
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          <span className="block font-medium text-violet-600 sm:inline dark:text-violet-400">{dateLabel(now, lang)}</span>
          <span className="hidden sm:inline" aria-hidden="true"> · </span>
          {boardSummary(t, counts, ready)}
        </p>
      </div>
      {ready && counts.all > 0 && <ProgressRing value={progress} label={t("meter.label", counts.done, counts.all)} />}
    </motion.section>
  );
}
