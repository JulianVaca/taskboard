import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

/** Estrella de cuatro puntas dibujada como separador entre frases. */
function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden="true">
      <path d="M12 1.5 14.6 9.4 22.5 12 14.6 14.6 12 22.5 9.4 14.6 1.5 12 9.4 9.4Z" fill="var(--b-heat)" stroke="var(--b-ink)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Cinta en movimiento continuo. La velocidad base se acelera con la velocidad del scroll
 * (resorte), y cambia de sentido al subir o bajar.
 */
export default function Marquee({ items, direction = 1, tilt = -2, className = "" }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const dir = useRef(direction);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * 2.2 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -direction;
    else if (f > 0) dir.current = direction;
    move += dir.current * move * Math.abs(f);
    base.set(base.get() + move);
  });

  const row = (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {[...items, ...items].map((text, i) => (
        <span key={i} className="flex items-center gap-6">
          <span className="display-wide text-xl whitespace-nowrap text-b-on-accent sm:text-2xl">{text}</span>
          <Spark />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className={`relative left-1/2 w-[110vw] -translate-x-1/2 overflow-hidden border-y-4 border-b-ink bg-b-sun py-2.5 ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {row}
        {row}
      </motion.div>
    </div>
  );
}
