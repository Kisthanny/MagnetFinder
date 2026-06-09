## Why

现有的 `references/pollingTorrent.py` 只能在 CLI 中使用，交互体验差、上手门槛高，每次使用都要打开终端运行脚本。需要一个布局合理、美观、即开即用的桌面 GUI，让用户用影视名称 + 清晰度等条件搜索磁力资源、一键复制磁力链接，并保留可扩展的多源查询能力（当前 PirateBay 单一源头不稳定）。

## What Changes

- 新增一个基于 React 的桌面应用（Electron 打包，双击即开即用、无需每次从源码启动）。
- 实现按影视名称搜索磁力/种子资源，并支持按清晰度（2160p / 1080p / 720p）、季、集进行筛选。
- 搜索结果以列表展示（名称、做种数、体积、清晰度标签等），按做种数排序。
- 选中某条结果后生成磁力链接并复制到系统剪贴板。
- 针对单集查询支持定时轮询（可开关、可配置间隔），轮询到新资源时提示。
- 抽象出可扩展的「搜索源适配器」接口：先实现 PirateBay（apibay）源，预留接口以便后续接入 1337X 等其他源，并支持在 UI 中切换/聚合源。
- 通过应用内的本地代理层发起对第三方源的网络请求，规避浏览器 CORS 限制并统一注入请求头。

## Capabilities

### New Capabilities
- `source-adapter`: 定义统一的搜索源适配器接口（搜索、结果归一化、磁力生成），内置 PirateBay 实现并预留多源扩展（如 1337X）。
- `torrent-search`: 按影视名称搜索，并支持清晰度 / 季 / 集筛选与结果排序、展示。
- `magnet-clipboard`: 由资源信息生成标准磁力链接（含 tracker），并复制到系统剪贴板。
- `episode-polling`: 针对指定季集的定时轮询，发现新资源时通知用户。
- `desktop-app-shell`: Electron 桌面应用外壳，提供即开即用启动、窗口承载 React UI，以及规避 CORS 的本地请求代理。

### Modified Capabilities
<!-- 无既有规范，留空 -->

## Impact

- 新增前端代码（React UI、状态管理、组件）与 Electron 主进程 / 预加载脚本。
- 新增源适配器模块与本地请求代理。
- 新增依赖：React、Electron、构建工具（Vite/electron-builder）、HTTP 客户端、剪贴板能力。
- 复用 `references/pollingTorrent.py` 中的查询逻辑、磁力生成、tracker 列表与筛选规则作为实现参考。
- 不修改既有 Python 脚本；它保留为参考实现。
