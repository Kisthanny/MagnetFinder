## 1. i18n 基础设施（共享层）

- [x] 1.1 以 `zh-CN` 为基准定义统一 key 集合与 `Messages` 类型，创建 `src/shared/i18n/locales/` 下 5 个 locale 文件：`zh-CN.ts`、`en.ts`、`ja.ts`、`fr.ts`、`es.ts`（均实现同一 `Messages` 类型）
- [x] 1.2 创建 `src/shared/i18n/index.ts`：导出 `SUPPORTED_LANGUAGES`（含 code + 原生名：简体中文 / English / 日本語 / Français / Español）、`DEFAULT_LANGUAGE`、`getMessages(lang)`、`resolveSystemLanguage(locale)`（按前缀映射：`zh*`→zh-CN、`ja*`→ja、`fr*`→fr、`es*`→es、其余→en）
- [x] 1.3 将现有硬编码文案整理为 key（搜索、筛选、结果列表、轮询、状态反馈、菜单、窗口标题等），填充 5 种语言资源（zh-CN / en / ja / fr / es）

## 2. 主进程：语言权威源与持久化

- [x] 2.1 实现设置持久化模块：读写 `app.getPath('userData')/settings.json`（含 `language` 字段）
- [x] 2.2 启动时解析有效语言：已持久化偏好 ?? `resolveSystemLanguage(app.getLocale())` ?? 默认英文
- [x] 2.3 新增 IPC：`i18n:get`（返回当前语言与受支持列表）、`i18n:set`（持久化 + 重建菜单 + 广播 `i18n:changed`）
- [x] 2.4 在 preload 暴露 `getLanguage` / `setLanguage` / `onLanguageChanged` 及 `onOpenSettings`

## 3. 主进程：本地化应用菜单与设置入口

- [x] 3.1 用 `Menu.buildFromTemplate` 构建应用菜单，文案取自当前语言消息目录
- [x] 3.2 添加「设置」菜单项（macOS 置于应用菜单并绑定 `Cmd+,`；Win/Linux 置于应用菜单且保持菜单栏可见）
- [x] 3.3 点击「设置」→ `webContents.send('settings:open')`
- [x] 3.4 `i18n:set` 后重建菜单与更新窗口标题，使菜单文案随语言切换

## 4. 渲染层：i18n Provider 与设置面板

- [x] 4.1 实现 `I18nProvider` 与 `useT()`：从 `i18n:get` 初始化，订阅 `i18n:changed`，提供 `t(key, params?)` 含 `{name}` 插值
- [x] 4.2 在应用根部接入 `I18nProvider`
- [x] 4.3 实现 `SettingsPanel` 模态：语言下拉（展示原生名），监听 `settings:open` 打开，选择即调用 `setLanguage`
- [x] 4.4 为设置面板与模态添加样式

## 5. 文案替换（消除硬编码）

- [x] 5.1 替换 `App.tsx` 中的硬编码文案为 `t(key)`（标题、副标题、状态、轮询、toast 等）
- [x] 5.2 替换 `components/SearchControls.tsx` 文案（标签、占位符、按钮、清晰度筛选项、集筛选约束提示）
- [x] 5.3 替换 `components/ResultList.tsx` 文案（表头、复制按钮、NEW、未知清晰度等）
- [x] 5.4 处理 `shared/filter.ts` 的清晰度标签：改由 i18n key 提供，避免硬编码中文

## 6. 验证

- [x] 6.1 `npm run typecheck` 通过（含 i18n 类型）
- [x] 6.2 `npm run build` 通过
- [x] 6.3 启动验证：菜单「设置」打开面板、切换语言即时生效、菜单/标题随之更新
- [x] 6.4 验证默认系统语言与回退、重启后沿用已保存语言
- [x] 6.5 更新 README：多语言能力、新增语言的扩展步骤
