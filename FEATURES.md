# Features List

## School Projects & Simulations
- **Physics Labs Directory (`/physics`)**: A collection of Grade 12 Physics lab reports rendered via iframe from dynamic routes.
- **Calculus Fishstocks Simulation (`/calculus-fishstocks`)**: Interactive simulation of fish populations and harvesting models using dynamic canvas plotting and user parameters. Includes a real-time background canvas with fish that dynamically avoid the mouse cursor and touch positions.

## Content Publishing
- **Dynamic Public Notes (`/notes`)**: Fetches markdown notes dynamically from a private GitHub repository (`mattdanielmurphy/personal-notes`). Automatically publishes notes that have `public: true` in their frontmatter. Utilizes ISR and a catch-all route to seamlessly support nested folder structures from an Obsidian vault.
- **Obsidian Auto-Sync Daemon**: macOS LaunchAgent service backing the dynamic publishing pipeline. Monitors the local Obsidian directory for modifications and automatically commits and pushes changes to the private repository, with sandbox/TCC isolation managed via a compiled C binary wrapper.

