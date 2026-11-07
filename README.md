# TaskBoard

Gestor de tareas full stack: crea, lista, completa y elimina tareas. El frontend y el backend están separados, se comunican mediante una API REST y se despliegan en Render como tres servicios independientes.

| Servicio | URL de producción |
|---|---|
| Aplicación (Static Site) | https://skillware.online · https://taskboard-web.onrender.com |
| API (Web Service) | https://api.skillware.online/api/health · https://taskboard-api.onrender.com/api/health |
| Base de datos | Render Postgres `taskboard-db` (solo accesible desde Render) |

> Si el subdominio `.onrender.com` asignado por Render es distinto, actualiza esta tabla.

## Arquitectura

```
Navegador ──► Static Site (React + Vite)          skillware.online
                │  fetch JSON (CORS)
                ▼
            Web Service (Node.js + Express)        api.skillware.online
                │  Internal Database URL
                ▼
            Render Postgres (tabla tasks)
```

```
taskboard/
├── backend/            API REST (Node.js + Express + pg)
│   ├── db/schema.sql   esquema de la tabla tasks
│   ├── src/app.js      app Express: CORS, seguridad, errores
│   ├── src/routes/     endpoints /api/tasks
│   ├── src/db.js       pool de PostgreSQL y migración
│   └── test/           pruebas automáticas (node:test + supertest)
├── frontend/           interfaz (React + Vite)
│   └── src/            App.jsx, cliente api.js y estilos
├── docs/               guía de despliegue, evidencias y reflexión
└── render.yaml         Blueprint: los tres servicios en un clic
```

## API REST

| Método | Ruta | Cuerpo | Respuestas |
|---|---|---|---|
| GET | `/api/health` | — | `200 {"status":"ok"}` |
| GET | `/api/tasks` | — | `200` lista de tareas |
| POST | `/api/tasks` | `{"title": "..."}` | `201` tarea creada · `400` título vacío o > 200 caracteres |
| PATCH | `/api/tasks/:id` | `{"done": true}` (y/o `"title"`) | `200` tarea actualizada · `400` datos inválidos · `404` no existe |
| DELETE | `/api/tasks/:id` | — | `204` sin contenido · `400` id inválido · `404` no existe |

Los errores siempre devuelven JSON con la forma `{"error": "mensaje"}`.

```bash
curl https://api.skillware.online/api/health
curl -X POST https://api.skillware.online/api/tasks -H "Content-Type: application/json" -d '{"title":"Mi tarea"}'
curl -X PATCH https://api.skillware.online/api/tasks/1 -H "Content-Type: application/json" -d '{"done":true}'
curl -X DELETE https://api.skillware.online/api/tasks/1
```

## Ejecución local

Requisitos: Node.js 20 o superior (LTS) y Git.

```bash
git clone https://github.com/JulianVaca/taskboard.git
cd taskboard

# Backend
cd backend
cp .env.example .env      # completa DATABASE_URL (opcional, ver abajo)
npm install
npm run db:init           # crea la tabla en Render Postgres (solo si usas DATABASE_URL)
npm run dev               # http://localhost:3000

# Frontend (otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

Si dejas `DATABASE_URL` vacía, la API usa una base PostgreSQL en memoria. Sirve para probar rápido, pero los datos se pierden al reiniciar.

Pruebas del backend:

```bash
cd backend && npm test
```

## Variables de entorno

**Backend** (`backend/.env`, o la sección Environment del Web Service):

| Variable | Local | Producción (Render) |
|---|---|---|
| `DATABASE_URL` | External Database URL | Internal Database URL |
| `DB_SSL` | `true` | `false` |
| `FRONTEND_URL` | `http://localhost:5173` | `https://skillware.online,https://www.skillware.online,https://taskboard-web.onrender.com` |
| `PORT` | `3000` | la asigna Render automáticamente |

`FRONTEND_URL` acepta varios orígenes separados por coma. Las barras finales se ignoran.

**Frontend** (`frontend/.env`, o la sección Environment del Static Site):

| Variable | Local | Producción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | `https://api.skillware.online` o `https://taskboard-api.onrender.com` |

Vite incrusta `VITE_API_URL` al compilar. Si la cambias en Render, lanza **Manual Deploy → Deploy latest commit**.

## Despliegue

El paso a paso completo, incluido el dominio de Hostinger, está en [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md). Resumen:

1. Render → **New → Blueprint** → repositorio `taskboard`. Render lee `render.yaml` y crea la base de datos, la API y el sitio.
2. Escribe `VITE_API_URL` cuando Render la pida.
3. Configura los registros DNS en Hostinger para `skillware.online`.
4. Cada `git push` a `main` vuelve a desplegar automáticamente. GitHub Actions ejecuta las pruebas en cada push.

## Buenas prácticas aplicadas

- Puerto dinámico con `process.env.PORT` y cierre ordenado ante `SIGTERM`.
- Consultas parametrizadas (`$1`) contra inyección SQL.
- Validación de datos y códigos HTTP adecuados (200, 201, 204, 400, 404, 500).
- CORS restringido a los orígenes del frontend y cabeceras de seguridad con `helmet`.
- La tabla se crea automáticamente al arrancar si no existe.
- El frontend muestra carga, errores con reintento y un aviso cuando el plan gratuito está despertando.
- Ningún `.env` ni `node_modules` en el repositorio.

## Entregables

- Evidencias: [docs/evidencias](docs/evidencias/README.md)
- Reflexión: [docs/REFLEXION.md](docs/REFLEXION.md)
