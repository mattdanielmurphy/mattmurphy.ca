# 2026-08-16 20:58 - Add music-cross-linker and yt-highlight-reel to Projects

## Summary
Added new project entries for **Music Cross-Linker** (`music.mattmurphy.ca`) and **YouTube Highlight Reel** (`yt.mattmurphy.ca`) to the top of the project list in `src/data/projects.js`.

## Changes Made
- Migrated package management lockfiles to `bun.lock` via `bun install`.
- Updated `src/data/projects.js` with:
  - `music-cross-linker`: Live link (`https://music.mattmurphy.ca`), GitHub repository link, tags `["Web App", "Music"]`.
  - `yt-highlight-reel`: Live link (`https://yt.mattmurphy.ca`), GitHub repository link, tags `["Web App", "Video", "AI"]`.
- Verified production build via `bun run build` with all static and ISR pages compiling successfully.
