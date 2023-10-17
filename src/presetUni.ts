import { builtInPlatforms } from '@uni-helper/uni-env'
import type { PresetFactory } from 'unocss'
import { definePreset } from 'unocss'

import { resolveOptions } from './options'
import { createPresets } from './presets'
import type { UserUniPresetOptions } from './types'
import { createVariants } from './variants'

const presetFactoryUni: PresetFactory = (userOptions: UserUniPresetOptions = {}) => {
  const options = resolveOptions(userOptions)
  const presets = createPresets(options)
  const variants = createVariants()

  return {
    name: 'unocss-preset-uni',
    presets,
    variants,
    theme: {
      platform: builtInPlatforms.reduce((acc, platform) => {
        acc[platform] = platform
        return acc
      }, {} as any),
    },
  }
}

export const presetUni = definePreset(presetFactoryUni)
