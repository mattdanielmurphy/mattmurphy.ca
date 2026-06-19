## Goal
Resolve Next.js build failure caused by the deprecation of the `baseUrl` option and subsequent invalid values for `ignoreDeprecations` in `tsconfig.json`.

## Changes Made
- Modified [tsconfig.json](file:///Users/matthewmurphy/projects/mattmurphy.ca/tsconfig.json):
  - Completely removed the deprecated `"baseUrl": "."` compiler option.
  - Removed `"ignoreDeprecations": "6.0"`, which is an invalid option value in TypeScript 5.7.3.
  - Updated the path mapping from `"src/*"` to the relative path `"./src/*"` because relative paths are required when `baseUrl` is not defined.

## What Worked
- Removing `baseUrl` and updating `@/*` mapping to `./src/*` completely silences the deprecation warning/error without requiring `ignoreDeprecations`.
- Next.js build completed successfully with `pnpm build`.

## What Didn't Work / Known Issues
- Setting `"ignoreDeprecations": "6.0"` failed compilation in the local TypeScript version 5.7.3 (`error TS5103: Invalid value for '--ignoreDeprecations'`).

## Architecture Notes
- In modern TypeScript projects, `paths` can resolve without `baseUrl`. Prefixing targets with `./` (e.g. `"./src/*"`) is required to make them relative when `baseUrl` is absent.
