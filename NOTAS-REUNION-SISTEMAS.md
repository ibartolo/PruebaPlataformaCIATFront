# Notas — Pendientes con Sistemas CIAT

> Reunión pendiente. Temas de integración de la nueva plataforma (Angular + WebAPI) con el sistema y simulador existentes de CIATSOFTWARE.

## 1. SSO / Auto-autenticación (simulador + portal)

**Objetivo**: el alumno se autentica en la nueva plataforma y entra al simulador/portal **sin escribir ningún código manual**.

**Lo que ya sabemos del simulador actual** (`ciatsoftware.com/Apps/Simulador3D_PLC`):
- Valida mediante `POST ?accion=validar_codigo` (validación **server-side**).
- La sesión "desbloqueada" se mantiene en el servidor (cookie/sesión IIS por confirmar).
- Pide un **código de acceso de 8 caracteres**, que es **distinto** de la matrícula (`CPR25-0049` tiene 10).

**Preguntas para Sistemas**:
1. ¿Cómo se mantiene la sesión desbloqueada? (cookie, token, sesión IIS)
2. ¿Existe —o pueden exponer— un **endpoint de SSO / validación de licencia** para que la plataforma autentique al alumno?
3. ¿El código de 8 caracteres es una **licencia por alumno**?

## 2. Almacenamiento de usuarios

**Pregunta central**: ¿dónde viven los usuarios?
- ¿En una **nueva base de datos** de la plataforma?
- ¿Se **reutiliza la base** del sistema actual de CIAT?
- Opción "**guardar en 2**": dos bases (nueva plataforma + sistema CIAT). Si es así, definir **sincronización** (¿cuál es la fuente de verdad?).

## 3. Cruce de activos con suscripción

- Cruzar **"activos"** (alumnos activos) con **"suscripción"** (estado de pago/inscripción).
- ⚠️ **Aclarar terminología**: el modelo nuevo es **PAGO ÚNICO** (sin cobros recurrentes). "Suscripción" en el sistema actual probablemente significa **inscripción / estado de pago**, no una suscripción recurrente. Hay que reconciliar ambos conceptos.

---

## Decisiones ya cerradas (contexto)
- App + API **nuevas** (greenfield). No reutilizar el PHP existente.
- **Simulador y Valeria ya existen** → solo se integran.
- Stack: Angular (Standalone + módulos por sección) + ASP.NET Core DDD + SQL Server.
- Modelo de negocio: **pago único**.
- Video: por definir (HLS propio vs VdoCipher DRM).
