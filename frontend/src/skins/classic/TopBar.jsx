import { AnimatePresence, motion } from "motion/react";
import { CheckCheck, Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";

const STATUS = {
  online: { dot: "bg-emerald-500", ping: "bg-emerald-400" },
  checking: { dot: "bg-zinc-400", ping: "bg-zinc-300" },
  waking: { dot: "bg-amber-500", ping: "bg-amber-400" },
  offline: { dot: "bg-rose-500", ping: "bg-rose-400" },
};

const LANGS = [
  { id: "es", label: "ES", name: "Español" },
  { id: "en", label: "EN", name: "English" },
];

const SKINS = ["classic", "comic", "brutal"];

const pill =
  "rounded-full border border-zinc-200/80 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-white/5";

/** Control segmentado con un indicador que se desliza entre opciones. */
function Segmented({ label, items, value, onChange, layoutId }) {
  return (
    <div role="group" aria-label={label} className={clsx(pill, "flex p-0.5")}>
      {items.map((it) => {
        const active = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            lang={it.lang}
            aria-pressed={active}
            aria-label={it.name}
            onClick={() => onChange(it.id)}
            className={clsx(
              "relative cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              active ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-zinc-900/5 dark:bg-white/10 dark:ring-white/10"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function TopBar({ apiStatus, theme, onToggleTheme, skin, setSkin }) {
  const { t, lang, setLang } = useI18n();
  const s = STATUS[apiStatus];
  return (
    <div>
      <header className="flex items-center justify-between gap-3">
        <a href="/" className="group flex items-center gap-2.5" aria-label={t("brand.home")}>
          <motion.span
            whileHover={{ rotate: -8, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
          >
            <CheckCheck className="size-5" strokeWidth={2.5} />
          </motion.span>
          <span className="hidden text-lg font-semibold tracking-tight min-[380px]:inline">TaskBoard</span>
        </a>

        <div className="flex items-center gap-2">
          <div className={clsx(pill, "flex shrink-0 items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-zinc-600 dark:text-zinc-300")} role="status" aria-live="polite">
            <span className="relative flex size-2">
              {apiStatus !== "offline" && <span className={clsx("absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none", s.ping)} />}
              <span className={clsx("relative inline-flex size-2 rounded-full", s.dot)} />
            </span>
            <span className="hidden sm:inline">{t(`status.${apiStatus}`)}</span>
            <span className="sm:hidden">{t(`status.short.${apiStatus}`)}</span>
          </div>

          <Segmented label={t("lang.label")} items={LANGS.map((l) => ({ ...l, lang: l.id }))} value={lang} onChange={setLang} layoutId="classic-lang" />

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
            className={clsx(pill, "relative grid size-9 shrink-0 cursor-pointer place-items-center overflow-hidden text-zinc-700 transition-colors hover:bg-white dark:text-zinc-200 dark:hover:bg-white/10")}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ y: 14, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -14, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{t("skin.label")}</span>
        <Segmented
          label={t("skin.label")}
          items={SKINS.map((id) => ({ id, label: t(`skin.${id}`), name: t(`skin.${id}`) }))}
          value={skin}
          onChange={setSkin}
          layoutId="classic-skin"
        />
      </div>
    </div>
  );
}
