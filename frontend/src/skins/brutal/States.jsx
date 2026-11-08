import { motion } from "motion/react";
import { CircleCheckBig, CloudOff, ListTodo, RotateCw, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n.jsx";

const spring = { type: "spring", stiffness: 300, damping: 18 };

export function LoadingState({ slow }) {
  const { t } = useI18n();
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">{t("loading.sr")}</span>
      {slow && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="slab overflow-hidden">
          <p className="border-b-4 border-b-ink bg-b-sun px-4 py-2 text-sm font-black uppercase text-b-on-accent [font-stretch:110%]">{t("waking.title")}</p>
          <div className="px-4 py-3">
            <p className="text-sm font-semibold">{t("waking.text")}</p>
            <div className="mt-3 h-4 overflow-hidden rounded-[6px] border-[3px] border-b-ink bg-b-paper">
              <motion.div className="h-full w-1/3 bg-b-heat" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>
      )}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: i * 0.08 }}
          className="slab flex items-center gap-3 px-4 py-4"
        >
          <div className="size-9 rounded-[8px] border-4 border-b-ink bg-b-sun/60" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded-full bg-b-ink/15" style={{ width: `${70 - i * 15}%` }} />
            <div className="h-3 w-24 rounded-full bg-b-para/40" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  const { t } = useI18n();
  return (
    <motion.div role="alert" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="slab overflow-hidden text-center">
      <p className="border-b-4 border-b-ink bg-b-heat px-4 py-2 text-sm font-black uppercase text-b-on-accent [font-stretch:110%]">{t("error.title")}</p>
      <div className="flex flex-col items-center px-6 py-8">
        <span className="grid size-14 place-items-center rounded-full border-4 border-b-ink bg-b-para text-b-on-para shadow-[4px_4px_0_var(--b-ink)]">
          <CloudOff className="size-7" strokeWidth={2.5} />
        </span>
        <p className="mt-4 max-w-sm text-sm font-semibold text-b-text-soft">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="press mt-5 inline-flex cursor-pointer items-center gap-2 rounded-[10px] border-4 border-b-ink bg-b-heat px-4 py-2 font-black uppercase text-b-on-accent shadow-[6px_6px_0_var(--b-ink)] [font-stretch:110%]"
        >
          <RotateCw className="size-4" strokeWidth={3} /> {t("error.retry")}
        </button>
      </div>
    </motion.div>
  );
}

const ICONS = { all: ListTodo, pending: CircleCheckBig, done: Sparkles };

export function EmptyState({ filter }) {
  const { t } = useI18n();
  const Icon = ICONS[filter];
  const title = filter === "all" ? t("empty.classic.title") : t(`empty.${filter}.title`);
  return (
    <motion.div key={filter} initial={{ opacity: 0, y: 30, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={spring} className="slab flex flex-col items-center px-6 py-12 text-center">
      <motion.span
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="grid size-16 place-items-center rounded-[14px] border-4 border-b-ink bg-b-sun text-b-on-accent shadow-[4px_4px_0_var(--b-ink)]"
      >
        <Icon className="size-8" strokeWidth={2.5} />
      </motion.span>
      <p className="display-wide mt-5 text-2xl">{title}</p>
      <p className="mt-1 text-sm font-semibold text-b-text-soft">{t(`empty.${filter}.text`)}</p>
    </motion.div>
  );
}
