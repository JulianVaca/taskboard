import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "sonner";
import Background from "./Background.jsx";
import TopBar from "./TopBar.jsx";
import Hero from "./Hero.jsx";
import TaskComposer from "./TaskComposer.jsx";
import FilterTabs from "./FilterTabs.jsx";
import TaskItem from "./TaskItem.jsx";
import { EmptyState, ErrorState, LoadingState } from "./States.jsx";
import { useI18n } from "../../i18n.jsx";
import { api } from "../../api.js";

/** Estilo clásico: el diseño original de TaskBoard (tarjetas translúcidas y acento violeta). */
export default function ClassicApp(props) {
  const { visible, counts, status, slow, error, busy, load, add, toggle, rename, remove, filter, setFilter, apiStatus, ready, theme, onToggleTheme, skin, setSkin } = props;
  const { t, describeError } = useI18n();

  return (
    <div className="font-sans text-zinc-900 dark:text-zinc-100">
      <Background />
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pt-6 pb-8 sm:px-6 sm:pt-8">
        <TopBar apiStatus={apiStatus} theme={theme} onToggleTheme={onToggleTheme} skin={skin} setSkin={setSkin} />

        <main className="mt-12 flex-1 sm:mt-16">
          <Hero counts={counts} ready={ready} />

          <div className="mt-8">
            <TaskComposer onAdd={add} disabled={!ready} />
          </div>

          <section aria-label={t("list.label")} className="mt-8">
            {ready && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex min-w-0 items-center justify-between gap-3">
                <FilterTabs value={filter} onChange={setFilter} counts={counts} />
                {counts.all > 0 && <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">{t("list.hint")}</p>}
              </motion.div>
            )}

            {status === "loading" && <LoadingState slow={slow} />}
            {status === "error" && <ErrorState message={describeError(error)} onRetry={() => load()} />}
            {ready &&
              (visible.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <ul className="space-y-2.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((task) => (
                      <TaskItem key={task.id} task={task} busy={busy.has(task.id)} onToggle={toggle} onRename={rename} onRemove={remove} />
                    ))}
                  </AnimatePresence>
                </ul>
              ))}
          </section>
        </main>

        <footer className="mt-16 flex flex-col items-center gap-2 text-center text-xs text-zinc-500 sm:flex-row sm:justify-between dark:text-zinc-400">
          <p>React · Vite · Express · PostgreSQL · Render</p>
          <nav className="flex gap-4">
            <a className="transition-colors hover:text-violet-600 dark:hover:text-violet-400" href="https://github.com/JulianVaca/taskboard" target="_blank" rel="noreferrer">
              {t("footer.code")}
            </a>
            <a className="transition-colors hover:text-violet-600 dark:hover:text-violet-400" href={`${api.url}/api/health`} target="_blank" rel="noreferrer">
              {t("footer.api")}
            </a>
          </nav>
        </footer>
      </div>

      <Toaster position="bottom-center" theme={theme} richColors closeButton toastOptions={{ className: "font-sans" }} />
    </div>
  );
}
