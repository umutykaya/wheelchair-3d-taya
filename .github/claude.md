# ROLE
You are a senior full-stack engineer and 3D web specialist with deep expertise in Three.js, React, TypeScript, accessibility (WCAG 2.1 AA), and medical-device UX. You write clean, modular, production-ready code.

---

# GOAL
Build a **premium 3D wheelchair configurator** as a single-page React + TypeScript application. It must feel trustworthy and calm — suitable for clinicians, occupational therapists, and end-customers who are comparing mobility products.

---

# TECH STACK
| Layer | Choice |
|---|---|
| UI framework | React 18 + TypeScript (strict mode, no `any`) |
| 3D engine | Three.js via `@react-three/fiber` + `@react-three/drei` |
| State | Zustand (flat, typed store) |
| Styling | Tailwind CSS v3 (dark mode via `class` strategy) |
| i18n | `react-i18next` with JSON locale files |
| Icons | `lucide-react` |
| Build | Vite |
| Tests | Vitest + React Testing Library |

---

# ARCHITECTURE RULES
- Separate **domain logic** (configuration rules, pricing, compatibility) from **UI** and **3D** layers.
- One responsibility per module. Never mix 3D logic with form/state logic.
- Shared types live in `src/types/`. Shared utilities in `src/utils/`.
- All AI/ML or external config values (model names, pricing tables) live in `src/config/`.
- Keep every component under ~150 lines. Extract sub-components early.
- Use composition, not inheritance.

---

# FEATURE SPECIFICATION

## 1 · 3D Viewport
- Render a realistic wheelchair model in a **clean studio environment**: soft grey gradient background, subtle floor reflection, no clutter.
- Lighting: one warm key light (directional), one cool fill light, one soft ambient. Use `THREE.PMREMGenerator` for environment reflections.
- Controls: `OrbitControls` with damping. Restrict polar angle to avoid ground-clipping (min: 5°, max: 85°). Enable zoom (min distance 0.8 m, max 3.5 m).
- **Guided camera angles**: when the user selects a configuration step, smoothly tween the camera (`gsap` or lerp in `useFrame`) to a preset `{ position, target }` that frames the relevant part (frame, wheels, seat, armrests, footrests, backrest, accessories).
- Material system: build a `MaterialFactory` utility that maps configuration keys → `THREE.MeshStandardMaterial` or `THREE.MeshPhysicalMaterial` with correct `roughness`, `metalness`, `color`, and optional `envMapIntensity`.

## 2 · Configuration Flow (Step-by-Step)
Steps (in order):
1. **Frame** — color (10 RAL-inspired swatches) + finish (matte / satin / gloss)
2. **Wheels** — style (spoke / mag / solid) + tire (black / grey / white)
3. **Upholstery** — seat & back fabric color (6 swatches) + material (mesh / vinyl / foam)
4. **Armrests** — style (full / desk / none) + height adjustment toggle
5. **Footrests** — style (swing-away / elevating / fixed) + color match toggle
6. **Backrest** — height (low / mid / high) + lumbar support toggle
7. **Accessories** — multi-select: headrest, anti-tip, cup holder, bag, side guards

Each step:
- Highlights the active step in the left sidebar.
- Triggers a guided camera tween to focus on that part.
- Updates the 3D model **instantly** (no loading spinner for material changes).
- Saves its value to the Zustand store.

## 3 · Compatibility Engine
Build a pure-function `checkCompatibility(config: WheelchairConfig): CompatibilityResult` in `src/domain/compatibility.ts`.

Rules to encode (examples — add more logical ones):
- `footrests: 'elevating'` + `armrests: 'none'` → warning: "Elevating footrests are recommended with armrests for stability."
- `backrest: 'high'` + `accessories: includes('headrest')` → info: "Great choice — high backrest pairs well with headrest."
- `wheels: 'solid'` + `frame_finish: 'gloss'` → incompatible: "Solid wheels are only available with matte or satin finish."

Display inline banners (warning / error / info) above the Next button. Block progression on `incompatible` errors.

## 4 · Summary Panel
Final step shows:
- Thumbnail snapshot of the configured chair (use `gl.domElement.toDataURL()`).
- Full option list with labels and values.
- **Dynamic pricing**: base price + per-option delta, formatted with `Intl.NumberFormat`.
- Two CTAs: **"Download PDF Summary"** (use `jsPDF` or `window.print()`) and **"Request a Quote"** (opens a modal with name / email / notes form; logs to console or POST to `/api/quote`).

## 5 · Internationalisation (i18n)
- Use `react-i18next`. Default locale: `en`. Add `de` and `fr` as secondary locales.
- All UI strings, option labels, compatibility messages, and aria-labels must come from translation JSON files (`public/locales/{lang}/translation.json`).
- Language switcher: a compact `<select>` or flag-button group in the top-right header.
- Support RTL-ready layout (use logical CSS properties: `inline-start`, `inline-end`).

## 6 · Dark Mode
- Tailwind `darkMode: 'class'` strategy.
- A toggle button (sun/moon icon from `lucide-react`) in the header saves preference to `localStorage` and sets `document.documentElement.classList`.
- Design tokens:
  - Light: background `#F8F9FA`, surface `#FFFFFF`, text `#1A1A2E`, accent `#2563EB`
  - Dark: background `#0F1117`, surface `#1E2130`, text `#E8EAF0`, accent `#3B82F6`
- The 3D scene background and fog color must also update when theme changes (listen to a `theme` value in Zustand, update `scene.background` and `scene.fog`).

---

# UX & ACCESSIBILITY REQUIREMENTS
- WCAG 2.1 AA minimum contrast on all text/background pairs.
- All interactive elements reachable and operable by keyboard.
- Every swatch/button has an `aria-label` describing its value.
- Step indicators have `aria-current="step"` on the active item.
- 3D canvas has `role="img"` and `aria-label` describing the current configuration.
- Focus ring visible at all times (never `outline: none` without a replacement).
- Minimum touch target: 44 × 44 px.
- Font size minimum 16 px for body copy; step labels 14 px minimum.
- Color swatches also show a text label below (never rely on color alone).

---

# PERFORMANCE RULES
- Lazy-load the Three.js scene with `React.lazy` + `Suspense` (show a branded skeleton).
- Use `useGLTF.preload()` or `BufferGeometryUtils` to keep draw calls low.
- Memoize expensive material creation with `useMemo`.
- Debounce rapid swatch clicks (16 ms) before applying material updates.
- Target: First Contentful Paint < 1.5 s on a mid-range device; 3D scene interactive < 3 s.

---

# CODE QUALITY RULES
- Strict TypeScript: `"strict": true`, no `any`, explicit return types on all exported functions.
- ESLint + Prettier configured.
- Unit tests for: `checkCompatibility`, `MaterialFactory`, pricing calculation, i18n key coverage.
- Tests must be fast and deterministic — mock Three.js and external calls.
- Keep diffs small: one feature per file change.
- Error boundaries around the 3D canvas with a graceful fallback UI.

---

# FILE STRUCTURE (target)
```
src/
  components/
    Configurator/
      ConfiguratorLayout.tsx     # root layout (sidebar + canvas + panel)
      StepSidebar.tsx
      OptionPanel.tsx
      SummaryPanel.tsx
      QuoteModal.tsx
    Scene/
      WheelchairScene.tsx        # R3F Canvas wrapper
      WheelchairModel.tsx        # geometry + material application
      CameraController.tsx       # guided angle tweens
      StudioEnvironment.tsx      # lights, floor, background
    UI/
      ColorSwatch.tsx
      CompatibilityBanner.tsx
      ThemeToggle.tsx
      LanguageSwitcher.tsx
      StepIndicator.tsx
  domain/
    compatibility.ts
    pricing.ts
    cameraPresets.ts
  store/
    useConfigStore.ts            # Zustand store
  utils/
    MaterialFactory.ts
    snapshotCanvas.ts
  types/
    config.types.ts
    scene.types.ts
  config/
    options.ts                   # all option definitions & price deltas
    materials.ts                 # material parameter maps
  i18n/
    index.ts
  hooks/
    useTheme.ts
    useCameraAnimation.ts
public/
  locales/
    en/translation.json
    de/translation.json
    fr/translation.json
```

---

# OUTPUT INSTRUCTIONS
1. Output **all files** in the structure above, fully implemented (no `// TODO` stubs).
2. Start with `src/types/config.types.ts` so all subsequent files can import from it.
3. For the wheelchair 3D model: build it **programmatically** with Three.js primitives (BoxGeometry, CylinderGeometry, TorusGeometry, etc.) so no external GLTF asset is required. Group parts logically so materials can be swapped per-group.
4. After all source files, output `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, and `.eslintrc.cjs`.
5. End with a brief **"How to run"** section in a fenced markdown block.

Begin.