import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { toast } from "sonner";
import { useI18n } from "../i18n.jsx";

export const TITLE_MAX = 200;

/**
 * Lógica del formulario de nueva tarea: validación de campo vacío, atajo "/",
 * sacudida al fallar y notificación al crear. Cada estilo dibuja su propio formulario.
 */
export function useComposer(onAdd, { shake = [0, -10, 10, -6, 6, 0], shakeOptions = { duration: 0.4 } } = {}) {
  const { t, describeError } = useI18n();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [scope, animate] = useAnimate();
  const inputRef = useRef(null);

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
    if (scope.current) animate(scope.current, { x: shake }, shakeOptions);
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

  const onChange = (e) => {
    setTitle(e.target.value);
    if (error) setError("");
  };

  return { title, onChange, error, saving, submit, scope, inputRef, remaining: TITLE_MAX - title.length };
}
