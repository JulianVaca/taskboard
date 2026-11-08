import { motion } from "motion/react";
import { useI18n } from "../../i18n.jsx";
import { boardSummary, dateLabel, greetingKey } from "../../shared/format.js";

const spring = (i) => ({ type: "spring", stiffness: 260, damping: 18, delay: i * 0.08 });
const enter = { opacity: 0, y: 40, rotate: -2 };

/** Cabecera en Bento Grid: tarjeta de saludo, tarjeta de progreso Paradise e insignia flotante. */
export default function Bento({ counts, ready }) {
  const { t, lang } = useI18n();
  const now = new Date();
  const pct = counts.all ? Math.round((counts.done / counts.all) * 100) : 0;

  return (
    <section className="grid grid-cols-6 gap-4 sm:gap-5">
      <motion.div initial={enter} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={spring(0)} className="slab press relative col-span-6 sm:col-span-4">
        <div className="flex items-center gap-3 rounded-t-[10px] border-b-4 border-b-ink bg-b-sun py-2 pr-24 pl-4 text-b-on-accent">
          <span className="hidden shrink-0 gap-1.5 sm:flex" aria-hidden="true">
            <span className="size-3 rounded-full border-[2.5px] border-b-ink bg-b-heat" />
            <span className="size-3 rounded-full border-[2.5px] border-b-ink bg-[#fffdf9]" />
            <span className="size-3 rounded-full border-[2.5px] border-b-ink bg-b-para" />
          </span>
          <span className="text-xs font-black uppercase [font-stretch:110%]">{dateLabel(now, lang)}</span>
        </div>
        <div className="px-5 pt-4 pb-5">
          <h1 key={lang} className="display-wide text-[clamp(2.3rem,8.5vw,3.6rem)] leading-[0.92] text-balance">
            {t(greetingKey(now)).replace(/[¡!]/g, "")}
          </h1>
          <p className="mt-3 max-w-sm font-semibold text-b-text-soft">{boardSummary(t, counts, ready)}</p>
        </div>

        {ready && counts.all > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 11, delay: 0.45 }}
            className="absolute -top-6 -right-4 flex flex-col items-center rounded-[18px] border-4 border-b-ink bg-b-heat px-3.5 py-1.5 text-center text-b-on-accent shadow-[4px_4px_0_var(--b-ink)]"
          >
            <span className="display-wide text-3xl leading-none tabular-nums">{counts.pending}</span>
            <span className="text-[0.65rem] font-black uppercase [font-stretch:105%]">{t("badge.pending", counts.pending)}</span>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={enter}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={spring(1)}
        className="slab press col-span-6 flex flex-col justify-between gap-4 bg-b-para p-5 text-b-on-para sm:col-span-2"
        role="img"
        aria-label={t("meter.label", counts.done, counts.all)}
      >
        <span className="ticket self-start bg-[#fffdf9] px-3 py-1 text-[0.7rem] font-black uppercase text-[#351c4d] [font-stretch:110%]">{t("meter.caption")}</span>
        <div>
          <p className="display-wide text-5xl leading-none tabular-nums">
            {counts.done}
            <span className="opacity-70">/{counts.all}</span>
          </p>
          <div className="mt-4 h-6 overflow-hidden rounded-[8px] border-4 border-b-ink bg-b-paper">
            <motion.div
              className="h-full bg-b-heat"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
