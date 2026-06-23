## Goal
Fix a 403 (Forbidden) "Failed to revalidate /notes" error occurring inside the Next.js API route (`src/pages/api/revalidate-notes.js`).

## Changes Made
- Modified `src/pages/api/revalidate-notes.js` to override `req.headers.host` with `process.env.VERCEL_URL` right before calling `res.revalidate()`.
- This ensures that Next.js' internal `node-fetch` request bypasses Cloudflare entirely and talks directly to the Vercel Edge Network, resolving the 403 blocks triggered by Bot Fight Mode or Domain Redirects.

## What Worked
- Injecting the Cloudflare bypass for `res.revalidate()`.

## What Didn't Work / Known Issues
- None yet. This is the standard fix for Next.js On-Demand ISR loops getting blocked by Cloudflare.

## Architecture Notes
- Vercel's Edge Network relies heavily on the `x-prerender-revalidate` security token matching a build-time constant when regenerating pages.
- Cloudflare intercepts loopback `fetch` calls from Vercel's AWS IPs (using the default `node` User-Agent) and issues a 403, returning this error directly to Next.js's internal API handler which surfaces as "Failed to revalidate".
- Redirects (like `mattmurphy.ca` -> `www.mattmurphy.ca`) strip custom fetch headers, compounding the issue.
