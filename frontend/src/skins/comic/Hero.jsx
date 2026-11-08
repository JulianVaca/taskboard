import { motion } from "motion/react";
import ProgressMeter from "./ProgressMeter.jsx";
import { useI18n } from "../../i18n.jsx";

function greetingKey(date) {
  const h = date.getHours();
  if (h < 12) return "greet.morning";
  if (h < 19) return "greet.afternoon";
  return "greet.night";
}

export default function Hero({ counts, ready }) {
  const { t, lang } = useI18n();
  const now = new Date();
  const date = new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long" }).format(now);

  let summary = t("hero.loading");
  if (ready) {
    if (counts.all === 0) summary = t("hero.empty");
    else if (counts.pending === 0) summary = t("hero.allDone");
    else summary = t("hero.pending", counts.pending);
  }

  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <motion.h1
          key={lang}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: (p) => Math.floor(p * 6) / 6 }}
          className="lettering origin-left text-[clamp(2.75rem,10vw,4.75rem)] leading-[0.95] text-balance"
        >
          {t(greetingKey(now))}
        </motion.h1>
        {/* Cartela de narrador: fecha y resumen del día, como en el arranque de una página de cómic. */}
        <motion.p
          initial={{ x: -24, opacity: 0, rotate: -5 }}
          animate={{ x: 0, opacity: 1, rotate: -1.5 }}
          transition={{ duration: 0.36, delay: 0.15, ease: (p) => Math.floor(p * 6) / 6 }}
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
