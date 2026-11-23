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
- Video: `anexos/video.mp4` (~109 MB). Anexos: `anexo1.txt`, `anexo2.txt`, `anexo3.pdf`.
- Bugs corregidos: "solo header" en desktop (wrapper `.app-body`) · video colapsado (`padding-bottom: 56.25%`).

## 4. Pendiente (mañana)
1. Ver el prototipo en el **subdominio** solicitado.
2. Verificar que `anexos/video.mp4` subió **completo** y con MIME `video/mp4` en IIS (probar URL directa).
3. **Reunión Sistemas**: SSO/auto-autenticación · `frame-ancestors` (permitir iframe del simulador) · dónde se guardan los usuarios (nueva BD vs 2 BDs) · cruce "activos" con "suscripción".

## 5. Video (decisión pendiente)
- **HLS propio** (gratis, evita descarga pero NO grabación) vs **VdoCipher DRM** (cotización). Dejar un "conector de video" abstraído.

## 6. Hosting
- SmarterASP **W1050 Premium**: 3 GB app pool + múltiples pools · bandwidth y conexiones "ilimitadas" (fair-use) · NVMe · Cloudflare CDN Ready · MSSQL 10 GB.

## 7. Archivos del repo
- `index.html` — prototipo reproductor (entregable principal).
- `anexos/` — video.mp4 + anexo1.txt + anexo2.txt + anexo3.pdf.
- `SPEC.md` — contexto/especificación.
- `NOTAS-REUNION-SISTEMAS.md` — pendientes con Sistemas.
