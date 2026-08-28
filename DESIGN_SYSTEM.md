# Lokka — Design System & Règles de Conception

> Ce document est la **référence absolue** pour toutes les pages du projet Lokka.
> Chaque composant, chaque page, chaque décision visuelle doit s'y conformer.

---

## 1. Philosophie

**Quiet luxury + property management + financial control + modern SaaS.**

L'interface doit évoquer un produit de **wealth-management premium** — calme, intelligent, digne de confiance, coûteux — jamais tape-à-l'œil.

### Inspirations
- Soft editorial SaaS (Linear, Mercury, Ramp)
- Wealth-management premium (Wealthsimple, Carta)
- Minimalisme architectural (lignes structurelles épurées)
- Layout éditorial suisse (grille forte, hiérarchie typographique)

### Ce qu'on fait
- Whitespace généreux
- Surfaces off-white chaleureuses
- Bordures très subtiles
- Ombres minimales
- Typographie élégante
- UI produit raffinée

### Ce qu'on NE fait PAS
- Cards trop arrondies (max `8px`, exception `12px` pour containers)
- Gradients forts
- Blobs colorés
- Ombres lourdes
- Glassmorphism
- Effets SaaS exagérés
- Le vert `#087F5B` sur de grandes surfaces

---

## 2. Palette de Couleurs

> **Source unique de vérité : `app/globals.css` (`@theme` + `:root`).**
> Les valeurs ci-dessous sont les vraies valeurs des tokens CSS, pas un idéal théorique.
> Les composants doivent utiliser les classes de tokens (`bg-bg-canvas`, `text-text-primary`...)
> et non des hex en dur (`bg-[#FAF9F6]`) — voir §12 "Dette technique" pour le plan de migration.

```
Surfaces (var --bg-*, clair)
├── bg-canvas            #FAF9F6    Fond principal (warm off-white)
├── bg-surface           #FFFFFF    Cards, surfaces élevées
├── bg-subtle            #F4F2EC    Alternance de sections, footer, badges
├── bg-muted             #EAE7DF    États hover/active discrets
└── bg-sidebar           #FFFFFF    Sidebar dashboard

Containers sombres (usage ponctuel, ex. dashboard preview landing)
├── surface-dark          #1C1C1C
└── surface-dark-subtle   #2A2A2A

Textes (WCAG AA/AAA vérifié sur fond blanc)
├── text-primary         #18181B    Titres, texte principal (contraste 14.2:1)
├── text-secondary       #52525B    Corps, descriptions (contraste 6.1:1)
└── text-muted           #71717A    Captions, labels, placeholders (contraste 4.6:1)

Bordures
├── border-subtle         #F0EDE6    Séparateurs très subtils
├── border-default         #E4E0D8    Bordures de cards, dividers
└── border-strong          #D1CBBF    Bordures interactives/focus

Accent marque (usage MINIMAL — jamais de grandes surfaces)
├── brand-primary        #18181B    CTA, liens actifs, sidebar item actif
├── brand-hover          #27272A    Hover sur brand-primary
└── brand-light           #F4F2EC    Fond de badges/sélection

Sémantique (statuts, usage minimal)
├── success               #16A34A    Confirmations, statuts positifs
├── warning               #D97706    Avertissements
├── danger                #DC2626    Erreurs, retards
└── info                  #2563EB    Informatif
```

### Note historique — accent vert `#087F5B`
Les premières itérations du design prévoyaient un vert `#087F5B` comme accent de marque
(badges, dots de statut, liens). Le thème réel en prod utilise `success` (`#16A34A`) à la
place pour ce rôle, et le noir (`brand-primary`) comme accent principal. Ne pas réintroduire
`#087F5B` dans du nouveau code — utiliser `success` pour les statuts positifs et `brand-primary`
pour les accents de marque.

### Dark mode
Le thème sombre existe déjà et est piloté par la classe `.dark` sur `<html>`/`<body>` — toutes
les variables `--bg-*`, `--text-*`, `--border-*` ont un équivalent dans le bloc `.dark { }` de
`globals.css`. Un nouveau composant qui utilise les classes de tokens (pas des hex en dur)
supporte le dark mode automatiquement, sans code supplémentaire.

---

## 3. Typographie

### Polices
- **Instrument Serif** — Headings éditoriaux uniquement (H1, H2, chiffres de stats)
- **Inter** — Tout le reste (corps, nav, boutons, labels, inputs)

### Échelle typographique

| Élément | Police | Poids | Taille | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| H1 (Hero) | Instrument Serif | 400 | `clamp(40px, 5vw, 64px)` | 1.1 | -0.02em |
| H2 (Sections) | Instrument Serif | 400 | `clamp(32px, 3.5vw, 44px)` | 1.18 | -0.02em |
| H3 (Cards) | Inter | 600 | 20px | 1.3 | -0.01em |
| Body | Inter | 400 | 16-17px | 1.65 | 0 |
| Body small | Inter | 400 | 14px | 1.6 | 0 |
| Caption | Inter | 500 | 12px | 1.33 | 0.04-0.06em, uppercase |
| Nav links | Inter | 500 | 14px | — | 0.01em |
| Boutons | Inter | 500 | 14px | — | 0 |

### Mots en italique
Le dernier mot clé du H1 héro est en **Instrument Serif italic** pour l'accent éditorial.
Ex: "Gérez votre patrimoine locatif. *Sereinement.*"

---

## 4. Espacement & Layout

| Propriété | Valeur |
|---|---|
| Padding vertical de section | `120px` (desktop), `80px` (mobile) |
| Padding horizontal | `24px` (desktop), `20px` (mobile) |
| Max-width contenu | `1200px` centré |
| Gap grille standard | `24px` |
| Gap grille large | `32px` |
| Margin section-label → heading | `16px` |
| Margin heading → contenu | `56-64px` |

---

## 5. Composants

### Cards
- Background : `#FFFFFF`
- Border : `1px solid #E8E5E0`
- Border-radius : **`8px`** (max `12px` pour grands containers)
- Padding : `32px`
- Shadow repos : `0 1px 2px rgba(0,0,0,0.04)` — presque invisible
- Shadow hover : `0 2px 8px rgba(0,0,0,0.06)` — très subtil
- Transition : `0.25s ease`

### Boutons
> Mis à jour : les boutons réels du site ne sont **pas en pill** (`100px`) — c'est un carré
> arrondi doux, cohérent avec les cards. Ne pas repasser en pill sans changer tout le site.
- **Primary** : fond `brand-primary` (#18181B), texte blanc, `border-radius: 6px`, padding `12px 20-24px`
- **Secondary** : transparent, border `1px solid border-default`, `border-radius: 8px`
- **Hover primary** : fond `brand-hover` (#27272A), transition `0.2s`
- Font : Inter 500/600, 13-14px
- Jamais de bouton vert plein — le vert (`success`) est un accent de statut, pas un CTA

### Inputs
- Border : `1px solid #E8E5E0`
- Border-radius : `8px`
- Padding : `12px 16px`
- Focus : border `#1C1C1C`, shadow `0 0 0 3px rgba(28,28,28,0.04)`
- Placeholder : `#9C9A95`

### Email Capture (pill inline)
- Container : white, border `#E8E5E0`, `border-radius: 100px`, padding `4px 4px 4px 20px`
- Input sans bordure à l'intérieur
- Bouton dark pill à droite

### Badges
- Background : `#E6F5EF`
- Border : `1px solid rgba(8,127,91,0.12)`
- Border-radius : `100px`
- Texte : `#087F5B`, Inter 500, 13px
- Dot pulsant `6px` devant

### Section Labels
- `12px`, Inter 500, `letter-spacing: 0.06em`, `text-transform: uppercase`
- Couleur : `#087F5B` (accent)
- Toujours au-dessus du heading de section

### Dividers
- Horizontaux : `1px solid #E8E5E0`
- Verticaux (stats) : `1px` width, `48px` height, `#E8E5E0`

---

## 6. Animations (Framer Motion)

> Mis à jour : le code utilise réellement **framer-motion** (`motion.div`, `initial`/`animate`/
> `transition`), pas GSAP. GSAP reste une dépendance possible pour des cas avancés (scroll-scrub
> complexe) mais n'est pas le standard actuel — ne pas mélanger les deux dans un même composant.

### Principes
- **Subtiles et mesurées** — jamais bouncy, jamais overshoot
- Easing standard : `[0.16, 1, 0.3, 1]` (ease-out doux, signature du site)
- Durée : 0.5s à 0.8s max
- Stagger : delay manuel de 0.1s à 0.15s entre éléments (via `transition.delay`)
- Toujours combiné à un `initial={{ opacity: 0, y: ... }}` → `animate={{ opacity: 1, y: 0 }}`

### Catalogue

| Élément | Animation | Durée | Delay |
|---|---|---|---|
| Hero badge | Fade up | 0.5s | 0 |
| Hero titre (H1) | Fade up | 0.7s | 0.1s |
| Hero sous-titre | Fade up | 0.6s | 0.25s |
| Hero form CTA | Fade up | 0.6s | 0.4s |
| Hero preuve sociale | Fade up | 0.5s | 0.55s |
| Headings de section / cards au scroll | Fade up | 0.6-0.7s | stagger 0.1s |

### Pattern Framer Motion standard
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
  ...
</motion.div>
```
Pour les animations déclenchées au scroll (hors Hero), utiliser `whileInView` au lieu de
`animate`, avec `viewport={{ once: true, margin: "-100px" }}` pour ne jouer qu'une fois.

---

## 7. Backgrounds

### Grille architecturale (Hero)
- SVG avec 2 patterns imbriqués
- Petit grid : `60×60`, stroke `0.4px`, opacity `0.04`
- Grand grid : `300×300`, stroke `0.6px`, opacity `0.06`
- Dots aux intersections du grand grid, `r=1.5`, opacity `0.06`
- Évoque plans d'architecte, portfolios immobiliers
- **Ne doit jamais être visible au premier regard** — seulement si on regarde attentivement

### Alternance de sections
- `surface-primary` (#FAF9F6) → `surface-tertiary` (#F3F1ED) → `surface-primary`...
- Transition naturelle, pas de changement brutal

---

## 8. Icônes

- Librairie : **Heroicons** (`@heroicons/react`)
- Style : **Outline** (24px, strokeWidth 1.5)
- Couleur par défaut : `#9C9A95` (text-tertiary)
- Pas d'icônes dans des cercles noirs — ce n'est pas notre style
- Les icônes sont un signal, pas une décoration

---

## 9. Responsive

| Breakpoint | Grille | Section padding | Font scale |
|---|---|---|---|
| Desktop (>1024px) | 3-4 cols | 120px vertical | 100% |
| Tablette (769-1024px) | 2 cols | 100px vertical | 90% |
| Mobile (<768px) | 1 col | 80px vertical | clamp() auto |

### Règles mobile
- Email capture → empilée verticalement, `border-radius: 12px`
- Stats → colonne verticale, dividers horizontaux
- Footer → 2 cols puis 1 col
- Navbar → hamburger menu

---

## 10. Structure des Fichiers

```
lokka/
├── app/
│   ├── globals.css                     ← Design system
│   ├── layout.tsx                      ← Root layout (fonts, meta)
│   ├── page.tsx                        ← Landing page
│   ├── auth/login/page.tsx             ← À construire
│   ├── auth/register/page.tsx          ← À construire
│   ├── onboarding/page.tsx             ← À construire
│   └── dashboard/
│       ├── layout.tsx                  ← Sidebar layout
│       ├── page.tsx                    ← Dashboard principal
│       ├── biens/page.tsx              ← Liste des biens
│       ├── biens/[id]/page.tsx         ← Détail bien
│       ├── biens/nouveau/page.tsx      ← Ajout bien
│       ├── locataires/page.tsx         ← Liste locataires
│       ├── locataires/[id]/page.tsx    ← Détail locataire
│       ├── loyers/page.tsx             ← Suivi loyers
│       ├── comptabilite/page.tsx       ← Comptabilité
│       ├── maintenance/page.tsx        ← Maintenance
│       ├── messagerie/page.tsx         ← Messagerie
│       ├── documents/page.tsx          ← Documents
│       ├── annonces/page.tsx           ← Annonces
│       └── parametres/page.tsx         ← Paramètres
├── components/
│   ├── landing/                        ← Composants landing (fait ✓)
│   ├── onboarding/                     ← Composants onboarding
│   ├── dashboard/                      ← Composants dashboard
│   └── ui/                             ← Composants réutilisables
└── public/
```

---

## 11. Stack Technique

| Outil | Rôle |
|---|---|
| Next.js 16 + TypeScript | Framework |
| Tailwind CSS v4 | Utilities CSS |
| GSAP + ScrollTrigger | Animations |
| @heroicons/react | Icônes |
| Instrument Serif (Google Fonts) | Headings éditoriaux |
| Inter (Google Fonts) | Texte corps |
| recharts (installé) | Graphiques dashboard |
| lucide-react (installé) | Icônes secondaires si besoin |

---

## 12. Pages Restantes — Direction

### Auth (Login / Register)
- Centré, minimal, fond `surface-primary`
- Card unique `surface-secondary`, `border-radius: 8px`
- Logo en haut, titre Instrument Serif, inputs Inter
- Lien entre login ↔ register en bas

### Onboarding (5 étapes)
- Stepper horizontal avec dots numérotés
- Dot active : `#1C1C1C`, completed : `#087F5B`, pending : `#F3F1ED`
- Lignes entre dots : `2px`, solid
- Contenu centré, transitions GSAP entre étapes
- Cards de sélection (type de profil) : bordure accent au click

### Dashboard Layout
- **Sidebar gauche** : `260px` wide, fond `#FFFFFF`, border-right `#E8E5E0`
  - Logo en haut
  - Nav links avec icônes Heroicons outline + labels Inter 14px
  - Link actif : fond `#1C1C1C`, texte blanc, `border-radius: 10px`
  - Avatar utilisateur en bas
- **Zone principale** : fond `#FAF9F6`, padding `32px`
- **Header** : recherche + notifications + profil

### Dashboard Widgets
- Cards `surface-secondary`, `border: 1px solid border-primary`, `border-radius: 8px`
- Chiffres larges Inter 600 ou Instrument Serif
- Changements positifs en `#087F5B`, négatifs en `#C92A2A`
- Graphiques : recharts, couleurs douces, pas de grille lourde

### Tables (Biens, Locataires, Loyers)
- Header : fond `surface-tertiary`, texte `text-tertiary`, caption uppercase
- Rows : bordure bottom `border-secondary`, hover fond `surface-tertiary`
- Pas de zebra striping agressif

---

---

## 13. Dette technique — Tokens en dur

Beaucoup de composants existants (`Hero.tsx`, `CTA.tsx`, `Features.tsx`...) utilisent des
valeurs hex en dur (`bg-[#FAF9F6]`, `text-[#1C1C1C]`) au lieu des classes de tokens
(`bg-bg-canvas`, `text-text-primary`). Ça fonctionne visuellement — `globals.css` contient des
règles `.dark .bg-\[\#FAF9F6\]` qui interceptent ces valeurs pour le dark mode — mais c'est
fragile : toute nouvelle couleur en dur qui n'a pas son override `.dark` explicite cassera le
thème sombre silencieusement.

**Règle pour tout nouveau code** : toujours utiliser les classes de tokens, jamais de hex en dur.
**Pour le code existant** : migration progressive, pas de refonte d'un coup — à chaque fois qu'on
touche un composant pour une autre raison, on en profite pour remplacer ses hex en dur par les
tokens correspondants.

---

*Ce document est la source de vérité. Toute page future doit s'y conformer.*
