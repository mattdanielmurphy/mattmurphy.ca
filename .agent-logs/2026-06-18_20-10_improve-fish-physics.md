## Goal
Improve the background fish simulation by preventing initial corner spawns, introducing periodic swimming direction adjustments, and making the fish bounce off the page boundaries instead of wrapping.

## Changes Made
- Updated `public/calculus-labs/calculus-fishstocks.html` inside the script block:
  - Initialized `bgLogicalWidth` and `bgLogicalHeight` to `window.innerWidth` and `window.innerHeight` respectively instead of `0` to prevent initial wrap-to-corner coordinates.
  - Called `resizeCanvases()` immediately during execution to fetch viewport dimensions right away.
  - Added a `changeTimer` field in the `Fish` constructor to track direction changes.
  - Updated `Fish.update(dt)` to decrement the timer and rotate headings randomly with a smooth speed adjustment.
  - Replaced the edge wrap-around logic in `Fish.update(dt)` with wall bouncing checks using `Math.abs` to reverse velocities at borders with a buffer size relative to the fish dimension.

## What Worked
- Initializing widths to window dimensions eliminated the corner spawning bug.
- Bouncing physics logic worked as expected and prevented fish escaping.
- Periodic updates added a much more organic feeling to the swimming patterns.
- Project built successfully with `pnpm build`.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The canvas size tracker depends on the global variables `bgLogicalWidth` and `bgLogicalHeight`, which must be initialized with non-zero defaults to prevent simulation equations from crashing or warping values on step 0 before layout events occur.
