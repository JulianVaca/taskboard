import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle, Plus } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";
import { useComposer } from "../../shared/useComposer.js";

export default function TaskComposer({ onAdd, disabled }) {
  const { t } = useI18n();
  const { title, onChange, error, saving, submit, scope, inputRef, remaining } = useComposer(onAdd, {
    shakeOptions: { type: "spring", stiffness: 900, damping: 12, duration: 0.45 },
  });

  return (
    <div>
      <form ref={scope} onSubmit={submit} noValidate className={clsx("slab flex items-center gap-2 p-2 pl-4", error && "border-b-heat")}>
        <label htmlFor="new-task" className="sr-only">{t("composer.label")}</label>
        <input
          id="new-task"
          ref={inputRef}
          value={title}
          maxLength={200}
          placeholder={t("composer.placeholder")}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "composer-error" : undefined}
          aria-keyshortcuts="/"
          onChange={onChange}
          className="h-12 min-w-0 flex-1 bg-transparent text-lg font-bold outline-none placeholder:font-semibold placeholder:text-b-text-soft disabled:cursor-not-allowed focus-visible:outline-none"
        />
        {!title && !disabled && (
          <kbd title={t("composer.shortcut")} className="hidden rounded-[6px] border-[3px] border-b-ink px-2 text-sm font-black sm:block">/</kbd>
        )}
        {remaining <= 30 && <span className={clsx("text-sm font-black tabular-nums", remaining <= 10 ? "text-b-heat" : "text-b-text-soft")}>{remaining}</span>}
        <button
          type="submit"
          disabled={disabled || saving}
          className="press flex h-12 cursor-pointer items-center gap-2 rounded-[10px] border-4 border-b-ink bg-b-heat px-4 text-base font-black uppercase text-b-on-accent shadow-[6px_6px_0_var(--b-ink)] [font-stretch:112%] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {saving ? <LoaderCircle className="size-5 animate-spin" strokeWidth={3} /> : <Plus className="size-5" strokeWidth={3.5} />}
          <span className="hidden sm:inline">{saving ? t("composer.saving") : t("composer.add").replace(/[¡!]/g, "")}</span>
          <span className="sr-only sm:hidden">{t("composer.add")}</span>
        </button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p
            id="composer-error"
            role="alert"
            initial={{ opacity: 0, y: -10, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="mt-4 ml-2 inline-block rounded-[8px] border-4 border-b-ink bg-b-heat px-3 py-1.5 text-sm font-black text-b-on-accent shadow-[4px_4px_0_var(--b-ink)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
