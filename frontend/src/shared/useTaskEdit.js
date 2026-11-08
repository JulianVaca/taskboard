import { useEffect, useRef, useState } from "react";

/** Edición en línea del título de una tarea (doble clic o botón, Enter guarda, Escape cancela). */
export function useTaskEdit(task, onRename) {
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

  const inputProps = {
    ref: inputRef,
    value: draft,
    maxLength: 200,
    onChange: (e) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e) => {
      if (e.key === "Enter") commit();
      if (e.key === "Escape") setEditing(false);
    },
  };

  return { editing, startEdit, inputProps };
}
