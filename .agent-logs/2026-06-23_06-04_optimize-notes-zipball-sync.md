## Goal
Optimize the public notes `/notes` index page fetching logic to prevent GitHub API rate limit failures, timeouts, and blank pages by using in-memory ZIP archive extraction.

## Changes Made
- Added `adm-zip` dependency.
- Updated `src/pages/notes/index.js` to download the entire repository as a ZIP archive in a single API call, extract it in-memory, and parse markdown frontmatter.
- Removed the old Code Search and sequential batch-fetching fallback logic which triggered rate limits.
- Updated `FEATURES.md` to reflect the new architecture.

## What Worked
- Downloaded and processed the repository containing 162 entries in a single request.
- Gracefully handled parsing errors on draft markdown files that contain non-conforming frontmatter.
- Compiles successfully via `pnpm run build`.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The `/notes` page index is built statically at build time or updated on-demand using `/api/revalidate-notes`.
- Downloading the zipball via `https://api.github.com/repos/owner/repo/zipball/branch` reduces all metadata and content scanning down to 1 API request.
