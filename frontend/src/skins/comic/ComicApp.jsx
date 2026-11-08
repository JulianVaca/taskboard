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

/** Estilo cómic: página de viñetas 2D que simula 3D. */
export default function ComicApp(props) {
  const { visible, counts, status, slow, error, busy, load, add, toggle, rename, remove, filter, setFilter, apiStatus, ready, theme, onToggleTheme, skin, setSkin } = props;
  const { t, describeError } = useI18n();

  return (
    <>
      <Background />
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pt-6 pb-10 sm:px-6 sm:pt-8">
        <TopBar apiStatus={apiStatus} theme={theme} onToggleTheme={onToggleTheme} skin={skin} setSkin={setSkin} />

        <main className="mt-10 flex-1 sm:mt-14">
          <Hero counts={counts} ready={ready} />

          <div className="mt-8">
            <TaskComposer onAdd={add} disabled={!ready} />
          </div>

          <section aria-label={t("list.label")} className="mt-10">
            {ready && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 flex min-w-0 items-center justify-between gap-3">
                <FilterTabs value={filter} onChange={setFilter} counts={counts} />
                {counts.all > 0 && (
                  <p className="hidden text-xs font-extrabold uppercase tracking-wide text-on-ground [font-stretch:85%] sm:block">{t("list.hint")}</p>
                )}
              </motion.div>
            )}

            {status === "loading" && <LoadingState slow={slow} />}
            {status === "error" && <ErrorState message={describeError(error)} onRetry={() => load()} />}
            {ready &&
              (visible.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((task) => (
                      <TaskItem key={task.id} task={task} busy={busy.has(task.id)} onToggle={toggle} onRename={rename} onRemove={remove} />
                    ))}
                  </AnimatePresence>
                </ul>
              ))}
          </section>
        </main>

        <footer className="mt-20 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="caption px-2.5 py-1 text-[0.7rem]">React · Vite · Express · PostgreSQL · Render</p>
          <nav className="flex gap-2 text-sm font-bold">
            <a className="inked rounded-[3px] px-3 py-1.5 text-ink-text underline [--depth:3px] hover:[--panel-bg:var(--yellow)] hover:text-[#14101f]" href="https://github.com/JulianVaca/taskboard" target="_blank" rel="noreferrer">
              {t("footer.code")}
            </a>
            <a className="inked rounded-[3px] px-3 py-1.5 text-ink-text underline [--depth:3px] hover:[--panel-bg:var(--yellow)] hover:text-[#14101f]" href={`${api.url}/api/health`} target="_blank" rel="noreferrer">
              {t("footer.api")}
            </a>
          </nav>
        </footer>
      </div>

      <Toaster position="bottom-center" theme={theme} closeButton toastOptions={{ className: "comic-toast" }} />
    </>
  );
}
