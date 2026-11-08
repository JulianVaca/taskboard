import { useEffect, useMemo } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/** Generador determinista para que la ciudad sea siempre la misma. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildCity(seed, { minH, maxH, windows }) {
  const r = rng(seed);
  const blocks = [];
  let x = -20;
  while (x < 1240) {
    const w = 44 + Math.round(r() * 70);
    const h = minH + Math.round(r() * (maxH - minH));
    const lit = [];
    if (windows) {
      for (let wy = 300 - h + 16; wy < 288; wy += 20) {
        for (let wx = x + 8; wx < x + w - 12; wx += 14) {
          if (r() < 0.22) lit.push([wx, wy]);
        }
      }
    }
    const antenna = r() < 0.25;
    blocks.push({ x, w, h, lit, antenna, roof: r() < 0.3 ? 8 + Math.round(r() * 10) : 0 });
    x += w + Math.round(r() * 6);
  }
  return blocks;
}

function City({ seed, minH, maxH, windows, fill, stroke }) {
  const blocks = useMemo(() => buildCity(seed, { minH, maxH, windows }), [seed, minH, maxH, windows]);
  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      {blocks.map((b, i) => (
        <g key={i}>
          {b.antenna && <rect x={b.x + b.w / 2 - 1.5} y={300 - b.h - 26} width={3} height={26} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : 0} />}
          {b.roof > 0 && (
            <rect x={b.x + 8} y={300 - b.h - b.roof} width={b.w - 16} height={b.roof + 2} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
          )}
          <rect x={b.x} y={300 - b.h} width={b.w} height={b.h + 4} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
          {b.lit.map(([wx, wy], j) => (
            <rect key={j} x={wx} y={wy} width={7} height={9} fill="var(--window)" />
          ))}
        </g>
      ))}
    </svg>
  );
}

/**
 * Fondo 2.5D: cielo con trama, líneas de velocidad, sol de trama y dos capas de ciudad
 * que se desplazan a distinta profundidad con el puntero y el scroll.
 */
export default function Background() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const { scrollY } = useScroll();

  useEffect(() => {
    if (reduce) return;
    const onMove = (e) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  const depth = (k, scrollK) => ({
    x: useTransform(sx, (v) => (reduce ? 0 : v * -k)),
    y: useTransform([sy, scrollY], ([v, s]) => (reduce ? 0 : v * -k * 0.5 - s * scrollK)),
  });
  /* eslint-disable react-hooks/rules-of-hooks -- llamadas fijas, siempre en el mismo orden */
  const sun = depth(10, 0.04);
  const far = depth(22, 0.08);
  const near = depth(48, 0.16);
  const lines = depth(6, 0);
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Trama del cielo, más densa arriba */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(var(--dot) 28%, transparent 32%)",
          backgroundSize: "9px 9px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />
      {/* Líneas de velocidad */}
      <motion.div
        className="absolute -inset-[20%] opacity-60"
        style={{
          ...lines,
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 18%, transparent 0deg 7deg, var(--dot) 7deg 8.5deg)",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 18%, transparent 18%, black 70%)",
        }}
      />
      {/* Sol / luna de trama */}
      <motion.div className="absolute -top-10 -right-14 size-32 sm:top-[9%] sm:right-[8%] sm:size-56" style={sun}>
        <div
          className="size-full rounded-full"
          style={{
            backgroundImage: "radial-gradient(var(--sun) 46%, transparent 50%)",
            backgroundSize: "8px 8px",
            maskImage: "radial-gradient(circle, black 55%, transparent 71%)",
          }}
        />
      </motion.div>
      {/* Ciudad lejana */}
      <motion.div className="absolute inset-x-[-6%] bottom-0 h-[34vh] min-h-56" style={far}>
        <City seed={7} minH={90} maxH={250} fill="var(--far-city)" />
        <div className="absolute inset-x-0 top-full h-[60vh] bg-(--far-city)" />
      </motion.div>
      {/* Ciudad cercana entintada */}
      <motion.div className="absolute inset-x-[-10%] -bottom-6 h-[24vh] min-h-40" style={near}>
        <City seed={42} minH={50} maxH={190} windows fill="var(--near-city)" stroke="var(--ink)" />
        <div className="absolute inset-x-0 top-full -mt-1 h-[60vh] bg-(--near-city)" />
      </motion.div>
    </div>
  );
}
