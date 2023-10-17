import type { Preset } from 'unocss'
import type { Theme } from '@unocss/preset-mini'
import { resolveOptions } from './options'
import { createPresets } from './presets'
import type { UserUniPresetOptions } from './types'
import { createVariants } from './variants'
import { createTransformers } from './transformers'
import { theme } from './theme'

export function presetUni<T extends object = Theme>(userOptions: UserUniPresetOptions = {}): Preset<T> {
  const options = resolveOptions(userOptions)
  const presets = createPresets<T>(options)
  const variants = createVariants<T>()
  const transformers = createTransformers((options))

  return {
    name: 'unocss-preset-uni',
    presets,
    variants,
    theme,
    configResolved(config) {
      if (!config.transformers)
        config.transformers = transformers
      else
        config.transformers = [...transformers, ...config.transformers]
    },
  }
}
