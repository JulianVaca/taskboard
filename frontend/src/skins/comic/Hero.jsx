import { motion } from "motion/react";
import ProgressMeter from "./ProgressMeter.jsx";
import { useI18n } from "../../i18n.jsx";
import { boardSummary, dateLabel, greetingKey } from "../../shared/format.js";

export default function Hero({ counts, ready }) {
  const { t, lang } = useI18n();
  const now = new Date();
  const date = dateLabel(now, lang);
  const summary = boardSummary(t, counts, ready);

  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <motion.h1
          key={lang}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="lettering origin-left text-[clamp(2.75rem,10vw,4.75rem)] leading-[0.95] text-balance"
        >
          {t(greetingKey(now))}
        </motion.h1>
        {/* Cartela de narrador: fecha y resumen del día, como en el arranque de una página de cómic. */}
        <motion.p
          initial={{ x: -16, opacity: 0, rotate: -3 }}
          animate={{ x: 0, opacity: 1, rotate: -1.5 }}
          transition={{ duration: 0.22, delay: 0.05, ease: "easeOut" }}
          className="caption mt-5 max-w-md origin-left px-3.5 py-2 text-left normal-case tracking-normal"
        >
          <span className="block text-xs uppercase tracking-[0.06em]">{date}</span>
          <span className="mt-0.5 block text-base font-bold [font-stretch:100%]">{summary}</span>
        </motion.p>
      </div>
      {ready && counts.all > 0 && <ProgressMeter done={counts.done} all={counts.all} />}
    </section>
  );
}
