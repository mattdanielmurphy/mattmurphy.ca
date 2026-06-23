## Goal
Resolve text scaling and layout overflow issues on sub-400px viewports (very narrow mobile displays) for notes.

## Changes Made
- Added a `@media (max-width: 480px)` breakpoint in [Notes.module.css](file:///Users/matthewmurphy/projects/mattmurphy.ca/src/styles/Notes.module.css).
- Reduced container padding to `1.5rem 0.75rem` (from `2rem 1rem`) on `.noteContainer` and `.container` for screen widths under 480px.
- Reduced font-sizes for title (to `1.6rem`), `h1` (to `1.4rem`), `h2` (to `1.25rem`), `h3` (to `1.15rem`), and body text / links (to `1rem`) at the same breakpoint.
- Adjusted outline item links to wrap (`word-wrap: break-word` and `overflow-wrap: break-word`) to prevent long outline paths from causing overflow.

## What Worked
- Lowering font-size and padding on very small viewports successfully kept note titles and body content inside the container boundaries without cutting off text.
- Verified Next.js compilation succeeds with these changes.

## What Didn't Work / Known Issues
None.

## Architecture Notes
- Kept spacing/typography scale clean by stacking media queries for `max-width: 768px` and `max-width: 480px`.
