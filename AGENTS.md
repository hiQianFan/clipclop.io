# Repository instructions

ClipClop 官方网站 - 交互式产品演示与下载入口。

## Commands

安装依赖：
```bash
pnpm install
```

开发服务器：
```bash
pnpm dev
# 访问 http://localhost:4321
```

构建生产版本：
```bash
pnpm build
# 输出到 dist/
```

预览构建产物：
```bash
pnpm preview
```

## Required validation

- 所有更改必须通过 `pnpm build` 无错误构建
- 构建产物大小应 < 500KB (未压缩)
- Lighthouse Performance/Accessibility 分数 > 90

## Project constraints

### 设计系统同步

**本网站的设计 tokens 必须与主仓库 `DESIGN.md` 保持一致。**

当主仓库 `DESIGN.md` 更新时，需要手动同步以下内容到 `src/pages/index.astro` 的 CSS variables：
- 颜色 tokens (bg-*/text-*/action-*)
- 字体家族 (mono/sans)
- 圆角 (radius-*)
- 阴影 (panel-shadow)
- 动画时长 (dur-*)

**不要偏离主仓库设计系统创造新的视觉风格。**

### 零依赖原则

- 不引入 React/Vue/Svelte 等前端框架
- 不使用第三方 UI 组件库
- 交互逻辑使用 Vanilla JS
- 只使用原生浏览器 API (Intersection Observer, Fetch)

### 静态站点约束

- 无后端服务
- 无用户账号系统
- 下载链接指向 GitHub Releases: `https://github.com/hiQianFan/ClipClop/releases/latest`
- GitHub stars 通过公开 API 获取: `https://api.github.com/repos/hiQianFan/ClipClop`

## File ownership

### 不要编辑的文件

- `public/icon.png` - 从主仓库 `src-tauri/icons/icon.png` 复制,不在此处修改
- `public/favicon.svg` / `public/favicon.ico` - 由设计工具生成

### 单一事实源

| 内容 | 所有者 | 说明 |
|-----|--------|------|
| 设计 tokens | 主仓库 `DESIGN.md` | 网站只同步,不修改 |
| App icon | 主仓库 `src-tauri/icons/` | 网站复制使用 |
| 产品描述文案 | 本仓库 `src/pages/index.astro` | 网站专有 |
| 下载链接 | GitHub Releases | 网站不托管安装包 |

## Context routing

- **产品背景和目标**: 读取 `PROJECT.md`
- **滚动交互设计**: 读取主仓库 `openspec/changes/build-interactive-marketing-website/design.md`
- **实现进度**: 读取主仓库 `openspec/changes/build-interactive-marketing-website/tasks.md`

## Accessibility requirements

- 支持 `prefers-color-scheme` 自动浅色/深色模式切换
- 支持 `prefers-reduced-motion` 禁用动画
- 所有交互元素必须有 ARIA labels
- 键盘焦点必须可见 (`:focus-visible` outline)
- Color contrast ratio ≥ 4.5:1

## Browser support

- 现代浏览器 (Chrome/Firefox/Safari/Edge 最新两个版本)
- 依赖原生 Intersection Observer (95%+ 浏览器支持,无需 polyfill)
- 移动端 iOS Safari 12+ / Chrome Android 最新版

## Deployment

- **平台**: Vercel
- **分支**: `main` 分支自动部署到生产环境
- **域名**: TBD (clipclop.io 或 clipclop.dev)
- **环境变量**: 无需配置

构建命令: `pnpm build`  
输出目录: `dist/`

## Related repositories

- 主仓库: `github.com/hiQianFan/ClipClop`
- OpenSpec 提案: `ClipClop/openspec/changes/build-interactive-marketing-website/`
