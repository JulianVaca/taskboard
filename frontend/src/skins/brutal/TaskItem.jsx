import { forwardRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";
import { relativeTime } from "../../shared/format.js";
import { useTaskEdit } from "../../shared/useTaskEdit.js";

const iconBtn =
  "press grid size-10 cursor-pointer place-items-center rounded-[8px] border-[3px] border-b-ink bg-b-paper text-b-text shadow-[4px_4px_0_var(--b-ink)] disabled:cursor-wait disabled:opacity-50";

const TaskItem = forwardRef(function TaskItem({ task, index, busy, onToggle, onRename, onRemove }, ref) {
  const { t, lang } = useI18n();
  const { editing, startEdit, inputProps } = useTaskEdit(task, onRename);
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    if (!stamp) return;
    const id = setTimeout(() => setStamp(0), 1400);
    return () => clearTimeout(id);
  }, [stamp]);

  const toggle = () => {
    if (!task.done) setStamp(Date.now());
    onToggle(task);
  };

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 50, rotate: index % 2 ? 3 : -3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.6, rotate: -8, transition: { type: "spring", stiffness: 500, damping: 30 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: Math.min(index, 8) * 0.05 }}
      className={clsx(
        "slab press group relative flex items-center gap-3 px-3 py-3 sm:px-4",
        task.done && "bg-b-para text-b-on-para"
      )}
    >
      <AnimatePresence>
        {stamp > 0 && (
          <motion.span
            key={stamp}
            aria-hidden="true"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: -10 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 10 }}
            className="pointer-events-none absolute -top-5 right-16 z-10 rounded-full border-4 border-b-ink bg-b-heat px-3 py-1 display-wide text-sm text-b-on-accent shadow-[4px_4px_0_var(--b-ink)]"
          >
            {t("burst")[2]}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.done ? t("task.uncomplete", task.title) : t("task.complete", task.title)}
        disabled={busy}
        onClick={toggle}
        whileTap={{ scale: 0.8 }}
        transition={{ type: "spring", stiffness: 600, damping: 15 }}
        className={clsx(
          "grid size-9 shrink-0 cursor-pointer place-items-center rounded-[8px] border-4 border-b-ink transition-colors disabled:cursor-wait",
          task.done ? "bg-b-heat text-b-on-accent" : "bg-b-paper hover:bg-b-sun"
        )}
      >
        <AnimatePresence initial={false}>
          {task.done && (
            <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 700, damping: 14 }}>
              <Check className="size-5" strokeWidth={4} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input {...inputProps} aria-label={t("task.editTitle")} className="-ml-2 w-full rounded-[6px] border-[3px] border-b-ink bg-b-sun px-2 py-0.5 text-lg font-bold text-b-on-accent outline-none" />
        ) : (
          <p
            onDoubleClick={() => !task.done && startEdit()}
            className={clsx("text-lg font-bold leading-snug wrap-anywhere", task.done && "line-through decoration-b-heat decoration-[3px]")}
          >
            {task.title}
          </p>
        )}
        <span
          className={clsx(
            "mt-1.5 inline-block rounded-full border-2 border-b-ink px-2 py-0.5 text-[0.65rem] font-black uppercase [font-stretch:105%]",
            task.done ? "bg-[#fffdf9] text-[#351c4d]" : "bg-b-para text-b-on-para"
          )}
        >
          {task.done ? t("task.doneAt") : t("task.created")} · {relativeTime(task.created_at, lang, t("task.justNow"))}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
        {!task.done && !editing && (
          <button type="button" onClick={startEdit} disabled={busy} aria-label={t("task.edit", task.title)} title={t("task.editShort")} className={clsx(iconBtn, "hover:bg-b-sun hover:text-b-on-accent")}>
            <Pencil className="size-4" strokeWidth={2.75} />
          </button>
        )}
        <button type="button" onClick={() => onRemove(task)} disabled={busy} aria-label={t("task.delete", task.title)} title={t("task.deleteShort")} className={clsx(iconBtn, "hover:bg-b-heat hover:text-b-on-accent")}>
          <Trash2 className="size-4" strokeWidth={2.75} />
        </button>
      </div>
    </motion.li>
  );
});

export default TaskItem;
