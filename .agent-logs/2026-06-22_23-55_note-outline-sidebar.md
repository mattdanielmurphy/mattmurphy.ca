## Goal
Add a minimalist outline to the left sidebar of the dynamic note detail page (`/notes/[...slug].js`) showing the note's headings, with the current heading emphasized based on the active scroll position, using anchor links.

## Changes Made
- Modified [src/pages/notes/[...slug].js](file:///Users/matthewmurphy/projects/mattmurphy.ca/src/pages/notes/[...slug].js):
  - Updated `getStaticProps` to extract all markdown headings (depth and text) from `marked.lexer` sequentially and compute unique slug IDs.
  - Used a custom `marked` renderer to inject matching unique `id` values into the generated heading HTML tags.
  - Added a state variable `activeId` and a scroll event listener hook to track which heading is currently closest to the top of the viewport (within 120px threshold) and set it as active.
  - Updated layout elements with a `.layoutWrapper` containing the sticky outline `<aside>` element and the `<main>` content element.
- Modified [src/styles/Notes.module.css](file:///Users/matthewmurphy/projects/mattmurphy.ca/src/styles/Notes.module.css):
  - Added `.noteContainer`, `.layoutWrapper`, `.sidebar`, `.outlineNav`, `.outlineList`, `.outlineItem`, `.activeOutlineItem`, and `.mainContent` classes.
  - Implemented nesting indentations/sizing for outline levels (depth 1 to 4).
  - Configured custom webkit-scrollbar hiding on the sidebar navigation block.
  - Added media query rules for mobile/smaller viewports to stack the outline navigation block above the note content vertically.
- Updated [FEATURES.md](file:///Users/matthewmurphy/projects/mattmurphy.ca/FEATURES.md) to document the new public notes outline navigation capabilities.

## What Worked
- Custom renderer in `marked` correctly appends matching ids sequentially.
- Scroll scroll-listener successfully detects the currently visible header with a threshold padding.
- Responsive layout stacks gracefully under 768px viewports.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- Using sequential unique ID generation requires resetting the ID map state at key parsing stages to ensure parity between token list ID assignments and final HTML string rendering.
