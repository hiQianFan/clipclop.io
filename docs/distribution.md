# Cloudflare deployment and distribution

本文档是 ClipClop 官网域名、Cloudflare 部署和下载分发的单一事实源。

## 部署架构

ClipClop 官网只使用 Cloudflare 基础设施，不使用 Vercel、Netlify 或其他网站托管服务。

- Astro 继续生成纯静态 `dist/`。
- Cloudflare Workers Static Assets 托管并缓存官网文件。
- 同一个 Worker 处理稳定下载路由，并通过 R2 binding 读取 `clipclop-releases`。
- `clipclop.io` 的 DNS、Custom Domain、Worker、R2 配置和部署工作流全部由本仓库维护。
- 不使用 Cloudflare Pages。Workers Static Assets 是新项目的默认方案，也便于网站与下载逻辑一次部署。

```text
Browser / App
      │
      ▼
clipclop.io (Cloudflare Custom Domain)
      │
      ├── static page or asset ──► Workers Static Assets
      ├── /download/* ──────────► Download Worker logic
      ├── /latest.json ─────────► R2 object
      └── /releases/* ──────────► R2 immutable object
```

## 公共 URL 契约

- `https://clipclop.io/`：官网首页。
- `https://clipclop.io/download`：面向用户的下载页面。
- `https://clipclop.io/download/macos`：重定向到最新 macOS Universal DMG。
- `https://clipclop.io/download/windows`：重定向到最新 Windows x64 NSIS 安装程序。
- `https://clipclop.io/latest.json`：Tauri 自动更新 manifest。
- `https://clipclop.io/releases/v<version>/...`：不可变版本文件。

因为官网与下载均由同一个 Cloudflare Worker 承载，不需要 `download.clipclop.io`。单域名路径结构更短，也不存在跨托管平台的路由冲突。

### 域名决策

采用 `clipclop.io/download/*`，不创建 `download.clipclop.io`。

二级下载域名只在网站与下载服务由不同平台或不同基础设施承载时，才有助于划分 DNS 和路由所有权。ClipClop 的网站、下载 Worker 与 R2 均由 Cloudflare 和本仓库统一维护，同一个 Worker 可以直接按路径分发静态页面、下载重定向和版本文件，因此额外子域名只会增加 DNS、证书与配置表面。

只有未来需要将下载流量、访问策略、故障域或维护团队独立隔离时，才重新评估 `download.clipclop.io`。迁移前不得同时公开两套新的正式下载地址。

## 仓库所有权

本网站仓库负责：

- `clipclop.io` zone 的 DNS 与 Custom Domain 配置；
- 官网 Workers Static Assets 配置；
- Download Worker、R2 binding、`wrangler.toml`、测试与部署工作流；
- 下载页面、平台识别、稳定下载链接和错误响应；
- 公共 URL、缓存与响应头契约。

App 主仓库继续负责：

- 构建 macOS 与 Windows 发布资产；
- 生成并验证更新签名；
- 生成 `downloads.json` 与 `latest.json`；
- 上传版本文件与 metadata 到 R2；
- 发布 GitHub Release。

网站仓库控制域名和公共读取入口；App 仓库生产并写入可信发布资产。不得在网站代码中维护版本号或具体安装包文件名。

## 下载与缓存规则

- `/download/macos` 和 `/download/windows` 读取 `downloads.json`，只接受以 `/releases/` 开头的 bucket 内路径，然后返回 `302`。
- `downloads.json`、`latest.json` 和下载重定向使用 `no-cache`。
- `/releases/v<version>/...` 使用一年期 `public, max-age=31536000, immutable`。
- 下载 metadata 无效或 R2 不可用时返回 `503`，不得跳转到未经验证的外部地址。
- 官网 CI 只保存 `CLOUDFLARE_ACCOUNT_ID` repository variable 和 `CLOUDFLARE_API_TOKEN` production environment secret；该 token 只授予 Worker 部署所需权限，不授予 R2 写权限。
- R2 写入凭据只保存在 App 主仓库的 `production-release` environment。

## 部署与回滚

`wrangler.toml` 是部署配置的单一事实源：`ASSETS` 指向 `dist/`，`RELEASES` 绑定现有 `clipclop-releases`，Custom Domain 为 `clipclop.io`，公开 `workers.dev` 和 preview URL 均关闭。`.github/workflows/deploy.yml` 是唯一生产部署器；`main` push 或手动触发时依次运行测试、构建、大小检查、Lighthouse 和 `wrangler deploy`。

部署后记录 Wrangler 输出的 Worker version。生产异常时运行 `pnpm dlx wrangler rollback <VERSION_ID>` 恢复上一版本；Worker 回滚不修改 R2 对象。

`clipclop.mapin.net` 不属于公开兼容契约。确认 `clipclop.io` 的页面、下载、更新和版本文件全部正常后，停用旧 Worker route，不配置重定向或代理。
