import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

const SIZE = 76;
const STROKE = 7;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/** Anillo de progreso con número animado. */
export default function ProgressRing({ value }) {
  const progress = useMotionValue(0);
  const offset = useTransform(progress, (v) => C - (v / 100) * C);
  const label = useTransform(progress, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    const controls = animate(progress, value, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, progress]);

  return (
    <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }} role="img" aria-label={`${value}% de las tareas completadas`}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} className="stroke-zinc-200 dark:stroke-white/10" />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="url(#ring)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <motion.span className="absolute inset-0 grid place-items-center text-sm font-semibold tabular-nums">{label}</motion.span>
    </div>
  );
}
