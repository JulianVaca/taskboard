-- Esquema de TaskBoard. Es idempotente: se puede ejecutar varias veces sin error.
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
