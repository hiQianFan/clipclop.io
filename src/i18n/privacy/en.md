# Privacy

<p class="intro">ClipClop keeps clipboard history on your device. Core capture, storage, search, preview, and paste operations need no cloud processing. The app has no account, cloud sync, telemetry, advertising, or content-analysis service, and it never opens copied URLs in the background.</p>

## Data stored locally

ClipClop stores supported clipboard content locally, together with related source-application metadata, file-path references, and settings. It does not inspect content to decide whether it is sensitive, so clipboard history should not be treated as a password vault.

File entries reference the original file path; ClipClop does not copy or move the original file. File preview is off by default and, while off, shows only stored names, paths, and source information. When enabled, ClipClop may read a file only after you explicitly preview it, to obtain its size, create a thumbnail, or invoke the system preview. The original file is never uploaded.

The local database relies on the current operating-system account and disk encryption such as FileVault or BitLocker. ClipClop does not currently add separate application-level database encryption.

## Network access

When automatic update checks are enabled, ClipClop contacts `clipclop.io`, served through Cloudflare, at most once every 24 hours to compare versions and retrieve update information. It downloads an installer only after you choose to update.

This website retrieves release history and the public GitHub star count from GitHub’s public API. None of these requests includes clipboard content, history, file paths, or source-application metadata. Automatic update checks can be disabled in the app’s Settings.

## Your controls

You can delete individual entries, clear all history, and set separate age and item-count limits. ClipClop removes records when either limit is reached. If “move recently used items to the top” is enabled, cleanup uses each item’s last-used time. Quitting ClipClop stops new clipboard capture.

Whether uninstalling also removes data depends on the operating system and installation method. To remove all local data, quit ClipClop and delete the application data directory for `com.clipclop.desktop`.

## Open source and auditability

ClipClop’s code and repository are public. You can inspect the implementation on [GitHub](https://github.com/hiQianFan/ClipClop) to independently verify what the app stores, when it reads files, and when it accesses the network.

## System permissions

On macOS, optional automatic paste uses Accessibility permission only to send the paste shortcut after you choose an item. Denying permission does not prevent copying: ClipClop still places the selected content on the system clipboard so you can paste it manually.

File preview uses separate Full Disk Access permission. macOS requires you to grant it manually and return to ClipClop to confirm before the app reads original files. You can skip, disable, or revoke this permission at any time; file history will continue to show stored basic information. First-run Quick Start uses built-in examples and does not display your clipboard history.

This notice will be updated before any release that adds telemetry, cloud sync, or another network feature that processes clipboard data.
