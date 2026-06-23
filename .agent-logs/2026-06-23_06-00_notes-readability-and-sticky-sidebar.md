## Goal
1. Constrain the maximum width of text elements on note detail pages (whether the outline is enabled or not) to keep line lengths readable, while letting non-text elements (like images, tables, code snippets) span full width.
2. Fix the sticky outline (sidebar) so that it remains fixed in place as the user scrolls down the page.

## Changes Made
- Modified `src/styles/Notes.module.css`:
  - Added a `max-width: 70ch;` rule targeting all primary text blocks (`p`, `ul`, `ol`, `blockquote`, and headings `h1`-`h6`) within the `.content` area.
- Modified `src/styles/globals.css`:
  - Changed `overflow-x: hidden;` to `overflow-x: clip;` on `html` and `body` elements. This prevents horizontal scrolling without creating an overflow container boundary that breaks `position: sticky` behavior.
- Updated `FEATURES.md`:
  - Documented the text-constraining readability enhancement under the Dynamic Public Notes feature list.

## What Worked
- Constraining block-level text containers to `70ch` successfully optimizes text readability by preventing extra-long line lengths when the sidebar is toggled/hidden or on wide viewport configurations.
- Changing horizontal body/html overflow to `clip` restored expected `position: sticky` behavior on the sidebar, allowing it to correctly stick as the user scrolls.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The `.content` container wraps the compiled Markdown html structure, allowing standard HTML elements to be targeted directly within CSS modules.
- `overflow: hidden` on parent/ancestor elements bounds `position: sticky` context to that scroll container. Using `overflow: clip` is the modern approach to prevent overflow clipping issues without breaking window scroll tracking and sticky positioning.
