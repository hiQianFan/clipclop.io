## Purpose

规定 ClipClop 官网在正式域名上的可访问性、部署门禁和回滚契约，使静态网站与下载服务由一个可验证的 Cloudflare Worker 发布。

## ADDED Requirements

### Requirement: Production site uses the canonical domain
系统 SHALL 通过 HTTPS 在 `clipclop.io` 提供生成后的官网页面、静态资源和下载服务，并 SHALL NOT 将 Cloudflare Pages 或公开 `workers.dev` 地址作为正式入口。

#### Scenario: Visitor opens the production site
- **WHEN** 访问者请求 `https://clipclop.io/`
- **THEN** 系统返回官网首页且浏览器无需跳转到其他托管域名

### Requirement: Static routes and distribution routes coexist
系统 SHALL 在同一个正式域名和 Worker 下同时提供静态网站路由与发布分发路由，并 SHALL 保持未知路径的静态站点响应行为不受下载处理逻辑干扰。

#### Scenario: Visitor opens a static page
- **WHEN** 访问者请求 `/privacy`、`/changelog` 或 `/download`
- **THEN** 系统返回对应的静态页面而不是下载服务错误响应

#### Scenario: Client requests a distribution route
- **WHEN** 客户端请求 `/download/macos`、`/download/windows`、`/latest.json` 或 `/releases/*`
- **THEN** 请求由发布分发行为处理而不是静态页面 fallback 处理

### Requirement: Production deployment is gated by validation
生产部署 SHALL 仅从官网仓库 `main` 分支发布，并 MUST 在发布前通过无错误生产构建、未压缩 `dist/` 小于 500KB、Worker 路由检查以及 Lighthouse Performance 和 Accessibility 均高于 90 的验证。

#### Scenario: Validation fails
- **WHEN** 任一必需的构建、大小、路由或 Lighthouse 检查失败
- **THEN** 系统不更新 `clipclop.io` 的生产 Worker 版本

#### Scenario: Validation succeeds
- **WHEN** `main` 分支提交通过全部必需检查
- **THEN** 部署流程发布一个可识别且可回滚的 Worker 版本

### Requirement: Production deployment can be rolled back
运营人员 MUST 能将 `clipclop.io` 回滚到前一个已验证的 Worker 版本，且回滚 SHALL NOT 修改或删除 R2 中的发布资产。

#### Scenario: Newly deployed site is unhealthy
- **WHEN** 新 Worker 版本上线后无法通过生产检查
- **THEN** 运营人员可以恢复上一 Worker 版本而不重新上传安装包
