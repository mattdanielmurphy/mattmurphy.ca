## Goal
Fix and document the background Obsidian Auto-Sync daemon that pushes edited markdown notes from the iCloud Obsidian vault to the `personal-notes` repository.

## Changes Made
- Modified `/Users/matthewmurphy/projects/mattmurphy.ca/AG_CONTEXT.md` to document the background Obsidian auto-sync mechanism and its TCC sandbox workarounds.
- Modified `/Users/matthewmurphy/projects/mattmurphy.ca/README.md` to provide setup instructions, component descriptions, and start/stop command references for the auto-sync daemon.
- Modified `/Users/matthewmurphy/projects/mattmurphy.ca/FEATURES.md` to add the Obsidian Auto-Sync daemon to the features list.
- Created `/Users/matthewmurphy/Library/LaunchAgents/git-sync.sh` as a local script copy to avoid execution failures from CloudMounter sandboxing.
- Compiled a C wrapper binary at `/Users/matthewmurphy/Library/LaunchAgents/notesync-wrapper` that executes the script, allowing targeted Full Disk Access.
- Updated `/Users/matthewmurphy/Library/CloudStorage/CloudMounter-MatthewMurphy/My Documents/Scripts/macOS/LaunchAgents/com.user.notesync.plist` to run the wrapper and set `WorkingDirectory` to avoid `git` permission errors on startup.

## What Worked
- Relocating the scripts out of the CloudMounter volume to a local path (`~/Library/LaunchAgents`) resolved the `Operation not permitted (Exit code 126)` issue caused by cloud-mount sandboxing.
- Setting `WorkingDirectory` in the plist resolved `fatal: Unable to read current working directory` errors from `git`.
- Implementing and compiling the C wrapper allowed the launchd job to execute the sync script cleanly under user session control (once granted Full Disk Access).

## What Didn't Work / Known Issues
- Accessing iCloud Drive (`~/Library/Mobile Documents`) from a background launchd agent without Full Disk Access results in `Operation not permitted` errors. The user must manually grant FDA to `/Users/matthewmurphy/Library/LaunchAgents/notesync-wrapper` for the script to access the Obsidian vault.

## Architecture Notes
- macOS TCC prevents background agents from accessing iCloud Drive. A compiled C binary wrapper is used instead of a standard shell interpreter so that the user does not have to grant dangerous Full Disk Access to the general `/bin/bash` or `/bin/zsh` interpreters. TCC entitlements are inherited by child processes spawned by the authorized wrapper binary.
