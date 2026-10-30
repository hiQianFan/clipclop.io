---
target: 首页 homepage
total_score: 29
p0_count: 0
p1_count: 2
timestamp: 2026-09-28T16-14-11Z
slug: src-features-home-homepage-astro
---
## Design Health Score
总分 29/40（Good）。弱项：Help & Documentation 2；其余 3。
## Priority Issues
- [P1] ≤1100px 隐藏 Hero 下载按钮（home.css `@media(max-width:1100px){.hero-actions{display:none}}`），平板/窄窗口首屏无主 CTA，下一个 CTA 在约 10000px 之后。
- [P1] 内容单薄的根因：12 个 story 章节复用同一个 mock 画面，约 8 屏滚动只换高亮行与右侧文字；缺少“呼出→粘贴到目标应用”这一核心时刻。
- [P2] Hero 静态、签名快捷键 ⌃⌘C 是页面最小元素（72% 透明度）；tagline 与按钮间约 130px 空白。
- [P2] Hero→Demo 过渡中间态松散（大块空带 + 标题贴底）；移动端 app 窗口右侧溢出被裁切。
- [P2] Trust / Closing 为纯文字区，缺少证据与视觉。
## Minor
- Header 下载与更新日志间距不均；demo 列表第 1、4 行同一 URL；图片示例使用 app icon；CJK 文本在等宽字体下渲染。
