import { useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
import ClassicApp from "./skins/classic/ClassicApp.jsx";
import ComicApp from "./skins/comic/ComicApp.jsx";
import BrutalApp from "./skins/brutal/BrutalApp.jsx";
import { useTasks } from "./hooks/useTasks.js";
import { useTheme } from "./hooks/useTheme.js";
import { useSkin } from "./shared/useSkin.js";

const SKIN_APPS = { classic: ClassicApp, comic: ComicApp, brutal: BrutalApp };

/** Estado compartido (tareas, tema, idioma, filtro) y un estilo visual intercambiable encima. */
export default function App() {
  const tasks = useTasks();
  const { theme, toggle: toggleTheme } = useTheme();
  const { skin, setSkin } = useSkin(theme);
  const [filter, setFilter] = useState("all");

  const visible = useMemo(() => {
    if (filter === "pending") return tasks.tasks.filter((x) => !x.done);
    if (filter === "done") return tasks.tasks.filter((x) => x.done);
    return tasks.tasks;
  }, [tasks.tasks, filter]);

  const { status, slow } = tasks;
  const apiStatus = status === "ready" ? "online" : status === "error" ? "offline" : slow ? "waking" : "checking";
  const Skin = SKIN_APPS[skin];

  return (
    <MotionConfig reducedMotion="user">
      <Skin
        key={skin}
        {...tasks}
        visible={visible}
        filter={filter}
        setFilter={setFilter}
        apiStatus={apiStatus}
        ready={status === "ready"}
        theme={theme}
        onToggleTheme={toggleTheme}
        skin={skin}
        setSkin={setSkin}
      />
    </MotionConfig>
  );
}
