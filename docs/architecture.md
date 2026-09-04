# Architecture

ClipClop 官网是 Astro 静态站点。域名、部署和下载分发契约见 [distribution.md](./distribution.md)。

## 系统组成

```text
src/pages/[lang]/         页面组合根；每类页面一个 Astro 模板，通过 getStaticPaths 生成 zh/en 静态路由
src/i18n/                 按页面、再按语言组织的本地化文案、SEO metadata 与页面数据
src/layouts/              共享本地化 HTML 文档结构、metadata、Header/Footer 和页面 slot
src/components/           跨页面共享的 Header/Footer；不为缩短页面而机械拆分 section
public/                   图片与图标
Cloudflare Worker         静态资源与下载路由
Cloudflare R2             安装包、downloads.json、latest.json
GitHub API                Stars 与公开发布记录
```

浏览器端只使用原生 JavaScript 和浏览器 API。网站没有账号、应用后端或运行时数据库。

页面语言由 URL 前缀决定。构建期使用同一页面模板与 `src/i18n/` 内容生成完整的中文和英文 HTML；客户端脚本只负责产品演示、主题、平台识别和公开发布数据等动态行为，不负责替换固定页面文案。语言选项是保留当前页面后缀的普通链接，菜单触发按钮本身不导航。

## 源码职责

```text
src/
├── pages/[lang]/
│   ├── index.astro       首页完整结构，包括交互演示
│   ├── download.astro
│   ├── changelog.astro
│   └── privacy.astro
├── layouts/
│   └── LocalizedLayout.astro
├── components/
│   ├── SiteHeader.astro
│   └── SiteFooter.astro
└── i18n/
    ├── config.ts         支持语言和 Locale 类型
    ├── site/             跨页面导航、页脚和外观控件文案
    ├── home/             首页文案与交互演示数据
    ├── download/         下载页文案
    ├── changelog/        更新日志页文案
    └── privacy/          隐私页 metadata 与 Markdown 正文
```

路由文件是页面组合根：负责取得已经由 `getStaticPaths()` 验证的 locale、选择对应页面内容，并在 `LocalizedLayout` 内直接表达页面结构。Layout 只提供共享文档合同和站点外壳，不装载页面业务内容。

Locale 遵循单向数据流：`[lang]` 页面把 locale 传给 Layout，Layout 再显式传给 Header/Footer。共享组件不得自行通过 pathname 猜测当前语言；Header 仅可读取当前 URL 来保留语言切换时的页面后缀和查询参数。

组件只在以下任一条件成立时拆分：跨页面复用已经存在；组件属于共享站点外壳；或其 markup、状态、行为、样式与无障碍合同能够形成完整的独立边界。首页演示目前仍与首页脚本和样式共享一个 DOM 合同，因此保留在 `index.astro`，不创建只有 markup 的半封装组件。

本地化内容按“页面优先、语言次级”组织，例如 `src/i18n/home/zh.ts` 和 `en.ts`。一个语言文件包含该页面的完整内容；Home 的 Demo 数据归 Home 所有。固定的两份隐私长文使用本地 Markdown，不为它们引入 Content Collections、CMS 或运行时翻译层。

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

- 所有页面必须静态生成，不增加 SSR adapter。
- 页面规范 URL 必须包含 `/zh` 或 `/en`；裸页面 URL 仅作为语言协商入口。
- 不引入应用后端、账号系统或服务端数据库。
- 默认下载链接只能使用稳定平台端点，不得硬编码版本文件名。
- 主仓库 `DESIGN.md` 是产品 UI tokens 的单一事实源。
- `public/icon.png` 和 favicon 仍由其各自上游生成，不在本仓库修改。
- 所有动态外部请求必须有无错误日志的失败降级。
