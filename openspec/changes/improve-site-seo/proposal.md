## Why

ClipClop 已具备基本的多语言 metadata、canonical、hreflang、robots.txt 和 sitemap，但生产环境根路径在缺少 `Accept-Language` 时会返回 500，直接影响爬虫与首次访问用户。现有首页标题、结构化数据和社交分享信息也未充分表达产品类别与支持平台，需要在不增加维护负担的前提下补齐。

## What Changes

- 修复无 `Accept-Language` 请求访问根路径及派生入口时的语言选择，使其稳定回退到英文并保留 `Vary: Accept-Language`。
- 为根路径语言协商增加覆盖“请求头不存在”的回归测试。
- 优化中英文首页 title 与 description，明确 ClipClop 是面向 macOS 和 Windows 的剪贴板历史工具。
- 在本地化首页加入准确、与可见内容一致的 `SoftwareApplication` JSON-LD。
- 保留现有静态 `robots.txt` 和 `sitemap.xml`；当前固定的 8 个公开页面无需引入 sitemap 集成或生成管线。
- 保留现有方形分享图作为当前回退；将专用 1200×630 社交分享图及 `summary_large_image` 作为独立视觉资产工作，不阻塞本次实现。
- 记录部署后的站长平台验证与 sitemap 提交事项，但不把外部账号操作伪装为代码能力。

## Capabilities

### New Capabilities

- `search-discovery`: 定义搜索引擎和社交平台能够稳定访问、理解并索引 ClipClop 多语言页面的行为要求。

### Modified Capabilities

无。当前 `openspec/specs/` 中没有需要修改的既有能力规范。

## Impact

- 影响 Cloudflare Worker 的本地化入口重定向、首页 i18n SEO 文案、首页 HTML metadata/JSON-LD，以及相应测试。
- `public/robots.txt` 与 `public/sitemap.xml` 经核对后保持现状，不新增运行时依赖或 Astro 集成。
- 不改变公开页面 URL、下载 URL、语言前缀策略或现有 canonical/hreflang 契约。
- Search Console、Bing Webmaster Tools、GitHub/外部站点链接属于部署后的运营动作，需要站点所有者权限。
