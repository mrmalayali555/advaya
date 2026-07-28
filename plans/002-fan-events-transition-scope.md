# 002 — Scope `.fan-card` transition (fix `transition: all` + wrong easing)

- **Status**: TODO
- **Commit**: 3c1043f
- **Severity**: HIGH
- **Category**: Performance + Easing & Duration
- **Estimated scope**: 1 file, ~3 lines

## Problem

`src/components/ui/fan-events.tsx:123` applies `transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)` to every `.fan-card`.

Current code:
```css
transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
```

Two problems:
1. `transition: all` forces the browser to animate every property including layout properties (`margin-left`, `width`, `border`) off the GPU compositor. On hover, this triggers layout + paint on every frame.
2. `cubic-bezier(0.25, 0.8, 0.25, 1)` is a weak easing inconsistent with the brand token `cubic-bezier(0.32, 0.72, 0, 1)`.
3. 500ms is too long for a hover interaction (budget: 150–250ms for this class of element).

## Target

```css
:global(.fan-card) {
  position: absolute;
  width: 250px;
  height: 290px;
  transition:
    transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 220ms cubic-bezier(0.32, 0.72, 0, 1),
    margin-left 220ms cubic-bezier(0.32, 0.72, 0, 1);
  border-radius: 1rem;
  transform: rotate(calc(var(--r) * 1deg)) translateZ(0);
  transform-origin: center bottom;
  will-change: transform;
}
```

Note: `will-change: transform, margin` → `will-change: transform` only. `will-change: margin` is invalid (layout properties cannot be composited).

## Repo conventions to follow

- Brand easing: `cubic-bezier(0.32, 0.72, 0, 1)` — matches `--ease-brand` in `src/app/globals.css:71` and the Framer Motion array `[0.32, 0.72, 0, 1]` used in `src/components/ui/reveal.tsx:6`.
- The inline `<style jsx>` block already exists in `fan-events.tsx:103` — edit in-place.

## Steps

1. Open `src/components/ui/fan-events.tsx`.
2. Locate the `:global(.fan-card)` rule inside the `<style jsx>` block (approximately line 119).
3. Replace only the `transition` and `will-change` lines:
   - Old `transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);`
   - New:
     ```css
     transition:
       transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
       opacity 220ms cubic-bezier(0.32, 0.72, 0, 1),
       margin-left 220ms cubic-bezier(0.32, 0.72, 0, 1);
     ```
   - Old `will-change: transform, margin;`
   - New `will-change: transform;`

## Boundaries

- Do NOT change transform values, rotation logic, or the hover spread effect CSS.
- Do NOT touch any other component or file.
- Do NOT add new dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit` — expect 0 errors.
- **Feel check**: Hover the "Upcoming Events" fan stack on the homepage.
  - Cards should spread out within ~220ms — faster and crisper than before (was 500ms).
  - In DevTools → Performance tab, record a hover — there should be no layout/paint tasks triggered by the `margin-left` transition (it will still cause layout but this is unavoidable; what we've eliminated is animating irrelevant properties).
  - At 10% playback speed in the Animations panel, the fan-out should start fast and decelerate smoothly.
- **Done when**: `.fan-card` has no `transition: all`, `will-change: transform` only, and the easing matches brand curve.
