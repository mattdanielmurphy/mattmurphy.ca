## Goal
Prevent the outline/table of contents links on the notes page from modifying the URL hash and adding browser history entries, while still scrolling smoothly to the target headings.

## Changes Made
- Modified [src/pages/notes/[...slug].js](file:///Users/matthewmurphy/projects/mattmurphy.ca/src/pages/notes/[...slug].js): Added an `onClick` handler to the outline anchor tags. It calls `e.preventDefault()`, queries the target element using `document.getElementById(heading.id)`, and calls `scrollIntoView({ behavior: 'smooth' })`.
- Updated [FEATURES.md](file:///Users/matthewmurphy/projects/mattmurphy.ca/FEATURES.md): Documented that outline link clicks now smooth-scroll without altering the URL or adding history entries.

## What Worked
- Replacing default anchor link clicks with programmatic `scrollIntoView` works perfectly.
- Browser automatically respects the `scroll-margin-top: 6rem` defined in `Notes.module.css` for headings.
- Build succeeded without any issues.

## What Didn't Work / Known Issues
None.

## Architecture Notes
- Using programmatic scrolling with `scrollIntoView` respects CSS properties such as `scroll-margin-top` on target elements, keeping layout spacing correct.
- Keeping the `href` attribute on the anchor tag ensures SEO friendliness and accessibility (e.g. context menus, screen readers) even when preventing default click behaviors.
