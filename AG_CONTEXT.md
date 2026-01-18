# Project Context

## Project Summary
- **Project Name**: mattmurphy.ca
- **Description**: Personal website and portfolio for Matt Murphy.
- **Tech Stack**: Next.js (Pages Router), React, Vanilla CSS with CSS Modules, Javascript.
- **Package Manager**: pnpm.

## Key Conventions
- **Styling**: Vanilla CSS with CSS Modules. Global styles in `src/styles/globals.css`. Typography uses Lato for body and Cormorant for headings. Hover effects are restricted to pointer devices using `@media (hover: hover)` to prevent "sticky" hover states on touch devices.
- **Conventions**: Project cards on the index show a compact "See Project →" button on hover (styled after the contact button hover state) with a slide-in animation. The entire card also features a subtle background and text color highlight on hover.
- **Project READMEs**: When fetching READMEs from GitHub for project detail pages, the first H1 tag is stripped to avoid redundancy with the project title already displayed on the page.
- **Structure**: Pages Router. `src/pages` for routes, `src/components` for reusable UI. No global header/navbar.

## Important Layout Files
- `src/pages/_app.js`: Root application component (handles Google Fonts).
- `src/pages/_document.js`: Root document component.
- `src/pages/index.js`: Home page.

## Definition of Done
- Code compiles without errors.
- Spacing improvements are visually pleasing and responsive.
