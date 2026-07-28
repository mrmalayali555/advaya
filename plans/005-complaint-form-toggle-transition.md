# 005 — Add explicit transition to complaint form field expand/collapse

- **Status**: TODO
- **Commit**: 3c1043f
- **Severity**: MEDIUM
- **Category**: Interruptibility + Easing & Duration
- **Estimated scope**: 1 file, 5 lines

## Problem

`src/components/forms/complaint-form.tsx:98-108` — the Named/Anonymous toggle animates a div from `height: 0` to `height: "auto"` with no explicit transition:

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  className="overflow-hidden"
>
```

Without an explicit `transition`, Framer Motion uses its default spring which is too slow (~600ms) for a tab-toggle interaction that can be hit rapidly. Rapid toggling causes the animation to restart from `height: 0` each time rather than smoothly retargeting.

## Target

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{
    height: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
    opacity: { duration: 0.15, ease: [0.32, 0.72, 0, 1] },
  }}
  className="overflow-hidden"
>
```

Duration 220ms for height is at the fast end of the dropdown budget (150–250ms per AUDIT.md). Opacity exits at 150ms so the field contents disappear before the container fully collapses.

## Repo conventions to follow

- Brand easing `[0.32, 0.72, 0, 1]` — as used throughout the codebase in Framer Motion props.
- `AnimatePresence` wrapper at line 96 already has `initial={false}` — correct, keep it.

## Steps

1. Open `src/components/forms/complaint-form.tsx`.
2. Find the `motion.div` inside the `AnimatePresence` block (approximately line 98).
3. Add a `transition` prop:
   ```tsx
   transition={{
     height: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
     opacity: { duration: 0.15, ease: [0.32, 0.72, 0, 1] },
   }}
   ```
4. Do not change `initial`, `animate`, `exit`, or `className`.

## Boundaries

- Do NOT touch the success state `motion.div` at line 42.
- Do NOT change the toggle buttons or form structure.
- Do NOT add new dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit` — 0 errors.
- **Feel check**: On the `/complaints` page, rapidly click Anonymous → Named → Anonymous.
  - The name/email fields should expand and collapse within ~220ms — not the slow 600ms+ default.
  - Rapid toggling should not cause restart-from-zero — the height should retarget from its current position.
  - At 10% DevTools playback, the height animation should start fast and decelerate smoothly.
- **Done when**: `motion.div` has an explicit `transition` prop with `height: { duration: 0.22 }` and `opacity: { duration: 0.15 }`.
