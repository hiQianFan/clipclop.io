# Architecture

ClipClop 官网是采用 feature-based co-location 的 Astro 静态站点。域名、部署和下载分发契约见 [distribution.md](./distribution.md)。本文件是当前源码架构的事实源；`openspec/changes/` 记录历史决策，不代替当前架构说明。

## 系统组成

```text
src/pages/[lang]/         Astro 文件路由；只解析 locale 并装配 feature
src/features/             按页面功能聚合结构、文案、脚本、样式和专属资产
src/layouts/              共享本地化 HTML 文档、metadata 和站点外壳
src/components/           已实际跨页面共享的 Header/Footer
src/i18n/                 全站 Locale 合同与共享站点文案
public/                   必须按稳定 URL 原样发布的静态文件
Cloudflare Worker         语言协商、静态资源和下载路由
Cloudflare R2             安装包、downloads.json、latest.json
GitHub API                Stars 与公开发布记录
```

浏览器端只使用原生 JavaScript 和浏览器 API。页面交互源码可以使用 TypeScript，但不引入 React、Vue、Svelte 或客户端运行时框架。网站没有账号、应用后端或运行时数据库。

## 源码结构

```text
src/
├── pages/
│   ├── index.astro               裸入口的静态回退；生产环境通常由 Worker 拦截
│   └── [lang]/
│       ├── index.astro           Home 薄路由
│       ├── download.astro        Download 薄路由
│       ├── changelog.astro       Changelog 薄路由
│       └── privacy.astro         Privacy 薄路由
├── features/
│   ├── home/
│   │   ├── HomePage.astro
│   │   ├── home.ts
│   │   ├── home.css
│   │   ├── i18n/{en,zh}.ts
│   │   └── assets/               Home 演示专属来源图标
│   ├── download/
│   │   ├── DownloadPage.astro
│   │   ├── download.css
│   │   └── i18n/{en,zh}.ts
│   ├── changelog/
│   │   ├── ChangelogPage.astro
│   │   ├── changelog.ts
│   │   ├── changelog.css
│   │   └── i18n/{en,zh}.ts
│   └── privacy/
│       ├── PrivacyPage.astro
│       ├── privacy.css
│       └── i18n/{en,zh}.{ts,md}
├── layouts/
│   └── LocalizedLayout.astro
├── components/
│   ├── SiteHeader.astro
│   └── SiteFooter.astro
└── i18n/
    ├── config.ts                 支持语言、Locale 与类型合同
    └── site/{en,zh}.ts           导航、页脚和外观控件文案
```

目录按实际需要创建，不为未来用途预建 `components`、`utils`、`types` 或 `services`。

## 模块职责与依赖方向

```text
Astro route → feature → shared layout/components/i18n config
Cloudflare Worker → Static Assets / R2
```

- Route 保留 `getStaticPaths()`，取得已验证的 locale，并把它显式传给对应 feature；不包含页面 section、交互数据或页面样式。
- Feature 是页面能力的所有者，负责页面结构、本地化内容、页面级脚本、样式和专属资产。
- Layout 负责 `<html>`、SEO metadata、Header、Footer 和内容 slot，不读取具体 feature 内容。
- Header/Footer 显式接收 locale，不从 URL 猜测语言；Header 只在构造语言切换链接时保留当前页面后缀和查询参数。
- Shared 层不得导入 feature。只有已经跨页面共享的实现才提升到 `components`、`layouts` 或站点级 i18n。

这是一种前端垂直切片，不是完整 DDD。项目不需要 entity、aggregate、repository、domain service 或 application/infrastructure 分层。

## 本地化

页面语言由 URL 前缀决定。构建期使用相同 feature 入口生成完整的中文和英文 HTML；客户端脚本不替换固定页面文案。

页面内容与所属 feature 共置，例如 `src/features/home/i18n/zh.ts` 与 `en.ts`。一个语言文件包含该页面的完整文案和数据，Home 演示数据归 Home 所有。Privacy 的固定长文使用 feature 内的 Markdown，不为两份文档引入 Content Collections、CMS 或运行时翻译层。

`src/i18n/config.ts` 是支持语言和类型合同的共享事实源；`src/i18n/site` 只保存 Header/Footer 等跨页面站点文案。

## 组件拆分

只在以下任一条件成立时拆组件：

- 已经被两个以上页面实际复用；
- 属于共享站点外壳；
- markup、状态、行为、样式与无障碍合同形成可独立维护的完整边界。

`HomePage.astro` 是 Home feature 的入口，连同 `home.ts`、`home.css` 和 Home i18n 形成完整模块。首页演示仍是 Home 内部实现；只有它形成独立行为边界时才拆为 `InteractiveDemo.astro`，不为缩短文件机械拆分。

## 源码资产与 `public/`

Feature 的 TypeScript 和 CSS 由 Astro/Vite 处理。需要模块导入、类型转换、依赖分析、压缩或哈希 URL 的页面资源放在 `src/features/<feature>/`，不放在 `public/`。

`public/` 只保留必须按稳定 URL 原样发布的文件：

| 文件 | 保留原因 |
|---|---|
| `favicon.ico`、`favicon.png`、`favicon.svg` | 浏览器和外部工具使用固定 URL；由设计工具生成 |
| `icon.png` | 来自主仓库 `src-tauri/icons/`；保持上游所有权 |
| `hero-logo.webp` | SEO/社交 metadata 使用固定绝对 URL |
| `clipclop-mark.svg` | Header 与页面 CSS 共享的固定 mask URL |
| `robots.txt` | 搜索引擎固定入口 |
| `sitemap.xml` | 当前 8 个稳定 canonical 页面，静态维护更直接 |

`public/` 不是业务代码目录，不保存页面级 JS 或 CSS。只有单个 feature 使用的图片进入该 feature 的 `assets/` 并通过源码导入。构建产物由 Vite 写入 `dist/_astro/`，不手工提交。

## 请求流

```text
clipclop.io/*
  └─ Cloudflare Worker
       ├─ /、/download、/changelog、/privacy：按 Accept-Language 302 到 /zh/* 或 /en/*
       ├─ /zh/*、/en/*：Workers Static Assets 返回对应语言的静态页面
       ├─ 匹配 dist/ 文件：Workers Static Assets 返回静态内容
       ├─ /download/{platform}：读取 R2 downloads.json 后 302
       ├─ /latest.json：返回 R2 updater manifest
       └─ /releases/*：返回 R2 不可变版本文件
```

## 构建与部署

- 构建命令：`pnpm build`
- 静态输出：`dist/`
- 目标运行平台：Cloudflare Workers Static Assets
- 正式域名：`clipclop.io`
- 部署来源：本仓库 `main` 分支
- 部署配置：`wrangler.toml`（Static Assets `ASSETS` + R2 `RELEASES`）
- 部署入口：`.github/workflows/deploy.yml`，通过检查后执行一次 `wrangler deploy`
- 回滚：Wrangler Worker version rollback，不修改 R2 发布对象

## 外部依赖

| 系统 | 职责 | 失败降级 |
|---|---|---|
| Cloudflare Workers Static Assets | 官网页面和静态资源 | 部署回滚到上一版本 |
| Cloudflare R2 | 安装包和更新 metadata | 下载路由返回 503 |
| GitHub API | Stars 和更新日志数据 | 隐藏动态数字或显示静态状态 |
| GitHub Releases | 源码发布记录和备用资产 | 不影响正式 R2 下载入口 |

## 不变量

- 所有页面静态生成，不增加 SSR adapter。
- canonical URL 包含 `/zh` 或 `/en`；裸页面 URL 只用于语言协商。
- 不引入应用后端、账号系统或服务端数据库。
- 默认下载链接只使用稳定平台端点，不硬编码版本文件名。
- 主仓库 `DESIGN.md` 是产品 UI tokens 的单一事实源。
- `public/icon.png` 和 favicon 仍由各自上游生成，不在本仓库修改。
- 动态外部请求必须有无错误日志的失败降级。
