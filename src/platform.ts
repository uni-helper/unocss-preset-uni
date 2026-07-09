import type { BuiltInPlatform } from '@uni-helper/uni-env'
import { isMp, platform } from '@uni-helper/uni-env'

/**
 * 当前编译平台的归一化描述，作为值在 builder 之间传递。
 *
 * 之所以把平台判定从「各文件各自 import `isMp` / `platform`」收敛成一个显式入参，
 * 是因为 `@uni-helper/uni-env` 在模块加载时就把 `process.env.UNI_PLATFORM` 冻结成常量，
 * 同一进程内无法对两个平台跑同一份分支逻辑，平台选择这条最值得测的链路因此没有测试面。
 * 改成入参后，`presetUni()` 在入口探测一次再向下传递，测试可显式构造两种 profile。
 *
 * 只包含**随构建变化的**字段（`isMp`、`platform`）；`builtInPlatforms` 在所有构建里是同一份静态清单，
 * 仍由 `theme.ts` 直接读取，不纳入 profile。
 */
export interface PlatformProfile {
  /** 是否为小程序平台（`mp-*`）。驱动 legacyCompat / applet / transformerAttributify 等小程序专属装配。 */
  isMp: boolean
  /** 当前编译平台（`process.env.UNI_PLATFORM`）。`undefined` 表示未在 uni-app 构建上下文中。 */
  platform: BuiltInPlatform | undefined
}

/**
 * 探测当前编译平台，返回归一化的 `PlatformProfile`。
 *
 * `@uni-helper/uni-env` 的导出是模块级常量，这里集中读取一次，避免 builder 各自重复 import。
 * 入口 `presetUni()` 显式调用一次并向下传递；各 builder 仅把它作为默认参数兜底，
 * 正常路径下由入口显式传值，从而不再直接 import env。
 */
export function detectPlatform(): PlatformProfile {
  return { isMp, platform }
}
