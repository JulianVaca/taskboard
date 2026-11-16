import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, CircleAlert, CircleCheck, Info, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "../i18n.jsx";
import { useNotifications } from "../hooks/useNotifications.jsx";
import { fullDate, relativeTime } from "../shared/format.js";
import { usePopover } from "../shared/usePopover.js";

const ICONS = {
  success: { Icon: CircleCheck, color: "text-emerald-500 bg-emerald-500/10" },
  info: { Icon: Info, color: "text-violet-500 bg-violet-500/10" },
  error: { Icon: CircleAlert, color: "text-rose-500 bg-rose-500/10" },
};

/** Campanita con contador de no leídas y el historial de actividad del tablero. */
export default function NotificationBell({ buttonClass }) {
  const { t, lang } = useI18n();
  const { items, unread, seenAt, markRead, clear } = useNotifications();
  const { open, setOpen, ref } = usePopover();
  const [lastSeen, setLastSeen] = useState(seenAt); // para resaltar las nuevas mientras el panel está abierto

  const toggle = () => {
    if (!open) {
      setLastSeen(seenAt);
      markRead();
    }
    setOpen(!open);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={t("notif.open", unread)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={clsx("relative", buttonClass)}
      >
        <motion.span key={unread} animate={unread ? { rotate: [0, -18, 14, -8, 0] } : {}} transition={{ duration: 0.5 }}>
          <Bell className="size-4.5" strokeWidth={2.25} />
        </motion.span>
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-bold text-white ring-2 ring-white dark:ring-zinc-900"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("notif.title")}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-zinc-200 bg-white font-sans text-zinc-900 normal-case shadow-2xl shadow-zinc-900/10 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-white/5">
              <p className="text-sm font-semibold">{t("notif.title")}</p>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-white/5"
                >
                  <Trash2 className="size-3.5" /> {t("notif.clear")}
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <span className="grid size-11 place-items-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-white/5">
                  <Bell className="size-5" />
                </span>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("notif.empty")}</p>
              </div>
            ) : (
              <ul className="max-h-96 divide-y divide-zinc-100 overflow-y-auto dark:divide-white/5">
                {items.map((n) => {
                  const { Icon, color } = ICONS[n.type] ?? ICONS.info;
                  const isNew = Date.parse(n.at) > lastSeen;
                  return (
                    <li key={n.id} className={clsx("flex gap-3 px-4 py-3", isNew && "bg-violet-50/70 dark:bg-violet-500/5")}>
                      <span className={clsx("mt-0.5 grid size-8 shrink-0 place-items-center rounded-full", color)}>
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        {n.description && <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{n.description}</p>}
                        <time dateTime={n.at} title={fullDate(n.at, lang)} className="text-[0.7rem] text-zinc-400 dark:text-zinc-500">
                          {relativeTime(n.at, lang, t("task.justNow"))}
                        </time>
                      </div>
                      {isNew && <span aria-label={t("notif.new")} className="mt-2 size-2 shrink-0 rounded-full bg-violet-500" />}
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}