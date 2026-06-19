## Goal
Make the fish aquarium canvas a fixed viewport background behind the report pages, showing the fish swimming along the page margins while content obscures it.

## Changes Made
- Modified `public/calculus-labs/calculus-fishstocks.html`:
  - Moved the `<canvas id="bgCanvas"></canvas>` from the inside of `.interactive-modeler-section` to a direct child at the start of the `<body>` so that it is not affected by parent CSS transformations.
  - Added CSS rule to `html` to apply a fixed blue gradient background (`background: linear-gradient(to bottom, #005a82, #002236) fixed !important;`).
  - Set `body` background to `transparent !important;`.
  - Set `#bgCanvas` to `position: fixed !important` with viewport width/height, `z-index: -100`, and `pointer-events: none` to serve as a viewport-level background overlay.
  - Set `.interactive-modeler-section` background to a translucent gradient (`rgba(0, 90, 130, 0.4)` and `rgba(0, 34, 54, 0.4)`) with backdrop filter blur to give a glassmorphic viewport window into the aquarium background.
  - Adjusted `resizeCanvases()` in JavaScript to calculate the background dimensions using `window.innerWidth` and `window.innerHeight` rather than the interactive section elements.

## What Worked
- Moving the canvas out of the transformed container allowed it to correctly anchor to the browser viewport.
- The translucent section backgrounds look great and show the fish swimming behind the interactive components.
- The project built successfully with `pnpm build`.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- Canvas containers positioned with `position: fixed` must reside outside of any elements styled with `transform`, `filter`, or `perspective` in modern CSS layout engines, otherwise the containing block shifts from the viewport to the transformed container.
