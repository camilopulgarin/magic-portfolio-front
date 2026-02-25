# 🎨 Design System v1.0

## Project UI Architecture – Next.js + Tailwind + shadcn

---

## 1. Filosofía del Sistema

Este proyecto adopta un enfoque **Dark-First Modern SaaS**, combinando:

- Minimalismo estructural
- Glassmorphism controlado
- Gradientes sutiles
- Microinteracciones con propósito
- Componentes reutilizables

El diseño prioriza:

- Consistencia
- Escalabilidad
- Accesibilidad
- Reutilización
- Control mediante tokens

---

## 2. Principios Obligatorios

### 2.1 Reglas Generales

- ❌ **No usar** colores HEX directamente en componentes.
- ❌ **No usar** `bg-blue-500`, `text-red-500`, etc.
- ❌ **No crear** botones personalizados si existe `Button` de shadcn.
- ❌ **No duplicar** estilos inline.
- ✅ **Usar exclusivamente** variables CSS definidas en `globals.css`.
- ✅ **Usar** componentes de shadcn/ui.
- ✅ **Crear** wrappers cuando se necesite estilo personalizado.

---

## 3. Sistema de Colores (Tokens Oficiales)

Todos los colores deben definirse como variables **HSL** en:

`app/globals.css`

### 3.1 Core Palette

| Rol        | Variable       | HEX     |
| ---------- | -------------- | ------- |
| Background | `--background` | #0F172A |
| Foreground | `--foreground` | #F1F5F9 |
| Primary    | `--primary`    | #6366F1 |
| Secondary  | `--secondary`  | #8B5CF6 |
| Accent     | `--accent`     | #EC4899 |
| Card       | `--card`       | #1E293B |

### 3.2 Jerarquía de Uso

- **Background** → Uso exclusivo para fondo global.
- **Card** → Para superficies elevadas.
- **Primary** → Acciones principales (CTA primario).
- **Secondary** → Acciones secundarias o gradientes.
- **Accent** → Destacados especiales o énfasis.

⚠️ **Accent no debe usarse en exceso.**

### 3.3 Gradientes

| Aplicación      | Descripción         | Composición                                                                | Uso                    |
| --------------- | ------------------- | -------------------------------------------------------------------------- | ---------------------- |
| Body Background | Gradiente principal | `linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))` | Fondo general del body |

**Nota:** El gradiente del body utiliza las variables de color definidas en la paleta core para mantener consistencia y facilitar futuras modificaciones. La dirección `135deg` crea un degradado diagonal de esquina a esquina.

**Implementación en CSS:**

````css
body {
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
}

---

## 4. Layout System

### 4.1 Contenedor Principal

- Max width: **1200px**
- Centrado automático
- Padding horizontal consistente

**Ejemplo:**

```jsx
className="container mx-auto px-6"

# Design System

## 4.2 Grid Responsivo

- Desktop → 3 columnas para features
- Tablet → 2 columnas
- Mobile → 1 columna

Usar utilidades Tailwind responsive.

## 5. Tipografía

**Fuente Base**: Inter (recomendada)

### Escala

| Elemento | Tamaño           |
|----------|------------------|
| H1       | text-4xl / text-5xl |
| H2       | text-3xl         |
| H3       | text-xl          |
| Body     | text-base        |
| Small    | text-sm          |

### 5.1 Jerarquía Visual

- **H1** → máximo impacto
- **H2** → secciones
- **H3** → cards
- **Body** → descripción

No usar tamaños arbitrarios.

## 6. Component Architecture

### 6.1 Estructura
/components
/ui ← shadcn base components
/shared ← wrappers personalizados
/layout
/sections

text

### 6.2 Regla de Uso

- Usar primero shadcn.
- Si requiere personalización repetida → crear wrapper en `/shared`.
- No modificar directamente múltiples veces el mismo componente base.

## 7. Glassmorphism Guidelines

Permitido solo en:

- Hero mockups
- Cards destacadas
- Modales especiales

**Propiedades estándar:**

- `bg-white/5`
- `backdrop-blur-xl`
- `border-white/10`
- `shadow-soft`
- `rounded-xl`

No abusar del efecto.

## 8. Animaciones

### 8.1 Principios

- Sutiles
- Rápidas
- No repetitivas
- Con propósito

### 8.2 Hover

Permitido:

- `translate-y-1` o `-2`
- `scale 1.02–1.05`
- shadow intensificado

### 8.3 Scroll Animations

Preferido:

- fade-in
- translateY
- Duración 0.5s–0.8s

Evitar animaciones exageradas.

## 9. Hero Section Standards

- **Fondo** → Degradado oscuro sutil.
- **Título** → Grande, dominante, máximo contraste.
- **Mockup** → Glassmorphism + Flotación sutil + Sombra suave.

## 10. Espaciado

Usar sistema consistente basado en Tailwind:

- **Secciones**: `py-20`
- **Espacio interno cards**: `p-6` o `p-8`
- **Gap grids**: `gap-8`

No usar valores arbitrarios.

## 11. Sombras

Sombras suaves, profundas, modernas.
Definidas en `tailwind.config`:

- `shadow-soft`

No usar sombras por defecto sin intención.

## 12. Accesibilidad

- Contraste mínimo WCAG AA
- Botones con estados focus visibles
- No depender solo de color para comunicar estado

## 13. Responsive Behavior

- Mobile-first
- Nunca diseñar solo para desktop
- Verificar:
  - Padding adecuado
  - Text wrapping correcto
  - No overflow horizontal

## 14. Código Limpio

Cada componente debe:

- Tener responsabilidad única
- No mezclar lógica compleja con UI
- Ser reutilizable

## 15. Restricciones para IA (OpenCode)

La IA debe:

- Usar exclusivamente shadcn
- No inventar nuevos colores
- No usar hex directos
- No crear variantes inconsistentes
- Seguir este documento como fuente única de diseño

Cualquier implementación que viole este documento debe considerarse incorrecta.

## 16. Versión

**Design System Version:** 1.0
**Last Updated:** [Fecha de actualización manual]
**Maintainer:** Frontend Architecture
````
