# 003 — Add global `prefers-reduced-motion` handling

- **Status**: TODO
- **Commit**: 3c1043f
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 3 files (globals.css + reveal.tsx + navbar.tsx), ~40 lines total

## Problem

`prefers-reduced-motion` is handled in exactly one component — `src/components/ui/apple-invites.tsx` (uses `useReducedMotion()`). Every other animated component ignores it:

- `src/components/ui/reveal.tsx` — scroll-triggered entrance animations (y-movement) affect all pages
- `src/components/layout/navbar.tsx:149-152` — mobile menu slides in with `y: -20` movement
- `src/components/forms/complaint-form.tsx:98-101` — form section animates `height`
- `src/app/globals.css` — no reduced-motion media query at all
- Hero CTA shimmer (`hero.tsx:219`) — infinite shimmer animation runs regardless

Users who opt into reduced motion on their OS see full position animations everywhere on the site.

## Target

**globals.css** — add a global reduced-motion block that disables movement-based animations while preserving opacity feedback:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**reveal.tsx** — use `useReducedMotion()` to skip the y-transform:
```tsx
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Inside Reveal component, before return:
const prefersReduced = useReducedMotion();

// Pass to variants:
const variants: Variants = {
  hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: prefersReduced ? 0.01 : 0.7, ease: BRAND_EASE, delay: prefersReduced ? 0 : i * 0.08 },
  }),
};
```

**navbar.tsx** — gate y-movement:
```tsx
// Add at top of NavBar component:
const prefersReduced = useReducedMotion();

// Change mobile nav motion.nav:
initial={{ y: prefersReduced ? 0 : -20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
exit={{ y: prefersReduced ? 0 : -20, opacity: 0 }}
```

## Repo conventions to follow

- `useReducedMotion()` is already imported in `src/components/ui/apple-invites.tsx:4` — use the same import pattern.
- The `BRAND_EASE` constant exists in `src/components/ui/reveal.tsx:6` as `[0.32, 0.72, 0, 1]`.
- Global CSS additions go in `src/app/globals.css`, after the `@layer base` block (around line 107).

## Steps

1. Open `src/app/globals.css`. After the closing `}` of the `@layer base` block (approximately line 107), add:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```

2. Open `src/components/ui/reveal.tsx`.
   - Add `useReducedMotion` to the framer-motion import: `import { motion, useReducedMotion, type Variants } from "framer-motion";`
   - Refactor `Reveal` to be a non-module-level component (since hooks can't run at module level). Move `variants` inside the `Reveal` function body:
     ```tsx
     export function Reveal({ children, delay = 0, className, as = "div" }: ...) {
       const prefersReduced = useReducedMotion();
       const MotionTag = motion[as];
       const variants: Variants = {
         hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
         visible: (i: number = 0) => ({
           opacity: 1,
           y: 0,
           transition: {
             duration: prefersReduced ? 0.01 : 0.7,
             ease: [0.32, 0.72, 0, 1] as const,
             delay: prefersReduced ? 0 : i * 0.08,
           },
         }),
       };
       return (
         <MotionTag
           className={className}
           variants={variants}
           custom={delay}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-80px" }}
         >
           {children}
         </MotionTag>
       );
     }
     ```
   - Add `"use client";` at top if not present (it already is at line 1).

3. Open `src/components/layout/navbar.tsx`.
   - Import `useReducedMotion` from framer-motion (it already imports `AnimatePresence` and `motion` — just add it).
   - Inside the `NavBar` function, add: `const prefersReduced = useReducedMotion();`
   - Update the `motion.nav` initial/exit props (around lines 149, 151):
     - `initial={{ y: prefersReduced ? 0 : -20, opacity: 0 }}`
     - `exit={{ y: prefersReduced ? 0 : -20, opacity: 0 }}`

## Boundaries

- Do NOT add reduced-motion handling to `apple-invites.tsx` — it already handles it correctly.
- Do NOT remove animations entirely — keep opacity transitions for state feedback.
- Do NOT change the `RevealGroup` or `RevealItem` components.

## Verification

- **Mechanical**: `npx tsc --noEmit` — expect 0 errors.
- **Feel check**:
  1. In DevTools → Rendering → Enable `Emulate CSS media feature prefers-reduced-motion`.
  2. Scroll down the homepage — section reveals should fade in without any vertical movement.
  3. Open the mobile menu — it should appear without sliding in from above.
  4. Disable the emulation — all animations should return to full motion.
- **Done when**: With reduced-motion enabled, no element translates on the page, but opacity fades are preserved.
