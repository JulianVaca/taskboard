const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { tasksRouter } = require("./routes/tasks");

const DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

/**
 * FRONTEND_URL admite uno o varios orígenes separados por coma, por ejemplo:
 * "https://skillware.online,https://taskboard-web.onrender.com".
 * Se ignoran espacios y barras finales para evitar el error de CORS más común.
 */
function allowedOrigins() {
  const raw = process.env.FRONTEND_URL;
  if (!raw) return process.env.NODE_ENV === "production" ? [] : DEV_ORIGINS;
  return raw
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

function createApp(pool) {
  const app = express();
  const origins = allowedOrigins();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // Render pone un proxy delante del servicio
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || origins.includes(origin)),
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );
  app.use(express.json({ limit: "10kb" }));

  // Seguridad (OWASP): limita cuántas peticiones puede hacer cada IP a la API de tareas.
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ventana de 15 minutos
    limit: Number(process.env.RATE_LIMIT_MAX) || 100, // máximo de peticiones por IP en esa ventana
    standardHeaders: "draft-8", // informa el límite en los encabezados RateLimit
    legacyHeaders: false,
    message: { error: "Demasiadas peticiones, intenta de nuevo en unos minutos" },
  });

  app.get("/", (req, res) => res.json({ name: "TaskBoard API", docs: "/api/health, /api/tasks" }));
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/tasks", limiter, tasksRouter(pool));

  app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

  // Express 5 envía aquí los errores de las rutas async.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "El cuerpo de la petición no es JSON válido" });
    }
    const status = err.status || 500;
    if (status >= 500) console.error("[api]", err);
    res.status(status).json({ error: status >= 500 ? "Error interno del servidor" : err.message });
  });

  return app;
}

module.exports = { createApp, allowedOrigins };