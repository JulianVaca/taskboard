const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { newDb } = require("pg-mem");

process.env.FRONTEND_URL = "https://skillware.online, https://taskboard-web.onrender.com/";

const { createApp } = require("../src/app");
const { migrate } = require("../src/db");

let app;

beforeEach(async () => {
  const { Pool } = newDb().adapters.createPg();
  const pool = new Pool();
  await migrate(pool);
  app = createApp(pool);
});

test("GET /api/health responde ok", async () => {
  const res = await request(app).get("/api/health").expect(200);
  assert.deepEqual(res.body, { status: "ok" });
});

test("POST crea una tarea y GET la lista", async () => {
  const created = await request(app).post("/api/tasks").send({ title: "  Estudiar Render  " }).expect(201);
  assert.equal(created.body.title, "Estudiar Render");
  assert.equal(created.body.done, false);

  const list = await request(app).get("/api/tasks").expect(200);
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].id, created.body.id);
});

test("POST rechaza títulos vacíos, ausentes o demasiado largos", async () => {
  await request(app).post("/api/tasks").send({}).expect(400);
  await request(app).post("/api/tasks").send({ title: "   " }).expect(400);
  await request(app).post("/api/tasks").send({ title: 42 }).expect(400);
  await request(app).post("/api/tasks").send({ title: "x".repeat(201) }).expect(400);
});

test("POST con JSON inválido devuelve 400", async () => {
  await request(app).post("/api/tasks").set("Content-Type", "application/json").send("{mal").expect(400);
});

test("PATCH marca como completada y luego como pendiente", async () => {
  const { body: task } = await request(app).post("/api/tasks").send({ title: "A" });
  const done = await request(app).patch(`/api/tasks/${task.id}`).send({ done: true }).expect(200);
  assert.equal(done.body.done, true);
  assert.equal(done.body.title, "A");
  const undone = await request(app).patch(`/api/tasks/${task.id}`).send({ done: false }).expect(200);
  assert.equal(undone.body.done, false);
});

test("PATCH valida id, cuerpo y existencia", async () => {
  await request(app).patch("/api/tasks/abc").send({ done: true }).expect(400);
  await request(app).patch("/api/tasks/1").send({}).expect(400);
  await request(app).patch("/api/tasks/1").send({ done: "si" }).expect(400);
  await request(app).patch("/api/tasks/999").send({ done: true }).expect(404);
});

test("DELETE elimina y devuelve 404 si no existe", async () => {
  const { body: task } = await request(app).post("/api/tasks").send({ title: "Borrar" });
  await request(app).delete(`/api/tasks/${task.id}`).expect(204);
  await request(app).delete(`/api/tasks/${task.id}`).expect(404);
  const list = await request(app).get("/api/tasks");
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

test("Rate limiting: responde 429 al superar el límite de peticiones", async () => {
  process.env.RATE_LIMIT_MAX = "3";
  const { Pool } = newDb().adapters.createPg();
  const pool = new Pool();
  await migrate(pool);
  const limitedApp = createApp(pool);
  delete process.env.RATE_LIMIT_MAX;

  for (let i = 0; i < 3; i++) {
    await request(limitedApp).get("/api/tasks").expect(200);
  }
  const res = await request(limitedApp).get("/api/tasks").expect(429);
  assert.match(res.body.error, /Demasiadas peticiones/);
});