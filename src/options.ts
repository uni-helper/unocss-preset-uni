import { isH5 } from '@uni-helper/uni-env'
import type { ResolvedUniPresetOptions, UniPresetOptions } from './types'

function convertToObject<T>(value: T | boolean | undefined, defaultValue?: T) {
  if (value === true)
    return defaultValue ?? {}

  else if (value)
    return { ...defaultValue, ...value }

  else if (defaultValue)
    return defaultValue

  return false
}

export function resolveOptions(userOptions: Partial<UniPresetOptions> = {}): ResolvedUniPresetOptions {
  const dark = isH5 ? 'class' : 'media'
  const uno = convertToObject(userOptions.uno, { dark })
  const attributify = convertToObject(userOptions.attributify, { ignoreAttributes: isH5 ? undefined : ['block', 'fixed'] })

  return {
    ...userOptions,
    uno,
    attributify,
  }
}
