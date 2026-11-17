const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { newDb } = require("pg-mem");

process.env.FRONTEND_URL = "https://skillware.online, https://taskboard-web.onrender.com/";

const { createApp } = require("../src/app");
const { migrate } = require("../src/db");

let app;
let token;

// Hace una petición con el token de la usuaria de prueba
const as = (method, path) => request(app)[method](path).set("Authorization", `Bearer ${token}`);

beforeEach(async () => {
  const { Pool } = newDb().adapters.createPg();
  const pool = new Pool();
  await migrate(pool);
  app = createApp(pool);
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Ingrith", email: "ingrith@test.co", password: "clave-segura-123" });
  token = res.body.token;
});

test("GET /api/health responde ok", async () => {
  const res = await request(app).get("/api/health").expect(200);
  assert.deepEqual(res.body, { status: "ok" });
});

test("POST crea una tarea y GET la lista", async () => {
  const created = await as("post", "/api/tasks").send({ title: "  Estudiar Render  " }).expect(201);
  assert.equal(created.body.title, "Estudiar Render");
  assert.equal(created.body.done, false);

  const list = await as("get", "/api/tasks").expect(200);
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].id, created.body.id);
});

test("POST rechaza títulos vacíos, ausentes o demasiado largos", async () => {
  await as("post", "/api/tasks").send({}).expect(400);
  await as("post", "/api/tasks").send({ title: "   " }).expect(400);
  await as("post", "/api/tasks").send({ title: 42 }).expect(400);
  await as("post", "/api/tasks").send({ title: "x".repeat(201) }).expect(400);
});

test("POST con JSON inválido devuelve 400", async () => {
  await as("post", "/api/tasks").set("Content-Type", "application/json").send("{mal").expect(400);
});

test("PATCH marca como completada y luego como pendiente", async () => {
  const { body: task } = await as("post", "/api/tasks").send({ title: "A" });
  const done = await as("patch", `/api/tasks/${task.id}`).send({ done: true }).expect(200);
  assert.equal(done.body.done, true);
  assert.equal(done.body.title, "A");
  const undone = await as("patch", `/api/tasks/${task.id}`).send({ done: false }).expect(200);
  assert.equal(undone.body.done, false);
});

test("PATCH valida id, cuerpo y existencia", async () => {
  await as("patch", "/api/tasks/abc").send({ done: true }).expect(400);
  await as("patch", "/api/tasks/1").send({}).expect(400);
  await as("patch", "/api/tasks/1").send({ done: "si" }).expect(400);
  await as("patch", "/api/tasks/999").send({ done: true }).expect(404);
});

test("DELETE elimina y devuelve 404 si no existe", async () => {
  const { body: task } = await as("post", "/api/tasks").send({ title: "Borrar" });
  await as("delete", `/api/tasks/${task.id}`).expect(204);
  await as("delete", `/api/tasks/${task.id}`).expect(404);
  const list = await as("get", "/api/tasks");
  assert.equal(list.body.length, 0);
});

test("CORS permite solo los orígenes configurados (sin importar la barra final)", async () => {
  const ok = await request(app).get("/api/health").set("Origin", "https://taskboard-web.onrender.com");
  assert.equal(ok.headers["access-control-allow-origin"], "https://taskboard-web.onrender.com");
  const blocked = await request(app).get("/api/health").set("Origin", "https://malicioso.com");
  assert.equal(blocked.headers["access-control-allow-origin"], undefined);
});

test("Rutas desconocidas devuelven 404 en JSON", async () => {
  const res = await request(app).get("/api/nada").expect(404);
  assert.ok(res.body.error);
});

test("Sin token, /api/tasks responde 401", async () => {
  await request(app).get("/api/tasks").expect(401);
  await request(app).get("/api/tasks").set("Authorization", "Bearer token-falso").expect(401);
});

test("Registro: valida datos y no permite correos repetidos", async () => {
  await request(app).post("/api/auth/register").send({ name: "A", email: "x@y.co", password: "12345678" }).expect(400);
  await request(app).post("/api/auth/register").send({ name: "Ana", email: "no-es-correo", password: "12345678" }).expect(400);
  await request(app).post("/api/auth/register").send({ name: "Ana", email: "ana@y.co", password: "corta" }).expect(400);
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Otra", email: "INGRITH@test.co", password: "otra-clave-123" })
    .expect(409);
});

test("Login: acepta la contraseña correcta y nunca devuelve el hash", async () => {
  const ok = await request(app)
    .post("/api/auth/login")
    .send({ email: "ingrith@test.co", password: "clave-segura-123" })
    .expect(200);
  assert.ok(ok.body.token);
  assert.equal(ok.body.user.password_hash, undefined);
  await request(app).post("/api/auth/login").send({ email: "ingrith@test.co", password: "mala-clave" }).expect(401);
  const me = await as("get", "/api/auth/me").expect(200);
  assert.equal(me.body.email, "ingrith@test.co");
});

test("Cada usuario solo ve y modifica sus propias tareas", async () => {
  const { body: mine } = await as("post", "/api/tasks").send({ title: "Mía" });
  const other = await request(app)
    .post("/api/auth/register")
    .send({ name: "Julián", email: "julian@test.co", password: "clave-julian-123" });
  const asOther = (m, p) => request(app)[m](p).set("Authorization", `Bearer ${other.body.token}`);
  const list = await asOther("get", "/api/tasks").expect(200);
  assert.equal(list.body.length, 0);
  await asOther("patch", `/api/tasks/${mine.id}`).send({ done: true }).expect(404);
  await asOther("delete", `/api/tasks/${mine.id}`).expect(404);
});

test("PATCH guarda la fecha en que se completó y la borra al desmarcar", async () => {
  const { body: task } = await as("post", "/api/tasks").send({ title: "Fecha" });
  assert.equal(task.completed_at, null);
  const done = await as("patch", `/api/tasks/${task.id}`).send({ done: true }).expect(200);
  assert.ok(done.body.completed_at);
  const undone = await as("patch", `/api/tasks/${task.id}`).send({ done: false }).expect(200);
  assert.equal(undone.body.completed_at, null);
});

test("Login bloquea después de 10 intentos", async () => {
  for (let i = 0; i < 9; i++) {
    await request(app).post("/api/auth/login").send({ email: "ingrith@test.co", password: "mala" });
  }
  await request(app).post("/api/auth/login").send({ email: "ingrith@test.co", password: "mala" }).expect(429);
});

test("Rate limiting: responde 429 al superar el límite de peticiones", async () => {
  process.env.RATE_LIMIT_MAX = "3";
  const { Pool } = newDb().adapters.createPg();
  const pool = new Pool();
  await migrate(pool);
  const limitedApp = createApp(pool);
  delete process.env.RATE_LIMIT_MAX;

  const reg = await request(limitedApp)
    .post("/api/auth/register")
    .send({ name: "Rate", email: "rate@test.co", password: "clave-segura-123" });

  for (let i = 0; i < 3; i++) {
    await request(limitedApp)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${reg.body.token}`)
      .expect(200);
  }
  const res = await request(limitedApp)
    .get("/api/tasks")
    .set("Authorization", `Bearer ${reg.body.token}`)
    .expect(429);
  assert.match(res.body.error, /Demasiadas peticiones/);
});