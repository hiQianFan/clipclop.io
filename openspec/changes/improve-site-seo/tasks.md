## 1. 修复本地化入口

- [x] 1.1 在语言解析边界兼容缺失的 `Accept-Language`，并用 Worker 测试验证无请求头时 302 到 `/en`、中文偏好时 302 到 `/zh`。
- [x] 1.2 运行完整 Worker 测试，确认下载、R2 资产及其他重定向行为没有回归。

## 2. 完善首页搜索语义

- [x] 2.1 更新 `src/i18n/home/en.ts` 与 `zh.ts` 的首页 title、description 和结构化数据文案，人工核对两种语言均明确“剪贴板历史、macOS、Windows”。
- [x] 2.2 在本地化首页输出 `SoftwareApplication` JSON-LD，并从构建产物解析 JSON，验证名称、类别、操作系统、本地化 URL、下载 URL、图片和免费 Offer 字段。

## 3. 核对爬虫与分享元数据

- [x] 3.1 检查构建后的中英文页面，确认 html lang、description、canonical、hreflang、Open Graph 和 Twitter metadata 与 locale 一致且图片 URL 有效。
- [x] 3.2 验证构建产物中的 `robots.txt` 指向 sitemap，且 `sitemap.xml` 恰好包含 8 个现有 canonical URL；保持静态实现且不新增依赖。

## 4. 质量与上线验证

- [x] 4.1 运行 `pnpm build`、项目测试和产物体积检查，确认构建通过、未压缩产物小于 500KB，并对首页执行 Lighthouse 验证 Performance 与 Accessibility 均高于 90。
- [ ] 4.2 部署后以真正缺少 `Accept-Language` 的请求验证 `https://clipclop.io/` 返回 302 `/en`，再由站点所有者在 Google Search Console 与 Bing Webmaster Tools 验证站点并提交 sitemap。

专用 1200×630 社交分享图在视觉资产确认后另行实施，不属于本次变更的完成条件。
