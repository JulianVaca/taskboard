import { useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { ArrowRight, CheckCheck, Eye, EyeOff, KeyRound, LoaderCircle, Lock, Mail, Moon, ShieldCheck, Sun, User } from "lucide-react";
import clsx from "clsx";
import Background from "../skins/classic/Background.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useI18n } from "../i18n.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLOW_MS = 3000; // a partir de aquí avisamos que el servidor gratuito está despertando

/** Traduce la respuesta de la API a un mensaje claro en el idioma activo. */
function authError(err, t, describeError) {
  if (err.status === 401) return t("auth.err.credentials");
  if (err.status === 409) return t("auth.err.taken");
  if (err.status === 429) return t("auth.err.tooMany");
  return describeError(err);
}

function Field({ icon: Icon, label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {hint && <span className="text-xs font-normal text-zinc-400">{hint}</span>}
      </span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3.5 size-4.5 text-zinc-400" />
        {children}
      </span>
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white/80 pr-4 pl-11 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100";

/** Pantalla de inicio de sesión, registro y recuperación de contraseña. */
export default function AuthScreen({ theme, onToggleTheme }) {
  const { t, lang, setLang, describeError } = useI18n();
  const { login, register, forgotPassword, resetPassword, notice } = useAuth();
  const [mode, setMode] = useState("login"); // login | register | forgot | reset
  const [form, setForm] = useState({ name: "", email: "", code: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [saving, setSaving] = useState(false);
  const [slow, setSlow] = useState(false);
  const [scope, animate] = useAnimate();

  const isRegister = mode === "register";
  const isRecovery = mode === "forgot" || mode === "reset";
  const needsPassword = mode === "login" || mode === "register" || mode === "reset";
  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
  };

  const fail = (message) => {
    setError(message);
    animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
  };

  const submit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const code = form.code.trim();
    // Validamos aquí también para dar respuesta inmediata (el backend vuelve a validar).
    if (isRegister && name.length < 2) return fail(t("auth.err.name"));
    if (!EMAIL_RE.test(email)) return fail(t("auth.err.email"));
    if (mode === "reset" && !/^\d{6}$/.test(code)) return fail(t("auth.err.code"));
    if (needsPassword && form.password.length < 8) return fail(t("auth.err.password"));

    setSaving(true);
    setError("");
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      if (mode === "register") await register(name, email, form.password);
      else if (mode === "login") await login(email, form.password);
      else if (mode === "forgot") {
        await forgotPassword(email);
        setMode("reset");
        setInfo(t("auth.codeSent"));
        setSaving(false);
      } else {
        await resetPassword(email, code, form.password);
      }
    } catch (err) {
      fail(authError(err, t, describeError));
      setSaving(false);
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
    }
  };

  return (
    <div className="font-sans text-zinc-900 dark:text-zinc-100">
      <Background />
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
              <CheckCheck className="size-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-semibold tracking-tight">TaskBoard</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="h-9 cursor-pointer rounded-full border border-zinc-200/80 bg-white/70 px-3 text-xs font-semibold backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-zinc-200/80 bg-white/70 backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <motion.div
            ref={scope}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="rounded-3xl border border-zinc-200/80 bg-white/75 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-zinc-900/70"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                <h1 className="text-2xl font-semibold tracking-tight">{t(`auth.title.${mode}`)}</h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t(`auth.subtitle.${mode}`)}</p>
              </motion.div>
            </AnimatePresence>

            {/* Pestañas con un indicador que se desliza */}
            {!isRecovery && (
              <div role="tablist" aria-label={t("auth.tabs")} className="mt-6 grid grid-cols-2 rounded-xl bg-zinc-100 p-1 dark:bg-white/5">
                {["login", "register"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => switchMode(m)}
                    className={clsx(
                      "relative cursor-pointer rounded-lg py-2 text-sm font-medium transition-colors",
                      mode === m ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                    )}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="auth-tab"
                        className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-white/10"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative">{t(`auth.${m}`)}</span>
                  </button>
                ))}
              </div>
            )}

            {(info || notice) && !error && (
              <p role="status" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                {info || t(notice)}
              </p>
            )}

            <form onSubmit={submit} noValidate className="mt-5 space-y-4">
              <AnimatePresence initial={false}>
                {isRegister && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <Field icon={User} label={t("auth.name")}>
                      <input value={form.name} onChange={set("name")} autoComplete="name" maxLength={80} placeholder={t("auth.namePh")} className={inputClass} />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field icon={Mail} label={t("auth.email")}>
                <input type="email" value={form.email} onChange={set("email")} autoComplete="email" maxLength={254} placeholder={t("auth.emailPh")} className={inputClass} />
              </Field>

              {mode === "reset" && (
                <Field icon={KeyRound} label={t("auth.code")}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.code}
                    onChange={set("code")}
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder={t("auth.codePh")}
                    className={inputClass}
                  />
                </Field>
              )}

              {needsPassword && (
                <>
                  <Field
                    icon={Lock}
                    label={mode === "reset" ? t("auth.newPassword") : t("auth.password")}
                    hint={isRegister || mode === "reset" ? t("auth.passwordHint") : undefined}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      autoComplete={isRegister || mode === "reset" ? "new-password" : "current-password"}
                      maxLength={72}
                      placeholder={t("auth.passwordPh")}
                      className={clsx(inputClass, "pr-12")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t("auth.hide") : t("auth.show")}
                      className="absolute right-2 grid size-8 cursor-pointer place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </Field>

                  {mode === "login" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="cursor-pointer text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
                      >
                        {t("auth.forgot")}
                      </button>
                    </div>
                  )}

                  {(isRegister || mode === "reset") && form.password.length > 0 && (
                    <div aria-hidden="true" className="flex gap-1.5">
                      {[1, 2, 3].map((level) => {
                        const strength = (form.password.length >= 8) + (form.password.length >= 12) + (/\d/.test(form.password) && /[^\w]/.test(form.password));
                        return (
                          <span
                            key={level}
                            className={clsx(
                              "h-1 flex-1 rounded-full transition-colors",
                              strength >= level ? ["bg-rose-400", "bg-amber-400", "bg-emerald-500"][strength - 1] : "bg-zinc-200 dark:bg-white/10"
                            )}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-sm text-rose-600 dark:text-rose-400">
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={saving}
                whileTap={{ scale: 0.98 }}
                className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 font-medium text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 disabled:cursor-wait disabled:opacity-80"
              >
                {saving ? (
                  <>
                    <LoaderCircle className="size-4.5 animate-spin" /> {t("auth.submitting")}
                  </>
                ) : (
                  <>
                    {mode === "forgot" ? t("auth.sendCode") : mode === "reset" ? t("auth.resetSubmit") : t(`auth.${mode}`)}{" "}
                    <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </motion.button>

              {slow && <p className="text-center text-xs text-amber-600 dark:text-amber-400">{t("auth.waking")}</p>}
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {isRecovery ? (
                <button type="button" onClick={() => switchMode("login")} className="cursor-pointer font-medium text-violet-600 hover:underline dark:text-violet-400">
                  {t("auth.backToLogin")}
                </button>
              ) : (
                <>
                  {isRegister ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
                  <button type="button" onClick={() => switchMode(isRegister ? "login" : "register")} className="cursor-pointer font-medium text-violet-600 hover:underline dark:text-violet-400">
                    {isRegister ? t("auth.login") : t("auth.register")}
                  </button>
                </>
              )}
            </p>
          </motion.div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="size-3.5" /> {t("auth.secure")}
          </p>
        </main>
      </div>
    </div>
  );
}