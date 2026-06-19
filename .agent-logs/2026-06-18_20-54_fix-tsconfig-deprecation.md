## Goal
Fix Next.js compilation failure caused by TypeScript compiler warning/error regarding the deprecated `baseUrl` option.

## Changes Made
- Modified [tsconfig.json](file:///Users/matthewmurphy/projects/mattmurphy.ca/tsconfig.json) to add `"ignoreDeprecations": "5.0"` under `compilerOptions`.

## What Worked
- Adding `"ignoreDeprecations": "5.0"` silenced the TypeScript deprecation error for `baseUrl` and allowed compiling successfully.
- Cleaned the stale Next.js cache directory `.next` to resolve transient page compilation errors.

## What Didn't Work / Known Issues
None.

## Architecture Notes
- The project is a Next.js (Pages Router) codebase using TypeScript/JavaScript.
- Modern TypeScript (5.x/6.x) deprecates `baseUrl` when used under certain module resolutions. Setting `"ignoreDeprecations": "5.0"` allows keeping `baseUrl` for path aliasing without compile errors.
