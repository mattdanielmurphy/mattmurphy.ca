## Goal
Ensure the white background of the `.pdf-page` container does not overlap or display behind the interactive population modeler and graph, and make the interactive section's own background transparent so the background fish are fully visible.

## Changes Made
- Modified `public/calculus-labs/calculus-fishstocks.html`:
  - Closed the `.pdf-page` div container (`</div>`) immediately before the `.interactive-modeler-section` begins. This prevents the page white background from rendering behind the interactive section.
  - Updated the CSS rule for `.interactive-modeler-section` to set its `background` to `transparent !important` and removed the backdrop filter, box-shadows, and border properties.

## What Worked
- Closing the `.pdf-page` container ended the white column background correctly, allowing the aquarium environment to be fully visible behind the interactive section.
- Removing backgrounds and filters from `.interactive-modeler-section` made the simulation widgets float directly above the swimming fish.
- Project built successfully with `pnpm build`.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- Unclosed layout containers (like `.pdf-page`) will bleed background styles down to their children, even if children are breakout blocks using relative margins or coordinate transforms. Explicitly closing sections ensures layout separation.
