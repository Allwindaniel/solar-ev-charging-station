---
name: Solar Highway Technical Spec
colors:
  surface: '#f8f9ff'
  surface-dim: '#d8dae1'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fa'
  surface-container: '#ecedf5'
  surface-container-high: '#e6e8ef'
  surface-container-highest: '#e1e2e9'
  on-surface: '#191c21'
  on-surface-variant: '#514534'
  inverse-surface: '#2e3036'
  inverse-on-surface: '#eff0f8'
  outline: '#837561'
  outline-variant: '#d6c4ad'
  surface-tint: '#7f5700'
  primary: '#7f5700'
  on-primary: '#ffffff'
  primary-container: '#e8a317'
  on-primary-container: '#5b3d00'
  inverse-primary: '#ffba3e'
  secondary: '#006a60'
  on-secondary: '#ffffff'
  secondary-container: '#8cf1e2'
  on-secondary-container: '#006f64'
  tertiary: '#0358cb'
  on-tertiary: '#ffffff'
  tertiary-container: '#8eafff'
  on-tertiary-container: '#003e95'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdeae'
  primary-fixed-dim: '#ffba3e'
  on-primary-fixed: '#281900'
  on-primary-fixed-variant: '#604100'
  secondary-fixed: '#8ff4e4'
  secondary-fixed-dim: '#72d8c9'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#b0c6ff'
  on-tertiary-fixed: '#001945'
  on-tertiary-fixed-variant: '#00429c'
  background: '#f8f9ff'
  on-background: '#191c21'
  surface-variant: '#e1e2e9'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  code-metric-lg:
    fontFamily: IBM Plex Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  code-metric-md:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  code-spec-sm:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves an engineering explainer and technical datasheet platform for solar-powered electric vehicle charging infrastructure deployed across national highway corridors in India. The audience comprises infrastructure planners, civil engineers, automotive technologists, and procurement authorities. 

The aesthetic is governed by **technical precision and pragmatic minimalism**. It adopts the visual language of structural blueprints, physical engineering schematics, and rigorous technical datasheets rather than commercial marketing or consumer SaaS. 

Key attributes:
- **Calm, deliberate utility:** Zero decorative gradients, no volumetric skeuomorphism, and no neon glows.
- **Architectural drafting discipline:** Explicit spatial demarcation with hairline boundaries, high informational density balanced by disciplined negative space, and clear system topology.
- **Instrument-grade clarity:** Information hierarchy prioritizes immediate legible parsing of telemetry, stage flows, electrical metrics, and hardware tolerances under varying ambient light conditions.

## Colors

The palette reproduces the tactile quality of drafting vellum, technical ink, and standards-compliant schematic color-coding.

### Canvas & Architecture
- **Canvas Base (`#F7F5F0`):** Warm, low-fatigue off-white simulating uncoated drafting stock.
- **Surface Cards (`#FFFFFF`):** High-opacity pure white for content modules, telemetry cards, and diagram callouts.
- **Grid Accent (`#EDEAE1`):** Subdued hairline structural guides for 24px and 48px schematic backgrounds.
- **Hairline Border (`#E2DED5`):** Monolithic 1px boundary value used across all structural dividers, component strokes, and containment frames.

### Content & Type
- **Primary Ink (`#15181D`):** Deep carbon black for maximum contrast and high legibility.
- **Secondary Ink (`#59616D`):** Neutral slate for metadata, supporting labels, engineering units, and secondary notes.

### System Stage Spectrum
Stage colors indicate topological progression through the highway charging architecture:
- **Generation (`#E8A317`):** Solar Amber. Primary anchor. Photovoltaic inputs, bifacial arrays, irradiance telemetry.
- **Conversion & Storage (`#0F8B7E`):** Electric Teal. Secondary anchor. Inverters, BESS racks, charge controllers.
- **Distribution & Delivery (`#2D6CDF`):** High-tension blue. Tertiary. CMS controllers, CCS2/CHAdeMO dispensers, dynamic load balancing.
- **Protection & Operations (`#6E56CF`):** Auxiliary violet. SCADA, earthing grids, breaker matrices, thermal trip units.
- **Foundation & Civil (`#8A7B6A`):** Auxiliary warm earth. Plinths, canopy substructures, geotechnical tolerances, drainage.

## Typography

The typographic hierarchy enforces clear functional boundaries across three specialized type families:

1. **Headings (`Space Grotesk`):** Engineered geometric grotesque displaying structural authority. Used for titles, section headings, and diagram callout anchors. Kerning is pulled slightly tight for a compact, technical look.
2. **Body Prose (`Inter`):** Systematic neutral sans-serif designed for high legibility in dense explanatory text, engineering justifications, and compliance summaries.
3. **Data, Metrics & Identifiers (`IBM Plex Mono`):** Fixed-width type system used strictly for values, units (kW, kWh, V, Hz, mm), stage numbering (ST-01), equipment tags, highway milestone markers, and JSON/BOM technical listings. Tabular figures must remain enabled across all numeric output.

## Layout & Spacing

The layout is anchored to a strict **12-column grid system** on desktop (max width `1440px`), collapsing to a **6-column grid** on tablets (`768px - 1024px`) and a **4-column grid** on mobile (`< 768px`).

### Drafting Grid Background
The viewport features a faint mathematical background grid rendered in `#EDEAE1` at `24px` intervals, providing an explicit engineering blueprint context. Cards and panels snap directly to this coordinate system.

### Responsive Rhythms
- **Desktop (1024px+):** Outer canvas margin is `3rem` (`48px`), column gutter is `1.5rem` (`24px`). Technical schematics and tables can break into side-by-side comparative views (e.g., 8-column schematic panel alongside a 4-column data inspector).
- **Tablet (768px - 1023px):** Outer canvas margin adjusts to `2rem` (`32px`), column gutter remains `1rem` (`16px`). Two-column technical blocks flow linearly.
- **Mobile (< 768px):** Outer margin drops to `1rem` (`16px`), gutters tighten to `0.75rem` (`12px`). High-density data tables become horizontally scrollable cards; stage diagrams shift from horizontal step flows to vertical node tracks.

## Elevation & Depth

This system avoids shadow blurs, cast depths, and ambient elevation. Depth is communicated strictly through **tonal separation and crisp outline containment**:

- **No Dropshadows:** `box-shadow: none` is enforced across all default states. No diffused or colored glow effects are allowed on buttons, stages, or active terminals.
- **Hairline Framing:** All containers, metric blocks, and diagram boundaries utilize a uniform `1px solid #E2DED5` stroke.
- **Surface Stacking:** 
  - Ground layer: Canvas (`#F7F5F0`) with faint coordinate grid (`#EDEAE1`).
  - First tier: White panels (`#FFFFFF`) framed in hairline borders.
  - Second tier (Active / Hover / Selected): `#FFFFFF` panels accented with structural inset outlines or a left-side 3px stage indicator rule, accompanied by an extremely faint offset tint (`#F0EFE9`).

## Shapes

The geometric framework balances technical rigor with modern UI ergonomics using a unified radius rule:

- **Corner Radius Standard:** All primary cards, interactive buttons, inputs, data modules, and technical callout panels utilize an exact `10px` radius (conforming to `rounded-lg` / `0.625rem`).
- **Inner Nesting Alignment:** Sub-components nested inside a `10px` parent (e.g., segmented controls inside a card header) adopt a `6px` radius to maintain optical concentricity.
- **Pill Exceptions:** Pure rounded-full pills are strictly reserved for compact status tags, phase chips, and stage step indicator dots (e.g., `ST-01`).

## Components

### Buttons
- **Primary:** Solid `#15181D` background with `#FFFFFF` text (`Inter` medium, 14px), 10px corner radius, 10px vertical and 18px horizontal padding. Zero shadow. On hover, background shifts to `#59616D`.
- **Secondary / Technical:** Pure `#FFFFFF` background with 1px `#E2DED5` border, `#15181D` text. On hover, background shifts to `#F7F5F0`.
- **Stage Action:** Solid stage color (e.g., `#E8A317` for Generation or `#0F8B7E` for Conversion) with dark `#15181D` text for amber, or `#FFFFFF` text for darker tones. Crisp 1px border matching the stage color tone.

### Chips & Stage Badges
- Composed of an uppercase `IBM Plex Mono` label (11px) with `0.04em` tracking.
- Contained in a pill container with a 1px border matching the corresponding stage color at 30% opacity, paired with an 8% stage tint background.
- Prefixed with a solid 6px circular dot in the stage's primary hex value.

### Data Metric Cards
- Surface is `#FFFFFF` with a 1px `#E2DED5` perimeter and 10px radius.
- Internal padding is `1.25rem` (`20px`).
- Header displays category title (`Inter`, 12px, `#59616D`) alongside a stage ID tag (`IBM Plex Mono`).
- Central value uses `IBM Plex Mono` (24px, `#15181D`), followed immediately by inline unit text (`#59616D`, 14px).
- Bottom hairline divider isolates operational parameters or tolerance intervals.

### Form Inputs & Selectors
- Background `#FFFFFF`, 1px solid border `#E2DED5`, 10px radius.
- Height fixed at `42px` with `0.75rem` lateral padding.
- Text set in `Inter` (14px). Placeholder in `#59616D`.
- Focus state: Replaces border with a crisp 1.5px `#15181D` rule; strictly no halo, blur, or glow ring.

### Checkboxes & Toggle Controls
- Square with 3px border-radius, 16px × 16px dimension, 1.5px `#E2DED5` stroke.
- Checked state: `#15181D` fill with a pure white rectilinear check mark.
- Toggles: Segmented rectangular bars with hairline dividers rather than organic sliding pills.

### Technical Schematic Canvas / Stage Nodes
- Nodes represent physical infrastructure stages connected by 1px dashed or solid `#E2DED5` vector routes.
- Active nodes feature a 2px colored top border corresponding directly to that stage's assigned palette color.
- Pinpoints and sensor anchors display live telemetry readouts directly inside monospace badge callouts.