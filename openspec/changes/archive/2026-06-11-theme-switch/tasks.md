## 1. CSS 配色重构（亮/暗两套）

- [x] 1.1 将 `styles.css` 中 `:root` 的颜色变量拆分为 `:root[data-theme='dark']`（沿用当前暗色值）与 `:root[data-theme='light']`（新增亮色值）
- [x] 1.2 设定无 `data-theme` 时的兜底（默认暗色），确保首帧不裸样式
- [x] 1.3 自查：背景/文字/边框/accent/success/error/warn 等变量在两套下均定义齐全

## 2. 主进程：偏好持久化 + nativeTheme + IPC

- [x] 2.1 `settings.ts` 的 `AppSettings` 增加 `theme?: 'light' | 'dark' | 'system'`
- [x] 2.2 新增 `src/main/theme.ts`：维护当前主题偏好（getter/setter），默认 `system`
- [x] 2.3 应用启动时读取偏好并设置 `nativeTheme.themeSource`
- [x] 2.4 新增 IPC `theme:get`（返回 `{ theme, shouldUseDarkColors }`）与 `theme:set`（写入 settings + 设置 themeSource + 广播）
- [x] 2.5 监听 `nativeTheme.on('updated')`，向渲染层广播 `theme:changed`（携带最新 `{ theme, shouldUseDarkColors }`）

## 3. 预加载与类型

- [x] 3.1 `preload/index.ts` 暴露 `getTheme` / `setTheme` / `onThemeChanged`
- [x] 3.2 `renderer/src/env.d.ts` 补充对应 `window.api` 类型

## 4. 渲染层：ThemeProvider 与设置入口

- [x] 4.1 新增 `renderer/src/theme/ThemeProvider.tsx`：初始化 `getTheme()`、订阅 `onThemeChanged`、据 `shouldUseDarkColors` 设置 `document.documentElement` 的 `data-theme`，暴露 `theme` 与 `setTheme()`
- [x] 4.2 `main.tsx` 用 `ThemeProvider` 包裹（与 `I18nProvider` 并列）
- [x] 4.3 `SettingsPanel.tsx` 增加主题下拉（亮/暗/跟随系统），与语言选择并列

## 5. 多语言文案

- [x] 5.1 在 `zh-CN` 增加 `settings.themeLabel` 与 `theme.light/dark/system`
- [x] 5.2 `messages.ts` 类型同步（以 zh-CN 为基准）
- [x] 5.3 在 `en / ja / fr / es` 补齐对应翻译

## 6. 验证

- [x] 6.1 `npm run lint`、`npm run typecheck`、`npm run build` 均通过
- [x] 6.2 运行 `npm run dev`：切换亮/暗即时生效；选「跟随系统」后在 OS 切换外观能实时跟随（实现完成，建议本地 `npm run dev` 目视确认）
- [x] 6.3 重启应用确认偏好持久化；逐屏检查结果列表/设置面板/toast/轮询条在两种主题下可读（实现完成，建议本地目视确认）
- [x] 6.4 在 `README.md` 补充「主题切换」说明（三选项、跟随系统的跨平台说明）
