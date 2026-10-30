# ClipClop 宣传片方案

## 已定决策

| 项 | 决定 |
|---|---|
| 尺寸 | 16:9 主版（1920×1080，45s，官网 / YouTube / X）+ 9:16 短版（1080×1920，20s，小红书 / 抖音 / Shorts） |
| 字幕 | 中英双字幕，中文主行、英文副行；无旁白 |
| 吉祥物 | 出镜，担任"哒"声的发声者；克制使用，不做大插画 |
| Windows | 只在片尾放标识与快捷键 `Ctrl+Alt+C`，不单独拍镜头 |
| 托管 | 成片放 R2 / YouTube，不进官网 `dist/`（构建上限 500KB） |

## 调性与规则

- 遵循 `PRODUCT.md`：安静、机械、可靠；无渐变、无玻璃拟态、无炫技转场。
- 颜色、字体、圆角、阴影、动效时长全部取自主仓库 `DESIGN.md` tokens。
- 真实性红线：画面里的每个动作都必须能在正式版 app 里复现，不演示不存在的能力。
- 声音母题：`Clip-clip, clop-clop`。呼出与粘贴各一声马蹄"哒"，其余只有键盘声和极轻底乐。

## 吉祥物用法

- 素材：`design/mascot/flat/hand-rebuild.svg`（可拆腿做动画）、`public/hoof-clop.svg`；片尾可用像素版 `design/mascot/pixel/`。
- 正片中：画面右下角小尺寸（≈高度 8%），只在"哒"的那一帧抬蹄落蹄，其余时间静止或不出现。
- 片尾：放大到画面主体，与图标并列，踏两步收尾。

## 大纲

1. 痛点：剪贴板只记得最后一次。
2. 解决：一个快捷键，两步粘回光标处。
3. 广度：文本、链接、图片、颜色、文件；全程键盘。
4. 信任：只在本机，无账号、无遥测、开源。
5. 行动：clipclop.io，macOS / Windows。

## 分镜 · 16:9 主版（45s）

| # | 时间 | 画面 | 字幕（中 / 英） | 声音 | 素材 |
|---|---|---|---|---|---|
| S1 | 0:00–0:04 | 编辑器与浏览器间连续复制链接、代码、色值；角落闪 `⌘C` keycap | 你每天复制上百次。/ You copy hundreds of times a day. | 键盘声 | 录屏 |
| S2 | 0:04–0:08 | 回编辑器 `⌘V`，贴出的是色值而非想要的链接；光标停顿 | 剪贴板只记得最后一次。/ Your clipboard only remembers the last one. | 静 | 录屏 |
| S3 | 0:08–0:13 | 按 `⌃⌘C`，面板浮在当前应用上方；右下角小马落蹄 | 一个快捷键。/ One shortcut. | **哒** | 录屏 + 吉祥物 |
| S4 | 0:13–0:20 | 输入 `git` → ↓ → Enter，粘到光标处，面板收起；小马第二蹄 | 哒哒两步，粘回光标处。/ Clip-clop. Pasted right where you were. | **哒** | 录屏 + 吉祥物 |
| S5 | 0:20–0:30 | 文本/链接/图片/颜色/文件各 ~2s，Space 预览 | 文本、链接、图片、颜色、文件。/ Text, links, images, colors, files. | 翻页轻声 | fixture 渲染 |
| S6 | 0:30–0:34 | keycap 卡点：↑↓ · 1–0 · Space · Enter · ⇧Enter · Esc | 全程键盘。/ Keyboard all the way. | 按键卡拍 | 代码 + fixture |
| S7 | 0:34–0:40 | 关 Wi-Fi 后搜索照常；mono 字逐行打出信任事实 | 你的剪贴历史，只在你的电脑上。/ Your history stays on your device. | 静 | 录屏 + 代码 |
| S8 | 0:40–0:45 | 小马放大踏两步 → 图标、tagline、clipclop.io、macOS / Windows 标识（`⌃⌘C` / `Ctrl+Alt+C`） | 马不停贴。/ Clip-clip, clop-clop. | 哒哒 | 代码 + 吉祥物 |

## 分镜 · 9:16 短版（20s）

S2（3s）→ S3（4s）→ S4（6s）→ S5 精选 3 类（4s）→ S8（3s）。

构图：面板为横向比例，竖版里居中放大面板并裁掉两侧的应用窗口；双字幕放在面板上方 1/4 区域，避开平台底部按钮和右侧互动栏；小马放在面板下方。

## 制作管线（已实现：`promo/`）

真机录屏效果差，改为代码合成：

- 面板 = 主仓库真实前端（`pnpm dev` @ :1420），以 iframe 嵌入；`promo/fixture.js` 用官网演示条目替代 Tauri 后端。
- 编辑器背景、按键、双字幕、吉祥物由 `promo/index.html` 按时间轴 `seek(t)` 绘制。
- `promo/render.mjs` 用 Playwright WebKit（与 macOS WKWebView 一致）逐帧 3x 截图 → ffmpeg lanczos 缩到 1080p，合成"哒"声。
- 真实性校验：按键真实发送给 app，时间线必须触发真实的 `paste_clip`，否则渲染失败。

```bash
(cd ../ClipClop && pnpm dev --host 127.0.0.1 --port 1420)
cd promo && npm i && npx playwright-core install webkit
node render.mjs --ar 16x9     # → out/promo-16x9.mp4
node render.mjs --ar 9x16     # → out/promo-9x16.mp4
node render.mjs --ar 16x9 --still 3.6,5.2   # 只出静帧
```

## 下一步

先做 spike：只完成 S3 + S4 两个镜头的 16:9 与 9:16 两版，把录屏、Remotion、双字幕、小马配合"哒"声这条管线打通，确认效果后再铺开全片。
