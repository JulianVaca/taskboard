import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { LoaderCircle, PencilLine, Plus } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";

const TITLE_MAX = 200;

/** Formulario para crear tareas, con validación de campo vacío y atajo de teclado "/". */
export default function TaskComposer({ onAdd, disabled }) {
  const { t, describeError } = useI18n();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [scope, animate] = useAnimate();
  const inputRef = useRef(null);

  // Atajo: "/" enfoca el campo desde cualquier parte de la página.
  useEffect(() => {
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const fail = (message) => {
    setError(message);
    animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.32, ease: "easeInOut" });
    inputRef.current?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return fail(t("composer.empty"));
    setSaving(true);
    setError("");
    try {
      await onAdd(clean);
      setTitle("");
      toast.success(t("toast.created"), { description: clean });
    } catch (err) {
      fail(describeError(err));
    } finally {
      setSaving(false);
      inputRef.current?.focus();
    }
  };

  const remaining = TITLE_MAX - title.length;

  return (
    <div>
      <form
        ref={scope}
        onSubmit={submit}
        noValidate
        className={clsx(
          "inked group flex items-center gap-2 rounded-[3px] p-2 pl-4 transition-transform focus-within:-translate-y-0.5 focus-within:[--depth:7px]",
          error && "[--extrude:var(--danger)]"
        )}
      >
        <PencilLine className="size-5 shrink-0 text-ink-soft transition-colors group-focus-within:text-magenta" strokeWidth={2.5} aria-hidden="true" />
        <label htmlFor="new-task" className="sr-only">{t("composer.label")}</label>
        <input
          id="new-task"
          ref={inputRef}
          value={title}
          maxLength={TITLE_MAX}
          placeholder={t("composer.placeholder")}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "composer-error" : undefined}
          aria-keyshortcuts="/"
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          className="h-12 min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none placeholder:font-medium placeholder:text-ink-soft disabled:cursor-not-allowed focus-visible:outline-none"
        />
        {!title && !disabled && (
          <kbd title={t("composer.shortcut")} className="hidden rounded-[3px] border-2 border-ink px-1.5 font-comic text-sm text-ink-text sm:block">/</kbd>
        )}
        {remaining <= 30 && (
          <span className={clsx("text-sm font-bold tabular-nums", remaining <= 10 ? "text-danger" : "text-ink-soft")}>{remaining}</span>
        )}
        <motion.button
          type="submit"
          disabled={disabled || saving}
          whileHover={{ rotate: -2, scale: 1.04 }}
          whileTap={{ scale: 0.92, rotate: 1 }}
          className="flex h-12 cursor-pointer items-center gap-2 rounded-[4px] border-[3px] border-ink bg-yellow px-4 font-comic text-xl tracking-wider text-[#14101f] shadow-[3px_3px_0_var(--ink)] transition-shadow hover:shadow-[5px_5px_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {saving && <LoaderCircle className="size-5 animate-spin" strokeWidth={3} />}
          <span className="hidden sm:inline">{saving ? t("composer.saving") : t("composer.add")}</span>
          {!saving && <Plus className="size-6 sm:hidden" strokeWidth={3.5} aria-hidden="true" />}
          <span className="sr-only sm:hidden">{t("composer.add")}</span>
        </motion.button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p
            id="composer-error"
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative mt-5 ml-3 inline-block rounded-[4px] border-[2.5px] border-ink bg-danger px-3 py-1.5 text-sm font-bold text-white"
          >
            {/* Cola del globo apuntando al campo */}
            <svg aria-hidden="true" viewBox="0 0 22 14" className="absolute -top-[13px] left-5 h-[14px] w-[22px] overflow-visible">
              <path d="M1 14 L8 1 L20 14" fill="var(--danger)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
              <rect x="2" y="12" width="17" height="4" fill="var(--danger)" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
