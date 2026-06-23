## Goal
Optimize the public notes `/notes` index page fetching logic to prevent GitHub API rate limit failures, timeouts, and blank pages by using in-memory ZIP archive extraction.

## Changes Made
- Added `adm-zip` dependency.
- Updated `src/pages/notes/index.js` to download the entire repository as a ZIP archive in a single API call, extract it in-memory, and parse markdown frontmatter.
- Implemented a local file-based dev cache (`./tmp/notes-cache.json`) during local development (`process.env.NODE_ENV === 'development'`) that caches the notes list for 5 minutes. This prevents downloading the ZIP archive from GitHub on every page refresh or hot reload, keeping load times instant (<10ms).
- Removed the old Code Search and sequential batch-fetching fallback logic which triggered rate limits.
- Updated `FEATURES.md` to reflect the new architecture.

## What Worked
- Downloaded and processed the repository containing 162 entries in a single request.
- Local dev caching successfully avoids hitting GitHub's API during hot reloads.
- Gracefully handled parsing errors on draft markdown files that contain non-conforming frontmatter.
- Compiles successfully via `pnpm run build`.

## What Didn't Work / Known Issues
- Next.js development server may occasionally run into stale chunk hashes/404s (showing a blank page due to the FOUC prevention style hidden state). Restarting the local Next.js dev server resolves the blank page.

## Architecture Notes
- The `/notes` page index is built statically at build time or updated on-demand using `/api/revalidate-notes`.
- Downloading the zipball via `https://api.github.com/repos/owner/repo/zipball/branch` reduces all metadata and content scanning down to 1 API request.
- Local caching is enabled exclusively in development mode (`NODE_ENV === 'development'`) to balance local speed with production freshness.
