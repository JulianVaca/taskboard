# Reflexión

## Dificultades encontradas

Considero que el taller fue un poco difícil, porque utilizamos herramientas que había escuchado pero nunca había usado, como Render y Cloudflare. Tampoco había trabajado con PostgreSQL, solo con MySQL, así que tuve que entender las diferencias. Por consiguiente, al momento de lograr conectar todo (el frontend con la API, la API con la base de datos y el dominio skillware.online con Render) sí se nos complicó un poco.

Una de las partes más difíciles fue el dominio: tuvimos que entender cómo funcionan los nameservers y los registros DNS, y probamos administrarlo desde Cloudflare y desde Hostinger hasta que quedó verificado en Render con certificado SSL.

También nos costó la coordinación, porque trabajamos en el mismo repositorio y teníamos que hacer cambios sin dañar el trabajo del otro.

Por último, tuvimos un error de codificación en el archivo `index.html`: la palabra "día" aparecía como "dÃ­a" en la descripción que se muestra al compartir el enlace, y al corregirla quedó un carácter invisible que no se veía en el editor pero hacía que el texto siguiera mal.

## Cómo se resolvieron

Para conectar los servicios revisamos los logs de Render, la consola del navegador y el endpoint `/api/health`, y configuramos las variables de entorno (la URL de la API y los orígenes permitidos por CORS). Al final quedó un lindo proyecto, con 3 estilos diferentes (Clásico, Cómic y Brutal), desde el más simple hasta el más pro.

Para trabajar en equipo usamos ramas (`desarrollo`, `produccion` y ramas para cada cambio) y pull requests, así cada uno trabajaba por separado y los cambios se revisaban antes de llegar a producción. Además, GitHub Actions ejecuta las pruebas automáticamente en cada push.

Para reforzar la seguridad agregamos **rate limiting** a la API: cada IP puede hacer máximo 100 peticiones cada 15 minutos y, si se pasa, recibe un error 429. Es una medida recomendada por OWASP para evitar abusos y ataques de denegación de servicio, y la comprobamos con una prueba automática. Las 10 pruebas del backend pasan.

El carácter invisible lo detectamos con el comando `grep`, lo corregimos reemplazando la línea completa con `sed` y arreglamos el commit con `git commit --amend`.

## Mejoras para un entorno productivo real

- Pagar un plan de Render para que el servicio no se "duerma": mientras tomábamos las evidencias notamos que la primera carga tardaba, y además la base de datos gratuita expira a los 30 días.
- Agregar inicio de sesión para que cada usuario vea solo sus tareas.
- Hacer copias de seguridad automáticas de la base de datos.
- Monitorear `/api/health` y recibir alertas si la API se cae.
- Usar migraciones versionadas para la base de datos, en vez de crear la tabla cuando arranca la API.