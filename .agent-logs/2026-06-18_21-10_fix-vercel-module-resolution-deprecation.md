## Goal
Resolve Next.js build failure on Vercel caused by the deprecation warning for `moduleResolution=node10`.

## Changes Made
- Modified [tsconfig.json](file:///Users/matthewmurphy/projects/mattmurphy.ca/tsconfig.json):
  - Changed `"moduleResolution": "node"` to `"moduleResolution": "bundler"`.

## What Worked
- Replacing `"moduleResolution": "node"` with `"moduleResolution": "bundler"` successfully compiled the Next.js project locally using `pnpm build` and silences the deprecation warning/error about `node10` module resolution that was failing the Vercel build.

## What Didn't Work / Known Issues
- None.

## Architecture Notes
- The Next.js template in this project uses `"module": "esnext"`, which is fully compatible with `"moduleResolution": "bundler"`. Using `"bundler"` is the modern standard for modern Next.js/Vercel environments and avoids deprecation warnings in newer TypeScript compiler environments.
