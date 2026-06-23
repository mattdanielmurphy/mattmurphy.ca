## Goal
Implement dashed slugs (`-`) instead of `%20` spaces for public note URLs to make them cleaner and more user-friendly.

## Changes Made
- Created `src/utils/slug.js` defining `pathToSlug` to convert markdown file paths into dashed slugs.
- Modified `src/pages/notes/index.js` to index and cache notes using the normalized dashed slugs.
- Modified `src/pages/notes/[...slug].js` to fetch the repository Git tree, map the requested dashed slug back to the original Obsidian filename (which contains spaces), and retrieve the content of the matched file.
- Modified `src/pages/api/revalidate-notes.js` to revalidate the note page path with dashed slugs.

## What Worked
- Dynamic lookup using GitHub's recursive Trees API (`git/trees/main?recursive=1` / `git/trees/master?recursive=1`) successfully mapped the dashed URLs to the corresponding files with spaces.
- The Next.js production build (`pnpm run build`) completed successfully with the new routing configurations.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- Resolving dashed URL paths back to filenames containing spaces requires querying the remote GitHub file list via the Trees API because Vercel serverless functions run statelessly and cannot maintain a persistent local lookup table across sessions.
- Incremental Static Regeneration (ISR) ensures that this Git Trees API call is only triggered on the first visit to a page or when revalidating.
