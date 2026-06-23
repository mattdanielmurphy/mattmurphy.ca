## Goal
Improve the mobile viewing experience of the notes page by ensuring text doesn't get cut off at narrow viewports.

## Changes Made
- Modified [Notes.module.css](file:///Users/matthewmurphy/projects/mattmurphy.ca/src/styles/Notes.module.css) to add responsive word-wrapping (`overflow-wrap: break-word` and `word-wrap: break-word`) on `.content`.
- Configured inline `code` blocks in the notes to wrap when hitting the edge (`white-space: pre-wrap` and `overflow-wrap: break-word`), while ensuring that code blocks within `<pre>` elements override this to scroll horizontally.
- Added `display: block` and `overflow-x: auto` to tables within `.content` to make them horizontally scrollable on mobile viewports rather than stretching the main container layout.

## What Worked
- Implementing these changes prevented horizontal overflow of layout containers on narrow viewports (e.g. 375px), keeping the layout responsive and legible.
- The build succeeded without errors.

## What Didn't Work / Known Issues
None.

## Architecture Notes
- The notes page render pipeline parses markdown content using `marked`, meaning styling is applied via general selector matching within `.content`.
