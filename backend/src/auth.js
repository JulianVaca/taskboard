const jwt = require("jsonwebtoken");

// Clave secreta con la que se firman los tokens. En Render va como variable de entorno.
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  // En Render (o en producción) es obligatoria: así nunca se usa la clave de desarrollo.
  if (process.env.NODE_ENV === "production" || process.env.RENDER) {
    throw new Error("JWT_SECRET es obligatoria en producción");
  }
  return "secreto-solo-para-desarrollo";
}

// Crea un token que dura 7 días y guarda el id y el nombre del usuario
function createToken(user) {
  return jwt.sign({ sub: String(user.id), name: user.name }, getSecret(), { expiresIn: "7d" });
}

// Middleware: deja pasar solo si la petición trae un token válido
function requireAuth(req, res, next) {
  const [type, token] = (req.headers.authorization || "").split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Debes iniciar sesión" });
  }
  try {
    const payload = jwt.verify(token, getSecret());
    req.user = { id: Number(payload.sub), name: payload.name };
    next();
  } catch {
    res.status(401).json({ error: "Tu sesión expiró, inicia sesión de nuevo" });
  }
}

module.exports = { getSecret, createToken, requireAuth };