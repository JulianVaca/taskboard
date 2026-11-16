import { AnimatePresence, motion } from "motion/react";
import { LogOut } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "../i18n.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { usePopover } from "../shared/usePopover.js";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** Botón con las iniciales del usuario; al abrirlo muestra su nombre y "Cerrar sesión". */
export default function UserMenu({ buttonClass }) {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { open, setOpen, ref } = usePopover();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`${t("auth.account")}: ${user.name}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className={clsx("text-xs font-bold", buttonClass)}
      >
        {initials(user.name)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-zinc-200 bg-white font-sans text-zinc-900 normal-case shadow-2xl shadow-zinc-900/10 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                {initials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="text-[0.7rem] text-zinc-500 dark:text-zinc-400">{t("auth.account")}</p>
                <p className="truncate text-sm font-semibold">{user.name}</p>
              </div>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="flex w-full cursor-pointer items-center gap-2 border-t border-zinc-100 px-4 py-3 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:border-white/5 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <LogOut className="size-4" /> {t("auth.logout")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}