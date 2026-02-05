# AGENTS.md

## Guía de comportamiento y estándares para el Agente de IA

Este archivo define las reglas, principios y estándares que el Agente de IA debe seguir **SIEMPRE** al generar, modificar o sugerir código, arquitectura, documentación o decisiones técnicas dentro de este proyecto.

---

## 🎯 OBJETIVO DEL PROYECTO

Desarrollar una plataforma web en **Next.js** para crear **portafolios y currículums vitae profesionales**, personalizables, modernos, accesibles y escalables, con múltiples estilos visuales y una arquitectura mantenible.

---

## 🧠 PRINCIPIOS GENERALES

El agente debe:

- Priorizar **calidad del código sobre rapidez**
- Pensar siempre en **escalabilidad, mantenimiento y legibilidad**
- Explicar decisiones técnicas cuando sea relevante
- No asumir requisitos ambiguos: si algo no está claro, debe **preguntar**
- Evitar soluciones “rápidas” o anti-patrones

---

## ⚙️ REGLAS GENERALES

El agente de IA debe:

- Generar **solo código relevante**
- Mantener consistencia con el código existente
- Priorizar **legibilidad y mantenimiento**
- Evitar suposiciones no explícitas
- Usar patrones modernos y recomendados

El agente de IA **NO debe**:

- Generar código innecesario
- Introducir dependencias sin justificación
- Romper la arquitectura definida
- Usar patrones obsoletos

## 🧱 PRINCIPIOS DE ARQUITECTURA

### 1. SOLID (OBLIGATORIO)

El agente debe respetar estrictamente:

- **S**ingle Responsibility  
  Cada componente, hook, servicio o función debe tener una única responsabilidad clara.

- **O**pen / Closed  
  El código debe estar abierto a extensión pero cerrado a modificación.

- **L**iskov Substitution  
  Las abstracciones deben poder reemplazarse sin romper el sistema.

- **I**nterface Segregation  
  Interfaces pequeñas y específicas, nunca “god interfaces”.

- **D**ependency Inversion  
  Dependencias hacia abstracciones, no implementaciones concretas.

---

## 🧼 CLEAN CODE (OBLIGATORIO)

El agente debe:

- Usar **nombres descriptivos y consistentes**
- Evitar funciones largas (máx. ~30 líneas)
- Evitar comentarios innecesarios (el código debe explicarse solo)
- No duplicar lógica (DRY)
- Manejar errores de forma explícita
- Eliminar código muerto o innecesario

---

## ⚛️ NEXT.JS & REACT CON SHADCN/UI

### Reglas obligatorias

- Usar **App Router**
- Usar **Server Components por defecto**
- Usar `"use client"` solo cuando sea estrictamente necesario
- Separar lógica de presentación
- No acceder a APIs directamente desde componentes
- No usar estados globales innecesarios

## Implementación con shadcn/ui

El agente debe:

- Usar shadcn/ui como sistema de componentes principal
  Componentes base: Button, Input, Card, Dialog, etc.

Personalizar según la paleta de colores del proyecto

Mantener consistencia con el theme configurado

Estructura de componentes con shadcn

text
src/
├── components/
│ ├── ui/ # Componentes de shadcn/ui
│ │ ├── button.tsx
│ │ ├── input.tsx
│ │ ├── card.tsx
│ │ └── ...
│ ├── layout/ # Componentes de layout
│ └── portfolio/ # Componentes específicos del dominio
Configuración de tema

Usar tailwind.config.js con colores personalizados

Configurar components.json para shadcn

Implementar ThemeProvider si se requiere modo oscuro/claro

Directrices específicas

Preferir componentes de shadcn sobre implementaciones custom

Extender componentes de shadcn cuando sea necesario, no reemplazar

Mantener el sistema de diseño consistente

Usar tokens de diseño (CSS variables) para colores y espaciado

Estructura de componentes
Componentes reutilizables en /components/ui

Componentes de página en /app/[ruta]/page.tsx

Layouts globales y anidados en /app/layout.tsx y /app/[ruta]/layout.tsx

Hooks personalizados en /hooks

Servicios/API clients en /services

---

## 🗂️ ESTRUCTURA DE CARPETAS

El agente de IA debe respetar y seguir esta estructura:

src/
│
├── app/
│ ├── layout.jsx
│ ├── page.jsx
│ │
│ ├── login/
│ │ └── page.jsx
│ │
│ ├── register/
│ │ └── page.jsx
│ │
│ ├── dashboard/
│ │ ├── page.jsx
│ │ │
│ │ ├── portfolio/
│ │ │ ├── page.jsx
│ │ │ └── edit/
│ │ │ └── page.jsx
│ │ │
│ │ └── settings/
│ │ └── page.jsx
│ │
│ ├── portfolios/
│ │ └── [username]/
│ │ └── page.jsx
│ │
│ └── api/
│
├── components/
│ ├── Navbar.jsx
│ ├── Footer.jsx
│ ├── PortfolioCard.jsx
│ ├── Button.jsx
│ └── Input.jsx
│
├── services/
│ ├── auth.service.js
│ └── portfolio.service.js
│
├── hooks/
│ ├── useAuth.js
│ └── usePortfolio.js
│
├── styles/
│ └── globals.css
│
├── utils/
│ └── constants.js
│
└── types/
