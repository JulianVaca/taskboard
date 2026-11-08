import { motion } from "motion/react";

/** Fondo decorativo: cuadrícula sutil y dos halos de color que respiran lentamente. */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(24_24_27/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(24_24_27/0.05)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.045)_1px,transparent_1px)]" />
      <motion.div
        className="absolute -top-56 left-1/2 h-130 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-violet-400/35 via-indigo-400/25 to-sky-300/30 blur-3xl dark:from-violet-600/25 dark:via-indigo-600/20 dark:to-sky-500/15"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 6, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-90 w-90 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-600/10"
        animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
