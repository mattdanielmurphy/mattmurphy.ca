## Goal
Automatically scroll the active outline item into view in the sidebar outline container when the active section changes as the user scrolls.

## Changes Made
- Modified `src/pages/notes/[...slug].js` to:
  - Import `useRef` from React.
  - Declare a `sidebarRef` and attach it to the sticky `<aside>` sidebar element.
  - Added a `useEffect` hook listening to `activeId` updates. When the active section changes, it locates the active outline item element inside the sidebar and checks if its viewport bounding rectangle is outside the sidebar container. If it is, it smoothly scrolls the container to bring it fully back into view (retaining a 20px padding at the boundary).
- Updated `FEATURES.md` to document the new auto-scrolling outline behavior.

## What Worked
- Successfully compiled using `pnpm run build`.
- Bounding rectangle logic precisely scrolls the sidebar container smoothly when the active item moves near/beyond the top or bottom of the visible sidebar area.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The sidebar container is the element that overflows (`overflow-y: auto`), so relative scroll coordinates must be computed using `.getBoundingClientRect()` to calculate the relative offsets between the active list item and the sidebar container itself.
