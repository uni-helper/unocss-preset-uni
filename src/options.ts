import type { ResolvedUniPresetOptions, UniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'

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

export function resolveOptions(userOptions: Partial<UniPresetOptions> = {}): ResolvedUniPresetOptions {
  const uno = parseOption(userOptions.uno, {})
  const attributify = parseOption(
    userOptions.attributify,
    { ignoreAttributes: isMp ? ['block', 'fixed'] : undefined },
  )
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
