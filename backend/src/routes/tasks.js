const { Router } = require("express");

const TITLE_MAX = 200;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "El id debe ser un número entero positivo");
  }
  return id;
}

function parseTitle(raw) {
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new HttpError(400, "El título es obligatorio");
  }
  const title = raw.trim();
  if (title.length > TITLE_MAX) {
    throw new HttpError(400, `El título no puede superar ${TITLE_MAX} caracteres`);
  }
  return title;
}

function tasksRouter(pool) {
  const router = Router();

  // GET /api/tasks → lista todas las tareas
  router.get("/", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id");
    res.json(rows);
  });

  // POST /api/tasks → crea una tarea
  router.post("/", async (req, res) => {
    const title = parseTitle(req.body?.title);
    const { rows } = await pool.query("INSERT INTO tasks (title) VALUES ($1) RETURNING *", [title]);
    res.status(201).json(rows[0]);
  });

  // PATCH /api/tasks/:id → marca como completada/pendiente (y opcionalmente renombra)
  router.patch("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    const body = req.body ?? {};
    const hasDone = Object.hasOwn(body, "done");
    const hasTitle = Object.hasOwn(body, "title");

    if (!hasDone && !hasTitle) {
      throw new HttpError(400, "Envía al menos el campo 'done' (booleano) o 'title'");
    }
    if (hasDone && typeof body.done !== "boolean") {
      throw new HttpError(400, "El campo 'done' debe ser true o false");
    }

    const done = hasDone ? body.done : null;
    const title = hasTitle ? parseTitle(body.title) : null;

    const { rows } = await pool.query(
      `UPDATE tasks
          SET done  = COALESCE($1, done),
              title = COALESCE($2, title)
        WHERE id = $3
        RETURNING *`,
      [done, title, id]
    );
    if (rows.length === 0) throw new HttpError(404, "Tarea no encontrada");
    res.json(rows[0]);
  });

  // DELETE /api/tasks/:id → elimina una tarea
  router.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    if (rowCount === 0) throw new HttpError(404, "Tarea no encontrada");
    res.status(204).end();
  });

  return router;
}

module.exports = { tasksRouter, HttpError };
