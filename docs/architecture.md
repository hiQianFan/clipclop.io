# Architecture

ClipClop 官网是 Astro 静态站点。域名、部署和下载分发契约见 [distribution.md](./distribution.md)。

## 系统组成

```text
src/pages/                Astro 静态页面
src/components/           共享网站组件
public/                   图片与图标
Cloudflare Worker         静态资源与下载路由
Cloudflare R2             安装包、downloads.json、latest.json
GitHub API                Stars 与公开发布记录
```

浏览器端只使用原生 JavaScript 和浏览器 API。网站没有账号、应用后端或运行时数据库。

## 请求流

```text
clipclop.io/*
  └─ Cloudflare Worker
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
- 不引入应用后端、账号系统或服务端数据库。
- 默认下载链接只能使用稳定平台端点，不得硬编码版本文件名。
- 主仓库 `DESIGN.md` 是产品 UI tokens 的单一事实源。
- `public/icon.png` 和 favicon 仍由其各自上游生成，不在本仓库修改。
- 所有动态外部请求必须有无错误日志的失败降级。
