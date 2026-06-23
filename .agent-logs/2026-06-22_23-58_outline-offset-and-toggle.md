## Goal
Add scroll-margin offset to note headings to prevent them from being hidden behind any viewport limits when anchor clicked, implement toggle control to show/hide the sidebar outline, and completely remove the blue color accent across notes links/headings.

## Changes Made
- Modified [src/pages/notes/[...slug].js](file:///Users/matthewmurphy/projects/mattmurphy.ca/src/pages/notes/[...slug].js):
  - Added a state `isSidebarVisible` to manage the outline visibility.
  - Added a controls container at the top of the note page featuring the "Back to Notes" link and the "Hide/Show Outline" toggle button.
  - Applied the `.sidebarHidden` class dynamically to `.layoutWrapper` when the outline is hidden.
- Modified [src/styles/Notes.module.css](file:///Users/matthewmurphy/projects/mattmurphy.ca/src/styles/Notes.module.css):
  - Added `scroll-margin-top: 6rem` to note content headings (`h1` through `h6`) to offset anchor jumping.
  - Replaced the blue color `#0070f3` with `#111` / `#222` charcoal/black shades across the note titles, content links, and active outline navigation links. Added modern hover underlines.
  - Added styling rules for `.controls`, `.toggleButton`, and `.sidebarHidden` wrapper classes.
  - Excluded the toggle button on viewports under `768px` where the outline flows vertically below the title in the natural page stack.

## What Worked
- Heading anchor jumps now stop 6rem above the viewport top.
- The sidebar toggle button works correctly, dynamically adapting the page grid layout.
- The blue accent was fully removed and styled with premium monochrome accents.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- None.
