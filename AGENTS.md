# unocss-preset-uni

uni-app 的 UnoCSS 预设入口。它不实现规则，只按当前编译平台把上游预设拼起来：小程序走 `unocss-applet` 的 `presetApplet`（并叠 `preset-legacy-compat`），其它平台走 `presetWind3` / `presetWind4`。

## 项目

- **语言与类型**：TypeScript，`tsconfig.json` 开启 `strict` + `strictNullChecks`，`include: ["src"]`（测试与 playground 不在 typecheck 范围内），`moduleResolution: "bundler"`。
- **Node**：`engines.node: ">=22.12"` 是发布出去、对消费者生效的声明；`devEngines.runtime` 与 `.node-version` 固定 `26`，只影响开发环境（`onFail: "warn"`，不会硬失败）。
- **pnpm**：`packageManager` 与 `devEngines.packageManager` 都是 `pnpm@12.16.1`，`onFail: "warn"`。建议 `corepack enable`。
- **构建**：tsdown（catalog `utils`，`^0.23.4`）。`tsdown.config.ts`：`entry: src/index.ts`、`format: esm`、`dts: true`、`fixedExtension: true`，产物只有 `dist/index.mjs` + `dist/index.d.mts`。`package.json` 的 `exports` 只有 `.` 一项，`files: ["dist"]`，`sideEffects: false`，`prepublishOnly` 会先跑 `pnpm build`。
- **依赖**：所有版本都走 `pnpm-workspace.yaml` 的命名 catalog（`unocss` / `uni-app` / `vite` / `typescript` / `types` / `utils` / `eslint`），`package.json` 里写 `catalog:<name>`。`unocss` 与 `unocss-applet` 同时出现在 `peerDependencies` 和 `dependencies`（都用 `catalog:unocss`），所以消费者装本包时 peer 自动满足，不会出现缺失提示。
- **workspace**：`pnpm-workspace.yaml` 的 `packages` 只有 `playground`。发布包在仓库根目录，不在 `packages/` 下。
- **发布**：`bumpp` 升版本并打 `v*` tag，`refs/tags/v*` 触发 `.github/workflows/release.yml`（`changelogithub` + `pnpm publish --access public --no-git-checks`）。

## Commands

```bash
pnpm install              # 安装依赖（根 + playground）
pnpm dev                  # tsdown --watch，持续重建 dist
pnpm build                # 产出 dist/index.mjs + dist/index.d.mts
pnpm typecheck            # tsc --noEmit，只检查 src
pnpm test                 # vitest（watch 模式）
pnpm vitest run           # vitest 单次跑完
pnpm vitest run test/platform.test.ts   # 只跑单个文件
pnpm lint                 # eslint .
pnpm lint:fix             # eslint . --fix
pnpm play:h5              # npm -C playground run dev:h5
pnpm play:mp-weixin       # npm -C playground run dev:mp-weixin（在微信开发者工具里看产物）
pnpm build:h5             # 构建 playground 的 H5 产物
pnpm build:mp-weixin      # 构建 playground 的小程序产物
pnpm release              # bumpp：升版本 + commit + tag + push（维护者用）
```

CI（`.github/workflows/ci.yml`）在同一组命令上跑 `build` → `build:mp-weixin` → `build:h5` → `lint` → `test` → `typecheck`，矩阵是 ubuntu / macos / windows × Node.js 22 / 24 / 26。

## Architecture

| 文件 | 职责 |
| --- | --- |
| `src/index.ts` | 唯一的发布入口，`export *` 自 `preset-uni.ts` 与 `types.ts`。新增对外导出必须经过这里。 |
| `src/preset-uni.ts` | `presetUni`（`PresetFactory`）。探测一次平台，依次调 `resolveOptions` / `createPresets` / `createVariants` / `createTransformers`，并在 `configResolved` 里挂 transformer。 |
| `src/platform.ts` | `detectPlatform()`，把 `@uni-helper/uni-env` 的 `isMp` / `platform` 归一化成 `PlatformProfile` 值。这是全仓唯一 import `@uni-helper/uni-env` 运行时变量的地方。 |
| `src/options.ts` | `resolveOptions()`，把 `boolean \| T \| undefined` 归一成 `false \| T`，并按平台注入默认值。 |
| `src/presets.ts` | `createPresets()`，按 `profile.isMp` 在 `presetApplet` 与 `presetWind3`/`presetWind4` 之间选，按开关追加 `presetRemRpx`、`presetAttributify`。 |
| `src/transformers.ts` | `createTransformers()`，仅小程序且 `attributify` 开启时返回 `transformerAttributify`。 |
| `src/variants.ts` | `createVariants()`，`uni-<platform>:` 变体（`multiPass: true`，支持 `uni-[mp-weixin]:`）。 |
| `src/theme.ts` | `theme`，由 `builtInPlatforms` 派生 `theme.platforms`，含去 `mp-` 前缀的别名和 `mp` / `app` / `quickapp` 聚合项。 |
| `src/types.ts` | `UniPresetOptions`、`UserUniPresetOptions`、`ResolvedUniPresetOptions`、`PresetAttributifyOptions`。 |

- **平台只探测一次，之后当值传**，因为 `@uni-helper/uni-env` 在模块加载时就把 `process.env.UNI_PLATFORM` 定成了常量，同一进程里切不了平台。在 builder 里重新 import env 会让分支彻底不可测，新增 builder 请继续接收 `profile` 参数（默认参数只是兜底），不要在文件顶层读 env。`theme.ts` 例外：`builtInPlatforms` 是静态清单，各平台一致，不放进 profile。
- **`configResolved` 是 `presetUni` 唯一的运行时副作用**：它把 transformers 追加到 `config.transformers`，用户已配置的不能被覆盖（`test/preset-uni.test.ts` 覆盖了这条）。
- **`createVariants` 的平台判定是 `profile.platform.startsWith(matchPlatform)`**，所以 `uni-mp:` 会命中所有 `mp-*`。`profile.platform === undefined`（非构建场景，如 VSCode 插件直接加载 `uno.config.ts`）时不做平台过滤，剥离全部前缀，只为编辑器提示服务。
- **`remRpx.mode` 两端默认不同**：小程序端不传 `mode`（由 `presetRemRpx` 默认走 `rem2rpx`），其它平台传 `'rpx2rem'`。`resolveOptions` 里的这个差异是刻意的，改动会同时影响 README 的单位换算章节。
- 选项合并是浅合并，用户传入的键覆盖默认值；数组类选项（如 `ignoreAttributes`）整体替换，不拼接。
- playground 读的是 `dist/`：它通过 `workspace:*` 链接到本包并走 `exports`，所以改完 `src/` 要先 `pnpm dev` 或 `pnpm build` 才能在 playground 看到效果。

## Conventions

- **注释与文档统一用中文**，对外 JSDoc 写清楚契约（默认值、副作用、平台差异），不要复述代码。
- 依赖版本只改 `pnpm-workspace.yaml` 的 catalog 条目，不要在 `package.json` 写死具体版本。`unocss` 与 `unocss-applet` 要留在同一个 catalog 里对齐。
- **测试**：平台相关逻辑通过入参注入 `PlatformProfile` 跑两遍，不要 mock `@uni-helper/uni-env`。断言尽量看真实产物（`createGenerator` 出来的 CSS、`config.transformers`），而不是只看 `match()` 的返回值。
- **CI 与本地一致**：提交前跑 `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build`，动了 CSS 生成逻辑再加 `pnpm build:h5` / `pnpm build:mp-weixin`。
- **lint** 用 `@uni-helper/eslint-config`（antfu flat config，`type: 'lib'`、`unocss: true`），忽略 `dist`、`node_modules`。不要用 `eslint-disable` 绕过规则。
- **提交信息**遵循 Conventional Commits：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `build` / `ci` / `chore`，示例见 `git log`。
- **版本与上游耦合**：本预设的小版本跟 unocss / unocss-applet 的可用范围绑定，改 peer 范围时同步更新 README 的兼容性表格。
- **`dist/` 不进 git**（在 `.gitignore` 里），由构建与 `prepublishOnly` 产出。
- 改了 `src/index.ts` 的对外导出时，同步更新 README 的「API 参考」和 CONTRIBUTING 的「源码各文件职责」。
