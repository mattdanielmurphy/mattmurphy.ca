## Goal
Make the interactive calculus fishstocks simulation page appear on the website served at `/calculus-fishstocks`.

## Changes Made
- Created directory `public/calculus-labs/`.
- Copied `calculus-project-2-fishstocks-interactive.html` to `public/calculus-labs/calculus-fishstocks.html` and modified it to:
  - Remove the local filesystem `<base>` tag.
  - Update `fish-stocks-graph.png` path to `/calculus-labs/fish-stocks-graph.png`.
  - Inject a navigation bar with a "← Back to Home" button targeting `/` at the top of the body.
- Copied `fish-stocks-graph.png` to `public/calculus-labs/fish-stocks-graph.png`.
- Created Next.js Page route `src/pages/calculus-fishstocks.js` which embeds `public/calculus-labs/calculus-fishstocks.html` via an iframe using style rules from `./physics/physics.module.css`.
- Created `FEATURES.md` to document the new feature capability.

## What Worked
- Copied HTML and assets.
- Removing base path, updating target image paths, and iframe page embedding worked seamlessly.
- Verification via `pnpm build` verified that the route compiles as static page data and nextjs builds without issues.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- Standalone pages such as physics labs or calculus simulations are served via an iframe on Next.js page routes, pulling files from `public/` to prevent React hydration or custom styling issues with dense static HTML files.
