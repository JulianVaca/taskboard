import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api.js";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "pending", label: "Pendientes" },
  { id: "done", label: "Completadas" },
];
const TITLE_MAX = 200;
const SLOW_MS = 3000; // a partir de aquí avisamos que el servidor está despertando

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);

  const load = useCallback(async (signal) => {
    setStatus("loading");
    setError("");
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      const data = await api.list({ signal });
      setTasks(data);
      setStatus("ready");
    } catch (err) {
      if (signal?.aborted) return;
      setError(err.message);
      setStatus("error");
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const markBusy = (id, on) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  const addTask = async (e) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) {
      setFormError("Escribe un título para la tarea.");
      inputRef.current?.focus();
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const created = await api.create(clean);
      setTasks((prev) => [...prev, created]);
      setTitle("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
      inputRef.current?.focus();
    }
  };

  const toggleTask = async (task) => {
    markBusy(task.id, true);
    // Actualización optimista: la UI responde al instante y se revierte si falla.
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
    try {
      const updated = await api.setDone(task.id, !task.done);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      setError(err.message);
    } finally {
      markBusy(task.id, false);
    }
  };

  const deleteTask = async (task) => {
    markBusy(task.id, true);
    try {
      await api.remove(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      if (err.status === 404) setTasks((prev) => prev.filter((t) => t.id !== task.id));
      else setError(err.message);
    } finally {
      markBusy(task.id, false);
    }
  };

  const counts = useMemo(() => {
    const done = tasks.filter((t) => t.done).length;
    return { all: tasks.length, done, pending: tasks.length - done };
  }, [tasks]);

  const visible = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const progress = counts.all ? Math.round((counts.done / counts.all) * 100) : 0;

  return (
    <div className="page">
      <main className="card">
        <header className="header">
          <div>
            <h1>TaskBoard</h1>
            <p className="subtitle">Organiza tu día, una tarea a la vez.</p>
          </div>
          {status === "ready" && counts.all > 0 && (
            <div className="progress" aria-label={`${progress}% completado`}>
              <span>{progress}%</span>
              <div className="bar">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </header>

        <form className="form" onSubmit={addTask} noValidate>
          <label htmlFor="new-task" className="sr-only">Nueva tarea</label>
          <input
            id="new-task"
            ref={inputRef}
            value={title}
            maxLength={TITLE_MAX}
            placeholder="¿Qué necesitas hacer?"
            autoComplete="off"
            aria-invalid={Boolean(formError)}
            aria-describedby={formError ? "form-error" : undefined}
            onChange={(e) => {
              setTitle(e.target.value);
              if (formError) setFormError("");
            }}
            disabled={status !== "ready"}
          />
          <button type="submit" disabled={saving || status !== "ready"}>
            {saving ? "Guardando…" : "Agregar"}
          </button>
        </form>
        {formError && (
          <p id="form-error" className="form-error" role="alert">{formError}</p>
        )}

        {status === "ready" && error && (
          <div className="banner error" role="alert">
            <span>{error}</span>
            <button className="link" onClick={() => setError("")}>Cerrar</button>
          </div>
        )}

        {status === "loading" && (
          <div className="state" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando tareas…</p>
            {slow && (
              <p className="hint">
                El servidor gratuito de Render se está despertando. Esto puede tardar hasta un minuto.
              </p>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="state" role="alert">
            <p className="state-title">No pudimos cargar tus tareas</p>
            <p className="hint">{error}</p>
            <button onClick={() => load()}>Reintentar</button>
          </div>
        )}

        {status === "ready" && (
          <>
            <nav className="filters" aria-label="Filtrar tareas">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={filter === f.id ? "chip active" : "chip"}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label} <span className="count">{counts[f.id]}</span>
                </button>
              ))}
            </nav>

            {visible.length === 0 ? (
              <p className="empty">
                {counts.all === 0
                  ? "Aún no hay tareas. ¡Crea la primera!"
                  : filter === "done"
                    ? "Todavía no has completado ninguna tarea."
                    : "¡Todo listo! No tienes tareas pendientes."}
              </p>
            ) : (
              <ul className="list">
                {visible.map((t) => (
                  <li key={t.id} className={t.done ? "item done" : "item"}>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={t.done}
                        disabled={busyIds.has(t.id)}
                        onChange={() => toggleTask(t)}
                        aria-label={t.done ? `Marcar "${t.title}" como pendiente` : `Completar "${t.title}"`}
                      />
                      <span className="box" aria-hidden="true" />
                      <span className="title">{t.title}</span>
                    </label>
                    <button
                      className="delete"
                      onClick={() => deleteTask(t)}
                      disabled={busyIds.has(t.id)}
                      aria-label={`Eliminar "${t.title}"`}
                      title="Eliminar"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <footer className="footer">
        React + Vite · Express · PostgreSQL · desplegado en Render
      </footer>
    </div>
  );
}
