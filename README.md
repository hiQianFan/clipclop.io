# ClipClop Official Website

> Your clipboard, always one shortcut away.

交互式产品演示与下载入口 - 通过滚动驱动的 App 体验展示 ClipClop 核心功能。

🌐 **官网**: [clipclop.io](https://clipclop.io)

📦 **主仓库**: [github.com/hiQianFan/ClipClop](https://github.com/hiQianFan/ClipClop)

---

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:4321

# 构建生产版本
pnpm build

# 预览构建产物
pnpm preview
```

---

## 📋 项目文档

本项目遵循 [AGENTS.md 规范](https://agents.md/) 和渐进式披露原则:

| 文档 | 内容 | 何时阅读 |
|-----|------|---------|
| **[AGENTS.md](./AGENTS.md)** | Agent 操作协议、命令、约束和索引 | 首次协作必读 |
| **[PRODUCT.md](./PRODUCT.md)** | 产品定位、用户与设计原则 | 涉及产品或内容变更时 |
| **[docs/architecture.md](./docs/architecture.md)** | 系统架构、组件、数据流、部署 | 涉及技术方案时 |
| **[docs/distribution.md](./docs/distribution.md)** | Cloudflare、R2、域名与下载契约 | 涉及部署或下载时 |
| **[openspec/changes](./openspec/changes/)** | 本网站的待实施变更 | 评审或实施变更时 |

---

## 🎨 设计与交互

### 交互模式: 滚动驱动的 App 演示

首页通过滚动驱动的 App 演示展示剪贴板历史、搜索、预览与键盘操作。演示只呈现桌面应用已有能力，不创造额外的网页交互概念。

### 设计系统

100% 遵循主仓库 [DESIGN.md](https://github.com/hiQianFan/ClipClop/blob/main/DESIGN.md):
- ✅ Tonal layering (4 层背景色阶)
- ✅ Monospace for content, Sans for chrome
- ✅ Single action color (#eceef0)
- ✅ Fixed px typography
- ✅ 140ms/160ms transition timing

---

## 🛠️ 技术栈

- **Astro 7.x** - 静态站点生成
- **Vanilla JS** - 零依赖交互
- **CSS Variables** - 设计 tokens
- **Intersection Observer** - 滚动检测 (原生 API)

**零客户端框架** - 无 React/Vue/Svelte 或第三方 UI 组件库

---

## 📦 部署

- **平台**: Cloudflare Workers Static Assets
- **目标分支**: `main` 部署到生产环境
- **正式域名**: `clipclop.io`
- **安装包与更新**: Cloudflare R2
- **下载入口**: `clipclop.io/download/*`

域名、Cloudflare Worker、R2 分发边界和迁移要求见 [docs/distribution.md](./docs/distribution.md)。

**构建产物:**
- 目录: `dist/`
- 大小: < 500KB (未压缩)
- 性能: Lighthouse > 90

---

## 🔒 隐私承诺

- ❌ 无 Google Analytics
- ❌ 无 Facebook Pixel
- ❌ 无第三方跟踪
- ✅ 符合 ClipClop Privacy-First 理念

---

## 🧪 验收标准

以 [AGENTS.md](./AGENTS.md) 中的 Required validation、无障碍与浏览器要求为准，不在此处重复维护。

---

## 📖 相关资源

- 主仓库: [github.com/hiQianFan/ClipClop](https://github.com/hiQianFan/ClipClop)
- 设计系统: [DESIGN.md](https://github.com/hiQianFan/ClipClop/blob/main/DESIGN.md)
- 网站变更提案: [openspec/changes](./openspec/changes/)
- 部署与下载契约: [docs/distribution.md](./docs/distribution.md)

---

## 📄 License

遵循主仓库 [AGPL-3.0](https://github.com/hiQianFan/ClipClop/blob/main/LICENSE)
