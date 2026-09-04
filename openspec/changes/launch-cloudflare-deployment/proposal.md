## Why

ClipClop 官网仍未部署到正式域名，下载与自动更新入口也由 App 主仓库和 `clipclop.mapin.net` 持有，造成网站、域名和公开下载契约的所有权分散。产品尚未正式投入使用，因此现在应一次性迁移到 `clipclop.io`，避免为旧域名建立没有实际用户需求的兼容层。

## What Changes

- 为官网建立 GitHub 远程仓库，并以 `main` 分支作为生产部署源。
- 使用 Cloudflare Workers Static Assets 部署 Astro 静态产物，不引入 Cloudflare Pages。
- 将 App 主仓库现有的 Download Worker 行为和测试迁移到官网仓库，补充真正的 R2 binding，由同一个 Worker 提供网站、下载重定向、更新 manifest 和版本文件；不再依赖通过公开域名反向 fetch metadata。
- 在 `clipclop.io` 提供 `/download/macos`、`/download/windows`、`/latest.json` 和 `/releases/*` 公共入口，复用现有 `clipclop-releases` R2 bucket。
- 增加官网构建、产物大小、路由、缓存头及生产部署校验，并记录 Cloudflare DNS、Custom Domain、R2 binding、CI variables、secrets 和 Worker 版本回滚要求。
- 将官网所有正式下载链接切换到 `clipclop.io/download/*`，不得硬编码具体版本或安装包文件名。
- 更新 App 主仓库的 README、应用内下载/发布入口、Tauri updater endpoint、隐私与联网说明及发布流程生成的 manifest URL，使发布资产和新版 App 只使用 `clipclop.io`。GitHub Releases API 和源码记录链接仍保留为数据来源，不作为正式安装包入口。
- 在新域名完整验证后一次性停用 `clipclop.mapin.net` 的 Worker route 和公开下载入口，不增加重定向、代理或长期兼容规则。
- 从 App 主仓库删除已迁移的 Download Worker、Wrangler 配置和部署 workflow，避免两个仓库继续部署同一公开服务。
- 明确仓库边界：官网仓库拥有公开读取入口和 Cloudflare 路由，App 主仓库继续构建、签名并上传发布资产到 R2。

## Capabilities

### New Capabilities

- `cloudflare-site-delivery`: 规定官网通过 Workers Static Assets 在 `clipclop.io` 部署、验证、回滚及管理 Custom Domain 的行为。
- `release-distribution`: 规定稳定下载路由、R2 文件读取、缓存与错误响应、App 更新入口一次性迁移以及旧入口停用行为。

### Modified Capabilities

无。

## Impact

- 官网仓库：GitHub repository/remote、Cloudflare Worker 与 Wrangler 配置、R2 binding、部署 workflow、下载链接、部署文档和 Worker 路由测试。
- App 主仓库 `/Users/qianfan/Desktop/Code/ClipClop`：删除 `cloudflare/` Download Worker 与对应部署 workflow；更新 README、privacy、`src-tauri/tauri.conf.json`、应用内入口、分发文档和 release workflow 生成的 URL；保留更新日志使用的 GitHub API。
- Cloudflare：复用 `clipclop-releases` bucket；配置 `clipclop.io` DNS、Worker Custom Domain、R2 binding 和部署凭据；验证切换后停用 `clipclop.mapin.net` 路由。
- 对外契约：网站、下载、版本文件和新版 App 更新统一使用 `https://clipclop.io`；不承诺旧域名继续可用。
