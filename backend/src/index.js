require("dotenv").config({ quiet: true });

const { createApp, allowedOrigins } = require("./app");
const { createPool, migrate } = require("./db");

async function main() {
  const pool = createPool();
  await migrate(pool);

  const app = createApp(pool);
  // Render asigna el puerto con la variable PORT: nunca se fija de forma rígida.
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}`);
    console.log(`CORS permitido para: ${allowedOrigins().join(", ") || "(ninguno)"}`);
  });

  // Render envía SIGTERM al redesplegar: cerramos conexiones de forma ordenada.
  const shutdown = (signal) => {
    console.log(`${signal} recibido, cerrando…`);
    server.close(() => pool.end().finally(() => process.exit(0)));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("No se pudo iniciar la API:", err);
  process.exit(1);
});
