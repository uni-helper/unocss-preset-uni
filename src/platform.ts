import type { BuiltInPlatform } from '@uni-helper/uni-env'
import { isMp, platform } from '@uni-helper/uni-env'

/**
 * 当前编译平台的描述，作为一个普通值在各个 builder 之间传递。
 *
 * 为什么不让每个文件自己去 import `isMp` / `platform`，而是统一传参？
 * 因为 `@uni-helper/uni-env` 在模块加载时就把 `process.env.UNI_PLATFORM` 定成了常量，
 * 同一个进程里没法切换平台跑两遍逻辑，平台选择这条最值得测的代码就完全测不到。
 * 改成传参之后，`presetUni()` 在入口探测一次再往下传，测试里就能分别构造两种平台来跑。
 *
 * 这里只放**会随构建变化**的字段（`isMp`、`platform`）；`builtInPlatforms` 在所有构建里都是同一份静态清单，
 * 由 `theme.ts` 直接读，不放进 profile。
 */
export interface PlatformProfile {
  /** 是不是小程序平台（`mp-*`）。小程序专属的装配（legacyCompat / applet / transformerAttributify）都看它。 */
  isMp: boolean
  /** 当前编译平台（`process.env.UNI_PLATFORM`）。`undefined` 表示不在 uni-app 构建环境里。 */
  platform: BuiltInPlatform | undefined
}

/**
 * 探测当前编译平台，返回一个 `PlatformProfile`。
 *
 * `@uni-helper/uni-env` 的导出是模块级常量，这里集中读一次，免得每个 builder 都去重复 import。
 * 入口 `presetUni()` 会调用一次并往下传；各 builder 只在默认参数里兜底，
 * 正常情况下都走入口显式传值，不再直接 import env。
 */
export function detectPlatform(): PlatformProfile {
  return { isMp, platform }
}
