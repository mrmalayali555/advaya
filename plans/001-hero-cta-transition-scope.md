# 001 — Scope hero CTA transitions (fix `transition: all` + wrong easing)

- **Status**: TODO
- **Commit**: 3c1043f
- **Severity**: HIGH
- **Category**: Performance + Easing & Duration
- **Estimated scope**: 1 file, ~15 lines

## Problem

`src/components/sections/hero.tsx:206` and `:236` use `transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1)` on the hero CTA buttons.

Current code at line 206:
```css
transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
```
Current code at line 236:
```css
transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
```

Two problems:
1. `transition: all` animates every CSS property (including font-size, border, layout properties) off-GPU on every hover. On a high-frequency UI element like hero CTAs, this wastes composite budget.
2. `cubic-bezier(0.4, 0, 0.2, 1)` is Material Design's standard ease — not the ADVAYA brand curve `cubic-bezier(0.32, 0.72, 0, 1)`. It's inconsistent with all other Framer Motion animations in the codebase which use `[0.32, 0.72, 0, 1]`.

## Target

Scope transitions explicitly to only the properties that actually change on hover (`transform`, `box-shadow`, `background`, `color`, `border-color`) and use the brand easing:

```css
/* hero-cta-primary — line ~206 */
transition:
  transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
  box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1),
  background 200ms cubic-bezier(0.32, 0.72, 0, 1) !important;

/* hero-cta-whatsapp — line ~236 */
transition:
  transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
  box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1),
  background 200ms cubic-bezier(0.32, 0.72, 0, 1),
  color 200ms cubic-bezier(0.32, 0.72, 0, 1),
  border-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
```

Also add `:active` press feedback to both buttons:
```css
.hero-cta-primary:active { transform: translateY(0px) scale(0.97); }
.hero-cta-whatsapp:active { transform: translateY(0px) scale(0.97); }
```

## Repo conventions to follow

- Brand easing token: `--ease-brand: cubic-bezier(0.32, 0.72, 0, 1)` in `src/app/globals.css:71`.
- The inline `<style jsx>` block is the correct place for these styles — it already exists at `hero.tsx:195`.
- Exemplar: `src/components/ui/reveal.tsx:6` uses `[0.32, 0.72, 0, 1]` — same curve in array form for Framer Motion.

## Steps

1. Open `src/components/sections/hero.tsx`.
2. Find the `<style jsx>` block starting at approximately line 195.
3. Replace the `transition` on `.hero-cta-primary` (currently at ~line 206):
   - Old: `transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;`
   - New:
     ```
     transition:
       transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
       box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1),
       background 200ms cubic-bezier(0.32, 0.72, 0, 1) !important;
     ```
4. After the `.hero-cta-primary:hover` block, add:
   ```css
   .hero-cta-primary:active { transform: translateY(0px) scale(0.97) !important; }
   ```
5. Replace the `transition` on `.hero-cta-whatsapp` (currently at ~line 236):
   - Old: `transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);`
   - New:
     ```
     transition:
       transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
       box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1),
       background 200ms cubic-bezier(0.32, 0.72, 0, 1),
       color 200ms cubic-bezier(0.32, 0.72, 0, 1),
       border-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
     ```
6. After the `.hero-cta-whatsapp:hover` block, add:
   ```css
   .hero-cta-whatsapp:active { transform: translateY(0px) scale(0.97); }
   ```

## Boundaries

- Do NOT touch any Framer Motion animation props in `hero.tsx` (the `initial`/`animate` on `motion.h1`, etc.).
- Do NOT change the shimmer `@keyframes` or the button markup.
- Do NOT add new dependencies.
- If the style block has drifted from line 195 since commit `3c1043f`, find it by searching for `.hero-cta-primary {` — STOP and report if not found.

## Verification

- **Mechanical**: `npx tsc --noEmit` — expect 0 errors. `npm run build` — expect successful build.
- **Feel check**: Open the homepage hero on a real device or in DevTools at 10% playback speed.
  - Hover the primary purple CTA — transition should feel snappy and purposeful (starts fast, not sluggish).
  - Press and hold the button — a subtle scale-down `0.97` should be visible.
  - The WhatsApp button background should switch to green on hover with the same crisp timing.
  - Open DevTools → Rendering tab → Enable `prefers-reduced-motion` → confirm buttons still show color/shadow changes but movement is minimal.
- **Done when**: No `transition: all` on `.hero-cta-primary` or `.hero-cta-whatsapp`, and both buttons have `:active` scale feedback.
