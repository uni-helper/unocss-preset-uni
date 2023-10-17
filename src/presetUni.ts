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
      platforms: builtInPlatforms.reduce((acc, platform) => {
        acc[platform] = platform
        const withoutPrefix = platform.replace(/^mp-/, '')
        if (withoutPrefix && withoutPrefix !== platform)
          acc[withoutPrefix] = platform
        return acc
      }, { mp: 'mp', app: 'app', quickapp: 'quickapp' } as any),
    },
  }
}

export const presetUni = definePreset(presetFactoryUni)
