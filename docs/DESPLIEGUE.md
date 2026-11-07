# Guía de despliegue: Render + dominio skillware.online

## 1. Crear los servicios en Render

### Opción A: Blueprint (recomendada, un clic)

1. Entra a https://dashboard.render.com con tu cuenta de GitHub y autoriza el repositorio `taskboard`.
2. **New → Blueprint** → elige `JulianVaca/taskboard` → rama `main`.
3. Render muestra los tres recursos de `render.yaml`: `taskboard-db`, `taskboard-api` y `taskboard-web`.
4. Cuando pida `VITE_API_URL`, escribe `https://taskboard-api.onrender.com` (sin barra final).
5. Pulsa **Apply** y espera a que los tres queden en verde.
6. Abre `https://taskboard-api.onrender.com/api/health`. Debe responder `{"status":"ok"}`.

Si Render asigna otro subdominio a la API, corrige `VITE_API_URL` en el Static Site y lanza **Manual Deploy → Deploy latest commit**. Si el sitio queda con otro subdominio, agrégalo a `FRONTEND_URL` en la API.

### Opción B: manual (como indica el taller)

1. **New → Postgres**: nombre `taskboard-db`, región Virginia, plan Free. Copia la Internal y la External Database URL.
2. **New → Web Service** con estos valores:

| Parámetro | Valor |
|---|---|
| Name | `taskboard-api` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |
| Health Check Path | `/api/health` |
| Variables | `DATABASE_URL` = Internal URL, `DB_SSL` = `false`, `FRONTEND_URL` = URL del sitio |

3. **New → Static Site** con estos valores:

| Parámetro | Valor |
|---|---|
| Name | `taskboard-web` |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Variable | `VITE_API_URL` = URL pública de la API |

La tabla `tasks` se crea sola cuando arranca la API. Si quieres crearla a mano, ejecuta `backend/db/schema.sql` con la External URL, o corre `npm run db:init` desde `backend` con esa URL en `.env`.

## 2. Conectar el dominio de Hostinger

### En Render

1. En **taskboard-web → Settings → Custom Domains**, verifica que estén `skillware.online` y `www.skillware.online`. Con el Blueprint ya aparecen.
2. En **taskboard-api → Settings → Custom Domains**, verifica `api.skillware.online`.
3. Render muestra los registros DNS exactos que espera. Si difieren de la tabla de abajo, usa los de Render.

### Dónde se editan los registros DNS

El dominio está registrado en Hostinger, pero sus servidores de nombres son de Cloudflare (`achiel.ns.cloudflare.com` y `collins.ns.cloudflare.com`). Por eso los registros se editan en **Cloudflare → skillware.online → DNS → Records**, no en hPanel. Los cambios que hagas en el DNS de Hostinger no tendrán efecto mientras los nameservers apunten a Cloudflare.

Elimina primero los registros `A` y `AAAA` existentes de `@` y `www`. Luego agrega estos registros con el proxy **apagado** (nube gris, "DNS only"). Render necesita ver el destino real para verificar el dominio y emitir el certificado HTTPS.

| Tipo | Nombre | Destino | Proxy |
|---|---|---|---|
| CNAME | `@` | `taskboard-web.onrender.com` | DNS only |
| CNAME | `www` | `taskboard-web.onrender.com` | DNS only |
| CNAME | `api` | `taskboard-api.onrender.com` | DNS only |

Cloudflare permite un CNAME en la raíz gracias al "CNAME flattening". Si prefieres un registro A en la raíz, usa `216.24.57.1`.

Si existe un registro `CAA`, debe permitir `letsencrypt.org` y `pki.goog`, o elimínalo.

Si algún día devuelves los nameservers a Hostinger, crea los mismos registros en hPanel → Dominios → skillware.online → DNS, usando el registro A `216.24.57.1` para la raíz.

### Verificar

1. En Render pulsa **Verify** en cada dominio. La propagación suele tardar de minutos a unas horas.
2. Render emite el certificado HTTPS automáticamente.
3. Cuando `https://api.skillware.online/api/health` responda, cambia `VITE_API_URL` del sitio a `https://api.skillware.online` y redespliega. Así toda la app queda bajo tu dominio.

## 3. Comprobar el despliegue automático

1. Haz un cambio menor, por ejemplo en el texto del pie de página de `frontend/src/App.jsx`.
2. `git add . && git commit -m "chore: cambio de prueba de despliegue" && git push`
3. En Render, el servicio muestra un nuevo deploy disparado por el commit. Toma la captura para las evidencias.

## 4. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| Error de CORS en la consola | El origen del sitio debe estar en `FRONTEND_URL` con `https://`. Guarda y Render reinicia la API. |
| El frontend llama a `localhost` | Falta `VITE_API_URL` al compilar. Defínela y redespliega el sitio. |
| La API no arranca | Revisa los logs. `DATABASE_URL` es obligatoria en producción. |
| Error de conexión a la base | Usa la Internal URL con `DB_SSL=false` en Render y la External con `DB_SSL=true` en local. |
| La primera carga tarda cerca de un minuto | Es el plan gratuito despertando. La app muestra un aviso mientras tanto. |
| El dominio no verifica | Revisa en Cloudflare que no queden registros `A`/`AAAA` antiguos y que el proxy esté en "DNS only". |
| Error de redirecciones infinitas | El proxy de Cloudflare está activo con SSL "Flexible". Apágalo o usa SSL "Full (strict)". |

La base de datos gratuita de Render expira a los 30 días de creada. Si la creas hoy, sigue activa para la entrega.
