## Purpose

确保搜索引擎、社交平台和首次访问用户能够可靠进入 ClipClop 网站，并从每个本地化页面获得准确、一致且可验证的产品与语言信息。

## ADDED Requirements

### Requirement: 本地化入口始终可访问
系统 SHALL 根据受支持的 `Accept-Language` 首选项将无语言前缀的公开页面临时重定向到对应的 `zh` 或 `en` 页面，并在请求头缺失、不支持或不可用时回退到 `en`。

#### Scenario: 请求偏好中文
- **WHEN** 客户端访问无语言前缀的公开页面且 `Accept-Language` 首选中文
- **THEN** 系统返回 302 并重定向到对应的 `/zh` 页面

#### Scenario: 请求头缺失
- **WHEN** 客户端访问无语言前缀的公开页面且未发送 `Accept-Language`
- **THEN** 系统返回 302 并重定向到对应的 `/en` 页面，而不是返回服务器错误

#### Scenario: 缓存区分语言协商结果
- **WHEN** 系统返回基于 `Accept-Language` 的重定向
- **THEN** 响应声明 `Vary: Accept-Language` 且不得被共享缓存固化为单一语言

### Requirement: 本地化页面提供一致的搜索元数据
每个可索引的本地化页面 SHALL 提供与页面语言和内容一致的 title、description、canonical 及 `zh`、`en`、`x-default` alternate 链接；首页 title 和 description MUST 清楚说明产品类别及其支持 macOS 与 Windows。

#### Scenario: 搜索引擎读取英文首页
- **WHEN** 搜索引擎读取 `/en`
- **THEN** 页面元数据以英文描述 ClipClop 是面向 macOS 与 Windows 的剪贴板历史工具，并将 `/en` 声明为 canonical

#### Scenario: 搜索引擎读取中文首页
- **WHEN** 搜索引擎读取 `/zh`
- **THEN** 页面元数据以中文描述 ClipClop 是面向 macOS 与 Windows 的剪贴板历史工具，并将 `/zh` 声明为 canonical

### Requirement: 首页声明软件应用语义
每个本地化首页 SHALL 提供有效的 `SoftwareApplication` JSON-LD，且应用名称、类别、操作系统、页面 URL、下载 URL、图片和价格信息 MUST 与页面可见内容及实际产品保持一致。

#### Scenario: 结构化数据被解析
- **WHEN** 结构化数据解析器读取任一本地化首页
- **THEN** 它获得一个语法有效且包含 ClipClop 软件应用必要字段的 JSON-LD 对象

### Requirement: 爬虫发现文件保持完整
网站 SHALL 在 `/robots.txt` 允许公开页面抓取并指向 `/sitemap.xml`，且 sitemap SHALL 只列出实际存在的 8 个中英文 canonical 页面。

#### Scenario: 爬虫发现站点地图
- **WHEN** 爬虫读取 `/robots.txt` 和 `/sitemap.xml`
- **THEN** 它能够发现 sitemap，并获得首页、下载、更新日志和隐私页的中英文 canonical URL

### Requirement: 社交分享信息提供有效回退
每个本地化页面 SHALL 提供与页面内容一致的 Open Graph 和 Twitter 标题、描述、URL 与可访问图片；在专用宽屏分享图交付前，现有方形产品图片 SHALL 继续作为有效回退。

#### Scenario: 社交平台抓取页面
- **WHEN** 社交平台读取任一本地化页面
- **THEN** 它获得完整、语言一致且图片 URL 可访问的分享元数据
