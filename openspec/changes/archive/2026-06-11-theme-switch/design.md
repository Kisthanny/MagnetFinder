## 上下文

应用为 Electron + React + Vite。外观由 `src/renderer/src/styles.css` 中 `:root` 的一组 CSS 变量（`--bg`、`--text`、`--accent` 等）驱动，目前**只有一套暗色**配色。

语言切换已建立一套成熟模式可直接借鉴：

- 偏好持久化在主进程 `settings.ts`（`userData/settings.json`），主进程为权威源（`src/main/language.ts`）。
- 主进程通过 IPC 暴露 `i18n:get` / `i18n:set`，并在变更时向渲染层广播 `i18n:changed`。
- 渲染层用 React Context（`I18nProvider` + `useT`）消费，`SettingsPanel` 内提供下拉选择。

主题与语言的差异点在于「跟随系统」：需要解析操作系统当前外观并响应其变化。Electron 提供 `nativeTheme`（主进程），其 `themeSource` 可设为 `'system' | 'light' | 'dark'`，`shouldUseDarkColors` 给出解析后的布尔值，并在系统外观变化时触发 `updated` 事件——跨平台可用，优于仅渲染层 `matchMedia` 的方案。

## 目标 / 非目标

**目标：**
- 设置面板提供「亮色 / 暗色 / 跟随系统」三选项，即时生效、持久化、默认跟随系统。
- 「跟随系统」实时响应 OS 外观变化（跨平台）。
- 提供完整的亮/暗两套 CSS 变量。

**非目标：**
- 不提供自定义主题色 / 多套配色（仅亮、暗两套）。
- 不做按时间自动切换（早晚主题）等高级特性。
- 不改动核心业务逻辑与既有 i18n 行为。

## 决策

**决策 1：主题偏好沿用语言的「主进程权威 + settings.json + IPC」模式。**
- `AppSettings` 增加 `theme?: 'light' | 'dark' | 'system'`；新增 `src/main/theme.ts` 维护当前偏好（与 `language.ts` 对称）。
- 新增 IPC：`theme:get`（返回 `{ theme, shouldUseDarkColors }`）、`theme:set`；广播 `theme:changed`（携带 `{ theme, shouldUseDarkColors }`）。
- 理由：与现有架构一致，降低认知成本；偏好集中持久化。

**决策 2：用 Electron `nativeTheme` 解析「跟随系统」并驱动原生外观。**
- 设置偏好时令 `nativeTheme.themeSource = theme`；监听 `nativeTheme.on('updated', …)`，在系统外观变化（仅当偏好为 system 时有意义）时向渲染层广播最新 `shouldUseDarkColors`。
- 同时使原生控件（滚动条、表单控件等）跟随，避免与页面配色割裂。
- 替代方案：渲染层 `window.matchMedia('(prefers-color-scheme: dark)')`——否决为主方案，因为不驱动原生外观；但可作为退化兜底。

**决策 3：渲染层以根节点 `data-theme` 属性应用配色，CSS 变量按属性分组。**
- 解析后的外观（light/dark）写到 `document.documentElement.dataset.theme`。
- `styles.css` 重构：把变量定义在 `:root[data-theme='dark'] { … }` 与 `:root[data-theme='light'] { … }`；其余样式继续引用 `var(--…)`，无需逐处改动。
- 新增 `ThemeProvider` + `useTheme`（与 `I18nProvider` 对称）：初始化时 `getTheme()`，订阅 `onThemeChanged`，据 `shouldUseDarkColors` 设置 `data-theme`，并暴露 `theme`（偏好）与 `setTheme()`。
- 理由：`data-theme` 切换零闪烁、改动面小；偏好与「解析后外观」分离清晰。

**决策 4：默认值为 `system`。**
- 无已保存偏好时默认跟随系统，符合主流应用习惯；现有暗色用户在暗色系统下观感不变。

**决策 5：主题文案接入 i18n。**
- 5 个 locale 增加 `settings.themeLabel` 与 `theme.light/dark/system`，`messages.ts` 类型同步（缺漏即编译期报错）。

## 风险 / 权衡

- [新增亮色方案需覆盖全部既有样式，易遗漏个别元素] → 缓解：以 CSS 变量为唯一颜色来源，集中在变量层切换；实现后在两种主题下逐屏检查结果列表、设置面板、toast、轮询条等。
- [Linux 下系统外观信号因桌面环境而异，`nativeTheme` 可能不准] → 缓解：可接受；用户仍可显式选亮/暗。文档注明跟随系统在不同平台的差异。
- [启动瞬间主题未就绪可能闪一下] → 缓解：窗口 `show: false` + `ready-to-show` 再显示（现有逻辑）；渲染层尽早在首帧前应用 `data-theme`。
- [偏好 system 时持久化存的是 system 而非解析值] → 缓解：明确存「偏好」而非「解析结果」，解析在运行时按 `nativeTheme` 实时进行。

## 迁移计划

1. 重构 `styles.css` 变量为亮/暗两套（暗色沿用当前值）。
2. 主进程接入 settings/theme 模块、`nativeTheme`、IPC 与广播。
3. 预加载与类型声明扩展。
4. 渲染层 `ThemeProvider`/`useTheme`、`main.tsx` 包裹、`SettingsPanel` 主题下拉、i18n 文案。
5. 回滚：移除主题相关代码与 CSS 分组、恢复单套 `:root` 即可，无数据迁移负担（`settings.json` 多余字段会被忽略）。

## 开放问题

- 暂无。亮色配色的具体色值在实现时确定（以对比度与可读性为准）。
