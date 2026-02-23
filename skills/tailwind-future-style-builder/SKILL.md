---
name: tailwind-future-style-builder
description: "Generar landing pages o componentes en React/Next.js (JSX) o HTML con estetica futurista 2026 usando exclusivamente Tailwind CSS. Usar cuando el usuario pida uno de estos estilos: Spatial UI, Sentient UX, Liquid Glass, Zero UI o Kinetic Typography, o cuando solicite una variante visual futurista con codigo completo listo para usar."
---

# Tailwind Future Style Builder

## Objetivo

Convertir una solicitud visual en una landing page o componente completo, responsive y funcional, usando solo utilidades de Tailwind CSS.

## Flujo de trabajo

1. Detectar estilo solicitado entre: `Spatial UI`, `Sentient UX`, `Liquid Glass`, `Zero UI`, `Kinetic Typography`.
2. Si no hay estilo explicito, pedir una eleccion concreta antes de generar codigo.
3. Detectar tipo de entrega:
   - `landing page` completa
   - `componente` aislado
4. Si no se especifica tipo, generar `landing page` por defecto.
5. Generar estructura completa en `JSX` (por defecto para React/Next.js) o `HTML` si el usuario lo pide explicitamente.
6. Agregar `tailwind.config.js` solo cuando haga falta para colores o animaciones personalizadas.

## Reglas globales de implementacion

- Usar exclusivamente Tailwind CSS en `className`/`class`.
- No usar CSS externo, CSS Modules, styled-components ni bloques `<style>`.
- Mantener compatibilidad responsive (`sm`, `md`, `lg`) para movil y desktop.
- Incluir jerarquia visual clara, CTA principal y estados interactivos visibles.
- Mantener semantica base (`header`, `main`, `section`, `button`, `a`) y foco accesible.
- Entregar codigo autocontenible listo para pegar.

## Reglas por estilo

### Spatial UI

- Usar profundidad con `backdrop-blur-xl`.
- Aplicar bordes transluidos como `border border-white/20`.
- Aplicar sombras profundas y por capas.
- Crear sensacion de espacio con capas (`relative`, `absolute`, `z-10`, `z-20`, etc.).

### Sentient UX

- Mantener layout limpio y legible.
- Marcar estados de foco con contraste alto (`focus-visible:ring-*`, `focus-visible:outline-none`).
- Aplicar gradientes suaves que cambien en `hover:`.
- Incluir micro-interacciones (`transition`, `duration-*`, `hover:-translate-y-*`, `hover:scale-*`).

### Liquid Glass

- Construir fondo con mesh gradients (varios gradientes superpuestos con `absolute` y `blur-*`).
- Usar superficies tipo vidrio con `bg-white/10`.
- Aplicar glow con `shadow-[0_0_20px_rgba(255,255,255,0.3)]`.
- Mantener contraste suficiente para texto y acciones.

### Zero UI

- Aplicar minimalismo extremo y eliminar ruido visual.
- Usar tipografia dominante (`text-7xl` o superior cuando corresponda).
- Reservar gran espacio negativo (`py-32`, `gap-16`, `max-w-*` contenido).
- Mantener navegacion oculta/minima; priorizar gesto o accion unica.

### Kinetic Typography

- Usar tipografias sans-serif pesadas (`font-black`).
- Priorizar el texto como elemento grafico principal.
- Aplicar animaciones de Tailwind (`animate-pulse`) o animaciones personalizadas via `tailwind.config.js`.
- Permitir desborde controlado del texto con `break-all` cuando aporte estilo.

## Formato de salida obligatorio

Entregar siempre en este orden:

1. `JSX/HTML completo` en bloque de codigo.
2. `tailwind.config.js` (solo si se requiere). Si no se requiere, indicar explicitamente que no hace falta.
3. Explicacion breve (2-4 lineas) justificando tipografia y paleta de color.

## Checklist previo a responder

- Verificar que el codigo refleje el estilo elegido sin mezclar patrones incompatibles.
- Verificar que la salida sea utilizable directamente en React/Next.js o HTML puro, segun solicitud.
- Verificar que todas las decisiones visuales esten implementadas con clases Tailwind.
