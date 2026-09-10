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

  if (value)
    return { ...defaultValue, ...value }

  if (defaultValue)
    return defaultValue

  return false
}

/**
 * 处理用户传进来的选项：每一项都从 `boolean | T | undefined` 转成 `false | T`，
 * 同时补上平台相关的默认值（小程序端的 attributify 要忽略 block/fixed；remRpx 两端的 mode 不一样）。
 *
 * 第二个参数 `profile` 表示当前编译平台，不传就自动探测。测试时可以手动传入，方便分别跑两种平台。
 */
export function resolveOptions(userOptions: Partial<UniPresetOptions> = {}, profile: PlatformProfile = detectPlatform()): ResolvedUniPresetOptions {
  const uno = parseOption(userOptions.uno, {})
  // 小程序原生也有 block、fixed 这两个属性，attributify 要忽略它们，免得撞名
  const attributify = parseOption(
    userOptions.attributify,
    { ignoreAttributes: profile.isMp ? ['block', 'fixed'] : undefined },
  )
  // remRpx：小程序端不传 mode，让 presetRemRpx 自己默认走 rem→rpx；其它平台传 rpx2rem，保留 rem。
  const remRpx = parseOption(
    userOptions.remRpx,
    { mode: profile.isMp ? undefined : 'rpx2rem' },
  )

  return {
    ...userOptions,
    uno,
    remRpx,
    attributify,
  }
}
