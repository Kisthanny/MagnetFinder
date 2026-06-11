## 上下文

仓库已有 `.github/workflows/release.yml`（tag `v*` 触发，三平台矩阵构建并发布 release）。`master` 分支启用了 ruleset，其中「Require status checks to pass before merging」已开启但**无任何 check**，因此分支保护在「代码质量门禁」这一项上目前是空的。

项目使用 npm + electron-vite + TypeScript + React，已有可直接复用的脚本：

- `npm run typecheck` → `tsc --noEmit`
- `npm run build` → `electron-vite build`

项目**当前没有任何 ESLint 配置或依赖**，因此本变更需从零引入 ESLint，并新增 `npm run lint` 脚本供本地与 CI 共用。

`package-lock.json` 存在，CI 可用 `npm ci` 获得可复现安装。

## 目标 / 非目标

**目标：**
- 为项目引入 ESLint（flat config）与 `npm run lint`，覆盖 TS + React。
- 提供一个在面向 `master` 的 PR 上自动运行的校验流程：`npm ci` → `lint` → `typecheck` → `build`。
- 暴露一个名称稳定的 job，便于在 `master` ruleset 中选为 required status check。
- 与 `release.yml` 职责分离、互不触发。

**非目标：**
- 不打包安装包（`.dmg/.exe/.AppImage`）、不发布 release（那是 `release.yml` 的职责）。
- 不做跨平台矩阵校验（静态检查与编译期检查均与平台无关，单平台足够，节省 CI 时间）。
- 不引入单元测试步骤（项目当前无 test 脚本；后续可增量添加）。
- 不强制接入 Prettier / 格式化（本变更聚焦 lint 规则正确性，格式化可后续单独引入）。
- 不通过本变更自动修改仓库设置（required check 的勾选需在 GitHub UI 手动完成，文档说明）。

## 决策

**决策 1：触发方式用 `pull_request`，目标分支限定 `master`。**
- 通过 `on.pull_request.branches: [master]` 限定，仅校验进入 `master` 的 PR。
- 默认 PR 事件类型（opened / synchronize / reopened）即满足「新建」「追加提交」「重开」三种重跑诉求，无需显式列出。
- 替代方案：用 `push` 触发——被否决，因为目标是「合并前」门禁，PR 事件才能与 ruleset 的 required check 对接。

**决策 2：单平台运行（`ubuntu-latest`），不做矩阵。**
- typecheck/build 是平台无关的编译期校验，Linux 最快且免费额度消耗最低。
- 替代方案：三平台矩阵——否决，校验阶段无收益，且拖慢 PR 反馈、浪费额度；跨平台可执行性由 tag 发布时的 `release.yml` 矩阵保证。

**决策 3：job 命名稳定为 `verify`，便于设为 required check。**
- ruleset 的 required status check 按 job 名匹配，命名固定可避免将来改动导致 required check 失效。
- 文件名 `pr-verify.yml`，workflow `name: PR Verify`。

**决策 4：复用现有 npm scripts，`npm ci` 保证可复现。**
- 直接调用 `lint`、`typecheck` 与 `build`，与本地开发一致，避免重复定义命令。
- Node 版本与 `release.yml` 保持一致（Node 22），并启用 `actions/setup-node` 的 npm 缓存。

**决策 5：ESLint 采用 flat config + typescript-eslint + React 插件。**
- 使用现代 flat config（`eslint.config.js`），ESLint 9 默认形态，避免过时的 `.eslintrc`。
- 依赖：`eslint`、`typescript-eslint`（提供 TS 解析与推荐规则）、`eslint-plugin-react`、`eslint-plugin-react-hooks`（覆盖渲染层 React 与 Hooks 规则）、`globals`（声明 node/browser 全局）。
- 分目录适配环境：`src/main`、`src/preload`、`electron.vite.config.ts` 等按 Node 环境；`src/renderer` 按浏览器环境 + React 插件。
- 忽略 `out/`、`release/`、`node_modules/`、`dist/` 等产物目录。
- 采用「推荐规则集」为基线，必要时把个别噪音规则降级或关闭，确保首次落地可控、CI 不被无关告警阻塞。
- 替代方案：沿用旧版 `.eslintrc` JSON——否决，ESLint 9 起以 flat config 为主，新项目无必要走旧路。

**决策 6：lint 失败判定以 error 级别为准。**
- `npm run lint` 使用默认行为：存在 error 即非零退出使 CI 失败；warning 不阻塞。
- 可选加 `--max-warnings=0` 收紧，但首次落地先不收紧，避免历史告警一次性卡死 PR；后续可在另一个变更里收紧。

**决策 7：required check 的启用作为「实现后的手动设置步骤」记录在 tasks，而非代码。**
- 该 check 必须先在某个 PR 上跑过一次，名称才会出现在 ruleset 的可选列表里。顺序：合并/出现该 workflow → 在 PR 上首次运行 → 到 ruleset 勾选为 required。

## 风险 / 权衡

- [首次 required 勾选有先后依赖] → 缓解：tasks 中明确顺序——workflow 先在一个 PR 上运行产生 check 名称，再到 ruleset 勾选；文档写清。
- [仅单平台校验，可能漏掉平台特定的构建问题] → 缓解：可接受；平台特定问题在 tag 发布的三平台矩阵中暴露，且校验目标是快速门禁而非全面验证。
- [首次引入 ESLint 可能爆出大量历史告警/错误] → 缓解：以推荐规则为基线，对噪音规则适度降级；先不加 `--max-warnings=0`；必要时对少量现有代码做规范性修正（不改运行时行为）后再合入。
- [ESLint 版本与插件兼容性（flat config 需 ESLint 9 与配套插件版本）] → 缓解：安装时让包管理器解析匹配版本，本地 `npm run lint` 跑通后再提交锁文件。
- [ruleset 勾了 required 但 workflow 因故未运行会阻塞合并] → 缓解：触发条件简单且面向所有 PR，正常情况下必然运行；如遇异常可由管理员临时处理。

## 迁移计划

1. 新增 `.github/workflows/pr-verify.yml` 并合入 `master`（经一个 PR）。
2. 该 PR 运行后，`verify` check 出现在仓库的 status checks 列表中。
3. 到 `master` ruleset 的「Require status checks to pass」中把 `verify` 选为 required。
4. 回滚策略：从 ruleset 取消 required 勾选并删除该 workflow 文件即可，无运行时副作用。

## 开放问题

- 是否未来加入单元测试步骤与 Prettier 格式化？（当前无对应脚本，暂不纳入本变更）
- 是否后续收紧为 `--max-warnings=0`？（待首次落地、清理历史告警后再定）
