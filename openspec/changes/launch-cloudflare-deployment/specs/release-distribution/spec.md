## Purpose

规定 ClipClop 安装包与自动更新文件在 `clipclop.io` 下的稳定公开契约，包括路由、安全校验、缓存、失败行为和一次性域名切换。

## ADDED Requirements

### Requirement: Platform downloads use stable first-party routes
系统 SHALL 在 `/download/macos` 和 `/download/windows` 接受 `GET` 与 `HEAD` 请求，读取 `downloads.json` 中对应平台的当前目标，并返回指向同域 `/releases/` 路径的 `302` 响应和 `Cache-Control: no-cache`。其他方法 MUST 返回 `405`。

#### Scenario: macOS download is available
- **WHEN** 客户端以 `GET` 或 `HEAD` 请求 `/download/macos` 且 metadata 包含有效 macOS 目标
- **THEN** 系统以 `302` 跳转到 `https://clipclop.io/releases/...` 下的当前 DMG

#### Scenario: Windows download is available
- **WHEN** 客户端以 `GET` 或 `HEAD` 请求 `/download/windows` 且 metadata 包含有效 Windows 目标
- **THEN** 系统以 `302` 跳转到 `https://clipclop.io/releases/...` 下的当前 NSIS 安装程序

#### Scenario: Unsupported method is used
- **WHEN** 客户端以 `GET` 和 `HEAD` 之外的方法请求平台下载路由
- **THEN** 系统返回 `405` 且不读取或修改发布 metadata

### Requirement: Download targets stay inside release storage
系统 MUST 只接受 `downloads.json` 中以 `/releases/` 开头的相对对象路径，并 SHALL 从 `clipclop-releases` R2 bucket 提供 metadata 与发布文件，不得将未验证目标转换成外部重定向。

#### Scenario: Metadata contains an unsafe target
- **WHEN** 平台目标缺失、不是字符串或不以 `/releases/` 开头
- **THEN** 系统返回 `503` 且不产生重定向

#### Scenario: Metadata cannot be read
- **WHEN** R2 不可用、`downloads.json` 不存在或内容无法解析
- **THEN** 系统返回 `503` 且不回退到 GitHub Releases 或其他下载地址

### Requirement: Updater manifest remains fresh
系统 SHALL 在 `/latest.json` 返回 R2 中当前的 Tauri updater manifest，并 MUST 使用阻止陈旧 manifest 被长期缓存的响应策略。

#### Scenario: App checks for an update
- **WHEN** App 请求 `/latest.json` 且 R2 中存在有效对象
- **THEN** 系统返回该对象及 `Cache-Control: no-cache`

#### Scenario: Updater manifest is unavailable
- **WHEN** `latest.json` 无法从 R2 读取
- **THEN** 系统返回明确的非成功响应且不返回旧的内置 manifest

### Requirement: Versioned release files are immutable
系统 SHALL 在 `/releases/v<version>/...` 返回对应 R2 对象，并 MUST 对成功响应使用 `public, max-age=31536000, immutable`；安装包 SHALL 保留适合下载的内容类型与文件名。

#### Scenario: Client downloads a versioned installer
- **WHEN** 客户端请求存在的版本化安装包对象
- **THEN** 系统返回该对象、正确的内容类型、下载文件名和一年 immutable 缓存头

#### Scenario: Versioned object does not exist
- **WHEN** 客户端请求不存在的 `/releases/` 对象
- **THEN** 系统返回 `404` 而不是静态网站页面

### Requirement: Release publishing remains atomic
App 发布流程 MUST 先完成版本化资产上传，再替换 `downloads.json` 和 `latest.json`，官网仓库 SHALL NOT 构建、签名或写入发布资产。

#### Scenario: Release upload is interrupted
- **WHEN** 任一版本化资产上传或签名验证失败
- **THEN** 发布流程不替换当前 `downloads.json` 或 `latest.json`

#### Scenario: Release upload completes
- **WHEN** 所有版本化资产和签名均已上传并通过验证
- **THEN** 发布流程最后更新两个 metadata 对象以公开新版本

### Requirement: Canonical domain cutover is one-time
官网、App updater、发布 manifest、下载文档和正式下载动作 MUST 使用 `https://clipclop.io`。新域名通过完整生产验证后，系统 SHALL 停用 `clipclop.mapin.net` 的下载 Worker route，且 SHALL NOT 提供旧域名重定向或代理兼容层。

#### Scenario: Cutover validation succeeds
- **WHEN** `clipclop.io` 的网站、两个平台下载、updater manifest、版本文件和缓存头全部通过生产验证
- **THEN** 运营人员停用旧域名 route，并使两个仓库中的正式 URL 仅指向 `clipclop.io`

#### Scenario: Cutover validation fails
- **WHEN** 任一新域名生产检查失败
- **THEN** 运营人员不执行旧域名停用，并先修复或回滚新 Worker
