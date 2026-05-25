## Aeterna Mobility — 3D Wheelchair Configurator

A single-page, conversion-focused configurator in the Soft Minimal Editorial direction (warm cream background, Playfair Display + Inter + JetBrains Mono, sage-green accent).

### Pages & routes
- `/` — landing + configurator (single scroll with anchor nav to `#configurator`)
- `/__root.tsx` — shared shell, head meta, fonts, Framer Motion provider

### Sections (in order)
1. **Sticky nav** — AETERNA wordmark, Design / Performance / Find a Dealer, Configure CTA
2. **Hero** — Playfair headline "Precision in Every Motion", subcopy, sage CTA, large overhead product image
3. **Intro** — short editorial paragraph + 3 supporting stat/value blocks (weight, materials, craft)
4. **Configurator** — split layout: left scrolling step controls, right sticky live preview
   - Step 01 Frame finish (4 color swatches)
   - Step 02 Frame geometry (rigid / folding)
   - Step 03 Wheels (radio cards w/ prices)
   - Step 04 Handrims (select)
   - Step 05 Backrest (options)
   - Step 06 Footrest (options)
   - Step 07 Accessories (multi-select chips)
   - Running price + "Request Build Quote" CTA at bottom of column
   - Right panel: layered images that cross-fade per selection; small step indicator dots
5. **Summary** — clean spec sheet of current build (read-only mirror)
6. **Lead capture** — name, email, user/dealer select, optional notes, submit
7. **Footer** — wordmark, ISO 13485 / Clinical Excellence / Privacy, copyright

### Technical

- **Stack**: TanStack Start (existing), Tailwind v4 tokens in `src/styles.css`, `framer-motion` for transitions.
- **Tokens** (copied verbatim from selected direction into `src/styles.css`):
  - background `hsl(45 20% 96%)`, foreground `hsl(200 15% 15%)`, muted `hsl(200 10% 40%)`, accent `hsl(155 12% 42%)`, border `hsl(200 15% 15% / 0.1)`
  - fonts: Playfair Display (display), Inter (sans), JetBrains Mono (mono) via Google Fonts in `__root.tsx` head
  - ease: `cubic-bezier(0.16, 1, 0.3, 1)`
- **State**: single `useConfigurator` hook (React state) holding `{ frame, wheels, handrims, backrest, footrest, accessories[] }` + derived `price`. Lifted in `routes/index.tsx`, passed to step components and preview.
- **Preview**: stack of generated product images (one per frame color) absolutely positioned; the active one fades in via `framer-motion` `AnimatePresence`. Wheels/accessories shown as small overlay badges on the preview.
- **Motion**: `motion.section` fade-up on scroll-in (viewport once), hover lift on option cards (`whileHover y:-2`), 300–400ms expo easing. No parallax, no flashy effects.
- **Images** (generated via `imagegen`, saved to `src/assets/`):
  - hero overhead shot (1600×900)
  - 4 side-profile shots, one per frame finish (1400×1050)
  - small detail thumbnails for wheels/handrims options (optional, 400×400)
- **Form**: client-side Zod validation; submit currently shows a success state (no backend — Lovable Cloud not enabled). Note this to user; offer to wire it up next.
- **Files**:
  - `src/routes/__root.tsx` — add fonts, update meta (title "Aeterna — Bespoke Mobility", description, og)
  - `src/routes/index.tsx` — page composition
  - `src/components/site/Nav.tsx`, `Hero.tsx`, `Intro.tsx`, `Configurator.tsx`, `StepFrame.tsx`, `StepWheels.tsx`, `StepHandrims.tsx`, `StepBackrest.tsx`, `StepFootrest.tsx`, `StepAccessories.tsx`, `PreviewPanel.tsx`, `Summary.tsx`, `LeadForm.tsx`, `Footer.tsx`
  - `src/lib/configurator.ts` — types, option catalogs, price calc, `useConfigurator`
  - `src/styles.css` — add design tokens
- **Deps**: `bun add framer-motion zod` (zod already likely present; check)

### SEO
Single H1 in hero; route head() sets title <60 chars, description <160, og:title/description/image (hero image).

### Out of scope (call out to user after build)
- True 3D/WebGL rotation — using high-quality layered images for the "live preview" instead (per scope guardrails). Can upgrade to real 3D later.
- Backend submission — needs Lovable Cloud to persist quotes / send email.
