# Bitácora de cambios - Autenticación con Google

**Fecha:** 2026-05-07

## Objetivo
Conectar el botón de Google en la página de login con la autenticación OAuth implementada en el backend.

---

## Archivos creados

### 1. `src/app/api/auth/google/route.ts`
- **Tipo:** Route handler de Next.js
- **Función:** Recibe la solicitud del login y redirige al endpoint de Google OAuth del backend
- **Detalles:** Pasa el callbackUrl al backend para que redirija al frontend después de autenticarse

### 2. `src/app/api/auth/google/callback/route.ts`
- **Tipo:** Route handler de Next.js
- **Función:** Maneja el callback de Google OAuth desde el backend
- **Detalles:** 
  - Recibe el código de autorización de Google
  - Lo envía al backend para obtener los tokens
  - Extrae los tokens de la URL de redirect del backend
  - Redirige a `/oauth-callback` con los tokens

### 3. `src/app/api/auth/callback/route.ts`
- **Tipo:** Route handler de Next.js
- **Función:** Captura los tokens devueltos por el backend (versión alternativa)
- **Detalles:** No usado actualmente, puede eliminarse

### 4. `src/app/oauth-callback/page.tsx`
- **Tipo:** Página de Next.js
- **Función:** Recibe los tokens, los guarda en localStorage/cookies y redirige al dashboard
- **Detalles:** Muestra un spinner mientras procesa la autenticación

## Archivos modificados

### 1. `src/app/(auth)/login/page.tsx`
- **Cambio:** Agregado `onClick` al botón de Google
- **Función:** Redirige a `/api/auth/google?callbackUrl=...` con la URL del dashboard
- **Línea:** ~120

### 2. `next.config.ts`
- **Cambio:** Agregado proxy para `/auth/*`
- **Función:** Permite que las rutas `/auth/*` del backend pasen directamente al servidor backend

### 3. `.gitignore`
- **Cambio:** Agregado `BITACORA.md`

---

## Inconvenientes y soluciones

### Problema 1: El backend devuelve tokens en la URL
**Síntoma:** `GET /login?error=no_token`

**Causa:** El flujo OAuth del backend envía tokens directamente como query params (`/auth/callback?accessToken=...&refreshToken=...`), no usa código OAuth estándar.

**Solución:** 
- El callback del frontend (`/api/auth/google/callback`) extrae los tokens del redirect del backend
- Redirige a `/oauth-callback` con los tokens para que el frontend los procese

### Problema 2: Redirección infinita o no se reciben los tokens
**Síntoma:** El callback no recibía el código de Google o no seguía el redirect del backend correctamente

**Solución:**
- Usar `redirect: "manual"` en el fetch para capturar el headers `location`
- Extraer los tokens de la URL de redirect antes de redirigir
- Evitar que el proxy de Next.js intercepte las rutas del backend

### Problema 3: El flujo completo requiere popup
**Síntoma:** El flujo de redirect causaba problemas con las cookies

**Solución:** Implementar un flujo donde:
1. El usuario hace click en Google
2. Backend redirige a Google OAuth
3. Google retorna al callback del backend
4. Backend redirige con tokens a `/oauth-callback` en el frontend
5. El frontend guarda tokens y redirige al dashboard

---

## Flujo actual de autenticación

1. Usuario hace click en botón "Google" en la página de login
2. Navegador redirige a `/api/auth/google?callbackUrl=/dashboard`
3. El route handler del frontend redirige al backend (`/auth/google?callbackUrl=...`)
4. Backend redirige a Google OAuth para autenticación
5. Después de autenticarse, Google redirige al callback del backend (`/auth/google/callback?code=...`)
6. Backend procesa el callback y redirige con tokens (`/auth/callback?accessToken=...&refreshToken=...`)
7. El callback del frontend (`/api/auth/google/callback`) extrae los tokens de la URL
8. Redirige a `/oauth-callback?accessToken=...&refreshToken=...`
9. La página `/oauth-callback` guarda tokens en localStorage/cookies
10. Redirige a `/dashboard`
11. El AuthProvider detecta las cookies y carga el usuario

---

## Estado actual
El flujo está implementado pero puede requerir ajustes dependiendo de cómo el backend maneje el callback exacto. Si persisten errores, verificar en la consola del backend los logs de `/auth/google` y `/auth/google/callback`.

---

## Actualización: HTTP-only cookies y limpieza

**Fecha:** 2026-05-13

### Cambios realizados

Se migro el almacenamiento de tokens de localStorage a cookies httpOnly para mayor seguridad.

### Archivos modificados

#### 1. `src/app/api/auth/google/route.ts`
- Ahora usa `process.env.NEXT_PUBLIC_API_URL` para la URL del backend
- Pasa el callbackUrl encodeado al backend

#### 2. `src/app/api/auth/google/callback/route.ts`
- Extrae tokens desde las cookies que envía el backend (no de query params)
- Guarda los tokens en cookies httpOnly en el frontend
- Implementa `parseAllCookies()` para parsear el header `set-cookie`

#### 3. `src/app/api/auth/logout/route.ts`
- Envia el refreshToken al backend para invalidar la sesión
- Limpia las cookies del frontend

#### 4. `src/app/(auth)/login/page.tsx` y `register/page.tsx`
- Habilitados los botones de Google con `onClick` que llama a `/api/auth/google`

### Problema resuelto: loop de redirect

**Síntoma:** El callbackUrl se encodeaba múltiples veces causando un loop de redirección infinita.

**Causa:** El proxy de Next.js causaba doble encoding del callbackUrl.

**Solución:** Usar URLs directas al backend (`http://localhost:4000`) en lugar del proxy para evitar el problema de encoding.

### Flujo final

1. Usuario hace click en botón Google
2. `/api/auth/google` redirige a `http://localhost:4000/api/auth/google?callbackUrl=...`
3. Backend redirige a Google OAuth
4. Google retorna al callback del backend
5. Backend devuelve tokens en cookies httpOnly
6. `/api/auth/google/callback` extrae tokens y crea cookies en el frontend
7. Redirige al dashboard

### Cookies utilizadas

| Nombre | Tipo | Duración |
|--------|------|----------|
| `accessToken` | httpOnly, secure, sameSite=lax | 15 minutos |
| `refreshToken` | httpOnly, secure, sameSite=lax | 7 días |

---

## Actualización: Refactor de API y configuración centralizada

**Fecha:** 2026-05-23

### Objetivo
Centralizar la configuración de la API y mejorar la arquitectura del cliente HTTP para mayor mantenibilidad y escalabilidad.

### Cambios realizados

#### 1. Configuración centralizada (`src/lib/api/config.ts`)
- **Archivo nuevo:** `src/lib/api/config.ts`
- **Función:** Exportar constantes de configuración como `CLIENT_API_URL`
- **Ventaja:** Evita duplicación de URLs y facilita cambios de entorno

#### 2. Refactor del cliente API (`src/lib/api/client.ts`)
- **Cambios principales:**
  - Reemplaza `API_URL` con `CLIENT_API_URL` desde config
  - Simplifica manejo de tokens (localStorage + cookies)
  - Mejora manejo de errores en interceptores
  - Corrige formato de cookies y localStorage
  - Actualiza URLs de endpoints para usar rutas absolutas

#### 3. Adaptación de API de autenticación (`src/lib/api/auth.ts`)
- **Cambios:**
  - Usa rutas absolutas (`/api/auth/*`) en lugar de relativas
  - Implementa logout usando route handler de Next.js
  - Mantiene compatibilidad con flujo existente
  - Corrige sintaxis de importaciones

#### 4. Mejoras en Next.js config (`next.config.ts`)
- **Cambios:**
  - Agrega configuración de imágenes para Google OAuth
  - Actualiza formato de rewrites y remapeos
  - Mejora configuración de proxy para auth routes

#### 5. Optimización de componentes de dashboard
- **Archivos afectados:**
  - `src/components/dashboard/DashboardTopBar.tsx`
  - `src/components/dashboard/Sidebar.tsx`
  - **Cambios:** Refactor de imports y mejor estructura de componentes

#### 6. Actualización de AuthProvider (`src/components/auth/AuthProvider.tsx`)
- **Mejoras:** 
  - Optimiza manejo de estado de autenticación
  - Mejora manejo de errores y redirecciones
  - Actualiza lógica de refresh token

### Problemas resueltos

#### Problema 1: URLs duplicadas y inconsistentes
**Síntoma:** Diferentes partes del código usaban diferentes formatos de URLs
**Solución:** Centralización en `config.ts`

#### Problema 2: Manejo confuso de tokens
**Síntoma:** Tokens almacenados en múltiples lugares con formatos inconsistentes
**Solución:** Unificación de manejo en `client.ts`

#### Problema 3: Configuración de imágenes para OAuth
**Síntoma:** Errores al cargar imágenes de Google OAuth
**Solución:** Configuración de `remotePatterns` en `next.config.ts`

### Estado actual
La API está refactorizada con arquitectura más limpia y mantenible. El flujo de autenticación sigue funcionando pero con mejor manejo de errores y configuración centralizada.

---

## Actualización: Corrección de OAuth Google Callback (404 Not Found)

**Fecha:** 2026-06-01

### Objetivo
Resolver el error 404 "Not Found" en el flujo de callback de Google OAuth, asegurando que Google redirija correctamente al backend a través de Next.js rewrites, y que el backend finalice el flujo correctamente con cookies httpOnly y redirección al dashboard del frontend.

### Problema Presentado
Google estaba redirigiendo el navegador a `http://localhost:3000/auth/callback` después de la selección de cuenta, lo cual resultaba en un error 404 (Not Found) en el frontend. La URL correcta esperada por el backend (a través de Next.js rewrites) era `http://localhost:3000/api/auth/google/callback`.

### Causa Exacta
1.  **Google Cloud Console OAuth Redirect URI incorrecta:** La URL configurada en Google Cloud Console (`http://localhost:3000/auth/callback`) no coincidía con la ruta del backend (`http://localhost:3000/api/auth/google/callback`) que debía manejar el callback.
2.  **Configuración `callbackURL` en el Backend incorrecta:** Es probable que la `callbackURL` definida en la estrategia de Google de Passport.js (o equivalente) en el backend también estuviera apuntando a la URL incorrecta.

### Solución Implementada (Acciones Manuales Requeridas)

1.  **Google Cloud Console:**
    *   **Acción:** Actualizar las "URIs de redireccionamiento autorizados" en la configuración de la credencial OAuth 2.0.
    *   **URL Correcta (Desarrollo):** `http://localhost:3000/api/auth/google/callback`
    *   **URL Correcta (Producción):** `https://[tu-dominio-de-produccion].com/api/auth/google/callback`
    *   **Eliminar:** Cualquier URI incorrecta, como `http://localhost:3000/auth/callback`.

2.  **Código del Backend (Archivo de Configuración de Google Strategy):**
    *   **Acción:** Modificar la `callbackURL` en la configuración de la estrategia de Google OAuth (ej. Passport.js).
    *   **Código Anterior (Ejemplo):** `callbackURL: 'http://localhost:3000/auth/callback'`
    *   **Código Corregido (Ejemplo):** `callbackURL: 'http://localhost:3000/api/auth/google/callback'`
        *(Para producción, reemplazar por `https://[tu-dominio-de-produccion].com/api/auth/google/callback`)*

3.  **Código del Backend (Redirección Post-Login):**
    *   **Acción:** Asegurar que el endpoint del backend que maneja el callback de Google redirija al usuario a la ruta del dashboard del frontend después de la autenticación exitosa.
    *   **URL de Redirección Correcta (Desarrollo):** `http://localhost:3000/dashboard`
    *   **URL de Redirección Correcta (Producción):** `https://[tu-dominio-de-produccion].com/dashboard`

### Archivos de Frontend (magicportfolio-frontend) Modificados
*   **Ninguno.** La solución se centró en configuraciones externas (Google Cloud Console) y en el código del backend, respetando la arquitectura backend-driven del proyecto Next.js.

### Aspectos NO Tocados en el Frontend (magicportfolio-frontend)
*   `next.config.ts` (los rewrites existentes son correctos para el flujo).
*   `src/lib/api/config.ts`.
*   `axios` configuración `withCredentials: true`.
*   Botón de Google (`window.location.href = '/api/auth/google';`).
*   No se crearon nuevas API Routes de autenticación en Next.js.
*   No se introdujo lógica de tokens o refresh en el frontend.
*   No se utilizaron `fetch`, `localStorage`, `sessionStorage` o `Authorization headers` manuales para el flujo de autenticación.
*   No se modificaron `src/app/(auth)/login/page.tsx`, `src/components/auth/AuthProvider.tsx`, `src/lib/schemas/auth.ts`, `src/lib/api/auth.ts`, `src/lib/api/client.ts`.

### Flujo OAuth Profesional Backend-Driven Correcto
1.  Usuario hace clic en el botón de Google en el frontend.
2.  El frontend redirige el navegador a `http://localhost:3000/api/auth/google`.
3.  Next.js reescribe (`rewrite`) la solicitud internamente a `http://localhost:4000/api/auth/google`.
4.  El backend inicia el flujo de autenticación de Google, **especificando `http://localhost:3000/api/auth/google/callback` como `redirect_uri` a Google.**
5.  Google presenta al usuario el selector de cuentas.
6.  El usuario selecciona su cuenta.
7.  Google redirige el navegador del usuario a `http://localhost:3000/api/auth/google/callback`.
8.  Next.js reescribe (`rewrite`) esta solicitud internamente a `http://localhost:4000/api/auth/google/callback`.
9.  El backend procesa la respuesta de Google, autentica al usuario, establece las cookies `httpOnly`, y redirige el navegador a `http://localhost:3000/dashboard`.
10. El `AuthProvider` del frontend detecta las cookies y carga la información del usuario mediante `authApi.getMe()`.

---
