/** Utilidades de formato compartidas por todos los estilos (con instancias Intl en caché). */

const rtfCache = new Map();
const dtfCache = new Map();

function getRtf(lang) {
  let rtf = rtfCache.get(lang);
  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    rtfCache.set(lang, rtf);
  }
  return rtf;
}

function getDtf(lang) {
  let dtf = dtfCache.get(lang);
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long" });
    dtfCache.set(lang, dtf);
  }
  return dtf;
}

const UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function relativeTime(dateStr, lang, justNow) {
  const diff = (Date.parse(dateStr) - Date.now()) / 1000;
  const rtf = getRtf(lang);
  for (const [unit, secs] of UNITS) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return justNow;
}

export function greetingKey(date) {
  const h = date.getHours();
  if (h < 12) return "greet.morning";
  if (h < 19) return "greet.afternoon";
  return "greet.night";
}

export function dateLabel(date, lang) {
  const s = getDtf(lang).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Resumen del tablero en el idioma activo. */
export function boardSummary(t, counts, ready) {
  if (!ready) return t("hero.loading");
  if (counts.all === 0) return t("hero.empty");
  if (counts.pending === 0) return t("hero.allDone");
  return t("hero.pending", counts.pending);
}
