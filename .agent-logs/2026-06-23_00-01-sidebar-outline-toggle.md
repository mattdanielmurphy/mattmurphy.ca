## Goal
Modify the hide/show outline button on the notes page to be a symbol only and position it directly next to the outline in the sidebar.

## Changes Made
- Modified `src/pages/notes/[...slug].js`:
  - Removed the toggle button from the main `.controls` header wrapper.
  - Placed a symbol-only button using clean chevron/layout SVGs inside the sidebar header next to the "Outline" heading.
  - Kept the sidebar rendering when collapsed but set its width to only the size of the collapse/expand button, keeping it visible next to the main content so the user can show it again.
- Modified `src/styles/Notes.module.css`:
  - Added styling for `.sidebarHeader`, `.sidebarTitle`, and `.sidebarToggleButton`.
  - Added `.sidebarCollapsed` styling to shrink the sidebar width to `28px` when outline is hidden.
  - Adjusted `.layoutWrapper.sidebarHidden` to keep a flex layout with a narrower gap (`1.5rem`) so the toggle button stays positioned nicely adjacent to the main content.
  - Updated media query for mobile screens to hide the new `.sidebarToggleButton`.
- Modified `FEATURES.md`:
  - Documented the addition of the symbol-only sidebar outline toggle button.

## What Worked
- Relocating the toggle button to the sidebar header creates a much cleaner, more standard documentation-style interface.
- Keeping the collapsed sidebar rendered at a minimal width ensures the expand button is always accessible right next to the content.
- Verified that type checking, ESLint rules, and next.js production builds compile without warnings or errors.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The collapsed sidebar state modifies the `layoutWrapper` and `sidebar` widths rather than removing the aside element entirely, preserving the toggle button in the markup.
