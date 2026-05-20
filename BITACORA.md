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