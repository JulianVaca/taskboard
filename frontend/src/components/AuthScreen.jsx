import { useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { ArrowRight, CheckCheck, Eye, EyeOff, LoaderCircle, Lock, Mail, Moon, ShieldCheck, Sun, User } from "lucide-react";
import clsx from "clsx";
import ClassicBackground from "../skins/classic/Background.jsx";
import ComicBackground from "../skins/comic/Background.jsx";
import Stickers from "../skins/brutal/Stickers.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useI18n } from "../i18n.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLOW_MS = 3000; // a partir de aquí avisamos que el servidor gratuito está despertando
const SKINS = ["classic", "comic", "brutal"];

/**
 * Apariencia de la pantalla de login en cada estilo visual.
 * La estructura y la lógica son las mismas; solo cambian las clases (principio abierto/cerrado).
 */
const LOOK = {
  classic: {
    Background: ClassicBackground,
    page: "font-sans text-zinc-900 dark:text-zinc-100",
    logo: "grid size-9 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30",
    brand: "text-lg font-semibold tracking-tight",
    headerBtn:
      "grid h-9 min-w-9 cursor-pointer place-items-center rounded-full border border-zinc-200/80 bg-white/70 px-3 text-xs font-semibold backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
    card: "rounded-3xl border border-zinc-200/80 bg-white/75 shadow-xl shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70",
    title: "text-2xl font-semibold tracking-tight",
    subtitle: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
    tabs: "grid grid-cols-2 rounded-xl bg-zinc-100 p-1 dark:bg-white/5",
    tab: "rounded-lg py-2 text-sm font-medium",
    tabOn: "text-zinc-900 dark:text-white",
    tabOff: "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400",
    tabPill: "rounded-lg bg-white shadow-sm dark:bg-white/10",
    label: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
    hint: "text-xs font-normal text-zinc-400",
    icon: "text-zinc-400",
    input:
      "h-12 rounded-xl border border-zinc-200 bg-white/80 text-zinc-900 transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100",
    eye: "rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200",
    submit:
      "rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 font-medium text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40",
    error: "text-sm text-rose-600 dark:text-rose-400",
    notice: "rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
    muted: "text-sm text-zinc-500 dark:text-zinc-400",
    link: "font-medium text-violet-600 hover:underline dark:text-violet-400",
    footer: "text-xs text-zinc-500 dark:text-zinc-400",
    skinWrap: "rounded-full border border-zinc-200/80 bg-white/70 p-0.5 backdrop-blur dark:border-white/10 dark:bg-white/5",
    skinBtn: "rounded-full px-2.5 py-1 text-xs font-medium",
    skinOn: "bg-white text-zinc-900 shadow-sm dark:bg-white/10 dark:text-white",
    skinOff: "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
    skinLabel: "text-xs text-zinc-500 dark:text-zinc-400",
  },
  comic: {
    Background: ComicBackground,
    page: "text-ink-text",
    logo: "inked grid size-11 place-items-center rounded-[3px] text-[#14101f] [--depth:3px] [--panel-bg:var(--yellow)]",
    brand: "lettering text-[1.7rem] leading-none [-webkit-text-stroke-width:1.5px]",
    headerBtn:
      "inked grid h-10 min-w-10 cursor-pointer place-items-center rounded-[3px] px-2 font-comic text-base tracking-wider text-ink-text [--depth:3px] hover:[--panel-bg:var(--yellow)] hover:text-[#14101f]",
    card: "inked rounded-[3px]",
    title: "lettering text-[2.4rem] leading-[0.95] sm:text-5xl",
    subtitle: "caption mt-4 -rotate-1 px-3 py-1.5 text-sm font-bold normal-case tracking-normal",
    tabs: "inked grid grid-cols-2 rounded-[3px] p-1 [--depth:3px]",
    tab: "rounded-[2px] py-1.5 font-comic text-lg tracking-wider",
    tabOn: "text-white dark:text-[#14101f]",
    tabOff: "text-ink-text hover:bg-yellow hover:text-[#14101f]",
    tabPill: "rounded-[2px] border-2 border-ink bg-magenta",
    label: "text-xs font-extrabold uppercase tracking-wide text-ink-text [font-stretch:85%]",
    hint: "text-[0.7rem] font-bold normal-case text-ink-soft",
    icon: "text-ink-soft",
    input:
      "h-12 rounded-[3px] border-[3px] border-ink bg-paper font-semibold text-ink-text transition-shadow placeholder:font-medium placeholder:text-ink-soft focus:shadow-[4px_4px_0_var(--magenta)]",
    eye: "rounded-[3px] text-ink-soft hover:bg-yellow hover:text-[#14101f]",
    submit:
      "rounded-[4px] border-[3px] border-ink bg-yellow font-comic text-2xl tracking-wider text-[#14101f] shadow-[4px_4px_0_var(--ink)] transition-shadow hover:shadow-[6px_6px_0_var(--ink)]",
    error: "inline-block rounded-[4px] border-[2.5px] border-ink bg-danger px-3 py-1.5 text-sm font-bold text-white",
    notice: "caption px-3 py-2 text-sm font-bold normal-case tracking-normal",
    muted: "text-sm font-semibold text-ink-soft",
    link: "font-comic text-lg tracking-wider text-magenta hover:underline",
    footer: "text-xs font-extrabold uppercase tracking-wide text-on-ground [font-stretch:85%]",
    skinWrap: "inked flex rounded-[3px] p-1 [--depth:3px]",
    skinBtn: "rounded-[2px] px-2.5 py-0.5 font-comic text-sm tracking-wider",
    skinOn: "bg-magenta text-white dark:text-[#14101f]",
    skinOff: "text-ink-text hover:bg-yellow hover:text-[#14101f]",
    skinLabel: "text-xs font-extrabold uppercase tracking-wide text-on-ground [font-stretch:85%]",
  },
  brutal: {
    Background: Stickers,
    page: "text-b-text",
    logo: "grid size-11 -rotate-6 place-items-center rounded-[10px] border-4 border-b-ink bg-b-heat text-b-on-accent shadow-[4px_4px_0_var(--b-ink)]",
    brand: "display-wide text-xl sm:text-2xl",
    headerBtn:
      "slab press grid h-10 min-w-10 cursor-pointer place-items-center rounded-[10px] px-2 text-sm font-black uppercase shadow-[4px_4px_0_var(--b-ink)] hover:bg-b-sun hover:text-b-on-accent",
    card: "slab overflow-hidden",
    strip: true,
    title: "display-wide text-[2rem] leading-[0.95] sm:text-[2.4rem]",
    subtitle: "mt-2 font-semibold text-b-text-soft",
    tabs: "grid grid-cols-2 gap-1 rounded-[12px] border-4 border-b-ink bg-b-paper p-1 shadow-[4px_4px_0_var(--b-ink)]",
    tab: "rounded-[8px] py-2 text-xs font-black uppercase [font-stretch:100%] sm:text-sm sm:[font-stretch:110%]",
    tabOn: "text-b-on-para",
    tabOff: "text-b-text hover:bg-b-sun hover:text-b-on-accent",
    tabPill: "rounded-[8px] border-[3px] border-b-ink bg-b-para",
    label: "text-xs font-black uppercase [font-stretch:110%]",
    hint: "text-[0.7rem] font-bold normal-case text-b-text-soft",
    icon: "text-b-text-soft",
    input:
      "h-12 rounded-[10px] border-4 border-b-ink bg-b-paper font-bold text-b-text transition-shadow placeholder:font-semibold placeholder:text-b-text-soft focus:shadow-[4px_4px_0_var(--b-ink)]",
    eye: "rounded-[6px] text-b-text-soft hover:bg-b-sun hover:text-b-on-accent",
    submit:
      "press rounded-[10px] border-4 border-b-ink bg-b-heat font-black uppercase text-b-on-accent shadow-[6px_6px_0_var(--b-ink)] [font-stretch:112%]",
    error: "inline-block rounded-[8px] border-4 border-b-ink bg-b-heat px-3 py-1.5 text-sm font-black text-b-on-accent shadow-[4px_4px_0_var(--b-ink)]",
    notice: "rounded-[8px] border-[3px] border-b-ink bg-b-sun px-3 py-2 text-sm font-bold text-b-on-accent",
    muted: "text-sm font-semibold text-b-text-soft",
    link: "font-black uppercase underline decoration-b-heat decoration-[3px] underline-offset-2",
    footer: "text-xs font-black uppercase [font-stretch:110%]",
    skinWrap: "slab flex gap-1 rounded-[10px] p-1 shadow-[4px_4px_0_var(--b-ink)]",
    skinBtn: "rounded-[6px] px-2 py-0.5 text-xs font-black uppercase [font-stretch:105%]",
    skinOn: "bg-b-para text-b-on-para",
    skinOff: "text-b-text hover:bg-b-sun hover:text-b-on-accent",
    skinLabel: "hidden text-xs font-black uppercase [font-stretch:110%] sm:inline",
  },
};

/** Traduce la respuesta de la API a un mensaje claro en el idioma activo. */
function authError(err, t, describeError) {
  if (err.status === 401) return t("auth.err.credentials");
  if (err.status === 409) return t("auth.err.taken");
  if (err.status === 429) return t("auth.err.tooMany");
  return describeError(err);
}

function Field({ look, icon: Icon, label, hint, children }) {
  return (
    <label className="block">
      <span className={clsx("mb-1.5 flex items-baseline justify-between", look.label)}>
        {label}
        {hint && <span className={look.hint}>{hint}</span>}
      </span>
      <span className="relative flex items-center">
        <Icon className={clsx("pointer-events-none absolute left-3.5 z-10 size-4.5", look.icon)} />
        {children}
      </span>
    </label>
  );
}

/** Pantalla de inicio de sesión y registro; se viste con el estilo elegido (Clásico, Cómic o Brutal). */
export default function AuthScreen({ theme, onToggleTheme, skin, setSkin }) {
  const { t, lang, setLang, describeError } = useI18n();
  const { login, register, notice } = useAuth();
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [slow, setSlow] = useState(false);
  const [scope, animate] = useAnimate();

  const look = LOOK[skin] ?? LOOK.classic;
  const { Background } = look;
  const isRegister = mode === "register";
  const inputClass = clsx("w-full pr-4 pl-11 outline-none", look.input);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const fail = (message) => {
    setError(message);
    animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
  };

  const submit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    // Validamos aquí también para dar respuesta inmediata (el backend vuelve a validar).
    if (isRegister && name.length < 2) return fail(t("auth.err.name"));
    if (!EMAIL_RE.test(email)) return fail(t("auth.err.email"));
    if (form.password.length < 8) return fail(t("auth.err.password"));

    setSaving(true);
    setError("");
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      if (isRegister) await register(name, email, form.password);
      else await login(email, form.password);
    } catch (err) {
      fail(authError(err, t, describeError));
      setSaving(false);
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
    }
  };

  const strength =
    (form.password.length >= 8) + (form.password.length >= 12) + (/\d/.test(form.password) && /[^\w]/.test(form.password));

  return (
    <div className={look.page}>
      <Background />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2.5">
            <span className={clsx("shrink-0", look.logo)}>
              <CheckCheck className="size-5" strokeWidth={2.75} />
            </span>
            <span className={look.brand}>TaskBoard</span>
          </span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setLang(lang === "es" ? "en" : "es")} className={look.headerBtn} aria-label={t("lang.label")}>
              {lang === "es" ? "EN" : "ES"}
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
              className={look.headerBtn}
            >
              {theme === "dark" ? <Sun className="size-4.5" strokeWidth={2.5} /> : <Moon className="size-4.5" strokeWidth={2.5} />}
            </button>
          </div>
        </header>

        {/* Selector de estilo: el mismo que hay dentro del tablero */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className={look.skinLabel}>{t("skin.label")}</span>
          <div role="group" aria-label={t("skin.label")} className={look.skinWrap}>
            {SKINS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={skin === id}
                onClick={() => setSkin(id)}
                className={clsx("cursor-pointer transition-colors", look.skinBtn, skin === id ? look.skinOn : look.skinOff)}
              >
                {t(`skin.${id}`)}
              </button>
            ))}
          </div>
        </div>

        <main className="flex flex-1 flex-col justify-center py-8">
          <motion.div
            key={skin}
            ref={scope}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={look.card}
          >
            {look.strip && (
              <div className="flex items-center gap-1.5 border-b-4 border-b-ink bg-b-sun px-4 py-2" aria-hidden="true">
                <span className="size-3 rounded-full border-[2.5px] border-b-ink bg-b-heat" />
                <span className="size-3 rounded-full border-[2.5px] border-b-ink bg-[#fffdf9]" />
                <span className="size-3 rounded-full border-[2.5px] border-b-ink bg-b-para" />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                  <h1 className={look.title}>{t(`auth.title.${mode}`)}</h1>
                  <p className={look.subtitle}>{t(`auth.subtitle.${mode}`)}</p>
                </motion.div>
              </AnimatePresence>

              {/* Pestañas con un indicador que se desliza */}
              <div role="tablist" aria-label={t("auth.tabs")} className={clsx("mt-6", look.tabs)}>
                {["login", "register"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => switchMode(m)}
                    className={clsx("relative cursor-pointer transition-colors", look.tab, mode === m ? look.tabOn : look.tabOff)}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId={`auth-tab-${skin}`}
                        className={clsx("absolute inset-0", look.tabPill)}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative">{t(`auth.${m}`)}</span>
                  </button>
                ))}
              </div>

              {notice && !error && (
                <p role="status" className={clsx("mt-5", look.notice)}>
                  {t(notice)}
                </p>
              )}

              <form onSubmit={submit} noValidate className="mt-5 space-y-4">
                <AnimatePresence initial={false}>
                  {isRegister && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-1 pb-1 -mx-1">
                      <Field look={look} icon={User} label={t("auth.name")}>
                        <input value={form.name} onChange={set("name")} autoComplete="name" maxLength={80} placeholder={t("auth.namePh")} className={inputClass} />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field look={look} icon={Mail} label={t("auth.email")}>
                  <input type="email" value={form.email} onChange={set("email")} autoComplete="email" maxLength={254} placeholder={t("auth.emailPh")} className={inputClass} />
                </Field>

                <Field look={look} icon={Lock} label={t("auth.password")} hint={isRegister ? t("auth.passwordHint") : undefined}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    maxLength={72}
                    placeholder={t("auth.passwordPh")}
                    className={clsx(inputClass, "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t("auth.hide") : t("auth.show")}
                    className={clsx("absolute right-2 grid size-8 cursor-pointer place-items-center transition-colors", look.eye)}
                  >
                    {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                  </button>
                </Field>

                {isRegister && form.password.length > 0 && (
                  <div aria-hidden="true" className="flex gap-1.5">
                    {[1, 2, 3].map((level) => (
                      <span
                        key={level}
                        className={clsx(
                          "h-1.5 flex-1 rounded-full transition-colors",
                          strength >= level ? ["bg-rose-400", "bg-amber-400", "bg-emerald-500"][strength - 1] : "bg-zinc-300/60 dark:bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.p role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={look.error}>
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    "group flex h-12 w-full cursor-pointer items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-80",
                    look.submit
                  )}
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="size-4.5 animate-spin" /> {t("auth.submitting")}
                    </>
                  ) : (
                    <>
                      {t(`auth.${mode}`)} <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.75} />
                    </>
                  )}
                </motion.button>

                {slow && <p className={clsx("text-center", look.muted)}>{t("auth.waking")}</p>}
              </form>

              <p className={clsx("mt-6 text-center", look.muted)}>
                {isRegister ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
                <button type="button" onClick={() => switchMode(isRegister ? "login" : "register")} className={clsx("cursor-pointer", look.link)}>
                  {isRegister ? t("auth.login") : t("auth.register")}
                </button>
              </p>
            </div>
          </motion.div>

          <p className={clsx("mt-8 flex items-center justify-center gap-1.5 text-center", look.footer)}>
            <ShieldCheck className="size-3.5 shrink-0" /> {t("auth.secure")}
          </p>
        </main>
      </div>
    </div>
  );
}