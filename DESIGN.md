---
name: Lokka
description: Modern real estate & property management SaaS with Tropical Palm Emerald & Sage aesthetic.
colors:
  primary: "#059669"
  secondary: "#0F172A"
  tertiary: "#E11D48"
  neutral-bg: "#F4F9F6"
  surface-secondary: "#FFFFFF"
  surface-tertiary: "#ECFDF5"
  surface-dark: "#0A1310"
  border-primary: "#E2ECE6"
  text-primary: "#0F172A"
  text-secondary: "#5E6B65"
  text-tertiary: "#94A3B8"
  accent-light: "#ECFDF5"
  success: "#059669"
  warning: "#F59E0B"
typography:
  display:
    fontFamily: "'Instrument Serif', 'Georgia', serif"
    fontWeight: 400
  body:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.surface-secondary}"
    rounded: "{rounded.md}"
---

# Design System: Lokka (Variante 3: Émeraude Tropicale & Sauge)

## Overview

**Creative North Star: "Vitalité Immobilière & Rente Active"**

Lokka adopte une identité alliant la fraîcheur côtière ouest-africaine à la précision financière. Le système s'articule autour d'une base minérale ivoire-menthe (`#F4F9F6`), rehaussée de surfaces blanches aux bordures architecturales légères (`#E2ECE6`) et d'un vert Émeraude Forêt dense (`#059669`) pour commander les actions maîtresses et valoriser la croissance des rendements locatifs.

**Caractéristiques clés :**
- Fond minéral doux anti-éblouissement (`#F4F9F6`)
- Boutons d'action et éléments clés en Émeraude dense (`#059669` / `#047857`)
- Badges et pastilles d'encaissement en Sauge & Menthe douce (`#ECFDF5`)
- Typographie ardoise noble (`#0F172A`) assurant un contraste WCAG AAA irréprochable
- Dark mode immersif en Nuit Végétale (`#0A1310` & `#121F1B`)

## Colors

### Primary & Accents
- **Émeraude Forêt** (#059669): Couleur maîtresse pour les boutons d'action, le bouton actif de sidebar, les KPI clés et les flux positifs.
- **Ivoire Menthe** (#F4F9F6): Canvas doux et moderne apportant de la respiration.
- **Sauge & Menthe Claire** (#ECFDF5): Surfaces secondaires et badges de statut.
- **Blanc Pur** (#FFFFFF): Cartes, tableaux et conteneurs de données.
- **Ardoise Sombre** (#0F172A): Typographie principale.

## Typography

**Display Font:** Instrument Serif (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui fallback)

**Character:** A sophisticated tension. The elegant, high-contrast serif display font gives the product a premium, editorial feel, while the highly legible sans-serif body font ensures complex SaaS workflows remain effortless to read.

### Hierarchy
- **Display** (400, clamp(40px, 5vw, 64px), 1.1): Used for hero headlines and major section titles.
- **Headline** (400, clamp(32px, 3.5vw, 44px), 1.18): Used for sub-sections.
- **Title** (600, 20px): Used for card titles and component headers (sans-serif).
- **Body** (400, 17px, 1.65): Primary reading text.
- **Label / Caption** (500, 12px, 0.04em, uppercase): Used for overlines, section markers, and badges.

## Layout

The layout uses an architectural grid approach, with maximum widths (1200px) and generous section padding (120px 24px default, 80px 24px on mobile). Spacing relies on clear rhythm, often separated by visible 1px border dividers (`.stat-divider`) rather than just whitespace, enforcing a structured, blueprint-like feel.

## Elevation & Depth

The system is predominantly flat. Depth is created through layering shapes and borders rather than ambient shadows, except for specific interactive highlights.

### Shadow Vocabulary
- **Card Hover:** Subtle lift (`0 2px 8px rgba(0, 0, 0, 0.06)`).
- **Dark Surface Pop:** Deep drop shadow (`0 24px 48px rgba(0, 0, 0, 0.12)`) used for the main dashboard preview to separate it from the paper background.

**The Flat-By-Default Rule.** Surfaces are flat at rest, defined by 1px borders. Shadows appear only as a response to state (hover) or to elevate a single, critical hero element above the page.

## Shapes

Shapes are strictly geometric with tight, refined corner radii.
- Interactive elements (buttons, inputs, badges): **6px radius**.
- Structural elements (cards, preview containers, email captures): **8px radius**.
The difference is subtle but intentional, keeping controls feeling tactile and containers feeling architectural.

## Components

### Buttons
- **Shape:** 6px radius.
- **Primary:** Deep Black (#1C1C1C) background, White text.
- **Secondary:** Transparent background, Deep Black text, 1px Architectural Border.
- **Hover:** Primary dims to #333 with a slight `-1px` lift; Secondary gains a subtle dark gray background tint (`rgba(28,28,28,0.03)`).

### Inputs / Fields
- **Style:** 6px radius, Pure White background, Architectural Border.
- **Focus:** Border deepens to Primary Black with a subtle 3px focus ring (`rgba(28,28,28,0.04)`).

### Cards
- **Corner Style:** 8px radius.
- **Background:** Pure White.
- **Border:** 1px Architectural Border.
- **Hover:** Slight shadow lift (`0 2px 8px rgba(0,0,0,0.06)`).

### Badges
- **Style:** 6px radius, Crisp Sand background, green-tinted border (`rgba(8,127,91,0.12)`). Includes a pulsing dot animation.

## Do's and Don'ts

### Do:
- **Do** use the architectural grid and 1px dividers to structure content.
- **Do** stick to the 6px radius for interactive elements and 8px for containers.
- **Do** lean heavily on the Warm Paper background to keep the interface feeling premium and approachable.

### Don't:
- **Don't** use large, diffuse shadows on standard cards at rest.
- **Don't** mix the serif display font into body copy or small UI labels.
