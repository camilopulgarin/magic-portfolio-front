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

## Actualización: Flujo de Recuperación de Contraseña

**Fecha:** 2026-06-07

### Objetivo
Implementar el flujo completo de recuperación de contraseña: solicitud de enlace por email y restablecimiento de contraseña mediante token.

### Diseño de referencia
Se utilizó un diseño de Stitch como referencia visual para ambas páginas (forgot-password y reset-password), manteniendo consistencia con el design system existente (glassmorphism, colores secondary, paleta del proyecto).

### Archivos creados

#### 1. `src/app/(auth)/forgot-password/page.tsx`
- **Tipo:** Página client-side (`'use client'`)
- **Función:** Formulario para solicitar enlace de recuperación de contraseña
- **Estados:**
  - **Formulario:** Icono de candado → título "Recuperar contraseña" → subtítulo → campo email con icono de sobre → botón lavanda → link volver
  - **Loading:** Botón deshabilitado con texto "Enviando..."
  - **Éxito:** Icono de envío → "¡Correo enviado!" → mensaje con email → link "Intentar de nuevo"
- **Validación:** `react-hook-form` + `zodResolver` con `forgotPasswordSchema`
- **API:** `POST /api/auth/forgot-password` via `authService.forgotPassword()`
- **Estilo:** Card glassmorphism (`bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl`), botón `bg-secondary`, labels uppercase con tracking-wider

#### 2. `src/app/(auth)/reset-password/page.tsx`
- **Tipo:** Página client-side (`'use client'`)
- **Función:** Formulario para restablecer contraseña con token de recuperación
- **Token:** Se lee de URL search params (`?token=xxx`) via `useSearchParams()`
- **Estados:**
  - **Token inválido:** Muestra error con link a "Solicitar nuevo enlace" en `/forgot-password`
  - **Formulario:** Icono de candado → título "Nueva contraseña" → campo nueva contraseña + confirmar contraseña (ambos con icono de candado) → botón lavanda
  - **Loading:** Botón deshabilitado con texto "Restableciendo..."
  - **Éxito:** Icono check → "¡Contraseña restablecida!" → mensaje de confirmación → link a login
- **Validación:** `react-hook-form` + `zodResolver` con `resetPasswordSchema` (incluye `.refine()` para verificar que las contraseñas coincidan)
- **API:** `POST /api/auth/reset-password` via `authService.resetPassword()`
- **Misma identidad visual** que forgot-password

### Archivos modificados

#### 3. `src/lib/schemas/auth.ts`
- **Cambio:** Agregados `forgotPasswordSchema` y `resetPasswordSchema`
- **forgotPasswordSchema:** Valida que el email sea requerido y tenga formato válido
- **resetPasswordSchema:** Valida password (8-72 chars, mayúscula + minúscula + número) y confirmPassword con `.refine()` para coincidencia
- **Tipos exportados:** `ForgotPasswordFormData`, `ResetPasswordFormData`

#### 4. `src/types/auth.ts`
- **Cambio:** Agregadas interfaces `ForgotPasswordDto` y `ResetPasswordDto`
- **ForgotPasswordDto:** `{ email: string }`
- **ResetPasswordDto:** `{ token: string; password: string }`

#### 5. `src/lib/services/auth.ts`
- **Cambio:** Agregados métodos `forgotPassword()` y `resetPassword()`
- **forgotPassword:** `POST /api/auth/forgot-password` con `ForgotPasswordDto`
- **resetPassword:** `POST /api/auth/reset-password` con `ResetPasswordDto`
- **Import:** Se agregó `ResetPasswordDto` al import de tipos

### Flujo completo de recuperación

```
Login → "¿Olvidaste tu contraseña?" → /forgot-password
    → Ingresa email → POST /api/auth/forgot-password
    → Muestra "¡Correo enviado!"

Email → Click en enlace → /reset-password?token=xxx
    → Ingresa nueva contraseña + confirmación
    → POST /api/auth/reset-password
    → Muestra "¡Contraseña restablecida!"
    → Click "Volver al inicio de sesión" → /login
```

### Endpoints utilizados

| Endpoint | Método | Body | Respuesta |
|----------|--------|------|-----------|
| `/api/auth/forgot-password` | POST | `{ email }` | 200 OK |
| `/api/auth/reset-password` | POST | `{ token, password }` | 200 OK |

### Validación de contraseñas (reset-password)

- Mínimo 8 caracteres, máximo 72
- Al menos una mayúscula, una minúscula y un número
- Confirmación de contraseña requerida (`.refine()` en Zod)

### Verificación
- TypeScript (`tsc --noEmit`): Sin errores
- ESLint: Sin errores
- Link existente en `/login` ya apunta a `/forgot-password` (funcional ahora)

### Estado actual
El flujo de recuperación de contraseña está completamente implementado en el frontend. Las páginas están listas para conectarse a los endpoints del backend. El auth layout existente envuelve ambas páginas con el fondo gradient y blur circles automáticamente.

---

## Actualización: Página Principal de Portafolios (HU-005 - DYN-42)

**Fecha:** 2026-07-07

### Objetivo
Implementar la página "Mis Portafolios" en el dashboard para que los usuarios puedan visualizar, gestionar y crear portafolios, siguiendo la arquitectura existente de settings.

### Issue de referencia
- **Linear:** DYN-42 - HU-005: Pagina principal de portafolios
- **Proyecto:** Magic-Portfolio

### Archivos creados

#### 1. `src/lib/services/portfolio.ts`
- **Tipo:** Servicio mock
- **Función:** Simula llamadas a API con datos de prueba
- **Métodos:**
  - `getPortfolios()` - Retorna lista de portafolios mock ordenados por `updatedAt` descendente
  - `deletePortfolio(id)` - Simula eliminación de portafolio
- **Nota:** Servicio temporalmente mock hasta que el backend implemente los endpoints reales

#### 2. `src/components/dashboard/EmptyPortfoliosState.tsx`
- **Tipo:** Componente de estado vacío
- **Función:** Muestra mensaje y botón cuando el usuario no tiene portafolios
- **Elementos:**
  - Icono de briefcase con fondo `bg-primary/10`
  - Título "No tienes portafolios aún"
  - Descripción orientativa
  - Botón "Crear mi primer portafolio" con gradiente `from-primary to-secondary`

#### 3. `src/components/dashboard/PortfoliosTable.tsx`
- **Tipo:** Componente de tabla reutilizable
- **Función:** Muestra la lista de portafolios con acciones disponibles
- **Columnas:**
  - **Nombre** (link al portafolio)
  - **Plantilla** (Creativo / Formal)
  - **Estado** (Publicado / Borrador con badge de color)
  - **Creado** (formato DD/MM/YYYY)
  - **Actualizado** (formato DD/MM/YYYY)
  - **Acciones** (dropdown contextual)
- **Acciones disponibles:**
  - Ver → `/dashboard/portfolios/:id`
  - Editar → `/dashboard/portfolios/:id/edit`
  - Copiar URL → copia al portapapeles
  - Eliminar → con confirmación
- **Características:**
  - Ordenamiento por defecto: más reciente primero
  - Loading state durante eliminación
  - Feedback visual con toasts (success/error)

#### 4. `src/app/dashboard/portfolios/page.tsx`
- **Tipo:** Página principal del módulo
- **Función:** Página de entrada para gestionar portafolios
- **Estructura:**
  - Header: Título "Mis Portafolios" + descripción
  - Botón "Crear Portafolio" siempre visible
  - PortfoliosTable (cuando hay datos)
  - EmptyPortfoliosState (cuando no hay datos)
- **Protección:** Redirige a `/login` si no está autenticado
- **Loading:** Muestra spinner mientras carga datos

### Archivos modificados

#### 5. `src/types/portfolio.ts`
- **Cambio:** Agregadas interfaces `Portfolio` y `PortfolioListResponse`
- **Portfolio:**
  ```typescript
  interface Portfolio {
    id: string;
    name: string;
    template: 'creative' | 'formal';
    status: 'published' | 'draft';
    createdAt: string;
    updatedAt: string;
    publicUrl?: string;
  }
  ```
- **PortfolioListResponse:**
  ```typescript
  interface PortfolioListResponse {
    data: Portfolio[];
    total: number;
  }
  ```

### Mock data utilizado

```typescript
const mockPortfolios = [
  {
    id: '1',
    name: 'Mi Portafolio Creativo',
    template: 'creative',
    status: 'published',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-07T14:30:00Z',
    publicUrl: '/portfolio/mi-portafolio-creativo',
  },
  {
    id: '2',
    name: 'CV Profesional',
    template: 'formal',
    status: 'published',
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-07-05T09:15:00Z',
    publicUrl: '/portfolio/cv-profesional',
  },
  {
    id: '3',
    name: 'Portafolio Draft',
    template: 'creative',
    status: 'draft',
    createdAt: '2026-07-07T16:00:00Z',
    updatedAt: '2026-07-07T16:00:00Z',
  },
];
```

### Plantillas disponibles
- **Creativo** (`creative`) - Efectos glassmorphism, referencia: `src/app/demo/creative/page.tsx`
- **Formal** (`formal`) - Académico/profesional, referencia: `src/app/demo/formal/page.tsx`

### Criterios de aceptación cubiertos

| CA | Descripción | Estado |
|----|-------------|--------|
| CA-001 | Visualización del listado | ✅ Tabla con todos los portafolios |
| CA-002 | Información de la tabla | ✅ Nombre, creación, actualización, acciones |
| CA-003 | Creación de nuevo portafolio | ✅ Botón redirige a HU-006 |
| CA-004 | Usuario sin portafolios | ✅ Empty state con botón visible |

### Reglas de negocio implementadas
- Solo muestra portafolios del usuario actual (mock data)
- Tabla ordenada por defecto: más reciente primero
- Fechas en formato DD/MM/YYYY
- Botón "Crear portafolio" siempre visible
- Navegación hacia HU-006 para crear nuevo portafolio

### Arquitectura utilizada
- **Patrón:** Similar a `settings/page.tsx`
- **Componentes shadcn:** Button
- **Variables CSS:** Design system (bg-card, text-foreground, bg-primary, etc.)
- **Responsive:** Mobile-first con breakpoints `lg:`
- **Feedback:** Toast notifications con `use-toast`

### Verificación
- ✅ ESLint: Sin errores nuevos
- ✅ Sigue patrón de `settings/page.tsx`
- ✅ Usa componentes existentes del proyecto
- ✅ Responsive design

### Ruta de acceso
- **URL:** `/dashboard/portfolios`
- **Sidebar:** Botón "Mis Portafolios" en `src/components/dashboard/Sidebar.tsx`

### Notas para futuras iteraciones
1. Conectar a endpoints reales del backend cuando estén disponibles
2. Implementar HU-006 (crear portafolio) en `/dashboard/portfolios/new`
3. Implementar detalle de portafolio en `/dashboard/portfolios/:id`
4. Implementar edición de portafolio en `/dashboard/portfolios/:id/edit`
5. Agregar confirmación de eliminación con modal

### Estado actual
La página "Mis Portafolios" está completamente implementada con datos mock. Está lista para conectarse a los endpoints del backend. La navegación desde el sidebar funciona correctamente. El diseño es consistente con el design system del proyecto.

---

## Actualización: Paginación para PortfoliosTable

**Fecha:** 2026-07-07

### Objetivo
Implementar paginación reutilizable en la tabla de portafolios para soportar grandes volúmenes de datos y mejorar la experiencia de usuario.

### Archivos creados

#### 1. `src/components/ui/pagination.tsx`
- **Tipo:** Componente UI reutilizable
- **Función:** Paginación completa con navegación, selector de items por página y indicadores
- **Props:**
  ```typescript
  interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    totalItems?: number;
    className?: string;
  }
  ```
- **Características:**
  - Botones Anterior/Siguiente con iconos Chevron
  - Números de página con ellipsis automático para muchas páginas
  - Indicador "Mostrando X-Y de Z portafolios"
  - Selector de items por página (5, 10, 25)
  - Accesibilidad: `aria-label`, `aria-current="page"`, keyboard navigation
  - Responsive: layout vertical en mobile, horizontal en desktop
  - States: disabled en botones extremos, active con `bg-primary`
  - Transiciones: `transition-colors duration-200`

### Archivos modificados

#### 2. `src/types/portfolio.ts`
- **Cambio:** Agregadas interfaces `PaginationMeta` y `PaginatedResponse`
- **PaginationMeta:**
  ```typescript
  interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }
  ```
- **PaginatedResponse:**
  ```typescript
  interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
  }
  ```

#### 3. `src/lib/services/portfolio.ts`
- **Cambio:** Actualizado `getPortfolios()` para soportar parámetros de paginación
- **Parámetros:** `page: number`, `pageSize: number`
- **Respuesta:** `PaginatedResponse<Portfolio>` con metadata de paginación
- **Mock data:** Expandido de 3 a 16 portafolios para probar paginación
- **Ejemplo:** 16 items / 5 por página = 4 páginas

#### 4. `src/components/dashboard/PortfoliosTable.tsx`
- **Cambio:** Integrado componente Pagination
- **Nuevas props:**
  - `pagination: PaginationMeta` - Metadata de paginación
  - `onPageChange: (page: number) => void` - Callback cambio de página
  - `onPageSizeChange: (size: number) => void` - Callback cambio de tamaño
- **Estructura:** Tabla + Pagination debajo

#### 5. `src/app/dashboard/portfolios/page.tsx`
- **Cambio:** Agregado estado de paginación y llamadas API con parámetros
- **Estado:** `pagination: PaginationMeta` con page, pageSize, total, totalPages
- **Funciones:**
  - `fetchPortfolios(page, pageSize)` - Obtiene datos paginados
  - `handlePageChange(page)` - Cambia de página
  - `handlePageSizeChange(size)` - Cambia items por página (resetea a página 1)
- **Flujo:** Al eliminar un portafolio, recarga la página actual

### Datos mock expandidos

```typescript
// 16 portafolios de prueba (originalmente 3)
const mockPortfolios = [
  { id: '1', name: 'Mi Portafolio Creativo', template: 'creative', status: 'published', ... },
  { id: '2', name: 'CV Profesional', template: 'formal', status: 'published', ... },
  { id: '3', name: 'Portafolio Draft', template: 'creative', status: 'draft', ... },
  { id: '4', name: 'Portfolio Designer', template: 'creative', status: 'published', ... },
  // ... 12 portafolios más
  { id: '16', name: 'Portfolio Startup', template: 'creative', status: 'published', ... },
];
```

### Distribución por página (5 items)

| Página | Items | Portafolios |
|--------|-------|-------------|
| 1 | 1-5 | Creativo, CV Profesional, Draft, Designer, Ingeniero |
| 2 | 6-10 | Fotógrafo, Arquitecto, Marketing, UX, Emprendedor |
| 3 | 11-15 | Científico, Freelancer, PM, Artista, DevOps |
| 4 | 16 | Startup |

### UI/UX implementado

**Desktop:**
```
┌─────────────────────────────────────────────────────────┐
│ [← Anterior] [1] [2] [3] [4] [Siguiente]              │
│           Mostrando 1-5 de 16 portafolios              │
│                 5 por página ▼                          │
└─────────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────────────┐
│ [←] [1/4] [→]              │
│ Mostrando 1-5 de 16        │
│ 5 por página ▼             │
└─────────────────────────────┘
```

### Estilos (design system)

- **Container:** `bg-card border border-border rounded-xl p-4`
- **Botones:** `text-muted-foreground hover:bg-muted hover:text-foreground`
- **Active:** `bg-primary text-primary-foreground`
- **Disabled:** `text-muted-foreground/50 cursor-not-allowed`
- **Ellipsis:** `text-muted-foreground`
- **Transiciones:** `transition-colors duration-200`

### Accesibilidad

- `aria-label="Paginación"` en el nav
- `aria-label="Página anterior"` / `aria-label="Página siguiente"`
- `aria-current="page"` para página activa
- `aria-label="Página X"` para cada número de página
- Focus visible con `focus:outline-none focus:ring-1 focus:ring-ring`

### Verificación
- ✅ ESLint: Sin errores (solo warning intencional de dependencies)
- ✅ Componente reutilizable para otras tablas
- ✅ Responsive design (mobile-first)
- ✅ Accesibilidad con aria-labels
- ✅ Sigue design system del proyecto

### Uso del componente Pagination

```tsx
import { Pagination } from '@/components/ui/pagination';

<Pagination
  currentPage={1}
  totalPages={4}
  onPageChange={(page) => console.log(page)}
  pageSize={5}
  onPageSizeChange={(size) => console.log(size)}
  totalItems={16}
/>
```

### Notas para futuras iteraciones
1. Conectar a endpoints reales del backend con paginación server-side
2. Agregar loading skeleton durante cambio de página
3. Implementar infinite scroll como alternativa
4. Agregar URL query params para paginación (opcional)
5. Persistir preferencia de items por página en localStorage

### Estado actual
La paginación está completamente implementada y funcionando con datos mock. El componente `Pagination` es reutilizable y está listo para usar en otras tablas del proyecto. Cuando el backend esté listo, solo será necesario pasar los parámetros `page` y `pageSize` al endpoint real.
