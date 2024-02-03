import { isH5, isMp } from '@uni-helper/uni-env'
import type { ResolvedUniPresetOptions, UniPresetOptions } from './types'

function parseOption<T>(value: T | boolean | undefined, defaultValue?: T) {
  if (value === false)
    return value

  if (value === true)
    return defaultValue ?? {}

  if (value)
    return { ...defaultValue, ...value }

  if (defaultValue)
    return defaultValue

  return false
}

export function resolveOptions(userOptions: Partial<UniPresetOptions> = {}): ResolvedUniPresetOptions {
  const dark = isH5 ? 'class' : 'media'
  const uno = parseOption(userOptions.uno, { dark })
  const attributify = parseOption(
    userOptions.attributify,
    { ignoreAttributes: isH5 ? undefined : ['block', 'fixed'] },
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
