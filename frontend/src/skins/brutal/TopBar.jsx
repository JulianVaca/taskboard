import { CheckCheck, Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "../../i18n.jsx";

const DOT = { online: "bg-[#3ddc97]", checking: "bg-b-sun", waking: "bg-b-sun", offline: "bg-b-heat" };
const LANGS = [
  { id: "es", label: "ES", name: "Español" },
  { id: "en", label: "EN", name: "English" },
];
const SKINS = ["classic", "comic", "brutal"];

/** Grupo de botones: el activo es una plancha Paradise. */
function Group({ label, items, value, onChange, size = "h-10", compact = false }) {
  return (
    <div role="group" aria-label={label} className={clsx("slab flex gap-1 rounded-[10px] p-1 shadow-[4px_4px_0_var(--b-ink)]", size)}>
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
              "cursor-pointer rounded-[6px] font-black uppercase transition-colors",
              compact ? "px-1.5 text-xs [font-stretch:95%] sm:px-2.5 sm:text-sm sm:[font-stretch:110%]" : "px-2.5 text-sm [font-stretch:110%]",
              active ? "bg-b-para text-b-on-para" : "text-b-text hover:bg-b-sun hover:text-b-on-accent"
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export default function TopBar({ apiStatus, theme, onToggleTheme, skin, setSkin }) {
  const { t, lang, setLang } = useI18n();
  return (
    // Móvil: marca + idioma/tema arriba, estado + estilo abajo. Escritorio: estado junto a los controles.
    <header className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-4 [grid-template-areas:'brand_controls'_'status_skin'] sm:grid-cols-[1fr_auto_auto] sm:[grid-template-areas:'brand_status_controls'_'skin_skin_skin']">
        <a href="/" className="flex min-w-0 items-center gap-3 [grid-area:brand]" aria-label={t("brand.home")}>
          <span className="hidden size-11 shrink-0 -rotate-6 place-items-center rounded-[10px] border-4 border-b-ink bg-b-heat text-b-on-accent shadow-[4px_4px_0_var(--b-ink)] sm:grid">
            <CheckCheck className="size-6" strokeWidth={3} />
          </span>
          <span className="display-wide text-[1.05rem] leading-none [font-stretch:100%] min-[380px]:text-lg sm:text-2xl sm:[font-stretch:118%]">TaskBoard</span>
        </a>

        <div role="status" aria-live="polite" className="ticket flex h-10 items-center gap-2 justify-self-start px-3.5 text-xs font-black whitespace-nowrap uppercase [font-stretch:105%] [grid-area:status] sm:justify-self-end">
          <span className={clsx("size-2.5 shrink-0 rounded-full ring-2 ring-b-ink", DOT[apiStatus])} />
          <span className="hidden sm:inline">{t(`status.${apiStatus}`)}</span>
          <span className="sm:hidden">{t(`status.short.${apiStatus}`)}</span>
        </div>

        <div className="flex items-center gap-2 [grid-area:controls]">
          <Group label={t("lang.label")} items={LANGS.map((l) => ({ ...l, lang: l.id }))} value={lang} onChange={setLang} />
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
            className="slab press grid size-10 shrink-0 cursor-pointer place-items-center rounded-[10px] shadow-[4px_4px_0_var(--b-ink)] hover:bg-b-sun hover:text-b-on-accent"
          >
            {theme === "dark" ? <Sun className="size-5" strokeWidth={2.75} /> : <Moon className="size-5" strokeWidth={2.75} />}
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 [grid-area:skin]">
          <span className="hidden text-xs font-black uppercase [font-stretch:110%] sm:inline">{t("skin.label")}</span>
          <Group
            label={t("skin.label")}
            items={SKINS.map((id) => ({ id, label: t(`skin.${id}`), name: t(`skin.${id}`) }))}
            value={skin}
            onChange={setSkin}
            size="h-9"
            compact
          />
        </div>
    </header>
  );
}
