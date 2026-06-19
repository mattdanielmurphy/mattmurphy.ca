# 2026-06-18 21:34 — Replace fishstocks HTML with JS-generator approach

## Goal
Replace the massive 1.9 MB / 37,167-line pre-compiled `calculus-fishstocks.html` with a compact JS-generator approach: embed the updated markdown source inline and render it client-side using `marked` + `KaTeX` CDN libraries, then append the interactive simulator below.

## Changes Made
- **`public/calculus-labs/calculus-fishstocks.html`** — Replaced with a 70 KB / 1,341-line file that:
  - Loads `katex@0.16.11` and `marked@12.0.0` from jsDelivr CDN
  - Embeds the markdown source as a JS string literal (`MARKDOWN_SOURCE`)
  - Runs `renderMarkdownWithMath()` which mirrors the pdf-exporter.js pipeline:
    - Pre-processes `**math**` → `__AUTOBOLD__` auto-bold markers
    - Replaces `$$...$$` block math and `$...$` inline math with KaTeX-rendered HTML stored in a `mathMap`
    - Runs `marked.parse()` for the markdown body
    - Restores math from `mathMap`, wrapping inline math in `.inline-math-nowrap` spans
    - Wraps `<table>` in `.table-wrapper` for overflow scrolling
  - Fixes relative image paths to `/calculus-labs/` prefix after render
  - Scales wide `.math-block` equations to fit available width (mirrors pdf-exporter behaviour)
  - Applies the same glassmorphism screen styles (gradient background, frosted .pdf-page card)
  - Includes the image modal viewer
  - Appends the interactive fish population modeller simulator at the bottom

- **`public/calculus-labs/calculus-project-2-fishstocks.md`** — Copied from School dir (the updated version with corrected population data and new model parameters)

## What Worked
- Markdown rendered correctly through marked + KaTeX
- All updated data (2,590; 850; 257 and new model params M=3900, A=0.11, k=0.14, a=3510, b=0.9283) flow directly from the single markdown source
- Simulator `realData` array was already correct from the previous session (2590, 850, 257)
- File size: 1.9 MB → 70 KB (97% reduction)
- Line count: 37,167 → 1,341 (96% reduction)

## What Didn't Work / Known Issues
- The KaTeX `defer` attribute means it loads after the document. The `boot()` function polls `typeof katex === 'undefined'` every 50ms to wait. This is fine but could be improved using `renderDeferred` or a load event listener on the script element.
- The lookbehind regex `(?<!\\$)` for inline math detection may not work in all browsers (requires ES2018+). Works in modern Chromium-based browsers and Firefox 78+.
- The markdown's inline HTML (the `<div class="figure-container">` for Q3) is passed through directly by marked — this is correct behaviour.

## Architecture Notes
- The PDF exporter (`/School/scripts/pdf-exporter.js`) is a Node.js pipeline; this new approach replicates its math rendering in the browser using the same KaTeX library.
- The interactive simulator section starts immediately after Q6's closing `</p>` tag in the old file. In the new file, it follows the rendered `#lab-content` div and the image modal.
- The markdown source lives in two places: `public/calculus-labs/calculus-project-2-fishstocks.md` (for reference) and embedded inline as `MARKDOWN_SOURCE` (for zero-latency rendering without an HTTP fetch).
- To update the lab content in future: edit the `.md` file, then re-embed it by running the generation script or manually updating the `MARKDOWN_SOURCE` string in the HTML.
