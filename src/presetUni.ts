import type { Preset } from '@unocss/core'
import { definePreset } from '@unocss/core'
import type { Theme } from '@unocss/preset-mini'
import { resolveOptions } from './options'
import { createPresets } from './presets'
import type { UserUniPresetOptions } from './types'
import { createVariants } from './variants'
import { createTransformers } from './transformers'
import { theme } from './theme'

export type { Theme } from '@unocss/preset-mini'

export { theme, createVariants, createTransformers, createPresets, resolveOptions }

export const presetUni = definePreset((userOptions: UserUniPresetOptions = {}) => {
  const options = resolveOptions(userOptions)
  const presets = createPresets(options)
  const variants = createVariants()
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
        config.transformers = [...config.transformers, ...transformers]
    },
  } as Preset<object>
})
