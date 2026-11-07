// Crea la tabla `tasks` en la base indicada por DATABASE_URL (alternativa a psql/DBeaver).
// Uso: npm run db:init   (con DATABASE_URL = External Database URL y DB_SSL=true en .env)
require("dotenv").config({ quiet: true });
const { createPool, migrate } = require("../src/db");

(async () => {
  if (!process.env.DATABASE_URL) {
    console.error("Define DATABASE_URL en backend/.env antes de ejecutar este script.");
    process.exit(1);
  }
  const pool = createPool();
  try {
    await migrate(pool);
    const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM tasks");
    console.log(`Tabla 'tasks' lista. Tareas existentes: ${rows[0].total}`);
  } finally {
    await pool.end();
  }
})().catch((err) => {
  console.error("Error inicializando la base de datos:", err.message);
  process.exit(1);
});
