## 1. 引入 ESLint

- [x] 1.1 安装 devDependencies：`eslint`、`typescript-eslint`、`eslint-plugin-react`、`eslint-plugin-react-hooks`、`globals`
- [x] 1.2 新增 `eslint.config.mjs`（flat config）：TS 基线 + React/Hooks 规则，按 main/preload(Node) 与 renderer(browser) 分环境
- [x] 1.3 配置 ignores：`out/`、`release/`、`dist/`、`node_modules/`
- [x] 1.4 在 `package.json` 增加 `"lint": "eslint ."` 脚本
- [x] 1.5 本地运行 `npm run lint`，对噪音规则适度降级、并修正现有源码的 error 级问题（不改运行时行为），直至通过（现有代码 0 问题，无需修正）

## 2. 新增 PR 校验 workflow

- [x] 2.1 创建 `.github/workflows/pr-verify.yml`，`name: PR Verify`
- [x] 2.2 配置触发：`on.pull_request.branches: [master]`（默认 opened/synchronize/reopened）
- [x] 2.3 配置单个 job `verify`，`runs-on: ubuntu-latest`
- [x] 2.4 步骤：checkout → setup-node（Node 22 + npm 缓存）→ `npm ci`
- [x] 2.5 步骤：`npm run lint`
- [x] 2.6 步骤：`npm run typecheck`
- [x] 2.7 步骤：`npm run build`
- [x] 2.8 确认不含任何打包/发布步骤（无 electron-builder、无 release 动作）

## 3. 本地验证

- [x] 3.1 本地运行 `npm run lint`、`npm run typecheck` 与 `npm run build` 确认三条命令均成功
- [x] 3.2 校验 `pr-verify.yml` 的 YAML 语法正确

## 4. 接入分支保护（实现后的仓库设置，手动）

- [x] 4.1 经一个 PR 将 `pr-verify.yml`、`eslint.config.js` 等合入 `master`，使 `verify` check 首次运行并出现在 status checks 列表
- [x] 4.2 在 `master` ruleset 的「Require status checks to pass before merging」中将 `verify` 选为 required
- [x] 4.3 用一个故意含 lint 违规或类型错误的测试 PR 验证：校验失败时合并被阻止；修正后校验通过、可合并

## 5. 文档

- [x] 5.1 在 `README.md` 补充「代码规范（ESLint）」与「PR 校验」说明（触发条件、校验内容 lint/typecheck/build、与发布流程的区别）
