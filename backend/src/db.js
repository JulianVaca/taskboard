const fs = require("node:fs");
const path = require("node:path");
const { Pool } = require("pg");

const SCHEMA = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");

/**
 * Crea el pool de conexiones.
 * - Producción (Render): DATABASE_URL = Internal Database URL y DB_SSL=false.
 * - Local contra Render: DATABASE_URL = External Database URL y DB_SSL=true.
 * - Local sin base de datos: si no hay DATABASE_URL y no estamos en producción,
 *   se usa una base PostgreSQL en memoria (pg-mem) para poder probar la app.
 */
function createPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      max: 5,
    });
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL es obligatoria en producción");
  }

  console.warn("[db] DATABASE_URL no definida: usando PostgreSQL en memoria (los datos se pierden al reiniciar)");
  const { newDb } = require("pg-mem");
  const { Pool: MemPool } = newDb().adapters.createPg();
  return new MemPool();
}

/** Crea la tabla si no existe, para que el servicio arranque listo en cualquier entorno. */
async function migrate(pool) {
  await pool.query(SCHEMA);
}

module.exports = { createPool, migrate };
