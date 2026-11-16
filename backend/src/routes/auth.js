const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { rateLimit } = require("express-rate-limit");
const { HttpError } = require("./tasks");
const { createToken, requireAuth } = require("../auth");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseName(raw) {
  const name = typeof raw === "string" ? raw.trim() : "";
  if (name.length < 2 || name.length > 80) {
    throw new HttpError(400, "El nombre debe tener entre 2 y 80 caracteres");
  }
  return name;
}

function parseEmail(raw) {
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    throw new HttpError(400, "Escribe un correo válido");
  }
  return email;
}

function parsePassword(raw) {
  if (typeof raw !== "string" || raw.length < 8 || raw.length > 72) {
    throw new HttpError(400, "La contraseña debe tener entre 8 y 72 caracteres");
  }
  return raw;
}

// Lo que se le devuelve al frontend: nunca la contraseña
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

function authRouter(pool) {
  const router = Router();

  // Máximo 10 intentos cada 15 minutos por IP (protege contra fuerza bruta)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Demasiados intentos. Espera 15 minutos e intenta de nuevo" },
  });

  // POST /api/auth/register → crea la cuenta y devuelve el token
  router.post("/register", limiter, async (req, res) => {
    const name = parseName(req.body?.name);
    const email = parseEmail(req.body?.email);
    const password = parsePassword(req.body?.password);
    const hash = await bcrypt.hash(password, 10);
    try {
      const { rows } = await pool.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
        [name, email, hash]
      );
      res.status(201).json({ token: createToken(rows[0]), user: publicUser(rows[0]) });
    } catch (err) {
      if (err.code === "23505") throw new HttpError(409, "Ese correo ya está registrado");
      throw err;
    }
  });

  // POST /api/auth/login → revisa correo y contraseña y devuelve el token
  router.post("/login", limiter, async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) throw new HttpError(401, "Correo o contraseña incorrectos");
    res.json({ token: createToken(user), user: publicUser(user) });
  });

  // GET /api/auth/me → devuelve el usuario dueño del token
  router.get("/me", requireAuth, async (req, res) => {
    const { rows } = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [req.user.id]);
    if (rows.length === 0) throw new HttpError(401, "Usuario no encontrado");
    res.json(rows[0]);
  });

  return router;
}

module.exports = { authRouter };