# ClipClop Official Website

> Your clipboard, always one shortcut away.

交互式产品演示与下载入口 - 通过滚动驱动的 App 体验展示 ClipClop 核心功能。

🌐 **官网**: [clipclop.io](https://clipclop.io) (TBD)  
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
| **[PROJECT.md](./PROJECT.md)** | 产品背景、用户场景、业务规则 | 涉及功能变更时 |
| **[docs/architecture.md](./docs/architecture.md)** | 系统架构、组件、数据流、部署 | 涉及技术方案时 |
| **主仓库 OpenSpec** | [build-interactive-marketing-website](https://github.com/hiQianFan/ClipClop/tree/main/openspec/changes/build-interactive-marketing-website) | 查看实现任务 |

---

## 🎨 核心设计

### 交互模式: 滚动驱动的 App 演示

**Desktop:**
```
┌────────────────────────────────────────┐
│          Hero Section (100vh)          │
│   Logo + Title + Download + Stars      │
└────────────────────────────────────────┘
                  ↓ 滚动
┌────────────────────────────────────────┐
│       完整 App 窗口 (sticky)            │
│  ┌──────────────┬──────────────────┐  │
│  │  Clip List   │  Preview Panel   │  │
│  │  (左 40%)    │  (右 60%)        │  │
│  │              │                  │  │
│  │ 1 Text ✓     │  大字号显示内容   │  │
│  │ 2 Link       │  + 描述文字       │  │
│  │ 3 Code       │                  │  │
│  │ ...          │                  │  │
│  └──────────────┴──────────────────┘  │
│                                        │
│  用户滚动 → List 选中项自动切换        │
│           → Preview 同步更新           │
└────────────────────────────────────────┘
```

**Mobile:** Quick Panel 垂直布局
- Panel 固定在顶部 (搜索 + clips)
- Preview sections 下方滚动
- 保持核心交互逻辑

### 设计系统

100% 遵循主仓库 [DESIGN.md](https://github.com/hiQianFan/ClipClop/blob/main/DESIGN.md):
- ✅ Tonal layering (4 层背景色阶)
- ✅ Monospace for content, Sans for chrome
- ✅ Single action color (#eceef0)
- ✅ Fixed px typography
- ✅ 140ms/160ms transition timing

---

## 🛠️ 技术栈

- **Astro 4.x** - 静态站点生成
- **Vanilla JS** - 零依赖交互
- **CSS Variables** - 设计 tokens
- **Intersection Observer** - 滚动检测 (原生 API)

**零外部依赖** - 无 React/Vue/Tailwind/GSAP

---

## 📦 部署

- **平台**: Vercel
- **分支**: `main` 自动部署到生产环境
- **域名**: TBD (clipclop.io 或 clipclop.dev)

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

- [ ] `pnpm build` 无错误
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] 支持 macOS/Windows 平台检测
- [ ] GitHub stars 实时显示 (或失败降级)
- [ ] 浅色/深色模式自动切换
- [ ] `prefers-reduced-motion` 生效
- [ ] 移动端 Quick Panel 布局正常

---

## 📖 相关资源

- 主仓库: [github.com/hiQianFan/ClipClop](https://github.com/hiQianFan/ClipClop)
- 设计系统: [DESIGN.md](https://github.com/hiQianFan/ClipClop/blob/main/DESIGN.md)
- OpenSpec 提案: [build-interactive-marketing-website](https://github.com/hiQianFan/ClipClop/tree/main/openspec/changes/build-interactive-marketing-website)
- 实现文档: [IMPLEMENTATION.md](./IMPLEMENTATION.md)

---

## 📄 License

遵循主仓库 [AGPL-3.0](https://github.com/hiQianFan/ClipClop/blob/main/LICENSE)
