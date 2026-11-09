import { memo, useEffect, useMemo } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/** Generador determinista para que la ciudad sea siempre la misma. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Precompila toda la silueta de la ciudad y sus ventanas en dos únicos strings SVG <path>.
 * Reduce ~280 nodos DOM (<rect>) por capa a solo 2 nodos <path>, acelerando el compositing.
 */
function buildCityPaths(seed, { minH, maxH, windows }) {
  const r = rng(seed);
  let body = "";
  let roofs = "";
  let antennas = "";
  let lit = "";
  let x = -20;

  while (x < 1240) {
    const w = 44 + Math.round(r() * 70);
    const h = minH + Math.round(r() * (maxH - minH));
    if (windows) {
      for (let wy = 300 - h + 16; wy < 288; wy += 20) {
        for (let wx = x + 8; wx < x + w - 12; wx += 14) {
          if (r() < 0.22) lit += `M${wx},${wy}h7v9h-7Z`;
        }
      }
    }
    if (r() < 0.25) {
      const ax = x + w / 2 - 1.5;
      const ay = 300 - h - 26;
      antennas += `M${ax},${ay}h3v26h-3Z`;
    }
    const roof = r() < 0.3 ? 8 + Math.round(r() * 10) : 0;
    if (roof > 0) {
      roofs += `M${x + 8},${300 - h - roof}h${w - 16}v${roof + 2}h${-(w - 16)}Z`;
    }
    body += `M${x},${300 - h}h${w}v${h + 4}h${-w}Z`;
    x += w + Math.round(r() * 6);
  }

  return { body, roofs, antennas, lit };
}

const City = memo(function City({ seed, minH, maxH, windows, fill, stroke }) {
  const { body, roofs, antennas, lit } = useMemo(
    () => buildCityPaths(seed, { minH, maxH, windows }),
    [seed, minH, maxH, windows]
  );
  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      {antennas && <path d={antennas} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : 0} />}
      {roofs && <path d={roofs} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} />}
      <path d={body} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
      {lit && <path d={lit} fill="var(--window)" />}
    </svg>
  );
});

/**
 * Fondo 2.5D optimizado para GPU:
 * - Cielo y líneas de velocidad estáticos (evita re-rasterizar conic-gradient + mask-image de 140% del viewport).
 * - Ciudades compiladas en 2 <path> SVG en lugar de cientos de <rect>.
 * - Puntero muestreado con requestAnimationFrame solo en dispositivos con puntero fino.
 */
export default function Background() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 55, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 55, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let nextX = 0;
    let nextY = 0;
    const flush = () => {
      raf = 0;
      px.set(nextX);
      py.set(nextY);
    };
    const onMove = (e) => {
      nextX = e.clientX / window.innerWidth - 0.5;
      nextY = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, px, py]);

  const sunX = useTransform(sx, (v) => v * -10);
  const sunY = useTransform(sy, (v) => v * -5);
  const farX = useTransform(sx, (v) => v * -20);
  const farY = useTransform(sy, (v) => v * -8);
  const nearX = useTransform(sx, (v) => v * -40);
  const nearY = useTransform(sy, (v) => v * -14);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden contain-strict">
      {/* Trama del cielo, más densa arriba */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(var(--dot) 28%, transparent 32%)",
          backgroundSize: "9px 9px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />
      {/* Líneas de velocidad (capa estática para no re-evaluar conic-gradient + mask en cada frame) */}
      <div
        className="absolute -inset-[12%] opacity-60"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 18%, transparent 0deg 7deg, var(--dot) 7deg 8.5deg)",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 18%, transparent 18%, black 70%)",
        }}
      />
      {/* Sol / luna de trama */}
      <motion.div
        className=" absolute -top-10 -right-14 size-32 transform-gpu will-change-transform sm:top-[9%] sm:right-[8%] sm:size-56"
        style={{ x: sunX, y: sunY }}
      >
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
      <motion.div
        className="absolute inset-x-[-6%] bottom-0 h-[34vh] min-h-56 transform-gpu will-change-transform"
        style={{ x: farX, y: farY }}
      >
        <City seed={7} minH={90} maxH={250} fill="var(--far-city)" />
        <div className="absolute inset-x-0 top-full h-[20vh] bg-(--far-city)" />
      </motion.div>
      {/* Ciudad cercana entintada */}
      <motion.div
        className="absolute inset-x-[-10%] -bottom-6 h-[24vh] min-h-40 transform-gpu will-change-transform"
        style={{ x: nearX, y: nearY }}
      >
        <City seed={42} minH={50} maxH={190} windows fill="var(--near-city)" stroke="var(--ink)" />
        <div className="absolute inset-x-0 top-full -mt-1 h-[20vh] bg-(--near-city)" />
      </motion.div>
    </div>
  );
}
