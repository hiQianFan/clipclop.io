## Why

当前页面功能被按技术类型分散在 `src/pages`、`src/i18n`、`public/scripts` 和 `public/styles`，理解或删除一个页面需要跨多个顶层目录追踪文件。项目需要改为按功能垂直切片，让页面结构、文案、交互、样式和专属资产围绕同一个 feature 聚合，同时保持 Astro 路由和共享站点外壳清晰。

## What Changes

- 新增 `src/features/<feature>/` 边界，分别承载 Home、Download、Changelog 和 Privacy 的页面实现、页面级样式、浏览器脚本、本地化内容及专属资产。
- 将 `src/pages/[lang]/*.astro` 收敛为薄路由：只验证 locale、选择对应 feature 并渲染，不再承载完整页面实现。
- 保持 `src/components` 和 `src/layouts` 仅用于已实际跨页面共享的站点组件与文档外壳；共享 locale 类型和站点级导航文案继续保留在共同边界，不复制到各 feature。
- 将需要 TypeScript、模块导入、依赖分析或 CSS 构建处理的页面代码从 `public/` 移入所属 feature，由 Astro/Vite 打包。
- 将 `public/` 收敛为必须按稳定 URL 原样发布的文件，包括 favicon、上游拥有的 app icon、共享公开图片、robots.txt 和 sitemap.xml；不把业务实现继续放入该目录。
- 保持所有公开 URL、生成 HTML、交互、样式、多语言内容、SEO metadata、Cloudflare Worker 与下载行为不变。
- 更新 `docs/architecture.md`，将 feature-based/co-location、薄路由、共享边界、依赖方向和 `public/` 规则定义为唯一当前架构。
- 更新 `AGENTS.md` 及其他当前项目说明中指向旧目录或旧所有权的内容，特别是设计 token 与产品文案位置。
- 全仓检索并删除或改写与新结构冲突的现行说明；历史 OpenSpec 提案保留为决策记录，但必须明确新提案取代其中已过时的源码组织结论，避免将历史方案误认成当前规范。

## Capabilities

### New Capabilities

无。本变更只重组内部源码和文档，不增加外部可观察能力。

### Modified Capabilities

无。公开行为和既有产品要求保持不变，本变更通过 `skip_specs: true` 明确跳过行为规范。

## Impact

- 主要影响 `src/pages/[lang]`、`src/i18n`、`public/scripts`、`public/styles`、页面专属静态资产及其导入路径。
- 新增 `src/features`，但不引入完整 DDD 的 entity、repository、service 或 application/infrastructure 分层。
- 更新 `docs/architecture.md`、`AGENTS.md`，并核对 `PRODUCT.md`、`docs/distribution.md` 与其他当前说明。
- 不新增依赖、框架、运行时服务、路由、网络请求或构建阶段。
- 必须继续满足生产构建、500KB 体积、Lighthouse、可访问性和现有 Worker 测试要求。
