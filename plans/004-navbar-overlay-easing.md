# 004 — Fix mobile nav backdrop easing

- **Status**: TODO
- **Commit**: 3c1043f
- **Severity**: MEDIUM
- **Category**: Easing & Duration
- **Estimated scope**: 1 file, 2 lines

## Problem

`src/components/layout/navbar.tsx:140` — the mobile overlay backdrop uses:
```tsx
transition={{ duration: 0.3 }}
```

No `ease` is specified, so Framer Motion defaults to its built-in ease which does not match the brand curve `[0.32, 0.72, 0, 1]`. The overlay also uses `duration: 0.3` while the inner nav panel uses `0.4` — inconsistent pairing.

The mobile menu is opened dozens of times per session — this is a high-frequency element.

## Target

```tsx
// Backdrop (motion.div at line ~136)
transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}

// Inner nav panel (motion.nav at line ~152) — already has ease; just align duration
transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
```

The backdrop exits faster than the nav panel to prevent a hanging blur.

## Repo conventions to follow

- Brand easing in array form: `[0.32, 0.72, 0, 1]` — as used in `src/components/ui/reveal.tsx:6` and `navbar.tsx:152` (the inner panel already has this).

## Steps

1. Open `src/components/layout/navbar.tsx`.
2. Find the outer `motion.div` (approximately line 136) with `transition={{ duration: 0.3 }}`.
3. Replace with: `transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}`
4. The inner `motion.nav` at line ~152 already has `ease: [0.32, 0.72, 0, 1]` — no change needed there.

## Boundaries

- Do NOT change the `AnimatePresence`, overlay click-to-close, or any layout/className.
- Only the backdrop `motion.div`'s `transition` prop changes.

## Verification

- **Mechanical**: `npx tsc --noEmit` — 0 errors.
- **Feel check**: Open and close the mobile menu repeatedly at normal speed.
  - The dark backdrop should appear and disappear slightly faster than the white nav panel — giving a layered feel.
  - At 10% DevTools playback, the backdrop ease should start fast and decelerate.
- **Done when**: Backdrop `transition.duration` is `0.2` and `ease` is `[0.32, 0.72, 0, 1]`.
