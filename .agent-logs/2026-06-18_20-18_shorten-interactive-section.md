## Goal
Shorten the interactive fishstocks simulation section height to prevent viewport height overflow.

## Changes Made
- Modified `public/calculus-labs/calculus-fishstocks.html`:
  - Reduced `.interactive-modeler-section` height from `950px` to `720px` and adjusted padding bottom from `4rem` to `2rem`.
  - Decreased `.interactive-modeler-section #hudCanvas` CSS min-height from `520px` to `380px`.
  - Updated JavaScript `resizeCanvases` logic to set desktop `minHudHeight` limit to `380` instead of `500`.

## What Worked
- The elements scaled down correctly, allowing the entire interactive section to fit within the new `720px` boundary without container overflow or clipping text.
- Project built successfully with `pnpm build`.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- Canvas heights are determined by `hudParent.clientHeight - 60`, which is constrained by CSS container rules and JS min-height properties. Keeping these bounds synchronized avoids canvas overflow bugs.
