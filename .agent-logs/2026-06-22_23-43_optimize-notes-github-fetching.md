## Goal
Optimize the public notes `/notes` index page fetching logic to prevent GitHub API secondary rate limit (abuse limit) failures and timeouts.

## Changes Made
- Modified `src/pages/notes/index.js` to first query the **GitHub Code Search API** to fetch only files containing `"public: true"` in the frontmatter.
- Implemented a `batchFetch` utility that fetches file content in concurrent batches of `5` (rather than 60+ parallel calls) to prevent triggering GitHub's secondary rate limits.
- Added a fallback in `getStaticProps` that scans the recursive Git tree and batch-fetches all files if the Search API fails.
- Added detailed console error logs for failed HTTP fetches of file contents.
- Updated `FEATURES.md` to document the Code Search and batching optimization.

## What Worked
- Verified that `pnpm run build` succeeds locally without any TypeScript or build errors.
- The Code Search API resolves all public notes in a single query when the index is up-to-date, reducing API calls significantly.
- Batching prevents concurrent request bursts that lead to temporary IP/token bans from GitHub.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The Code Search API is the primary fetching mechanism, fetching only public candidate markdown files.
- The Git Trees API acts as a fallback scanning all files sequentially/batched if search fails.
