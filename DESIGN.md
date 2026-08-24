---
name: Lokka
description: A consumer-focused SaaS offering that simplifies complex tasks.
colors:
  primary: "#1C1C1C"
  secondary: "#087F5B"
  tertiary: "#C92A2A"
  neutral-bg: "#FAF9F6"
  surface-secondary: "#FFFFFF"
  surface-tertiary: "#F3F1ED"
  surface-dark: "#1C1C1C"
  border-primary: "#E8E5E0"
  text-primary: "#1C1C1C"
  text-secondary: "#64635F"
  text-tertiary: "#9C9A95"
  accent-light: "#F5F5DC"
  warning: "#E67700"
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
    textColor: "{colors.surface-secondary}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.surface-secondary}"
    rounded: "{rounded.md}"
---

# Design System: Lokka

## Overview

**Creative North Star: "Refined Consumer Focus"**

Lokka is a consumer-facing SaaS that blends utility with elegance. The system uses a predominantly light, architectural grid aesthetic with stark black accents for focus and clarity. The design relies on precise spacing, refined borders, and a sophisticated serif display face to elevate common workflows out of typical SaaS utility and into a premium consumer experience.

**Key Characteristics:**
- High-contrast primary interactions against warm, neutral backgrounds
- Distinctive serif display paired with a clean, functional sans-serif body
- Flat-by-default surfaces with subtle hover states over deep shadows
- Architectural precision in grid lines and section dividers

## Colors

The palette is restrained, leaning on warm paper tones and deep blacks, with green and red reserved strictly for semantic feedback.

### Primary
- **Deep Black** (#1C1C1C): Used for primary text, primary buttons, and dark surface containers.
- **Warm Paper** (#FAF9F6): The primary background color, providing a soft, non-stark canvas.
- **Pure White** (#FFFFFF): Used for elevated surfaces like cards and the sidebar.

### Secondary
- **Subtle Beige** (#F3F1ED): Used for tertiary surfaces and sidebar accents.
- **Crisp Sand** (#F5F5DC): A light accent used for badges and subtle highlights.

### Neutral
- **Architectural Border** (#E8E5E0): Primary divider and border color.
- **Secondary Text** (#64635F): Used for body copy and supporting text.
- **Tertiary Text** (#9C9A95): Used for captions and placeholders.

### Semantic
- **Action Green** (#087F5B): Used strictly for success states or specific ring highlights.
- **Alert Red** (#C92A2A): Used for destructive actions or negative semantic states.

**The One Voice Rule.** The primary accent (Deep Black) commands attention. It should be used sparingly for primary actions and display headings. When everything is bold, nothing is.

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
