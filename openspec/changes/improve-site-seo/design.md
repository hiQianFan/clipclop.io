## Context

参见 [proposal.md](./proposal.md)。网站由 Astro 生成静态本地化页面，Cloudflare Worker 负责无语言前缀入口和下载分发。共享布局已输出 canonical、hreflang、Open Graph 与 Twitter metadata；robots 和 sitemap 已覆盖当前固定路由。根路径故障来自 Worker 将可能为 `null` 的请求头直接交给字符串解析。

## Goals / Non-Goals

**Goals:**

- 在语言解析的单一入口处理缺失请求头，并留下最小回归测试。
- 继续以 `src/i18n/home/{locale}.ts` 作为本地化首页 SEO 文案的事实源。
- 使用静态生成的 JSON-LD 表达首页的软件产品语义，不增加客户端脚本和网络请求。
- 复用共享布局已有的页面级 SEO 输出。

**Non-Goals:**

- 不改变 `/zh`、`/en` 及其派生页面的 URL 结构，也不把 302 改为永久重定向。
- 不引入 CMS、SEO 组件层、schema 生成库或 `@astrojs/sitemap`。
- 不在本次代码变更中生成品牌视觉资产、操作站长平台或承诺搜索排名结果。
- 不添加 `meta keywords`、`llms.txt`、`humans.txt` 等没有当前产品需求或明确排名价值的文件。

## Decisions

### 1. 在语言解析函数边界归一化空值

语言解析入口先将 `null`/`undefined` 归一化为空字符串，再复用现有解析和英文回退逻辑。相比在每个调用方加判断，这能覆盖当前及未来所有调用路径，且不改变支持语言和质量权重行为。

### 2. SEO 文案留在各语言的首页内容模块

title、description 和 JSON-LD description 使用 `src/i18n/home/en.ts` 与 `zh.ts` 中的本地化值。页面只负责组合 URL、平台等稳定结构字段，避免把两种语言重新耦合进 Astro 模板，也不为单一 schema 新建通用 SEO 配置层。

### 3. JSON-LD 仅在首页就地输出

本地化首页直接输出一个服务端序列化的 `SoftwareApplication` 对象。当前只有首页需要该 schema，因此不扩展共享布局 API；当第二种结构化数据或多个页面确实需要复用时再抽象。

结构化数据使用本地化 canonical URL 和下载页 URL，声明 `UtilitiesApplication`、`macOS, Windows`、现有产品图片，以及价格为 0 的 Offer。字段必须以实际发布状态和页面内容为准。

### 4. robots 与 sitemap 保持静态

当前只有 8 个稳定 canonical URL，已有文件内容完整。手工静态文件比引入生成依赖更短、更透明；当路由数量或内容生成方式使人工同步产生实际错误时，再采用 Astro 官方 sitemap 集成。

### 5. 社交图片分离为非阻塞视觉任务

现有 680×680 图片能提供有效分享回退，因此本次不临时拉伸或自动裁切。专用 1200×630 资产需要视觉确认，交付后再将卡片切换为 `summary_large_image` 并补充图片尺寸与 alt metadata。

## Risks / Trade-offs

- [静态 sitemap 可能随新增路由遗漏] → 每次新增可索引页面时同步更新；页面规模明显增长后再自动生成。
- [JSON-LD 与可见文案发生漂移] → 复用同一语言内容对象，并在构建产物中校验关键字段。
- [更明确的关键词标题削弱品牌口号曝光] → title 优先搜索意图，页面 H1 和正文继续承载品牌表达。
- [站长平台状态无法通过仓库测试] → 将验证和 sitemap 提交列为部署后人工清单，不阻塞代码验收。

## Migration Plan

1. 先修复 Worker 并运行缺失请求头回归测试。
2. 更新本地化首页 SEO 文案并加入 JSON-LD。
3. 构建站点，检查生成 HTML、robots、sitemap、产物体积和现有自动化测试。
4. 部署后以无 `Accept-Language` 请求验证生产根路径不再返回 500，再提交 sitemap 到站长平台。
5. 若发生问题，回退本次提交；路由和数据模型均未迁移，无额外清理步骤。

## Open Questions

- 专用 1200×630 社交分享图的构图和文案将在独立视觉任务中确认。
