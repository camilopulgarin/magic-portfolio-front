# Implementación de Autenticación con Google + Refactor a `fetch` nativo

Documento que describe paso a paso los cambios realizados para:

1. Integrar el login con **Google OAuth** contra el backend NestJS.
2. Refactorizar toda la capa HTTP del proyecto migrando de **axios** a **`fetch` nativo** isomorfo (server + cliente).

---

## 1. Contexto del flujo Google OAuth

El backend (NestJS, `http://localhost:3000`) maneja el flujo completo:

1. `GET /api/auth/google` → backend redirige al consent screen de Google.
2. Google devuelve a backend → backend setea dos cookies **httpOnly**:
   - `access_token` (15 min)
   - `refresh_token` (7 días)
3. Backend redirige a `http://localhost:3001/auth/callback` (sin query params; los tokens viven en cookies).
4. `GET /api/auth/me` → retorna el perfil (lee `access_token` de la cookie).
5. `POST /api/auth/logout` → invalida la sesión y limpia cookies.

> Todas las llamadas al backend deben incluir cookies. En cliente esto es `credentials: 'include'`; en server hay que reenviar manualmente el header `Cookie`.

---

## 2. Paso a paso de la implementación

### Paso 1 — Tipos centralizados

📄 [src/types/auth.ts](src/types/auth.ts)

Se definieron las interfaces del dominio de auth para usarlas en server, cliente y componentes:

- `User` — payload de `GET /api/auth/me`.
- `AuthState` — estado del hook/provider (`user`, `isLoading`, `isAuthenticated`).
- `LoginDto`, `RegisterDto`, `AuthResponse` — DTOs de los endpoints.

**Por qué:** elimina los tipos antiguos (`UserResponse`) que estaban acoplados a `lib/api/types.ts` y centraliza el modelo en `src/types/`.

---

### Paso 2 — Cliente HTTP isomorfo

📄 [src/lib/api/http.ts](src/lib/api/http.ts)

Wrapper delgado sobre `fetch` que **funciona igual en Server Components, Client Components, Route Handlers y Middleware**.

Responsabilidades:

- Compone la URL base con `process.env.NEXT_PUBLIC_API_URL`.
- En **server**: importa `cookies()` de `next/headers` y reenvía el header `Cookie` al backend.
- En **cliente**: usa `credentials: 'include'` para enviar cookies httpOnly.
- Serializa `body` a JSON automáticamente y setea `Content-Type`.
- Maneja respuestas vacías (`204`) y no-JSON.
- Lanza `ApiError(status, message)` en respuestas `!ok`.
- Acepta opciones de caché de Next.js: `cache`, `next: { revalidate, tags }`.

API expuesta:

```ts
http.get<T>(path, opts?)
http.post<T>(path, body?, opts?)
http.patch<T>(path, body?, opts?)
http.put<T>(path, body?, opts?)
http.delete<T>(path, opts?)
```

---

### Paso 3 — Servicio de autenticación único

📄 [src/lib/services/auth.ts](src/lib/services/auth.ts)

`authService` agrupa todos los endpoints de auth en un único objeto:

```ts
authService.getMe();
authService.login({ email, password });
authService.register({ email, password, fullName, username });
authService.logout();
authService.changePassword(currentPassword, newPassword);
```

**Resultado:** una sola definición sirve tanto para llamadas en cliente (`AuthProvider`, `use-auth`, settings) como para llamadas server-side (`/auth/callback`). Desaparecen los antiguos `getMe()` y `getMeServer()` duplicados.

---

### Paso 4 — Botón "Continuar con Google"

📄 [src/components/shared/GoogleSignInButton.tsx](src/components/shared/GoogleSignInButton.tsx)

Componente cliente que:

- Usa `Button` de shadcn con `variant="outline"`.
- Al hacer click: `window.location.href = '${NEXT_PUBLIC_API_URL}/api/auth/google'`.
- Incluye SVG inline del logo Google (sin librerías de íconos).
- Usa exclusivamente variables CSS del design system (`bg-background`, `text-foreground`, `border`, etc.).

Se integró en:

- [src/app/(auth)/login/page.tsx](<src/app/(auth)/login/page.tsx>)
- [src/app/(auth)/register/page.tsx](<src/app/(auth)/register/page.tsx>)

Se eliminó el `Button` inline anterior con su SVG, manteniendo intacta la autenticación por email/password.

---

### Paso 5 — Página de callback

📄 [src/app/auth/callback/page.tsx](src/app/auth/callback/page.tsx)

**Server Component** (sin `"use client"`):

```tsx
export const dynamic = 'force-dynamic';

export default async function AuthCallbackPage() {
  try {
    await authService.getMe(); // valida sesión leyendo cookies del request
  } catch {
    redirect('/login?error=oauth_failed');
  }
  redirect('/dashboard');
}
```

Como `authService.getMe()` se ejecuta en server, el cliente `http` reenvía automáticamente la cookie `access_token` al backend.

---

### Paso 6 — Hook `useAuth` reutilizable

📄 [src/hooks/use-auth.ts](src/hooks/use-auth.ts)

Hook ligero que expone `user`, `isLoading`, `isAuthenticated`, `logout()`. Llama a `authService.getMe()` al montar y limpia el estado si falla (401). En `logout()` invoca el servicio y redirige a `/login`.

Convive con el `AuthProvider` (contexto global) — el hook es útil para componentes aislados que no necesitan el árbol completo.

---

### Paso 7 — `AuthProvider` migrado al nuevo servicio

📄 [src/components/auth/AuthProvider.tsx](src/components/auth/AuthProvider.tsx)

Se cambió el import de `authApi` → `authService` y el tipo `UserResponse` → `User`. Se añadió cleanup con `cancelled` para evitar actualizaciones de estado tras unmount.

---

### Paso 8 — Middleware de rutas protegidas

📄 [src/middleware.ts](src/middleware.ts)

Simplificado a una sola responsabilidad: si una request a `/dashboard/*` no trae cookie `access_token`, redirige a `/login`.

```ts
export const config = {
  matcher: ['/dashboard/:path*'],
};
```

Antes el middleware también redirigía rutas de auth si había sesión, pero esa decisión la toma ahora el `AuthProvider` cliente para no bloquear la SSR.

---

## 3. Refactor: de `axios` a `fetch` nativo

### Motivación

Axios es un patrón heredado de la era SPA/CRA que no aporta valor en Next.js App Router y tiene costos:

| Aspecto                                                 | `fetch` nativo              | `axios`                  |
| ------------------------------------------------------- | --------------------------- | ------------------------ |
| Caché Next.js (`cache`, `next.revalidate`, `next.tags`) | ✅ Integrado                | ❌                       |
| Server Components                                       | ✅ Misma API server/cliente | ⚠️ Requiere config extra |
| `revalidateTag()` / ISR granular                        | ✅                          | ❌                       |
| Edge Runtime / Middleware                               | ✅                          | ❌                       |
| Bundle size                                             | 0 KB                        | ~13 KB en cliente        |
| Recomendación oficial Vercel/Next                       | ✅                          | ❌                       |

### Cambios realizados

1. **Nuevo cliente HTTP único** → `src/lib/api/http.ts` (descrito arriba).
2. **Servicios por dominio** → `src/lib/services/auth.ts` consume `http`. Cuando se añadan más dominios (portfolios, users, etc.), se crearán al mismo nivel.
3. **Consumidores actualizados** a usar `authService`:
   - `src/components/auth/AuthProvider.tsx`
   - `src/hooks/use-auth.ts`
   - `src/app/dashboard/settings/page.tsx`
   - `src/app/auth/callback/page.tsx`
4. **Archivos eliminados:**
   - `src/lib/api/auth.ts`
   - `src/lib/api/client.ts`
   - `src/lib/api/config.ts`
   - `src/lib/api/types.ts`
5. **Dependencia removida:** `npm uninstall axios` (–11 paquetes del bundle).
6. **`next.config.ts`** — se eliminó el rewrite `/api/*` → backend. Ya no es necesario: `http` apunta directo al backend con `NEXT_PUBLIC_API_URL`.

### Ajuste de puertos

Para evitar que Next.js y NestJS colisionen en el `3000`:

- Backend NestJS: `http://localhost:3000`
- Frontend Next.js: `http://localhost:3001`

📄 `package.json`:

```json
"scripts": {
  "dev": "next dev -p 3001",
  "start": "next start -p 3001"
}
```

---

## 4. Variables de entorno requeridas

`.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 5. Requisitos del backend (CORS)

Para que las cookies httpOnly fluyan correctamente entre `3001` (frontend) y `3000` (backend), el backend NestJS debe tener:

```ts
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
});
```

Y las cookies deben emitirse con:

- `httpOnly: true`
- `sameSite: 'lax'` (suficiente para mismo host distinto puerto)
- `secure: false` en local; `true` en producción tras HTTPS

---

## 6. Flujo end-to-end resultante

1. Usuario hace click en **Continuar con Google** en `/login`.
2. Navega a `http://localhost:3000/api/auth/google` (sin pasar por proxy).
3. Backend → Google → backend setea cookies → redirige a `http://localhost:3001/auth/callback`.
4. El Server Component de callback ejecuta `authService.getMe()`, que reenvía las cookies al backend.
5. Si la sesión es válida → `redirect('/dashboard')`. Si no → `redirect('/login?error=oauth_failed')`.
6. El `middleware.ts` protege `/dashboard/*` exigiendo cookie `access_token`.
7. El `AuthProvider` hidrata el estado del usuario en cliente con `authService.getMe()`.

---

## 7. Checklist de verificación

- [ ] `.env.local` contiene `NEXT_PUBLIC_API_URL=http://localhost:3000`
- [ ] Backend NestJS escuchando en `:3000`
- [ ] Frontend levantado con `npm run dev` en `:3001`
- [ ] CORS del backend permite `http://localhost:3001` con `credentials: true`
- [ ] Cookies emitidas como `httpOnly` + `sameSite: 'lax'`
- [ ] `axios` ya no aparece en `package.json`
- [ ] Carpeta `src/lib/api/` solo contiene `http.ts`

---

## 8. Estructura final relevante

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          ← usa <GoogleSignInButton />
│   │   └── register/page.tsx       ← usa <GoogleSignInButton />
│   └── auth/
│       └── callback/page.tsx       ← Server Component, valida y redirige
├── components/
│   ├── auth/AuthProvider.tsx       ← consume authService
│   └── shared/GoogleSignInButton.tsx
├── hooks/
│   └── use-auth.ts                 ← hook ligero, consume authService
├── lib/
│   ├── api/
│   │   └── http.ts                 ← cliente fetch isomorfo
│   └── services/
│       └── auth.ts                 ← authService
├── middleware.ts                   ← protege /dashboard/*
└── types/
    └── auth.ts                     ← User, AuthState, DTOs
```
