## 1. 建立迁移基线

- [x] 1.1 记录现有 8 个本地化页面的构建输出、metadata、公开资源、产物体积与 Worker 测试结果，并以可重复命令确认基线通过。
- [x] 1.2 建立 `src/features` 的实际入口和共享依赖方向，不预建空目录；通过源码树检查确认 route → feature → shared 且 shared 不反向导入 feature。

## 2. 按功能聚合源码

- [x] 2.1 将 Home 的完整页面、两种语言内容、交互脚本、样式和仅 Home 使用的资产迁入 `src/features/home`，让 `/zh`、`/en` 薄路由只传递 locale；通过构建产物与浏览器检查验证演示、下载按钮、主题和导航行为不变。
- [x] 2.2 将 Download 的页面、两种语言内容和样式迁入 `src/features/download`；通过中英文构建 HTML 检查验证平台下载 URL、metadata 与可见文案不变。
- [x] 2.3 将 Changelog 的页面、两种语言内容、脚本和样式迁入 `src/features/changelog`；通过浏览器和失败降级检查验证 GitHub 发布记录加载行为不变。
- [x] 2.4 将 Privacy 的页面、两种语言 metadata、Markdown 正文和样式迁入 `src/features/privacy`；通过中英文构建 HTML 检查验证正文、链接和 SEO 信息不变。
- [x] 2.5 删除已无引用的旧页面实现、页面级 `src/i18n` 目录、`public/scripts`、`public/styles` 和空目录；通过全仓引用检索与构建确认不存在旧路径或重复实现。

## 3. 收敛静态公开资源

- [x] 3.1 将仅由单个 feature 使用且适合构建导入的资源迁入对应 `assets`，保留 favicon、上游 app icon、固定 metadata 图片、robots.txt、sitemap.xml 等稳定 URL 文件；通过生成 HTML 与资源请求确认不存在 404。
- [x] 3.2 检查 `public/` 不再包含页面业务 JS/CSS，并为每个保留文件确认固定 URL 或上游所有权理由；通过目录清单与 `docs/architecture.md` 对照验证一致。

## 4. 统一项目文档

- [x] 4.1 重写 `docs/architecture.md` 的源码树、职责、依赖方向、组件拆分、i18n co-location、构建资产和 `public/` 规则；通过与实际目录逐项对照确认文档只描述当前架构。
- [x] 4.2 更新 `AGENTS.md` 中设计 token 同步位置、产品文案所有权和相关目录引用，并核对 `PRODUCT.md`、`docs/distribution.md`；通过全仓检索确认当前说明不再引用不存在或已迁移的路径。
- [x] 4.3 为 `clarify-astro-architecture` 等结论被本变更取代的历史 OpenSpec 文档添加 superseded 标记和新提案链接；验证历史决策仍可阅读且不会被误认为当前规范。
- [x] 4.4 全仓检索“完整页面位于 route”“全部页面内容位于全局 i18n”“业务脚本/样式属于 public”等旧概念，删除或改写当前文档中的冲突描述，并人工确认只剩显式标记的历史记录。

## 5. 集成验证

- [x] 5.1 运行 `pnpm build`、Worker 测试和体积检查，确认静态路由完整、测试通过且未压缩 `dist/` 小于 500KB。
- [x] 5.2 对中英文首页、下载、更新日志和隐私页执行浏览器回归，确认视觉、交互、键盘焦点、语言切换、主题、metadata 和资源加载无回归。
- [x] 5.3 对代表性页面运行 Lighthouse，确认 Performance 与 Accessibility 均高于 90，并运行 OpenSpec 严格校验确认变更可实施。
