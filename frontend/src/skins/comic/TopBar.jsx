import { AnimatePresence, motion } from "motion/react";
import { CheckCheck, Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";

const DOT = {
  online: "bg-[#19c37d]",
  checking: "bg-ink-soft",
  waking: "bg-yellow",
  offline: "bg-danger",
};

const LANGS = [
  { id: "es", label: "ES", name: "Español" },
  { id: "en", label: "EN", name: "English" },
];

const SKINS = ["classic", "comic", "brutal"];

/** Selector de estilo con el lenguaje del cómic: planchas entintadas, la activa en magenta. */
function SkinSwitch({ skin, setSkin }) {
  const { t } = useI18n();
  return (
    <div className="mt-4 flex items-center justify-end gap-2.5">
      <span className="text-xs font-extrabold uppercase tracking-wide text-on-ground [font-stretch:85%]">{t("skin.label")}</span>
      <div role="group" aria-label={t("skin.label")} className="inked flex h-9 rounded-[3px] p-1 [--depth:3px]">
        {SKINS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={skin === id}
            onClick={() => setSkin(id)}
            className={clsx(
              "cursor-pointer rounded-[2px] px-2.5 font-comic text-sm leading-none tracking-wider transition-colors",
              skin === id ? "bg-magenta text-white dark:text-[#14101f]" : "text-ink-text hover:bg-yellow hover:text-[#14101f]"
            )}
          >
            {t(`skin.${id}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TopBar({ apiStatus, theme, onToggleTheme, skin, setSkin }) {
  return (
    <div>
      <Bar apiStatus={apiStatus} theme={theme} onToggleTheme={onToggleTheme} />
      <SkinSwitch skin={skin} setSkin={setSkin} />
    </div>
  );
}

function Bar({ apiStatus, theme, onToggleTheme }) {
  const { t, lang, setLang } = useI18n();
  return (
    <header className="flex items-center justify-between gap-3">
      <a href="/" className="group flex min-w-0 items-center gap-3 no-underline" aria-label={t("brand.home")}>
        <motion.span
          whileHover={{ rotate: -10, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="inked hidden size-11 shrink-0 place-items-center rounded-[3px] text-[#14101f] [--depth:3px] [--panel-bg:var(--yellow)] sm:grid"
        >
          <CheckCheck className="size-6" strokeWidth={3} />
        </motion.span>
        <span className="lettering text-[1.55rem] leading-none [-webkit-text-stroke-width:1.5px] sm:text-[1.9rem] sm:[-webkit-text-stroke-width:2px]">TaskBoard</span>
      </a>

      <div className="flex items-center gap-2 sm:gap-2.5">
        <div
          className="inked flex h-10 items-center gap-2 rounded-[3px] px-2.5 text-xs font-bold [--depth:3px] sm:px-3"
          role="status"
          aria-live="polite"
        >
          <span className="relative flex size-2.5">
            {apiStatus !== "offline" && (
              <span className={clsx("absolute inline-flex size-full animate-ping rounded-full opacity-70 motion-reduce:animate-none", DOT[apiStatus])} />
            )}
            <span className={clsx("relative inline-flex size-2.5 rounded-full ring-2 ring-ink", DOT[apiStatus])} />
          </span>
          <span className="hidden uppercase [font-stretch:85%] sm:inline">{t(`status.${apiStatus}`)}</span>
          <span className="uppercase [font-stretch:78%] sm:hidden">{t(`status.short.${apiStatus}`)}</span>
        </div>

        <div role="group" aria-label={t("lang.label")} className="inked flex h-10 rounded-[3px] p-1 [--depth:3px]">
          {LANGS.map((l) => {
            const active = lang === l.id;
            return (
              <button
                key={l.id}
                type="button"
                lang={l.id}
                aria-pressed={active}
                aria-label={l.name}
                onClick={() => setLang(l.id)}
                className={clsx(
                  "cursor-pointer rounded-[2px] px-1.5 font-comic sm:px-2 text-base leading-none tracking-wider transition-colors",
                  active ? "bg-magenta text-white dark:text-[#14101f]" :"text-ink-text hover:bg-yellow hover:text-[#14101f]"
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
          className="inked grid size-10 shrink-0 cursor-pointer place-items-center overflow-visible rounded-[3px] text-ink-text [--depth:3px] hover:[--panel-bg:var(--yellow)] hover:text-[#14101f]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease: (p) => Math.floor(p * 4) / 4 }}
            >
              {theme === "dark" ? <Sun className="size-5" strokeWidth={2.5} /> : <Moon className="size-5" strokeWidth={2.5} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
