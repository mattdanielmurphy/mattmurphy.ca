## Goal
Refine outline scrolling behavior with increased margins/padding (keeping upcoming elements in view), grow the sidebar's height when it becomes sticky, and prevent layout reflows when outline items are marked active (bolded).

## Changes Made
- Modified `src/pages/notes/[...slug].js` to:
  - Add `isSticky` state.
  - Compute stickiness inside `handleScroll` by measuring `sidebarRef.current.getBoundingClientRect().top` relative to the sticky offset.
  - Dynamically add the `.stickySidebar` CSS class to the `<aside>` element.
  - Increased scroll margins inside the `useEffect` scroll handler: top threshold to `40px` and bottom threshold to `80px` (with `+80` offset) to keep adjacent items in view when scrolling.
- Modified `src/styles/Notes.module.css` to:
  - Add `.sidebar.stickySidebar` expanding `max-height` to `calc(100vh - 4rem)`.
  - Added a smooth transition for `max-height`.
  - Replaced `font-weight: 600` on `.activeOutlineItem a` with `text-shadow: 0.6px 0 0 currentColor` (for non-depth1 items) to simulate bolding without changing the layout width of the anchor elements, completely preventing text reflow.

## What Worked
- Project successfully compiled with `pnpm run build`.
- Bounding client rect measurements correctly toggled sidebar stickiness state.
- Layout reflow issues are fully resolved by using the text-shadow technique.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- Measuring stickiness inside the existing window scroll handler adds negligible overhead since scroll checks were already active.
