import type { ResolvedUniPresetOptions, UniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'

/**
 * 把 `boolean | T | undefined` 形态的选项归一化为 `false | T`：
 * - `false` → 关闭该能力；
 * - `true` / 缺省且有默认值 → 用默认值；
 * - 传具体配置 → 与默认值浅合并（用户值优先）。
 */
function parseOption<T>(value: T | boolean | undefined, defaultValue?: T) {
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
 * 归一化用户选项：把每项 `boolean | T | undefined` 转为 `false | T`，
 * 并注入平台相关的默认值（小程序 attributify 忽略 block/fixed；remRpx 两端 mode 不同）。
 */
export function resolveOptions(userOptions: Partial<UniPresetOptions> = {}): ResolvedUniPresetOptions {
  const uno = parseOption(userOptions.uno, {})
  // 小程序 attributify 需要忽略 block/fixed，避免与小程序原生属性冲突
  const attributify = parseOption(
    userOptions.attributify,
    { ignoreAttributes: isMp ? ['block', 'fixed'] : undefined },
  )
  // remRpx：小程序端不显式传 mode，由 presetRemRpx 默认走 rem→rpx；其它平台传 rpx2rem（保留 rem）。
  const remRpx = parseOption(
    userOptions.remRpx,
    { mode: isMp ? undefined : 'rpx2rem' },
  )

  return {
    ...userOptions,
    uno,
    remRpx,
    attributify,
  }
}
