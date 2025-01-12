import type { ResolvedUniPresetOptions, UniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'

/**
 * Parses and resolves an option with flexible configuration handling.
 *
 * @remarks
 * This utility function provides a robust way to handle option configurations with multiple input scenarios.
 *
 * @param value - The input value which can be a specific type, boolean, or undefined
 * @param defaultValue - Optional default configuration to be used when no explicit value is provided
 * @returns Resolved configuration based on input parameters
 *
 * @example
 * // Returns false
 * parseOption(false)
 *
 * @example
 * // Returns default object
 * parseOption(true, { key: 'value' })
 *
 * @example
 * // Returns merged configuration
 * parseOption({ newKey: 'newValue' }, { existingKey: 'existingValue' })
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
