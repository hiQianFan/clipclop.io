export default {
  "title": "ClipClop — Clipboard History Manager for macOS & Windows",
  "description": "ClipClop is a free, open-source clipboard history manager for macOS and Windows. Save, search, preview, and paste your clipboard history locally.",
  "ogDescription": "A free, open-source clipboard history manager for macOS and Windows. Save, search, preview, and paste locally.",
  "open": "Open",
  "paste": "Paste",
  "tagline": "Clip-clip, clop-clop. Two steps, fast.",
  "tagline2": "Clipboard history, saved locally and ready to reuse.",
  "mac": "Download for macOS",
  "windows": "Download for Windows",
  "actions": "Actions",
  "search": "Search clipboard…",
  "filter": "Filter history",
  "storyTitle": "Copied before.<br>Ready to find again.",
  "storyCopy": "Find copied text, links, images, and files in your history. Search, preview, and paste them again.",
  "trustTitle": "Your clipboard history is yours to manage.",
  "trustCopy": "Don't take our word for it. Every line below can be checked against the source code.",
  "trustFacts": [
    ["Clipboard content", "Stays on this device, never uploaded"],
    ["Account and sync", "No account, no cloud sync"],
    ["Telemetry and ads", "None"],
    ["Network", "Update checks only, at most every 24 hours, can be turned off"],
    ["Retention", "1 day to forever, with an optional item limit"],
    ["Source code", "AGPL-3.0, fully public"]
  ],
  "faqTitle": "Questions",
  "faq": [
    ["Is it free?", "Yes, and fully open source under AGPL-3.0. No account required."],
    ["Why does my system warn me when installing?", "The installers are not yet signed with an Apple Developer ID or Windows Authenticode certificate. On macOS, approve the app in Privacy & Security; on Windows you may see an “Unknown publisher” or SmartScreen prompt."],
    ["Which system permissions does it need?", "On macOS, optional auto-paste uses the Accessibility permission. If you decline, the selected item still goes to the system clipboard so you can paste it yourself. File previews need a separate Full Disk Access permission that you can skip or revoke at any time."],
    ["Is my clipboard history secure?", "History lives in a local database protected by your system account and disk encryption such as FileVault or BitLocker; ClipClop does not add its own encryption. It does not judge whether content is sensitive, so don't use it as a password vault."],
    ["How do I remove all my data?", "Delete single entries or clear all history inside the app. To remove every local file, quit ClipClop and delete the app data directory for com.clipclop.desktop."]
  ],
  "source": "View source code",
  "privacy": "Read the privacy notice",
  "closingTitle": "Keep everything you copy within reach.",
  "closingCopy": "Download ClipClop with no account required. Open your clipboard history with one shortcut.",
  "download": "Download ClipClop",
  "release": "For the current version and release history, see the",
  "summon": {
    "title": "One shortcut. Back at your cursor.",
    "copy": "Open your history from any app, pick an item with the arrow keys, and press Enter to paste it where your cursor is. The window gets out of the way.",
    "scenes": [
      { "clip": 0, "file": "message.txt", "prompt": "Here's the repo:\n" },
      { "clip": 2, "file": "greet.js", "prompt": "function greet() {\n  " },
      { "clip": 6, "file": "tokens.css", "prompt": ":root {\n  --text-strong: " }
    ]
  },
  "fullChangelog":"full changelog",
  "demo": {
    "clips": [
      {
        "type": "link",
        "text": "https://github.com/hiQianFan/ClipClop",
        "source": "Google Chrome",
        "icon": "chrome",
        "facts": [
          [
            "Hostname",
            "github.com"
          ],
          [
            "Characters",
            "37"
          ]
        ],
        "title": "Open source.\nOpen to inspection.",
        "copy": "The complete codebase is public. ClipClop needs no account, cloud sync, or telemetry; apart from optional update checks, core features run locally and offline."
      },
      {
        "type": "text",
        "text": "macOS  ⌃⌘C  Open\nWindows  Ctrl+Alt+C  Open\n↑ ↓  Select\n← →  Change page\n1–0  Quick select\nSpace  Preview\nEnter  Paste\nShift+Enter  Paste plain text\nEsc  Close",
        "source": "ClipClop",
        "icon": "device",
        "facts": [
          [
            "Characters",
            "158"
          ],
          [
            "Size",
            "172 B"
          ]
        ],
        "title": "Stay on the keyboard\nfrom open to paste",
        "copy": "Open, browse, preview, and paste entirely from the keyboard. Customize the global shortcut to fit your workflow."
      },
      {
        "type": "text",
        "text": "console.log(\"Hello, ClipClop\");",
        "source": "Codex",
        "icon": "codex",
        "facts": [
          [
            "Characters",
            "31"
          ],
          [
            "Size",
            "31 B"
          ]
        ],
        "title": "Find code snippets\njust as easily",
        "copy": "Copied JavaScript stays intact in history, ready to search and paste again like any other text."
      },
      {
        "type": "link",
        "text": "https://github.com/hiQianFan/ClipClop/releases/latest",
        "source": "Safari",
        "icon": "safari",
        "facts": [
          [
            "Hostname",
            "github.com"
          ],
          [
            "Characters",
            "53"
          ]
        ],
        "title": "Links are saved\nnever opened",
        "copy": "URLs enter history like any other content; ClipClop never visits them in the background for enrichment."
      },
      {
        "type": "image",
        "text": "ClipClop app icon",
        "source": "Preview",
        "icon": "image",
        "facts": [
          [
            "Dimensions",
            "1024 × 1024"
          ],
          [
            "Size",
            "90 KB"
          ]
        ],
        "title": "Preview images\nright away",
        "copy": "Clipboard history goes beyond plain text: images retain a thumbnail and stay ready to preview."
      },
      {
        "type": "file",
        "text": "ClipClop.dmg",
        "path": "/Users/qianfan/Downloads/ClipClop.dmg",
        "source": "Finder",
        "icon": "folder",
        "facts": [
          [
            "Type",
            "Disk Image"
          ],
          [
            "Size",
            "—"
          ]
        ],
        "title": "Files stay in\nyour history",
        "copy": "Copied files are kept with their name, type, and size so they remain easy to find later."
      },
      {
        "type": "color",
        "text": "#ECEEF0",
        "source": "Claude",
        "icon": "claude",
        "facts": [
          [
            "Type",
            "HEX"
          ],
          [
            "Characters",
            "7"
          ]
        ],
        "title": "Recognize colors\nat a glance",
        "copy": "Copied color values appear as both their original text and a swatch for quick confirmation."
      },
      {
        "type": "text",
        "text": "Save, search, preview, and paste—all on this device.",
        "source": "Microsoft Edge",
        "icon": "edge",
        "facts": [
          [
            "Characters",
            "52"
          ],
          [
            "Size",
            "54 B"
          ]
        ],
        "title": "Core features run\nlocally",
        "copy": "Clipboard content is never uploaded or sent to the cloud for analysis. History, search, preview, and paste keep working without a network connection."
      },
      {
        "type": "text",
        "text": "If direct paste is unavailable, your content stays on the system clipboard.",
        "source": "Google Chrome",
        "icon": "chrome",
        "facts": [
          [
            "Characters",
            "75"
          ],
          [
            "Size",
            "75 B"
          ]
        ],
        "title": "Paste safely\nwhen access is limited",
        "copy": "When the system blocks direct paste, ClipClop keeps the selected content ready for a normal system paste."
      },
      {
        "type": "text",
        "text": "Clipboard history retention\n1 / 7 / 30 / 90 days / 1 year / Forever\n\nClipboard history limit\n100 / 500 / 1,000 / 5,000 items / Unlimited",
        "source": "ClipClop",
        "icon": "device",
        "facts": [
          [
            "Characters",
            "136"
          ],
          [
            "Size",
            "136 B"
          ]
        ],
        "title": "Set your history\nretention",
        "copy": "Keep clipboard history for 1 day to 1 year, or forever. Store 100 to 5,000 items, or set no limit. Cleanup runs when either limit is reached."
      }
    ],
    "words": {
      "historyTitle": "Copied before.\nReady to find again.",
      "historyCopy": "Find copied text, links, images, and files in your history. Search, preview, and paste them again.",
      "favoritesTitle": "Keep favorites\nclose at hand",
      "favoritesCopy": "Save links, code, and images to favorites. Find them together, ready to paste again.",
      "viewSelected": "View selected content",
      "openLink": "Open in default browser",
      "copyPlain": "Copy as plain text",
      "favorite": "Add to favorites",
      "unfavorite": "Remove from favorites",
      "preview": "Press Space for system preview",
      "empty": "No matching clipboard items",
      "first": "First copied",
      "recent": "Last used",
      "scope": "History scope",
      "all": "All",
      "favorites": "Favorites",
      "settings": "Settings",
      "updates": "Check for updates",
      "about": "About ClipClop",
      "quit": "Quit ClipClop",
      "copy": "Copy to clipboard",
      "pastePlain": "Paste as plain text",
      "delete": "Delete from ClipClop…"
    }
  }
} as const;
