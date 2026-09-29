export default {
  "title": "下载 — ClipClop",
  "heading": "下载 ClipClop",
  "description": "下载适用于 macOS 或 Windows 的 ClipClop 剪贴板历史工具。",
  "intro": "免费、开源，不需要注册账号。",
  "latest": "最新版本",
  "released": "发布于",
  "mac": { "name": "macOS", "action": "下载 macOS 版", "detail": "Universal 安装包，适用于 Apple Silicon 与 Intel Mac" },
  "windows": { "name": "Windows", "action": "下载 Windows 版", "detail": "x64 安装程序，适用于 64 位 Windows" },
  "changelog": "查看更新日志",
  "mobile": "ClipClop 是桌面应用，请在 Mac 或 Windows 电脑上打开此页下载。",
  "copyLink": "复制下载页链接",
  "copied": "已复制",
  "installTitle": "安装只需三步",
  "started": "下载已开始，接下来这样安装。",
  "tabs": "选择系统",
  "macSteps": [
    { "title": "拖进“应用程序”", "body": "打开下载的 .dmg 文件，把 ClipClop 拖到“应用程序”文件夹。" },
    { "title": "首次打开时批准", "body": "安装包尚未使用 Apple Developer ID 签名，macOS 会先拦下它。打开“系统设置 › 隐私与安全性”，在页面下方点“仍要打开”。" },
    { "title": "按 ⌃⌘C 呼出", "body": "在任何应用里按 ⌃⌘C 打开剪贴历史，回车粘贴。自动粘贴需要辅助功能权限；不授权也能用，内容会放进剪贴板由你手动粘贴。" }
  ],
  "windowsSteps": [
    { "title": "运行安装程序", "body": "打开下载的 ClipClop_…_x64-setup.exe，按提示完成安装。" },
    { "title": "遇到 SmartScreen 时", "body": "安装程序尚未使用 Authenticode 签名，Windows 可能显示“Windows 已保护你的电脑”。点“更多信息”，再点“仍要运行”。" },
    { "title": "按 Ctrl+Alt+C 呼出", "body": "在任何应用里按 Ctrl+Alt+C 打开剪贴历史，回车粘贴。" }
  ],
  "art": {
    "applications": "应用程序",
    "blocked": "“ClipClop” 已被阻止使用，以保护你的 Mac。",
    "openAnyway": "仍要打开",
    "protected": "Windows 已保护你的电脑",
    "moreInfo": "更多信息",
    "runAnyway": "仍要运行",
    "paste": "粘贴"
  },
  "whyTitle": "为什么会有安全提示？",
  "whyBody": "ClipClop 是独立的开源项目，暂时没有购买 Apple 和微软的代码签名证书，所以系统会把它当作“未知开发者”。代码完全公开，你可以自行审查，或从源码构建。",
  "source": "查看源代码",
  "privacy": "阅读隐私说明"
} as const;
