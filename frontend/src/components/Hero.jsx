import { motion } from "motion/react";
import ProgressRing from "./ProgressRing.jsx";

function greeting(date) {
  const h = date.getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

const dateFmt = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" });
const today = (date) => {
  const s = dateFmt.format(date);
  return s.charAt(0).toUpperCase() + s.slice(1); // "Sábado, 7 de noviembre"
};

export default function Hero({ counts, ready }) {
  const now = new Date();
  const progress = counts.all ? Math.round((counts.done / counts.all) * 100) : 0;

  let summary = "Cargando tu tablero…";
  if (ready) {
    if (counts.all === 0) summary = "Tu tablero está vacío. Empieza agregando una tarea.";
    else if (counts.pending === 0) summary = "Completaste todo. ¡Excelente trabajo!";
    else summary = `Tienes ${counts.pending} ${counts.pending === 1 ? "tarea pendiente" : "tareas pendientes"}.`;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between gap-6"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{today(now)}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {greeting(now)} <span className="inline-block origin-[70%_70%] animate-wave motion-reduce:animate-none">👋</span>
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">{summary}</p>
      </div>
      {ready && counts.all > 0 && <ProgressRing value={progress} />}
    </motion.section>
  );
}
