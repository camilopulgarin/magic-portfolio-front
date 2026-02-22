# AGENTS.md

## Guía de comportamiento y estándares para el Agente de IA

Este archivo define las reglas, principios y estándares que el Agente de IA debe seguir **SIEMPRE** al generar, modificar o sugerir código, arquitectura, documentación o decisiones técnicas dentro de este proyecto.

---

## 🎯 OBJETIVO DEL PROYECTO

Desarrollar una plataforma web en **Next.js** para crear portafolios y currículums vitae profesionales, personalizables, modernos, accesibles y escalables, con múltiples estilos visuales y una arquitectura mantenible.

---

## 🧠 PRINCIPIOS GENERALES

El agente debe:

- Priorizar **calidad del código** sobre rapidez
- Pensar siempre en **escalabilidad, mantenimiento y legibilidad**
- Explicar decisiones técnicas cuando sea relevante
- **No asumir requisitos ambiguos**: si algo no está claro, debe preguntar
- Evitar soluciones "rápidas" o **anti-patrones**

---

## ⚙️ REGLAS GENERALES

### El agente de IA **DEBE**:

- Generar solo código relevante
- Mantener consistencia con el código existente
- Priorizar legibilidad y mantenimiento
- Evitar suposiciones no explícitas
- Usar patrones modernos y recomendados

### El agente de IA **NO DEBE**:

- Generar código innecesario
- Introducir dependencias sin justificación
- Romper la arquitectura definida
- Usar patrones obsoletos

---

## 🎨 DESIGN SYSTEM ENFORCEMENT (MANDATORY)

El sistema de diseño oficial del proyecto está definido en:
**`/docs/design-system.md`**

Este documento es la **única fuente de verdad** para todas las decisiones visuales.
Cualquier implementación que lo contradiga debe considerarse **inválida**.

---

### 1️⃣ Reglas de Componentes

**El agente DEBE:**

- Usar exclusivamente **shadcn/ui** como sistema base de componentes
- **Reutilizar componentes existentes** antes de crear nuevos
- Crear **wrappers reutilizables** cuando se necesite personalización repetida
- Mantener coherencia con el **theme configurado**

**El agente NO debe:**

- Crear `Buttons`, `Cards`, `Inputs` personalizados si existen en shadcn
- Duplicar estilos `inline`
- Modificar múltiples veces un mismo patrón visual sin abstracción

---

### 2️⃣ Reglas de Colores (ESTRICTO)

**El agente:**

- ❌ **NO** debe usar colores HEX directamente
- ❌ **NO** debe usar colores default de Tailwind como `bg-blue-500`
- ✅ **DEBE** usar exclusivamente variables CSS definidas en: `styles/globals.css`

**Ejemplos válidos:**

- `bg-background`
- `bg-card`
- `text-foreground`
- `bg-primary`
- `bg-secondary`
- `bg-accent`

**Si se requiere un nuevo color:**

1. Debe añadirse primero al `design-system.md`
2. Debe declararse como variable CSS
3. Luego puede utilizarse

---

### 3️⃣ Layout & Espaciado

**El agente debe:**

- Usar sistema de espaciado consistente
- Evitar valores arbitrarios
- Respetar padding y separación definidos en el design system
- Mantener consistencia en contenedores

**Patrón recomendado:**
`container mx-auto px-6`

---

### 4️⃣ Animaciones

**El agente debe:**

- Usar animaciones **sutiles** y con propósito
- Evitar animaciones distractoras o infinitas innecesarias
- Seguir las reglas definidas en `design-system.md`

---

### 5️⃣ Glassmorphism

- Permitido solo cuando el design system lo indique
- **Patrón estándar:**
  `bg-white/5` + `backdrop-blur-xl` + `border-white/10` + `shadow-soft` + `rounded-xl`

No improvisar variaciones no documentadas.

---

### 6️⃣ Responsive

- **Mobile-first** obligatorio
- No permitir overflow horizontal
- No crear soluciones solo para desktop
- Respetar breakpoints definidos

---

### 7️⃣ Cumplimiento en Issues de Linear

**Cuando el agente implemente una historia de usuario DEBE:**

- Seguir las restricciones del issue
- Respetar estrictamente el `design-system.md`
- Reutilizar componentes existentes
- No introducir nuevos patrones sin justificación arquitectónica

---

## 🧱 PRINCIPIOS DE ARQUITECTURA

### 1. SOLID (OBLIGATORIO)

**El agente debe respetar estrictamente:**

- **S**ingle Responsibility
- **O**pen / Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

---

### 2. CLEAN CODE (OBLIGATORIO)

**El agente debe:**

- Usar **nombres descriptivos**
- Evitar funciones largas (~30 líneas máximo)
- Evitar comentarios innecesarios
- No duplicar lógica (**DRY**)
- Manejar errores explícitamente
- Eliminar código muerto

---

## ⚛️ NEXT.JS & REACT CON SHADCN/UI

### Reglas obligatorias

- Usar **App Router**
- **Server Components** por defecto
- `"use client"` solo cuando sea necesario
- Separar lógica de presentación
- No acceder a APIs directamente desde componentes
- No usar estados globales innecesarios

### Implementación con shadcn/ui

**El agente debe:**

- Usar **shadcn/ui** como sistema de componentes principal
- Personalizar según la paleta de colores del proyecto
- Mantener consistencia con el **theme configurado**
- Usar tokens de diseño (CSS variables)
- Preferir componentes de shadcn sobre implementaciones custom
- Extender cuando sea necesario, no reemplazar

---

## 🗂️ ESTRUCTURA DE CARPETAS

**El agente debe respetar estrictamente la siguiente estructura:**

src/
│
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ ├── globals.css
│ │
│ ├── login/
│ ├── register/
│ ├── dashboard/
│ ├── portfolios/
│ └── api/
│
├── components/
│ ├── ui/           # shadcn base components
│ ├── shared/       # wrappers personalizados
│ ├── layout/
│ ├── sections/
│ ├── Navbar.tsx
│ ├── Footer.tsx
│ └── ...
│
├── services/
├── hooks/
├── lib/
│ └── utils.ts
├── styles/
├── utils/
└── types/

No alterar estructura sin justificación arquitectónica.

---

## 🔒 REGLA FINAL

- La **consistencia del sistema de diseño** tiene prioridad sobre la creatividad visual
- **Arquitectura > improvisación**
- **Sistema > estilos aislados**
