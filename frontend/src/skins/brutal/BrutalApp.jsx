import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "sonner";
import TopBar from "./TopBar.jsx";
import Marquee from "./Marquee.jsx";
import Bento from "./Bento.jsx";
import TaskComposer from "./TaskComposer.jsx";
import FilterTabs from "./FilterTabs.jsx";
import TaskItem from "./TaskItem.jsx";
import Stickers from "./Stickers.jsx";
import Cursor from "./Cursor.jsx";
import { EmptyState, ErrorState, LoadingState } from "./States.jsx";
import { useI18n } from "../../i18n.jsx";
import { api } from "../../api.js";

/** Estilo Kinetic Neo-Brutalism con la paleta Ponche Tropical. */
export default function BrutalApp(props) {
  const { visible, counts, status, slow, error, busy, load, add, toggle, rename, remove, filter, setFilter, apiStatus, ready, theme, onToggleTheme, skin, setSkin } = props;
  const { t, describeError } = useI18n();
  const ribbon = t("marquee", counts.pending, counts.done);

  return (
    <div className="text-b-text">
      <Stickers />
      <Cursor />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pt-6 pb-10 sm:px-6 sm:pt-8">
        <TopBar apiStatus={apiStatus} theme={theme} onToggleTheme={onToggleTheme} skin={skin} setSkin={setSkin} />

        <Marquee items={ribbon} className="mt-8" />

        <main className="mt-10 flex-1">
          <Bento counts={counts} ready={ready} />

          <div className="mt-8">
            <TaskComposer onAdd={add} disabled={!ready} />
          </div>

          <section aria-label={t("list.label")} className="mt-10">
            {ready && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="mb-5 flex min-w-0 items-center justify-between gap-3">
                <FilterTabs value={filter} onChange={setFilter} counts={counts} />
                {counts.all > 0 && <p className="hidden text-xs font-black uppercase [font-stretch:110%] sm:block">{t("list.hint")}</p>}
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
                    {visible.map((task, i) => (
                      <TaskItem key={task.id} index={i} task={task} busy={busy.has(task.id)} onToggle={toggle} onRename={rename} onRemove={remove} />
                    ))}
                  </AnimatePresence>
                </ul>
              ))}
          </section>
        </main>

        <Marquee items={ribbon} direction={-1} tilt={1.5} className="mt-20" />

        <footer className="mt-10 flex flex-col items-center gap-4">
          <p className="ticket px-3 py-1 text-center text-[0.7rem] font-black uppercase [font-stretch:105%] min-[420px]:whitespace-nowrap">React · Vite · Express · PostgreSQL · Render</p>
          <nav className="flex shrink-0 gap-3 text-sm font-black">
            <a className="slab press rounded-[10px] px-3 py-1.5 whitespace-nowrap shadow-[4px_4px_0_var(--b-ink)] hover:bg-b-sun hover:text-b-on-accent" href="https://github.com/JulianVaca/taskboard" target="_blank" rel="noreferrer">
              {t("footer.code")}
            </a>
            <a className="slab press rounded-[10px] px-3 py-1.5 whitespace-nowrap shadow-[4px_4px_0_var(--b-ink)] hover:bg-b-sun hover:text-b-on-accent" href={`${api.url}/api/health`} target="_blank" rel="noreferrer">
              {t("footer.api")}
            </a>
          </nav>
        </footer>
      </div>

      <Toaster position="bottom-center" theme={theme} closeButton toastOptions={{ className: "brutal-toast" }} />
    </div>
  );
}
