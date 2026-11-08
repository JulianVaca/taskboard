import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../api.js";

const SLOW_MS = 3000; // a partir de aquí avisamos que el servidor gratuito está despertando

// Pendientes primero y, dentro de cada grupo, por orden de creación.
const byStatusThenId = (a, b) => Number(a.done) - Number(b.done) || a.id - b.id;

/** Estado de las tareas y operaciones CRUD contra la API, con actualizaciones optimistas. */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(() => new Set());

  const markBusy = (id, on) =>
    setBusy((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  const replace = (task) => setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

  const load = useCallback(async (signal) => {
    setStatus("loading");
    setError("");
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      setTasks(await api.list({ signal }));
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

  /** Crea una tarea. Lanza el error para que el formulario lo muestre. */
  const add = async (title) => {
    const created = await api.create(title);
    setTasks((prev) => [...prev, created]);
    return created;
  };

  const toggle = async (task) => {
    markBusy(task.id, true);
    replace({ ...task, done: !task.done });
    try {
      replace(await api.setDone(task.id, !task.done));
      if (!task.done) toast.success("Tarea completada", { description: task.title });
    } catch (err) {
      replace(task);
      toast.error("No se pudo actualizar la tarea", { description: err.message });
    } finally {
      markBusy(task.id, false);
    }
  };

  const rename = async (task, title) => {
    if (title === task.title) return;
    markBusy(task.id, true);
    replace({ ...task, title });
    try {
      replace(await api.rename(task.id, title));
    } catch (err) {
      replace(task);
      toast.error("No se pudo renombrar la tarea", { description: err.message });
    } finally {
      markBusy(task.id, false);
    }
  };

  const remove = async (task) => {
    markBusy(task.id, true);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await api.remove(task.id);
      toast("Tarea eliminada", { description: task.title });
    } catch (err) {
      if (err.status !== 404) {
        setTasks((prev) => [...prev, task]);
        toast.error("No se pudo eliminar la tarea", { description: err.message });
      }
    } finally {
      markBusy(task.id, false);
    }
  };

  const sorted = useMemo(() => [...tasks].sort(byStatusThenId), [tasks]);

  const counts = useMemo(() => {
    const done = tasks.filter((t) => t.done).length;
    return { all: tasks.length, done, pending: tasks.length - done };
  }, [tasks]);

  return { tasks: sorted, counts, status, slow, error, busy, load, add, toggle, rename, remove };
}
