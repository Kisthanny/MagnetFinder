## Context

参考脚本 `references/pollingTorrent.py` 通过 `apibay.org`（PirateBay 后端）实现了：按名称搜索、按清晰度/季/集筛选、生成带 tracker 的磁力链接、复制到剪贴板、单集定时轮询。它仅能在终端运行，体验受限。

目标用户是熟悉 React 网页开发的前端工程师，要求「即开即用」（双击启动，无需每次从源码运行）。同时存在两个技术约束：

1. **CORS**：浏览器直接请求 `apibay.org` / `1337x` 会被同源策略与缺失 CORS 头拦截，且无法自定义 `Origin`/`Referer` 等请求头。
2. **剪贴板与本地能力**：需要稳定的剪贴板写入与未来可能的本地持久化（历史、配置）。

## Goals / Non-Goals

**Goals:**
- 用 React 构建美观、布局合理的搜索 GUI。
- 打包为桌面应用，双击即开即用。
- 复刻并增强参考脚本的搜索 / 筛选 / 复制 / 轮询能力。
- 提供可扩展的多源适配器接口，先实现 PirateBay，预留 1337X 等。
- 通过本地代理层规避 CORS 并统一注入请求头。

**Non-Goals:**
- 不内置下载（BT 客户端）功能；仅生成并复制磁力链接。
- 不做账号系统、云同步、服务器部署。
- 不修改或废弃既有 Python 脚本。
- 首版不强制实现 1337X 适配器，只保证接口可扩展（可作为示例/占位）。

## Decisions

### 决策 1：Electron + React + Vite 作为桌面外壳
- **选择**：Electron 主进程承载窗口，渲染进程运行 Vite 构建的 React 应用；通过 `electron-builder` 打包成可双击启动的安装包/可执行文件。
- **理由**：用户熟悉 React 网页开发，Electron 能让其复用 Web 技术栈；Electron 自带 Node.js，可在主进程发起无 CORS 限制的 HTTP 请求并访问系统剪贴板，天然满足「即开即用」。
- **替代方案**：
  - *Tauri*：体积更小，但需 Rust 工具链，对纯前端用户上手成本高。
  - *纯浏览器 Web 应用 + 公共 CORS 代理*：依赖外部代理、不稳定、不满足「即开即用」的离线启动。
  - *本地 Node 服务 + 浏览器访问*：仍需手动启动服务，不够「即开即用」。

### 决策 2：源请求走 Electron 主进程代理（IPC）
- **选择**：渲染进程通过 `preload` 暴露的安全 IPC（`window.api.search(...)`）调用主进程；主进程用 Node HTTP 客户端请求第三方源，注入 `User-Agent`/`Origin`/`Referer` 等头，再把归一化结果返回。
- **理由**：彻底规避 CORS；集中处理请求头、超时、错误、源切换；渲染进程保持 `contextIsolation: true`、`nodeIntegration: false` 的安全配置。
- **替代方案**：渲染进程直接 `fetch`（被 CORS 阻断，且无法设置 `Origin`）。

### 决策 3：源适配器接口（SourceAdapter）
- **选择**：定义统一接口，每个源实现：
  - `id` / `displayName`
  - `search(query, options): Promise<NormalizedResult[]>`
  - `buildMagnet(result): string`
  - 能力声明（是否支持季/集筛选、分辨率等）。
- 归一化结果结构：`{ id, source, name, seeders, leechers, sizeBytes, infoHash?, resolution?, raw }`。
- 适配器在主进程注册到 registry，UI 通过 registry 列举可用源、单选或聚合查询。
- **理由**：把「源差异」收敛到适配器内部，UI 与轮询逻辑只依赖归一化结构，新增 1337X 仅需实现接口并注册。
- **替代方案**：在 UI 中写死 PirateBay 字段——不可扩展。

### 决策 4：清晰度/季/集筛选与磁力生成复用参考逻辑
- **选择**：沿用参考脚本的正则匹配（`2160p/1080p/720p`、`S0X|Season X`、`E0X|Episode X`）与 tracker 列表、磁力格式（`magnet:?xt=urn:btih:<hash>&dn=...&tr=...`）。PirateBay 缺 `info_hash` 时回退到详情页 `t.php?id=` 二次获取。
- **理由**：参考实现已验证可用，降低风险。

### 决策 5：轮询在主进程定时执行
- **选择**：单集查询时，主进程按可配置间隔（默认 60s）定时重新查询，对比上次结果集（按资源 id / infoHash 去重）发现新增项后经 IPC 通知渲染进程并提示。可在 UI 启停。
- **理由**：定时器放在主进程更稳定，不受渲染进程页面状态影响。
- **替代方案**：渲染进程 `setInterval`——窗口/页面状态变化时易丢失。

## Risks / Trade-offs

- [第三方源不稳定 / 接口变动] → 适配器隔离、错误可视化提示、预留多源切换与聚合降低单点依赖。
- [Electron 体积较大] → 接受；优先满足即开即用与 CORS 规避，使用 electron-builder 产出平台安装包。
- [源站点的反爬 / 频率限制] → 复用参考请求头、对轮询设默认 60s 间隔并允许调整，避免高频请求。
- [磁力可下载性 / 资源合法性] → 工具仅生成与复制链接、不下载；由用户自行承担使用合规性。
- [跨平台打包差异] → 首版聚焦当前开发平台（macOS），构建脚本保留跨平台配置。

## Migration Plan

全新项目，无存量数据。上线即初始化 React + Electron 工程脚手架、实现适配器与 UI，本地 `dev` 调试、`build` 产出可双击运行的应用。回滚策略：保留参考 Python 脚本作为可用后备。

## Open Questions

- 1337X 等第二源首版是否需要可用实现，还是仅提供接口与占位？（倾向：首版仅接口 + PirateBay 实现）
- 是否需要持久化搜索历史 / 收藏 / 源配置？（首版可不做，接口预留）
