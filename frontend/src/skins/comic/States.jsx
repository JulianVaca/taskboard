import { motion } from "motion/react";
import { CircleCheckBig, CloudOff, ListTodo, RotateCw, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n.jsx";

const onTwos = (frames) => (p) => Math.floor(p * frames) / frames;

/** Viñetas fantasma mientras cargan las tareas, con cartela si el servidor gratuito está despertando. */
export function LoadingState({ slow }) {
  const { t } = useI18n();
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">{t("loading.sr")}</span>
      {slow && (
        <motion.div
          initial={{ opacity: 0, rotate: -4 }}
          animate={{ opacity: 1, rotate: -1 }}
          transition={{ duration: 0.3, ease: onTwos(4) }}
          className="caption block px-4 py-3 normal-case"
        >
          <p className="font-comic text-xl tracking-wider uppercase">{t("waking.title")}</p>
          <p className="mt-1 text-sm font-semibold tracking-normal">{t("waking.text")}</p>
          <div className="mt-3 h-3 overflow-hidden rounded-[2px] border-2 border-ink bg-white/60">
            <motion.div
              className="h-full w-1/3 bg-magenta"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: onTwos(10) }}
            />
          </div>
        </motion.div>
      )}
      {[0, 1, 2].map((i) => (
        <div key={i} className="inked flex items-center gap-3 rounded-[3px] px-4 py-4" style={{ rotate: `${(i - 1) * 0.4}deg` }}>
          <div className="skeleton size-8 rounded-[4px] border-[3px] border-ink" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 rounded-[2px]" style={{ width: `${70 - i * 15}%` }} />
            <div className="skeleton h-2.5 w-24 rounded-[2px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  const { t } = useI18n();
  return (
    <motion.div
      role="alert"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: onTwos(5) }}
      className="inked flex flex-col items-center rounded-[3px] px-6 py-10 text-center [--extrude:var(--danger)]"
    >
      <span className="lettering text-5xl [-webkit-text-stroke-color:var(--ink)]" aria-hidden="true">
        {t("error.sfx")}
      </span>
      <span className="mt-3 grid size-12 place-items-center rounded-[4px] border-[3px] border-ink bg-danger text-white">
        <CloudOff className="size-6" strokeWidth={2.5} />
      </span>
      <p className="mt-4 text-lg font-extrabold">{t("error.title")}</p>
      <p className="mt-1 max-w-sm text-sm font-medium text-ink-soft">{message}</p>
      <motion.button
        whileHover={{ rotate: -2, scale: 1.04 }}
        whileTap={{ scale: 0.92 }}
        onClick={onRetry}
        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-[4px] border-[3px] border-ink bg-yellow px-4 py-2 font-comic text-lg tracking-wider text-[#14101f] shadow-[3px_3px_0_var(--ink)]"
      >
        <RotateCw className="size-4" strokeWidth={3} /> {t("error.retry")}
      </motion.button>
    </motion.div>
  );
}

const EMPTY = {
  all: ListTodo,
  pending: CircleCheckBig,
  done: Sparkles,
};

export function EmptyState({ filter }) {
  const { t } = useI18n();
  const Icon = EMPTY[filter];
  return (
    <motion.div
      key={filter}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: onTwos(4) }}
      className="inked flex flex-col items-center rounded-[3px] px-6 py-12 text-center [--depth:3px] [--panel-bg:radial-gradient(rgb(128_120_160/0.16)_30%,transparent_34%)_0_0/8px_8px,var(--paper)]"
    >
      <motion.span
        animate={{ y: [0, -6, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: onTwos(8) }}
        className="grid size-14 place-items-center rounded-[4px] border-[3px] border-ink bg-cyan text-[#14101f] shadow-[3px_3px_0_var(--ink)]"
      >
        <Icon className="size-7" strokeWidth={2.5} />
      </motion.span>
      <p className="mt-5 font-comic text-3xl tracking-wider">{t(`empty.${filter}.title`)}</p>
      <p className="mt-1 text-sm font-semibold text-ink-soft">{t(`empty.${filter}.text`)}</p>
    </motion.div>
  );
}
