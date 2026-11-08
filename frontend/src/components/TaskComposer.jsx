import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { CornerDownLeft, LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

const TITLE_MAX = 200;

/** Formulario para crear tareas, con validación de campo vacío y atajo de teclado "/". */
export default function TaskComposer({ onAdd, disabled }) {
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
    animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
    inputRef.current?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return fail("Escribe un título para la tarea.");
    setSaving(true);
    setError("");
    try {
      await onAdd(clean);
      setTitle("");
      toast.success("Tarea creada", { description: clean });
    } catch (err) {
      fail(err.message);
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
        className={`group flex items-center gap-2 rounded-2xl border bg-white/80 p-2 pl-4 shadow-sm shadow-zinc-900/5 backdrop-blur transition-[border-color,box-shadow] focus-within:shadow-lg focus-within:shadow-violet-500/10 dark:bg-zinc-900/70 ${
          error
            ? "border-rose-400 dark:border-rose-500/60"
            : "border-zinc-200 focus-within:border-violet-400 dark:border-white/10 dark:focus-within:border-violet-500/60"
        }`}
      >
        <Plus className="size-5 shrink-0 text-zinc-400 transition-colors group-focus-within:text-violet-500" aria-hidden="true" />
        <label htmlFor="new-task" className="sr-only">Nueva tarea</label>
        <input
          id="new-task"
          ref={inputRef}
          value={title}
          maxLength={TITLE_MAX}
          placeholder="¿Qué necesitas hacer?"
          autoComplete="off"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "composer-error" : undefined}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed focus-visible:outline-none dark:placeholder:text-zinc-500"
        />
        {!title && !disabled && (
          <kbd className="hidden rounded-md border border-zinc-200 px-1.5 py-0.5 font-sans text-xs text-zinc-400 sm:block dark:border-white/10">/</kbd>
        )}
        {remaining <= 30 && (
          <span className={`text-xs tabular-nums ${remaining <= 10 ? "text-rose-500" : "text-zinc-400"}`}>{remaining}</span>
        )}
        <motion.button
          type="submit"
          disabled={disabled || saving}
          whileTap={{ scale: 0.95 }}
          className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : <CornerDownLeft className="size-4" />}
          <span className="hidden sm:inline">{saving ? "Guardando" : "Agregar"}</span>
          <span className="sr-only sm:hidden">Agregar</span>
        </motion.button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p
            id="composer-error"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-2 pt-2 text-sm text-rose-600 dark:text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
