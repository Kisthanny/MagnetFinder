## 为什么

`master` 分支已启用 ruleset，其中「Require status checks to pass before merging」已勾选，但目前**没有任何状态检查**，该规则形同虚设。需要一个在 Pull Request 上自动运行的校验流程，确保类型错误或构建失败的代码无法被合并到 `master`，把分支保护规则真正落地。

## 变更内容

- **从零引入 ESLint**：项目当前无任何 ESLint 配置/依赖，本变更新增 ESLint（flat config）与 `npm run lint` 脚本，覆盖 TypeScript + React 代码规范。
- 新增 GitHub Actions workflow，在面向 `master` 的 Pull Request（opened / synchronize / reopened）上自动运行。
- 校验内容：依赖安装（`npm ci`）→ 代码规范（`npm run lint`）→ 类型检查（`npm run typecheck`）→ 编译构建（`npm run build`）。
- 校验仅做静态检查与编译期验证，**不打包安装包、不发布**，与现有的 `release.yml`（tag 触发、产出安装包）职责分离。
- 该 workflow 的 job 作为 `master` ruleset 中「Require status checks」的 required check（仓库设置侧操作，非代码）。

## 功能 (Capabilities)

### 新增功能
- `ci-pr-verification`: 在 Pull Request 上自动执行代码规范（ESLint）、类型检查与构建校验，为分支保护提供可作为 required status check 的门禁；并为项目引入 ESLint 配置与 `lint` 脚本。

### 修改功能
<!-- 无现有功能的规范级行为变更 -->

## 影响

- 新增 `.github/workflows/pr-verify.yml`。
- 新增 ESLint flat config（`eslint.config.js`）与相关 devDependencies（eslint、typescript-eslint、react / react-hooks 插件等），`package.json` 增加 `lint` 脚本。
- 可能需要对现有源码做少量规范性修正以通过首次 lint（不改变运行时行为）。
- 仓库设置：在 `master` ruleset 中将该校验 job 选为 required status check（手动操作，文档说明）。
- 不改动应用的功能逻辑或运行时行为。
- 与 `.github/workflows/release.yml` 并存且互不触发（一个 PR 触发、一个 tag 触发）。
