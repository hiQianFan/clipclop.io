## Context

参见 [proposal.md](./proposal.md)。现有架构按技术类型组织，且 `docs/architecture.md` 明确要求完整页面留在 route、所有本地化内容集中于 `src/i18n`；这与本次确定的 feature co-location 方向直接冲突。`AGENTS.md` 还引用已不存在的 `src/pages/index.astro` 作为设计 token 和产品文案位置。迁移必须同时修正代码和当前文档，不能留下两套有效规则。

## Goals / Non-Goals

**Goals:**

- 让一个页面功能的 Astro 结构、文案、脚本、样式和专属资产可从一个 feature 目录发现。
- 保留 Astro `src/pages` 的文件路由职责，并让 route 只处理 locale 与 feature 装配。
- 明确 shared、feature、route、public 和 Worker 的依赖边界。
- 让 `docs/architecture.md` 与 `AGENTS.md` 准确描述迁移后的真实目录和所有权。
- 以构建产物和交互回归证明重排不改变外部行为。

**Non-Goals:**

- 不采用完整后端 DDD，不创建 entity、aggregate、repository、service、application 或 infrastructure 层。
- 不为每个 feature 机械创建 `components`、`utils`、`types` 等空目录。
- 不为了目录一致性复制共享 Header、Footer、Layout、Locale 类型或站点级文案。
- 不同时重做页面视觉、交互、SEO、路由或 Cloudflare 分发。
- 不将构建后的哈希文件手工提交到 `public/` 或 `dist/`。

## Decisions

### 1. 采用 feature-based co-location，而不是完整 DDD

目标结构为：

```text
src/
├── features/
│   ├── home/
│   │   ├── HomePage.astro
│   │   ├── home.css
│   │   ├── home.ts
│   │   ├── i18n/{en,zh}.ts
│   │   └── assets/              # 仅在 Home 使用时才存在
│   ├── download/
│   │   ├── DownloadPage.astro
│   │   ├── download.css
│   │   └── i18n/{en,zh}.ts
│   ├── changelog/
│   │   ├── ChangelogPage.astro
│   │   ├── changelog.css
│   │   ├── changelog.ts
│   │   └── i18n/{en,zh}.ts
│   └── privacy/
│       ├── PrivacyPage.astro
│       ├── privacy.css
│       └── i18n/{en,zh}.{ts,md}
├── pages/[lang]/                # 薄路由
├── components/                  # 已实际跨页面共享的 UI
├── layouts/                     # 共享 HTML 文档外壳
└── i18n/
    ├── config.ts                # Locale 类型与支持列表
    └── site/{en,zh}.ts          # Header/Footer 等站点级文案
```

目录只在有内容时创建。`HomePage.astro` 是 feature 的公开入口，不再是脱离行为和样式的半封装组件；Home 的演示区域仍作为 Home 内部实现，除非未来出现独立状态、可访问性与复用边界，否则不额外拆成 `InteractiveDemo.astro`。

备选方案是维持现有技术分层，但它继续让单个功能散落多处；完整 DDD 则没有相应业务复杂度，会增加无用概念。

### 2. Route 只表达 URL 与 locale 装配

每个 `src/pages/[lang]/*.astro` 保留 `getStaticPaths()` 和经过验证的 locale props，然后渲染对应 feature 入口。Feature 接收显式 locale，自行选择本地化内容并使用共享 Layout。Route 不包含页面 section、交互数据或页面 CSS。

这种边界保留 Astro 文件路由的可见性，同时允许删除 feature 时按目录清理。将 feature 直接放进 `pages` 的备选方案会让路由目录再次承担实现仓库职责。

### 3. 页面本地化内容跟随 feature，站点级内容保持共享

`src/i18n/home|download|changelog|privacy` 移到各自 feature 的 `i18n` 子目录；`src/i18n/config.ts` 和 `src/i18n/site` 保留，因为它们分别定义全站 locale 合同和共享站点外壳文案。Feature 可以依赖 shared locale 合同，shared 层不得反向依赖 feature。

这延续“一页一份完整语言文件”的原则，但将所有权从全局 i18n 技术目录改为具体功能。按语言建立顶层目录的备选方案会再次把同一页面拆散。

### 4. 页面脚本和样式由 Astro/Vite 处理

`public/scripts/index.js`、`public/scripts/changelog.js` 与页面级 CSS 移入所属 feature，并从 feature Astro 入口导入。迁移到 TypeScript 只增加必要类型，不重写已经工作的原生 DOM 逻辑。构建负责模块解析、TypeScript 转换、CSS 处理和最终资源输出。

不引入 React/Vue/Svelte 或 UI 组件库。脚本依然是 Vanilla JS 的浏览器行为，只是源码使用 `.ts` 并纳入构建图。

### 5. `public/` 仅存放需要稳定公开 URL 的原样资源

迁移完成后允许保留：

- `favicon.*` 与上游拥有的 `icon.png`；
- 被 metadata、Worker 或外部消费者按固定 URL 引用的共享公开图片；
- `robots.txt` 与当前静态 `sitemap.xml`；
- 其他确实要求固定路径、且不需要导入分析或转换的文件。

仅由单个 feature 使用的图片或图标应进入该 feature 的 `assets` 并通过源码导入。`public/` 不是“不需要写 TypeScript的代码目录”，也不再保存页面业务脚本和样式。

### 6. 文档与代码使用同一事实

`docs/architecture.md` 是当前架构事实源，必须完整重写源码树、职责、依赖方向、组件拆分规则和 `public/` 规则。`AGENTS.md` 必须把 token 同步位置和产品文案所有权更新为实际 feature 路径，并保持文件所有权约束。

`PRODUCT.md` 与 `docs/distribution.md` 只在存在目录或职责冲突时修改。全仓检索旧路径和旧概念；对于已经完成但未归档的 `clarify-astro-architecture` 等历史 change，不删除其决策过程，而在冲突文档顶部添加 superseded 说明并链接本变更。实施完成时，当前说明中不得同时声称“完整页面必须位于 route”和“完整页面属于 feature”。

## Risks / Trade-offs

- [一次移动多个页面容易产生导入或资源路径回归] → 按 Home、Download、Changelog、Privacy 顺序迁移，每个 feature 后构建检查。
- [Astro 处理脚本后执行时机或模块作用域变化] → 保持 DOM 合同和初始化时机，并对首页演示、主题、导航与更新日志做浏览器回归。
- [构建后的资源文件名可能哈希化] → 仅内部页面资源依赖构建 URL；外部契约继续留在 `public/`。
- [共享内容被错误复制进 feature] → 依赖方向固定为 route → feature → shared，站点 Header/Footer 文案保持单份。
- [历史提案与当前文档看似冲突] → 将 `docs/architecture.md` 定义为当前事实源，并在被取代的历史 change 上标注 superseded，而非删除历史。

## Migration Plan

1. 记录迁移前构建产物、路由、metadata、体积与关键浏览器行为基线。
2. 建立 shared/feature 边界，先迁移 Home 的 Astro、i18n、脚本、样式和专属资产并验证。
3. 依次迁移 Download、Changelog 和 Privacy，每步删除已无引用的旧文件与空目录。
4. 收敛 `public/`，保留固定 URL 资产和爬虫文件，验证所有生成资源可访问。
5. 更新 `docs/architecture.md`、`AGENTS.md` 及确有冲突的说明，为被取代的历史提案添加 superseded 标记。
6. 全仓检索旧路径和相互冲突的架构描述，运行生产构建、测试、体积、可访问性和 Lighthouse 验证。
7. 若发生无法局部修复的回归，按 feature 回退移动；本变更不涉及数据或外部 URL 迁移。
