import { useEffect, useMemo, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import ClassicApp from "./skins/classic/ClassicApp.jsx";
import ComicApp from "./skins/comic/ComicApp.jsx";
import BrutalApp from "./skins/brutal/BrutalApp.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import { useTasks } from "./hooks/useTasks.js";
import { useTheme } from "./hooks/useTheme.js";
import { useAuth } from "./hooks/useAuth.jsx";
import { NotificationsProvider, useNotifications } from "./hooks/useNotifications.jsx";
import { useSkin } from "./shared/useSkin.js";
import { useI18n } from "./i18n.jsx";

const SKIN_APPS = { classic: ClassicApp, comic: ComicApp, brutal: BrutalApp };

/** Sin sesión se muestra el login; con sesión, el tablero de ese usuario. */
export default function App() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <MotionConfig reducedMotion="user">
      {user ? (
        // key: al cambiar de usuario se reinician las tareas y el historial de notificaciones
        <NotificationsProvider key={user.id} userId={user.id}>
          <Board user={user} theme={theme} onToggleTheme={toggle} />
        </NotificationsProvider>
      ) : (
        <AuthScreen theme={theme} onToggleTheme={toggle} />
      )}
    </MotionConfig>
  );
}

/** Estado compartido (tareas, tema, idioma, filtro) y un estilo visual intercambiable encima. */
function Board({ user, theme, onToggleTheme }) {
  const tasks = useTasks();
  const { skin, setSkin } = useSkin(theme);
  const { notify } = useNotifications();
  const { t } = useI18n();
  const [filter, setFilter] = useState("all");

  // Saludo al iniciar sesión (el ref evita que salga dos veces en modo desarrollo).
  const greeted = useRef(false);
  useEffect(() => {
    if (greeted.current || !user.fresh) return;
    greeted.current = true;
    notify("success", user.fresh === "register" ? t("auth.welcomeNew", user.name) : t("auth.welcome", user.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cada minuto se vuelve a dibujar para que "hace 5 min" se mantenga al día.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(() => {
    if (filter === "pending") return tasks.tasks.filter((x) => !x.done);
    if (filter === "done") return tasks.tasks.filter((x) => x.done);
    return tasks.tasks;
  }, [tasks.tasks, filter]);

  const { status, slow } = tasks;
  const apiStatus = status === "ready" ? "online" : status === "error" ? "offline" : slow ? "waking" : "checking";
  const Skin = SKIN_APPS[skin];

  return (
    <Skin
      key={skin}
      {...tasks}
      visible={visible}
      filter={filter}
      setFilter={setFilter}
      apiStatus={apiStatus}
      ready={status === "ready"}
      theme={theme}
      onToggleTheme={onToggleTheme}
      skin={skin}
      setSkin={setSkin}
    />
  );
}