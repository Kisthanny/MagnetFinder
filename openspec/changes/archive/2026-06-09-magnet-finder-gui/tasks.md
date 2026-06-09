## 1. 项目脚手架与即开即用基础

- [x] 1.1 初始化 Electron + React + Vite 工程结构（主进程 / 预加载 / 渲染进程目录划分）
- [x] 1.2 在 package.json 添加依赖：electron、react、react-dom、vite、electron-builder、HTTP 客户端
- [x] 1.3 配置 dev 脚本（Vite dev server + Electron 启动）与 build 脚本（electron-builder 产出可双击启动产物）
- [x] 1.4 配置 BrowserWindow：开启 contextIsolation、禁用 nodeIntegration，加载 React 入口
- [x] 1.5 配置 preload 脚本，通过 contextBridge 暴露受控的 `window.api`（search / buildMagnet / copyMagnet / startPolling / stopPolling）
- [x] 1.6 验证开发模式启动窗口与构建产物可双击启动

## 2. 本地请求代理与 IPC（desktop-app-shell）

- [x] 2.1 在主进程实现 HTTP 请求封装，统一注入 User-Agent / Origin / Referer 等请求头与超时
- [x] 2.2 建立渲染进程与主进程之间的 IPC 通道（搜索、磁力生成、复制、轮询）
- [x] 2.3 在主进程实现错误捕获与可读错误信息回传渲染层

## 3. 源适配器接口与注册表（source-adapter）

- [x] 3.1 定义 SourceAdapter 接口（id、displayName、search、buildMagnet、能力声明）与归一化结果类型 `{ id, source, name, seeders, leechers, sizeBytes, infoHash?, resolution?, raw }`
- [x] 3.2 实现源注册表（registry）：注册、按 id 获取、枚举可用源
- [x] 3.3 实现 PirateBay 适配器：调用 apibay.org `q.php` 搜索并归一化结果
- [x] 3.4 实现 PirateBay info_hash 缺失（全零值）时经 `t.php?id=` 二次获取的回退逻辑
- [x] 3.5 实现聚合查询：并行调用多源、合并结果、单源失败不阻断其他源
- [x] 3.6 预留 1337X 适配器占位（仅接口实现/示例，便于后续接入）

## 4. 磁力链接生成与剪贴板（magnet-clipboard）

- [x] 4.1 移植参考脚本的 tracker 列表与磁力格式 `magnet:?xt=urn:btih:<hash>&dn=...&tr=...`，对名称与 tracker 做 URL 编码
- [x] 4.2 实现由归一化结果生成磁力链接；无有效 infoHash 时标记为不可生成
- [x] 4.3 实现复制磁力链接到系统剪贴板，并向渲染层回传成功/失败结果
- [x] 4.4 渲染层对不可生成磁力的资源禁用复制并提示

## 5. 搜索与筛选逻辑（torrent-search）

- [x] 5.1 实现清晰度识别与筛选（2160p / 1080p / 720p 正则，未识别归为未知）
- [x] 5.2 实现按季筛选（`S0X|Season X` 正则）
- [x] 5.3 实现按集筛选（`E0X|Episode X` 正则），并强制集筛选依赖季的存在
- [x] 5.4 实现结果默认按做种数（seeders）降序排序

## 6. 轮询能力（episode-polling）

- [x] 6.1 在主进程实现可配置间隔（默认 60s）的定时轮询，支持启动/停止
- [x] 6.2 实现相邻两次结果按 id / infoHash 去重对比，识别新增资源
- [x] 6.3 发现新增资源时经 IPC 通知渲染层；无新增不打扰

## 7. GUI 界面（desktop-app-shell / torrent-search）

- [x] 7.1 搭建主界面布局：源选择、搜索输入与筛选区、结果列表区、反馈区
- [x] 7.2 实现源选择控件（单选 / 聚合），根据适配器能力声明动态展示筛选控件
- [x] 7.3 实现搜索输入与清晰度 / 季 / 集筛选控件，集筛选未选季时给出约束提示
- [x] 7.4 实现结果列表：展示名称、做种数、体积、清晰度标签，按做种数排序，提供复制按钮
- [x] 7.5 实现加载 / 无结果 / 错误 / 复制成功 / 新资源通知等状态反馈 UI
- [x] 7.6 实现轮询开关与间隔配置控件，并展示新资源通知

## 8. 联调与产物验证

- [x] 8.1 端到端联调：搜索 → 筛选 → 复制磁力 → 轮询通知全流程
- [x] 8.2 验证 CORS 规避有效（经主进程代理请求成功）
- [x] 8.3 构建 macOS 可双击启动产物并验证即开即用
- [x] 8.4 编写 README：开发启动、构建打包、新增源适配器的扩展说明
