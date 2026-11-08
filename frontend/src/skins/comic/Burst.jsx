import { useId } from "react";

// Estrella de 14 puntas con radios irregulares, dibujada a mano en coordenadas fijas.
const POINTS = (() => {
  const radii = [50, 30, 47, 33, 52, 29, 45, 34, 50, 31, 48, 28, 53, 32, 46, 30, 51, 33, 47, 29, 50, 34, 45, 31, 52, 30, 48, 32];
  return radii
    .map((r, i) => {
      const a = (i / radii.length) * Math.PI * 2 - Math.PI / 2;
      return `${(60 + Math.cos(a) * r * 1.15).toFixed(1)},${(60 + Math.sin(a) * r).toFixed(1)}`;
    })
    .join(" ");
})();

/**
 * Onomatopeya de cómic al completar una tarea. Se anima "a dos" (fotogramas escalonados con
 * steps() en CSS) y las planchas cian y magenta entran en registro. Ver .burst en index.css.
 */
export default function Burst({ word }) {
  const dots = `burst-dots-${useId().replace(/:/g, "")}`;
  return (
    <div aria-hidden="true" className="burst pointer-events-none absolute -top-10 -left-9 z-10 w-36">
      <svg viewBox="0 0 120 120" className="w-full overflow-visible">
        <defs>
          <pattern id={dots} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.1" fill="#e0137a" opacity="0.35" />
          </pattern>
        </defs>
        <polygon className="burst-plate burst-plate-c" points={POINTS} fill="var(--cyan)" />
        <polygon className="burst-plate burst-plate-m" points={POINTS} fill="var(--magenta)" />
        <polygon points={POINTS} fill="var(--yellow)" stroke="#14101f" strokeWidth="4" strokeLinejoin="round" />
        <polygon points={POINTS} fill={`url(#${dots})`} />
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontFamily="Bangers, sans-serif"
          fontSize="27"
          letterSpacing="1"
          fill="#e0137a"
          stroke="#14101f"
          strokeWidth="5"
          paintOrder="stroke"
          transform="rotate(-6 60 60)"
        >
          {word}
        </text>
      </svg>
    </div>
  );
}
