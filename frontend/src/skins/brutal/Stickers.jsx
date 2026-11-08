import { useRef } from "react";
import { motion } from "motion/react";
import { useI18n } from "../../i18n.jsx";

const ink = "var(--b-ink)";

/** Stickers SVG dibujados a mano para el estilo brutal. */
const SHAPES = {
  star: (label) => (
    <svg viewBox="0 0 140 140" className="w-32">
      <path
        d="M70 6 84 44 124 34 100 68 130 98 90 98 82 136 60 106 24 124 34 86 6 66 44 54 40 14Z"
        fill="var(--b-heat)"
        stroke={ink}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <text x="70" y="77" textAnchor="middle" fontFamily="Archivo Variable" fontWeight="900" fontSize="14" fill="#351c4d">
        {label}
      </text>
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 110 110" className="w-24">
      <circle cx="55" cy="55" r="48" fill="var(--b-para)" stroke={ink} strokeWidth="5" />
      <path d="M32 57 48 73 79 39" fill="none" stroke="#fffdf9" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ticket: (label) => (
    <svg viewBox="0 0 170 70" className="w-36">
      <path
        d="M8 6H162V26A9 9 0 0 0 162 44V64H8V44A9 9 0 0 0 8 26Z"
        fill="var(--b-sun)"
        stroke={ink}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M128 10V60" stroke={ink} strokeWidth="3" strokeDasharray="5 5" />
      <text x="68" y="42" textAnchor="middle" fontFamily="Archivo Variable" fontWeight="900" fontStretch="118%" fontSize="16" fill="#351c4d">
        {label}
      </text>
    </svg>
  ),
  arrow: () => (
    <svg viewBox="0 0 130 90" className="w-28">
      <path
        d="M8 60C30 20 70 14 96 34L100 18 124 52 86 62 92 46C72 34 44 38 26 70Z"
        fill="#fffdf9"
        stroke={ink}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const PLACEMENT = [
  { shape: "star", label: "sticker.go", className: "left-[4%] top-[34%]", rotate: -12 },
  { shape: "check", className: "left-[8%] top-[68%]", rotate: 8 },
  { shape: "ticket", label: "sticker.todo", className: "right-[3%] top-[30%]", rotate: 10 },
  { shape: "arrow", className: "right-[6%] top-[68%]", rotate: -8 },
];

/**
 * Stickers arrastrables en los márgenes. Al soltarlos rebotan con física de resorte
 * y se quedan dentro de la ventana.
 */
export default function Stickers() {
  const { t } = useI18n();
  const bounds = useRef(null);
  return (
    <div ref={bounds} className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
      {PLACEMENT.map((s, i) => (
        <motion.div
          key={s.shape}
          drag
          dragConstraints={bounds}
          dragElastic={0.35}
          dragTransition={{ bounceStiffness: 320, bounceDamping: 12, power: 0.25 }}
          whileHover={{ scale: 1.08, rotate: s.rotate + 6 }}
          whileDrag={{ scale: 1.15, rotate: 0, cursor: "grabbing" }}
          initial={{ scale: 0, rotate: s.rotate - 40 }}
          animate={{ scale: 1, rotate: s.rotate }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 + i * 0.12 }}
          title={t("sticker.drag")}
          aria-hidden="true"
          className={`pointer-events-auto absolute cursor-grab touch-none drop-shadow-[5px_5px_0_var(--b-ink)] select-none ${s.className}`}
        >
          {SHAPES[s.shape](s.label ? t(s.label) : "")}
        </motion.div>
      ))}
    </div>
  );
}
