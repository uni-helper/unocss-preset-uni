import { definePreset } from '@unocss/core'
import { builtInPlatforms } from '@uni-helper/uni-env'
import { resolveOptions } from './options'
import { createPresets } from './presets'
import type { UserUniPresetOptions } from './types'
import { createTransformers } from './transformers'
import { createVariants } from './variants'

export default definePreset((userOptions: UserUniPresetOptions = {}) => {
  const options = resolveOptions(userOptions)
  const presets = createPresets(options)
  const transformers = createTransformers(options)
  const variants = createVariants()

  return {
    name: 'unocss-preset-uni',
    transformers,
    presets,
    variants,
    theme: {
      platform: builtInPlatforms.reduce((acc, platform) => {
        acc[platform] = platform
        return acc
      }, {} as any),
    },
    autocomplete: {
      templates: ['uni-$platform:'],
    },
  }
})
