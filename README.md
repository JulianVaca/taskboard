# TaskBoard

Gestor de tareas full stack: crea, lista, completa y elimina tareas. El frontend y el backend están separados, se comunican mediante una API REST y se despliegan en Render como tres servicios independientes.

| Servicio | URL de producción |
|---|---|
| Aplicación (Static Site) | https://taskboard-web-56l3.onrender.com · https://skillware.online |
| API (Web Service) | https://taskboard-api-9oyi.onrender.com/api/health · https://api.skillware.online/api/health |
| Base de datos | Render Postgres `taskboard-db`, PostgreSQL 17, solo accesible desde Render |

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
├── frontend/           interfaz (React + Vite + Tailwind CSS + Motion)
│   └── src/
│       ├── api.js          cliente de la API REST
│       ├── hooks/          useTasks (CRUD optimista) y useTheme
│       └── components/     TopBar, Hero, TaskComposer, FilterTabs, TaskItem…
├── docs/               guía de despliegue, evidencias y reflexión
└── render.yaml         Blueprint: los tres servicios en un clic
```

## Interfaz

| Librería | Uso |
|---|---|
| React 19 + Vite 8 | Aplicación y empaquetado |
| Tailwind CSS 4 | Sistema de estilos, tema claro (día) y oscuro (noche) |
| Motion | Animaciones de lista, filtros, casillas, medidor y fondo con parallax |
| Lucide | Íconos |
| Sonner | Notificaciones de éxito y error |
| Bangers, Archivo e Inter (Fontsource) | Rotulado de cómic, texto de interfaz y estilo clásico, servidos desde el propio sitio |

Estilos: un selector permite elegir entre tres estilos visuales. Todos tienen las mismas funciones, temas e idiomas, y el navegador recuerda la elección.

| Estilo | Descripción |
|---|---|
| Clásico | El diseño original: Inter, tarjetas translúcidas y acento violeta. |
| Cómic (por defecto) | Página de cómic 2D que simula 3D, inspirada en el estilo visual de *Spider-Man: Into the Spider-Verse*: tramas Ben-Day, tinta gruesa, planchas desregistradas, viñetas con extrusión y ciudad en capas con parallax. Animaciones "a dos" con `steps()`. |
| Brutal | Kinetic Neo-Brutalism con la paleta Ponche Tropical: bordes de 4 px y sombras rígidas de 6 px en Nightfall, Bento Grid, cintas en movimiento que aceleran con el scroll, compresión táctil al pasar el cursor y al pulsar, stickers SVG arrastrables y cursor reactivo, con física de resorte. |

Cada estilo vive en `frontend/src/skins/<estilo>/`. La lógica compartida está en `frontend/src/shared/`, `hooks/` e `i18n.jsx`.

Funciones:

- Crear tareas con validación de campo vacío. La tecla `/` enfoca el campo.
- Completar (con onomatopeya de cómic), editar con doble clic y eliminar tareas.
- Filtros por estado, medidor de progreso y contador de pendientes.
- Indicador de estado de la API y aviso mientras el servidor gratuito despierta.
- Interfaz en español o inglés (selector ES/EN, se recuerda en el navegador).
- Tema claro y oscuro, diseño responsivo y respeto por "reducir movimiento" del sistema.

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
| `FRONTEND_URL` | `http://localhost:5173` | `https://skillware.online,https://www.skillware.online,https://taskboard-web-56l3.onrender.com` |
| `PORT` | `3000` | la asigna Render automáticamente |

`FRONTEND_URL` acepta varios orígenes separados por coma. Las barras finales se ignoran.

**Frontend** (`frontend/.env`, o la sección Environment del Static Site):

| Variable | Local | Producción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | `https://taskboard-api-9oyi.onrender.com`, o `https://api.skillware.online` cuando el dominio esté activo |

Vite incrusta `VITE_API_URL` al compilar. Si la cambias en Render, lanza **Manual Deploy → Deploy latest commit**.

## Ramas y ambientes

| Rama | Propósito | Despliegue |
|---|---|---|
| `desarrollo` | Trabajo diario e integración de cambios | GitHub Actions ejecuta pruebas y build en cada push |
| `produccion` | Versión estable publicada | Render despliega automáticamente cada cambio |
| `main` | Rama por defecto que pide el taller, espejo de `produccion` | El workflow `Espejo main` la avanza automáticamente con cada cambio en `produccion` |

Flujo de trabajo:

```bash
git switch desarrollo
# ...cambios y commits...
git push
gh pr create --base produccion --head desarrollo --title "Release: ..."
# cuando el CI pasa, se fusiona el PR: el workflow "Espejo main" avanza main
# y Render despliega producción
```

Si el workflow fallara (por ejemplo, porque `main` tiene commits propios), el espejo se puede hacer a mano:

```bash
git switch main && git merge --ff-only origin/produccion && git push
```

La rama `produccion` está protegida: solo acepta cambios mediante pull request con el CI en verde.

## Despliegue

El paso a paso completo, incluido el dominio de Hostinger, está en [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md). Resumen:

1. Render → **New → Blueprint** → repositorio `taskboard`. Render lee `render.yaml` y crea la base de datos, la API y el sitio.
2. Escribe `VITE_API_URL` cuando Render la pida.
3. Configura los registros DNS de `skillware.online` en el panel de Hostinger.
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
