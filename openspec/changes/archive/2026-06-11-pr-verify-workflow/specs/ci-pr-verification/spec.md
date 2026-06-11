## 新增需求

### 需求:PR 自动触发校验
系统必须在面向 `master` 的 Pull Request 上自动运行校验流程，覆盖 PR 的创建、推送新提交与重新打开，禁止依赖人工手动触发。

#### 场景:新建 PR 触发校验
- **当** 开发者创建一个目标分支为 `master` 的 Pull Request
- **那么** 校验 workflow 自动开始运行，并在该 PR 的 Checks 中显示状态

#### 场景:PR 追加提交重新校验
- **当** 一个已存在的 PR 被推送了新的提交（synchronize）
- **那么** 校验 workflow 必须基于最新提交重新运行

### 需求:代码规范、类型检查与构建校验
校验流程必须依次执行代码规范检查（ESLint）、类型检查与项目构建；任一步骤失败时，整个校验必须判定为失败。校验禁止打包安装包或发布产物。

#### 场景:校验通过
- **当** PR 代码能成功通过 `npm run lint`、`npm run typecheck` 且 `npm run build` 成功
- **那么** 校验 job 必须以成功状态结束

#### 场景:ESLint 违规导致失败
- **当** PR 代码存在 ESLint 规则违规（error 级别）
- **那么** `npm run lint` 步骤必须失败，且校验 job 标记为失败

#### 场景:类型错误导致失败
- **当** PR 代码存在 TypeScript 类型错误
- **那么** `npm run typecheck` 步骤必须失败，且校验 job 标记为失败

#### 场景:构建错误导致失败
- **当** PR 代码无法通过 `npm run build`
- **那么** 校验 job 必须标记为失败

### 需求:项目提供 ESLint 配置与脚本
项目必须提供可用的 ESLint flat config 与 `npm run lint` 脚本，覆盖主进程 / 预加载 / 渲染层的 TypeScript 与 React 代码，使本地与 CI 使用同一套规则。

#### 场景:本地可运行 lint
- **当** 开发者在本地执行 `npm run lint`
- **那么** ESLint 必须按统一配置检查源码并返回结果，CI 使用的是同一脚本与配置

#### 场景:覆盖 TS 与 React
- **当** 源码中存在 TypeScript 或 React（含 Hooks）层面的规则违规
- **那么** ESLint 必须能够检出对应问题

### 需求:可作为分支保护的 required 门禁
校验 workflow 必须暴露一个名称稳定、可被 `master` ruleset 选为 required status check 的 job，使未通过校验的 PR 无法合并。

#### 场景:校验失败阻止合并
- **当** 某 PR 的校验 job 处于失败状态，且该 job 已被设为 required status check
- **那么** 该 PR 必须无法合并到 `master`

#### 场景:job 名称稳定
- **当** 维护者在 ruleset 中选择 required status check
- **那么** 该校验 job 必须以一个稳定、可识别的名称出现在可选检查列表中

### 需求:与发布流程职责分离
PR 校验流程禁止由 tag 推送触发，也禁止产出或发布安装包；发布流程（tag 触发）与校验流程（PR 触发）必须相互独立、互不干扰。

#### 场景:tag 推送不触发校验
- **当** 推送一个 `v*` 版本 tag
- **那么** 仅发布 workflow 运行，PR 校验 workflow 禁止被触发

#### 场景:PR 不产出安装包
- **当** PR 校验流程运行
- **那么** 该流程禁止生成 `.dmg` / `.exe` / `.AppImage` 等安装包，也禁止创建 release
