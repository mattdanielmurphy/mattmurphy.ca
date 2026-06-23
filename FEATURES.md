# Features List

## School Projects & Simulations
- **Physics Labs Directory (`/physics`)**: A collection of Grade 12 Physics lab reports rendered via iframe from dynamic routes.
- **Calculus Fishstocks Simulation (`/calculus-fishstocks`)**: Interactive simulation of fish populations and harvesting models using dynamic canvas plotting and user parameters. Includes a real-time background canvas with fish that dynamically avoid the mouse cursor and touch positions.

## Content Publishing
- **Dynamic Public Notes (`/notes`)**: Fetches markdown notes dynamically from a private GitHub repository (`mattdanielmurphy/personal-notes`). Automatically publishes notes that have `public: true` in their frontmatter. Downloads the entire repository as a ZIP archive in a single API call and extracts it in-memory to prevent rate-limiting and timeouts, supporting nested folder structures via a catch-all route. Includes a minimalist, sticky left sidebar outline showing note headings as anchor links, with active scroll tracking highlighting the current heading; clicking an outline link smooth-scrolls to the heading without altering the URL or adding history entries. A symbol-only toggle button is placed in the sidebar header to easily collapse or expand the outline, remaining accessible at the side of the content when collapsed. Constrains text elements (paragraphs, lists, headings) to a maximum width of 70 characters for optimal readability, while keeping images, tables, and code snippets full-width.
- **Obsidian Auto-Sync Daemon**: macOS LaunchAgent service backing the dynamic publishing pipeline. Monitors the local Obsidian directory for modifications and automatically commits and pushes changes to the private repository, with sandbox/TCC isolation managed via a compiled C binary wrapper.


