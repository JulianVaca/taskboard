import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const INTERACTIVE = "button, a, input, [role=checkbox], [draggable], .cursor-grab";

/** Cursor reactivo Heatwave que sigue al puntero con resorte y crece sobre lo interactivo. */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);
  const [inside, setInside] = useState(true);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    setEnabled(fine.matches && !reduce);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setInside(true);
      setHot(Boolean(e.target.closest?.(INTERACTIVE)));
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    const leave = () => setInside(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  // Sobre algo interactivo se vuelve un anillo hueco para no tapar el objetivo.
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 -ml-3 -mt-3 size-6 rounded-full border-[3px] border-b-ink"
      style={{ x: sx, y: sy }}
      animate={{
        scale: down ? 0.6 : hot ? 1.9 : 1,
        opacity: inside ? 1 : 0,
        backgroundColor: hot ? "rgba(255,126,95,0)" : "rgba(255,126,95,1)",
        borderColor: hot ? "#ff7e5f" : "#351c4d",
        borderWidth: hot ? 2 : 3,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
    />
  );
}
