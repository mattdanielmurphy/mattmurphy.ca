## Goal
Make the background simulating fish in the calculus fishstocks lab avoid the mouse cursor and touch positions.

## Changes Made
- Modified `public/calculus-labs/calculus-fishstocks.html`:
  - Added a global `cursor` tracking object.
  - Registered event listeners for `mousemove` and `mouseleave` for mouse pointer tracking.
  - Registered event listeners for `touchstart`, `touchmove`, and `touchend` with `{ passive: true }` to support responsive touch tracking on mobile devices.
  - Updated the `Fish.update(dt)` loop to compute distance to the active cursor, applying an avoidance force that accelerates the fish away from the cursor when within a `120px` radius.
  - Capped the avoidance velocity at `220px/s` to prevent infinite speed scaling.
  - Reset the fish's periodic swimming heading timer while actively fleeing so they organically adjust direction once clear of the cursor.
- Updated `FEATURES.md` to document the new dynamic cursor/touch avoidance feature.

## What Worked
- Tracking client-relative coordinates on `window` mapped perfectly to the background canvas since it is styled as fixed-viewport (`position: fixed`).
- Smoothly blending avoidance force relative to distance resulted in natural, lifelike fleeing animations.
- Capping the velocity kept fish behavior smooth without runaway acceleration.
- The project compiles successfully.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The background canvas uses viewport coordinates matching standard window pointer coordinates directly, which simplifies mouse/touch interaction mapping.
