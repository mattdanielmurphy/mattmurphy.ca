# Matthew Daniel Murphy's website

## Hidden pages:

- `/waking-up`: shows Waking Up login codes automatically
- `/calculus-fishstocks`
- `/physics`: Grade 12 Physics labs
- `/jiro`: Jiro Dreams of Sushi
- `baby`: Montessori Course Video/Worksheet viewer

## Obsidian Auto-Sync Setup
The Obsidian notes vault (`/Users/matthewmurphy/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal`) is automatically synchronized to the private `personal-notes` repository via a background macOS `launchd` service.

### Components:
1. **Launch Agent Plist**: `LaunchAgents/com.user.notesync.plist` (symlinked to `~/Library/LaunchAgents/com.user.notesync.plist`)
   - Watches the Obsidian folder path for file changes.
   - Executes the compiled wrapper binary when modifications occur.
2. **C Wrapper Binary**: `~/Library/LaunchAgents/notesync-wrapper` (compiled from source)
   - Created to bypass macOS TCC security policies. Instead of granting Full Disk Access to standard shells like `/bin/bash` or `/bin/zsh`, Full Disk Access is granted specifically to this wrapper.
   - Inherits Full Disk Access and executes `git-sync.sh` safely.
3. **Sync Script**: `~/Library/LaunchAgents/git-sync.sh`
   - Checks if changes exist, commits them with the current timestamp, and pushes them to `main`.
4. **Logs**:
   - Standard output: `/Users/matthewmurphy/Library/CloudStorage/CloudMounter-MatthewMurphy/My Documents/Scripts/macOS/notesync.out.log`
   - Standard error: `/Users/matthewmurphy/Library/CloudStorage/CloudMounter-MatthewMurphy/My Documents/Scripts/macOS/notesync.err.log`

### Maintenance:
- **Stop background sync**:
  `launchctl unload ~/Library/LaunchAgents/com.user.notesync.plist`
- **Start background sync**:
  `launchctl load ~/Library/LaunchAgents/com.user.notesync.plist`
- **Trigger manual sync**:
  `launchctl start com.user.notesync`