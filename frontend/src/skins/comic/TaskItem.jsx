import { forwardRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import Burst from "./Burst.jsx";
import { useI18n } from "../../i18n.jsx";
import { relativeTime } from "../../shared/format.js";
import { useTaskEdit } from "../../shared/useTaskEdit.js";

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
      whileTap={{ scale: 0.85, rotate: -6 }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
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
          transition={{ duration: 0.18, ease: "easeOut" }}
        />
      </svg>
    </motion.button>
  );
}

const iconBtn =
  "grid size-9 cursor-pointer place-items-center rounded-[4px] border-[2.5px] border-ink bg-paper text-ink-text transition-[translate,background-color,color] hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-50";

const TaskItem = forwardRef(function TaskItem({ task, busy, onToggle, onRename, onRemove }, ref) {
  const { t, lang } = useI18n();
  const { editing, startEdit, inputProps } = useTaskEdit(task, onRename);
  const [burst, setBurst] = useState(null);
  const words = t("burst");

  useEffect(() => {
    if (!burst) return;
    const id = setTimeout(() => setBurst(null), 1150);
    return () => clearTimeout(id);
  }, [burst]);

  const toggle = () => {
    if (!task.done) setBurst({ key: Date.now(), word: words[(task.id + (burst?.key ?? 0)) % words.length] });
    onToggle(task);
  };

  return (
    <motion.li
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 14, rotate: tilt(task.id) - 2 }}
      animate={{ opacity: 1, y: 0, rotate: tilt(task.id) }}
      exit={{ opacity: 0, scale: 0.88, x: -40, transition: { duration: 0.18, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 460, damping: 32 }}
      className={clsx(
        "inked comic-lift group flex items-center gap-3 rounded-[3px] px-3 py-3 sm:px-4",
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
            {...inputProps}
            aria-label={t("task.editTitle")}
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
          {task.done ? t("task.doneAt") : t("task.created")} · {relativeTime(task.created_at, lang, t("task.justNow"))}
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
