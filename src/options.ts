import type { PlatformProfile } from './platform'
import type { ResolvedUniPresetOptions, UniPresetOptions } from './types'
import { detectPlatform } from './platform'

/**
 * 把 `boolean | T | undefined` 这种选项值统一处理成 `false | T`：
 * 传 `false` 就是关闭；传 `true` 或者不传就用默认值；传了具体配置就和默认值浅合并（用户传的优先）。
 */
function parseOption<T>(value: T | boolean | undefined, defaultValue?: T): false | T {
  if (value === false)
    return value

  if (value === true)
    return defaultValue ?? {} as T

  if (value) {
    return {
      ...defaultValue,
      ...value,
    }
  }

  if (defaultValue)
    return defaultValue

  return false
}

/**
 * 处理用户传进来的选项：每一项都从 `boolean | T | undefined` 转成 `false | T`，
 * 同时补上平台相关的默认值（`attributify: true` 时小程序端忽略 block/fixed；remRpx 两端的 mode 不一样）。
 *
 * 第二个参数 `profile` 表示当前编译平台，不传就自动探测。测试时可以手动传入，方便分别跑两种平台。
 */
export function resolveOptions(userOptions: Partial<UniPresetOptions> = {}, profile: PlatformProfile = detectPlatform()): ResolvedUniPresetOptions {
  const uno = parseOption(userOptions.uno, {})
  // attributify 默认关闭：上游作者建议默认写字面 `class`，开启后小程序端还会多一层构建期改写，
  // 不适合当默认值。只有用户显式开启时才套下面的平台默认值；
  // 小程序原生也有 block、fixed 这两个属性，开启时忽略它们，免得撞名。
  const attributifyDefaults = {
    ignoreAttributes: profile.isMp
      ? ['block', 'fixed']
      : undefined,
  }
  // 不传和传 `true` 必须区分：不传是关闭，`true` 才是“开启并套平台默认值”。parseOption 两者都走默认值，
  // 所以这里先用 `=== undefined` 把“不传”挑出来。
  const attributify = userOptions.attributify === undefined
    ? false
    : parseOption(userOptions.attributify, attributifyDefaults)
  // remRpx：小程序端不传 mode，让 presetRemRpx 自己默认走 rem→rpx；其它平台传 rpx2rem，保留 rem。
  const remRpx = parseOption(
    userOptions.remRpx,
    {
      mode: profile.isMp ? undefined : 'rpx2rem',
    },
  )

  return {
    ...userOptions,
    uno,
    remRpx,
    attributify,
  }
}
