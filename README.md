# 磁力搜索器 (MagnetFinder)

一个有 GUI 的磁力链接（种子）搜索器。基于 **Electron + React + Vite** 构建，即开即用：

- 按影视名称搜索磁力 / 种子资源
- 按 **清晰度（2160p / 1080p / 720p）/ 季 / 集** 筛选，结果按做种数排序
- 一键生成标准磁力链接并复制到系统剪贴板
- 针对单集查询的 **定时轮询**，发现新资源时提示
- 可扩展的 **多源适配器** 接口（内置 The Pirate Bay，预留 1337X 等）
- 通过 Electron 主进程代理第三方源请求，规避浏览器 CORS 限制

> 本工具仅生成与复制磁力链接，不内置下载功能。资源合法性与使用合规由使用者自行承担。

## 环境要求

- Node.js ≥ 18（推荐 22）
- npm

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（启动窗口，支持热更新）
npm run dev
```

## 构建即开即用产物

```bash
# 仅编译（产物输出到 out/）
npm run build

# 打包为可双击启动的桌面应用（产物输出到 release/）
npm run build:mac     # macOS (.dmg)
npm run build:win     # Windows (.nsis)
npm run build:linux   # Linux (.AppImage)
```

打包完成后，在 `release/` 目录得到对应平台的安装包 / 可执行文件，双击即可启动，无需每次从源码运行。

## 项目结构

```
src/
  main/                 # Electron 主进程
    index.ts            # 创建窗口、加载渲染层
    http.ts             # 统一 HTTP 封装（注入请求头 / 超时，规避 CORS）
    ipc.ts              # IPC 通道（搜索 / 磁力 / 复制 / 轮询）
    search.ts           # 多源并行搜索 + 磁力生成服务
    polling.ts          # 主进程定时轮询管理器
    sources/            # 搜索源适配器
      types.ts          # SourceAdapter 接口
      registry.ts       # 源注册表
      piratebay.ts      # The Pirate Bay 适配器
      x1337.ts          # 1337X 占位适配器（可扩展示例）
      magnet.ts         # tracker 列表 + 磁力链接生成
  preload/
    index.ts            # contextBridge 暴露受控的 window.api
  shared/               # 主进程与渲染层共享代码
    types.ts            # 归一化数据结构与 IPC 类型
    filter.ts           # 清晰度 / 季 / 集筛选、排序、info_hash 校验
  renderer/             # React 渲染层
    index.html
    src/
      App.tsx           # 主界面与状态编排
      components/       # 搜索控件、结果列表
      styles.css
```

## 如何新增一个搜索源

1. 在 `src/main/sources/` 下新建适配器文件，实现 `SourceAdapter` 接口：

```ts
import type { SourceAdapter } from './types'

export const myAdapter: SourceAdapter = {
  id: 'mysource',
  displayName: '我的源',
  capabilities: { resolution: true, season: true, episode: true },
  async search(query) {
    // 请求源并返回归一化结果数组 NormalizedResult[]
  },
  async buildMagnet(result) {
    // 由结果生成磁力链接，无有效 info_hash 时返回 null
  }
}
```

2. 在 `src/main/sources/registry.ts` 中注册：

```ts
import { myAdapter } from './mysource'
register(myAdapter)
```

注册后，UI 会自动枚举到该源，可单选或与其它源聚合查询。无需改动 UI 或核心逻辑。

## 技术说明

- **CORS 规避**：渲染层不直接请求第三方源，所有源请求经 `preload` 暴露的 `window.api` → 主进程 IPC → Node 端 `fetch`（可自定义 `Origin` / `Referer` 等头）。
- **安全配置**：`contextIsolation: true`、`nodeIntegration: false`，渲染层仅能访问受控的 `window.api`。
- **轮询**：定时器位于主进程，不受渲染层页面状态影响；对比相邻两次结果（按 `info_hash` / `id` 去重）识别新增资源。

## 参考

实现参考了 `references/pollingTorrent.py`（CLI 版本）的搜索、筛选、磁力生成与 tracker 列表逻辑。该脚本保留为后备参考实现。
