# Especificación — Plataforma CIATSOFTWARE (Canal Comercial Digital)

> **Estado**: Captura inicial de contexto. NO es una especificación final.
> Quedan decisiones por definir con el cliente (ver §7).
> Fuentes: `deepseek_txt_20261122_ecba4b.txt`, `deepseek_txt_20261122_98d45a.txt`,
> `PROYECTO CIATSOFTWARE CANAL COMERCIAL DIGITAL.pdf`, `platica con sistemas.txt`.

---

## 1. Visión del negocio

Plataforma web "tipo Netflix" de **CIATSOFTWARE** (capacitación en automatización
industrial, PLC, robótica).

- **Modelo de negocio**: PAGO ÚNICO. No hay suscripciones ni cobros recurrentes.
- **Promesa**: el alumno paga una vez y en minutos obtiene acceso al curso grabado,
  al simulador 3D y a Valeria (IA de ventas y tutoría).
- **Idiomas**: lanzamiento global, inicialmente Español e Inglés.

## 2. Producto (alcance del lanzamiento)

| Componente | Qué recibe el alumno | Queda para después |
|---|---|---|
| **Curso** | PLC Siemens desde cero: 8 módulos, lecciones de 6–12 min, cuestionarios, recursos y proyecto final | Segundo curso (Allen-Bradley), ruta de aprendizaje |
| **Simulador 3D** | 6 prácticas con escena 3D y verificación automática, en 2 modos (editor propio + TIA Portal vía PLCSIM) | Planes Free/Pro, señales analógicas, Allen-Bradley |
| **Valeria** | Ventas por WhatsApp y web; tutora de dudas dentro de cada lección | Postventa automática, ofertas de ascenso |
| **Pago y acceso** | Un solo pago (Mercado Pago / PayPal), acceso <5 min sin intervención humana | Simulador Pro, membresía, empresas |
| **Constancia** | Digital propia con folio verificable (NO DC-3) | — |

## 3. Cronograma

Del manual de implementación v2.1 (PDF):

| Hito | Fecha |
|---|---|
| Arranque | 23-nov-2026 |
| Alcance congelado | 04-dic-2026 |
| Construcción terminada | 28-ene-2027 |
| Beta cerrada concluida | 15-feb-2027 |
| Decisión de lanzamiento | 19-feb-2027 |
| **LANZAMIENTO PÚBLICO** | **22-feb-2027** |
| Simulador Free/Pro a la venta | 05-may-2027 |
| Segundo curso publicado | 07-may-2027 |
| Cierre semestre / informe | 21-may-2027 |

Equipos de software: **SW1** = Valeria + WhatsApp + CRM · **SW2** = Simulador 3D
(ruta crítica) · **SW3** = Plataforma + pago único + accesos automáticos.

## 4. Arquitectura objetivo (a construir — NUEVA)

> La aplicación y la API a desarrollar son **nuevas (greenfield)**. No reutilizan
> el PHP existente.

### Backend — ASP.NET Core (monolito modular DDD)
- **CIAT.API**: controladores, `Program.cs`, middlewares (CORS/Auth), DI.
- **CIAT.Aplicacion**: casos de uso, DTOs, interfaces de servicios/repositorios.
- **CIAT.Dominio**: entidades, value objects, agregados, reglas puras (sin dependencias externas).
- **CIAT.Infraestructura**: repositorios, EF Core, integraciones (Mercado Pago, video DRM, WhatsApp).

**Bounded Contexts**: Usuarios/Auth · Pagos · Cursos · Simulador · Constancias · Valeria.

### Frontend — Angular (Standalone) + Monorepo Nx
- Apps por subdominio: `portal` (app.ciatsoftware.com), `curso`, `simulador`, `admin`.
- Libs compartidas: `shared-ui`, `shared-core` (servicios, modelos, interceptores).
- i18n: `@ngx-translate/core` + JSON por idioma.

### Datos — SQL Server
- Solo metadatos (no binarios). Tablas de traducción para i18n.

### Autenticación
- JWT (access corto + refresh) en cookies con dominio padre `.ciatsoftware.com`.

### Video (Netflix style — PENDIENTE de definición)
- Objetivo de los `.txt`: DRM externo (VdoCipher/Mux), token temporal vía API,
  archivo nunca en SmarterASP. PDFs en blob storage con URLs firmadas.

### Pagos — Mercado Pago / PayPal
- Activación del acceso **solo vía webhook `approved`** (nunca confiar en respuesta síncrona).

## 5. Infraestructura existente (realidad actual — NO se reutiliza)

- **Hosting**: 2 hostings. Hosting 1 = 3 GB RAM en 3 pools. Hosting 2 = "512 gb"
  (RAM por confirmar) en 1 pool.
- **PHP videocursos** en desarrollo (servidor local) — *no se reutiliza*.
- **API de pagos existente**: Mercado Pago ya consumido por API (hecha por Ivan);
  PayPal directo en página, plan de migrar a la misma API.
- **Simulador 3D ya web**: `ciatsoftware.com/Apps/Simulador3D_PLC`, login en `AppsLogin`.
- **Clases actuales**: Zoom + grabaciones en Drive publicadas en Google Classroom
  (no hay sistema propio).
- **Video actual**: HLS con fragmentos cifrados (AES-128), llave `enc.key` se entrega
  al navegador → **no es DRM real**. Sin servicio de streaming contratado.
- **Tarjetas**: PayPal abre su propia ventana; CIAT no toca datos de tarjeta.

## 6. Decisiones tomadas

1. **App y API nuevas** (greenfield). No reutilizar el PHP existente.
2. **Stack**: Angular Standalone + Nx (front) · ASP.NET Core DDD (back) · SQL Server.
3. **Modelo**: pago único (sin recurrentes).

## 7. Decisiones pendientes (por definir con el cliente)

1. **Protección de video**: ¿DRM Widevine real (VdoCipher/Mux) o aceptar HLS cifrado?
2. **Alcance del simulador**: ¿qué es el `/Apps/Simulador3D_PLC` actual vs. el
   "editor propio + TIA Portal/PLCSIM" del PDF?
3. **RAM real del hosting 2** ("512 gb" = ¿almacenamiento o RAM?).
4. **Alcance del proyecto de prueba**: ¿solo SW3 (plataforma + pago + accesos) o
   incluye SW2 (simulador) y SW1 (Valeria)?
5. **Naturaleza**: ¿prototipo de validación o código productivo para feb-2027?
6. **Estructura frontend**: monorepo con 4 subdominios vs. app única con lazy loading.

## 8. Fuentes

- `deepseek_txt_20261122_ecba4b.txt` — contexto maestro (negocio + stack).
- `deepseek_txt_20261122_98d45a.txt` — detalle arquitectónico (carpetas backend/frontend).
- `PROYECTO CIATSOFTWARE CANAL COMERCIAL DIGITAL.pdf` — manual de implementación v2.1.
- `platica con sistemas.txt` — estado real de infraestructura (WhatsApp, 21-nov-2026).
