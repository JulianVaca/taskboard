import { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import Burst from "./Burst.jsx";
import { useI18n } from "../../i18n.jsx";

function relative(dateStr, lang, justNow) {
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const diff = (new Date(dateStr) - Date.now()) / 1000;
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return justNow;
}

// Cada viñeta queda un poco torcida, como pegada a mano; el ángulo depende del id para ser estable.
const tilt = (id) => (((id * 37) % 7) - 3) * 0.22;

function Checkbox({ checked, disabled, onChange, label }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      whileTap={{ scale: 0.8, rotate: -8 }}
      className={clsx(
        "grid size-8 shrink-0 cursor-pointer place-items-center rounded-[4px] border-[3px] border-ink transition-colors disabled:cursor-wait",
        checked ? "bg-magenta" : "bg-paper hover:bg-yellow"
      )}
    >
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <motion.path
          d="M4.5 12.5l5 5L20 6.5"
          fill="none"
          stroke="#fbfcff"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.2, ease: (p) => Math.floor(p * 4) / 4 }}
        />
      </svg>
    </motion.button>
  );
}

const iconBtn =
  "grid size-9 cursor-pointer place-items-center rounded-[4px] border-[2.5px] border-ink bg-paper text-ink-text transition-[transform,background-color,color] hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-50";

const TaskItem = forwardRef(function TaskItem({ task, busy, onToggle, onRename, onRemove }, ref) {
  const { t, lang } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [burst, setBurst] = useState(null);
  const inputRef = useRef(null);
  const words = t("burst");

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  useEffect(() => {
    if (!burst) return;
    const id = setTimeout(() => setBurst(null), 1200);
    return () => clearTimeout(id);
  }, [burst]);

  const startEdit = () => {
    setDraft(task.title);
    setEditing(true);
  };

  const commit = () => {
    const clean = draft.trim();
    setEditing(false);
    if (clean && clean !== task.title) onRename(task, clean);
  };

  const toggle = () => {
    if (!task.done) setBurst({ key: Date.now(), word: words[(task.id + (burst?.key ?? 0)) % words.length] });
    onToggle(task);
  };

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.6, rotate: tilt(task.id) - 6 }}
      animate={{ opacity: 1, scale: 1, rotate: tilt(task.id) }}
      exit={{ opacity: 0, scale: 0.4, rotate: -12, x: -60, transition: { duration: 0.24, ease: (p) => Math.floor(p * 4) / 4 } }}
      whileHover={{ rotateX: 5, rotateY: -6, y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      style={{ transformPerspective: 900 }}
      className={clsx(
        "inked group flex items-center gap-3 rounded-[3px] px-3 py-3 sm:px-4 hover:[--depth:8px]",
        burst && "z-20",
        task.done && "[--depth:2px] [--panel-bg:radial-gradient(rgb(128_120_160/0.22)_30%,transparent_34%)_0_0/7px_7px,var(--paper-done)]"
      )}
    >
      {burst && <Burst key={burst.key} word={burst.word} />}

      <Checkbox
        checked={task.done}
        disabled={busy}
        onChange={toggle}
        label={task.done ? t("task.uncomplete", task.title) : t("task.complete", task.title)}
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            maxLength={200}
            aria-label={t("task.editTitle")}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="-ml-2 w-full rounded-[3px] border-[2.5px] border-ink bg-yellow px-2 py-0.5 text-lg font-semibold text-[#14101f] outline-none"
          />
        ) : (
          <p
            onDoubleClick={() => !task.done && startEdit()}
            className={clsx(
              "text-lg font-semibold leading-snug wrap-anywhere",
              task.done ? "text-ink-soft line-through decoration-magenta decoration-[3px]" : "text-ink-text"
            )}
          >
            {task.title}
          </p>
        )}
        <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-ink-soft [font-stretch:85%]">
          {task.done ? t("task.doneAt") : t("task.created")} · {relative(task.created_at, lang, t("task.justNow"))}
        </p>
      </div>

      {/* Solo se ocultan donde existe hover real; en pantallas táctiles quedan siempre visibles. */}
      <div className="flex shrink-0 items-center gap-1.5 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
        {!task.done && !editing && (
          <button
            type="button"
            onClick={startEdit}
            disabled={busy}
            aria-label={t("task.edit", task.title)}
            title={t("task.editShort")}
            className={clsx(iconBtn, "hover:bg-cyan hover:text-[#14101f]")}
          >
            <Pencil className="size-4" strokeWidth={2.5} />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(task)}
          disabled={busy}
          aria-label={t("task.delete", task.title)}
          title={t("task.deleteShort")}
          className={clsx(iconBtn, "hover:bg-danger hover:text-white")}
        >
          <Trash2 className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    </motion.li>
  );
});

export default TaskItem;
