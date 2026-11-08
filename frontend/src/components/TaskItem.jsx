import { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
function relative(dateStr) {
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
  return "justo ahora";
}

function Checkbox({ checked, disabled, onChange, label }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      whileTap={{ scale: 0.85 }}
      className={clsx(
        "grid size-6 shrink-0 cursor-pointer place-items-center rounded-lg border-2 transition-colors disabled:cursor-wait",
        checked
          ? "border-transparent bg-linear-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/30"
          : "border-zinc-300 hover:border-violet-400 dark:border-zinc-600 dark:hover:border-violet-400"
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </svg>
    </motion.button>
  );
}

const TaskItem = forwardRef(function TaskItem({ task, busy, onToggle, onRename, onRemove }, ref) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEdit = () => {
    setDraft(task.title);
    setEditing(true);
  };

  const commit = () => {
    const clean = draft.trim();
    setEditing(false);
    if (clean && clean !== task.title) onRename(task, clean);
  };

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={clsx(
        "group flex items-center gap-3 rounded-2xl border px-4 py-3.5 backdrop-blur transition-colors",
        task.done
          ? "border-zinc-200/60 bg-white/40 dark:border-white/5 dark:bg-white/2"
          : "border-zinc-200 bg-white/80 shadow-sm shadow-zinc-900/3 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-white/20"
      )}
    >
      <Checkbox
        checked={task.done}
        disabled={busy}
        onChange={() => onToggle(task)}
        label={task.done ? `Marcar "${task.title}" como pendiente` : `Completar "${task.title}"`}
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            maxLength={200}
            aria-label="Editar título"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-full rounded-md bg-zinc-100 px-2 py-0.5 -ml-2 outline-none ring-2 ring-violet-400 dark:bg-white/10"
          />
        ) : (
          <p
            onDoubleClick={() => !task.done && startEdit()}
            className={clsx(
              "wrap-anywhere transition-colors duration-300",
              task.done ? "text-zinc-400 line-through decoration-zinc-400/70 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-100"
            )}
          >
            {task.title}
          </p>
        )}
        <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
          {task.done ? "Completada" : "Creada"} · {relative(task.created_at)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        {!task.done && !editing && (
          <button
            type="button"
            onClick={startEdit}
            disabled={busy}
            aria-label={`Editar "${task.title}"`}
            title="Editar"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
          >
            <Pencil className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(task)}
          disabled={busy}
          aria-label={`Eliminar "${task.title}"`}
          title="Eliminar"
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </motion.li>
  );
});

export default TaskItem;
