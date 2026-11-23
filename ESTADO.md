# Estado del proyecto — Plataforma CIATSOFTWARE

> Prototipo front-first (HTML). Backend Angular/.NET pendiente. Actualizado: noviembre 2026.

## 1. Qué es
Plataforma de cursos "tipo Netflix" de CIATSOFTWARE (automatización industrial / PLC). Modelo **pago único** (sin suscripciones). Producto: curso PLC Siemens (8 módulos) + simulador 3D + Valeria (IA).

## 2. Decisiones cerradas
- **App + WebAPI nuevas** (greenfield). Simulador y Valeria **ya existen** → solo se integran.
- **Stack**: Angular (Standalone) + ASP.NET Core DDD + SQL Server.
- **Modelo**: pago único (sin recurrentes).
- **Front final**: módulo/repositorio por sección (micro-frontends), contexto vía **sessionStorage encriptado** (NO querystring), **subdominios** en SmarterASP. *(Ojo: sessionStorage es por-origen → si hay subdominios reales, el token debe ir en cookie con dominio padre.)*
- **Prototipo actual**: solo HTML (`index.html`), sin Angular.

## 3. Prototipo (`index.html`)
- Responsive: móvil / tablet / plegable / desktop.
- Header + sidebar (drawer en móvil) + reproductor de video + simulador (iframe) + anexos + comentarios + footer.
- **Video**: HLS **cifrado AES-128** en `anexos/hls/` (`video.m3u8` + 180 segmentos `.ts` + `enc.key`) con `hls.min.js` local. Anexos descargables: `anexo1.txt`, `anexo2.txt`, `anexo3.pdf`.
- Bugs corregidos: "solo header" en desktop (wrapper `.app-body`) · video colapsado sin `aspect-ratio` (se usa `padding-bottom: 56.25%`).

## 4. Pendiente
1. Ver el prototipo en el **subdominio** solicitado.
2. Verificar subida del **HLS** (`video.m3u8` + segmentos + `enc.key`) + MIME correcto en IIS.
3. **Reunión Sistemas**: SSO/auto-autenticación · `frame-ancestors` (permitir iframe del simulador) · dónde se guardan los usuarios (nueva BD vs 2 BDs) · cruce "activos" con "suscripción".

## 5. Video
- **Implementado**: HLS + **AES-128** (anti-descarga casual, **NO** anti-grabación).
- **Pendiente**: DRM real (VdoCipher/Mux) para pantalla en negro al grabar. Dejar un "conector de video" abstraído.

## 6. Hosting
- SmarterASP **W1050 Premium**: 3 GB app pool + múltiples pools · bandwidth y conexiones "ilimitadas" (fair-use) · NVMe · Cloudflare CDN Ready · MSSQL 10 GB.

## 7. Administración / Backoffice (REQUISITO — a definir)
- La plataforma **NO es solo para el alumno**: necesita una cara de **administración** para el personal de CIAT.
- **Módulos**: alta/edición de cursos, módulos, secciones, lecciones · gestión de recursos/anexos/videos · usuarios y **roles/permisos** · pagos/accesos · constancias · reportes.
- **Roles**: alumno, instructor, control escolar, administrador.
- El backoffice probablemente sea **app/subdominio separado** (`admin.ciatsoftware.com`).
- **Subida de video** = función del backoffice (subir MP4 → procesar HLS + AES-128 automáticamente). ⚠️ ffmpeg es intensivo en CPU → procesar **fuera de SmarterASP** y subir solo el HLS.

## 8. Archivos del repo
- `index.html` — prototipo reproductor (entregable principal).
- `hls.min.js` — librería HLS local (~624 KB).
- `web.config` — MIME types IIS (`.m3u8`, `.ts`, `.mp4`).
- `anexos/hls/` — video cifrado (`video.m3u8` + segmentos + `enc.key`).
- `anexos/anexo1.txt`, `anexo2.txt`, `anexo3.pdf` — anexos descargables.
- `SPEC.md` — contexto/especificación.
- `NOTAS-REUNION-SISTEMAS.md` — pendientes con Sistemas.
- `NOTAS-VIDEO.md` — pipeline de video (faststart, HLS, AES-128).
- `ESTADO.md` — este archivo.
