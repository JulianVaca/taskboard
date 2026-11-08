import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "../api.js";
import { useI18n } from "../i18n.jsx";

const SLOW_MS = 3000; // a partir de aquí avisamos que el servidor gratuito está despertando

// Pendientes primero y, dentro de cada grupo, por orden de creación.
const byStatusThenId = (a, b) => Number(a.done) - Number(b.done) || a.id - b.id;

/** Estado de las tareas y operaciones CRUD contra la API, con actualizaciones optimistas. */
export function useTasks() {
  const { t, describeError } = useI18n();
  // Las notificaciones usan siempre el idioma vigente aunque la operación haya empezado antes.
  const i18n = useRef({ t, describeError });
  i18n.current = { t, describeError };

  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(() => new Set());

  const markBusy = (id, on) =>
    setBusy((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  const replace = (task) => setTasks((prev) => prev.map((x) => (x.id === task.id ? task : x)));

  const load = useCallback(async (signal) => {
    setStatus("loading");
    setError(null);
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      setTasks(await api.list({ signal }));
      setStatus("ready");
    } catch (err) {
      if (signal?.aborted) return;
      setError(err);
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
    const { t, describeError } = i18n.current;
    markBusy(task.id, true);
    replace({ ...task, done: !task.done });
    try {
      replace(await api.setDone(task.id, !task.done));
      if (!task.done) toast.success(i18n.current.t("toast.completed"), { description: task.title });
    } catch (err) {
      replace(task);
      toast.error(t("toast.updateFail"), { description: describeError(err) });
    } finally {
      markBusy(task.id, false);
    }
  };

  const rename = async (task, title) => {
    if (title === task.title) return;
    const { t, describeError } = i18n.current;
    markBusy(task.id, true);
    replace({ ...task, title });
    try {
      replace(await api.rename(task.id, title));
    } catch (err) {
      replace(task);
      toast.error(t("toast.renameFail"), { description: describeError(err) });
    } finally {
      markBusy(task.id, false);
    }
  };

  const remove = async (task) => {
    const { t, describeError } = i18n.current;
    markBusy(task.id, true);
    setTasks((prev) => prev.filter((x) => x.id !== task.id));
    try {
      await api.remove(task.id);
      toast(i18n.current.t("toast.deleted"), { description: task.title });
    } catch (err) {
      if (err.status !== 404) {
        setTasks((prev) => [...prev, task]);
        toast.error(t("toast.deleteFail"), { description: describeError(err) });
      }
    } finally {
      markBusy(task.id, false);
    }
  };

  const sorted = useMemo(() => [...tasks].sort(byStatusThenId), [tasks]);

  const counts = useMemo(() => {
    const done = tasks.filter((x) => x.done).length;
    return { all: tasks.length, done, pending: tasks.length - done };
  }, [tasks]);

  return { tasks: sorted, counts, status, slow, error, busy, load, add, toggle, rename, remove };
}
