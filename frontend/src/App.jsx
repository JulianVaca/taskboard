import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Toaster } from "sonner";
import Background from "./components/Background.jsx";
import TopBar from "./components/TopBar.jsx";
import Hero from "./components/Hero.jsx";
import TaskComposer from "./components/TaskComposer.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import TaskItem from "./components/TaskItem.jsx";
import { EmptyState, ErrorState, LoadingState } from "./components/States.jsx";
import { useTasks } from "./hooks/useTasks.js";
import { useTheme } from "./hooks/useTheme.js";
import { api } from "./api.js";

export default function App() {
  const { tasks, counts, status, slow, error, busy, load, add, toggle, rename, remove } = useTasks();
  const { theme, toggle: toggleTheme } = useTheme();
  const [filter, setFilter] = useState("all");

  const visible = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const apiStatus = status === "ready" ? "online" : status === "error" ? "offline" : slow ? "waking" : "checking";
  const ready = status === "ready";

  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pt-6 pb-8 sm:px-6 sm:pt-8">
        <TopBar apiStatus={apiStatus} theme={theme} onToggleTheme={toggleTheme} />

        <main className="mt-12 flex-1 sm:mt-16">
          <Hero counts={counts} ready={ready} />

          <div className="mt-8">
            <TaskComposer onAdd={add} disabled={!ready} />
          </div>

          <section aria-label="Lista de tareas" className="mt-8">
            {ready && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex min-w-0 items-center justify-between gap-3">
                <FilterTabs value={filter} onChange={setFilter} counts={counts} />
                {counts.all > 0 && (
                  <p className="hidden text-xs text-zinc-400 sm:block">Doble clic para editar</p>
                )}
              </motion.div>
            )}

            {status === "loading" && <LoadingState slow={slow} />}
            {status === "error" && <ErrorState message={error} onRetry={() => load()} />}
            {ready &&
              (visible.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <ul className="space-y-2.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((t) => (
                      <TaskItem
                        key={t.id}
                        task={t}
                        busy={busy.has(t.id)}
                        onToggle={toggle}
                        onRename={rename}
                        onRemove={remove}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              ))}
          </section>
        </main>

        <footer className="mt-16 flex flex-col items-center gap-2 text-center text-xs text-zinc-400 sm:flex-row sm:justify-between dark:text-zinc-500">
          <p>React · Vite · Express · PostgreSQL · Render</p>
          <nav className="flex gap-4">
            <a className="transition-colors hover:text-violet-600 dark:hover:text-violet-400" href="https://github.com/JulianVaca/taskboard" target="_blank" rel="noreferrer">
              Código en GitHub
            </a>
            <a className="transition-colors hover:text-violet-600 dark:hover:text-violet-400" href={`${api.url}/api/health`} target="_blank" rel="noreferrer">
              Estado de la API
            </a>
          </nav>
        </footer>
      </div>

      <Toaster position="bottom-center" theme={theme} richColors closeButton toastOptions={{ className: "font-sans" }} />
    </MotionConfig>
  );
}
