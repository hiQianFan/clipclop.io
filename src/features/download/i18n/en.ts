export default {
  "title": "Download — ClipClop",
  "heading": "Download ClipClop",
  "description": "Download ClipClop clipboard history manager for macOS or Windows.",
  "intro": "Free, open source, no account required.",
  "latest": "Latest",
  "released": "released",
  "mac": { "name": "macOS", "action": "Download for macOS", "detail": "Universal installer for Apple Silicon and Intel Macs" },
  "windows": { "name": "Windows", "action": "Download for Windows", "detail": "x64 installer for 64-bit Windows" },
  "changelog": "View changelog",
  "mobile": "ClipClop is a desktop app. Open this page on your Mac or Windows PC to download it.",
  "copyLink": "Copy link to this page",
  "copied": "Copied",
  "installTitle": "Install in three steps",
  "started": "Your download has started. Here's what's next.",
  "tabs": "Choose your system",
  "macSteps": [
    { "title": "Drag into Applications", "body": "Open the downloaded .dmg and drag ClipClop into your Applications folder." },
    { "title": "Approve the first launch", "body": "The app isn't signed with an Apple Developer ID yet, so macOS blocks it at first. Open System Settings › Privacy & Security and click “Open Anyway” near the bottom." },
    { "title": "Press ⌃⌘C", "body": "Open your history from any app with ⌃⌘C and press Enter to paste. Auto-paste uses the Accessibility permission; without it, the item goes to the clipboard for you to paste." }
  ],
  "windowsSteps": [
    { "title": "Run the installer", "body": "Open the downloaded ClipClop_…_x64-setup.exe and follow the prompts." },
    { "title": "If SmartScreen appears", "body": "The installer isn't Authenticode-signed yet, so Windows may say “Windows protected your PC”. Click “More info”, then “Run anyway”." },
    { "title": "Press Ctrl+Alt+C", "body": "Open your history from any app with Ctrl+Alt+C and press Enter to paste." }
  ],
  "art": {
    "applications": "Applications",
    "blocked": "“ClipClop” was blocked to protect your Mac.",
    "openAnyway": "Open Anyway",
    "protected": "Windows protected your PC",
    "moreInfo": "More info",
    "runAnyway": "Run anyway",
    "paste": "Paste"
  },
  "whyTitle": "Why the security prompt?",
  "whyBody": "ClipClop is an independent open-source project and doesn't have paid Apple or Microsoft code-signing certificates yet, so your system treats it as an unidentified developer. The code is public: you can review it or build it yourself.",
  "source": "View source",
  "privacy": "Read the privacy notes"
} as const;
