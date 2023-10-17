import { builtInPlatforms } from '@uni-helper/uni-env'
import type { Preset } from 'unocss'
import type { Theme } from '@unocss/preset-mini'
import { resolveOptions } from './options'
import { createPresets } from './presets'
import type { UserUniPresetOptions } from './types'
import { createVariants } from './variants'

export function presetUni<T extends object = Theme>(userOptions: UserUniPresetOptions = {}): Preset<T> {
  const options = resolveOptions(userOptions)
  const presets = createPresets<T>(options)
  const variants = createVariants<T>()

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
    } as any,
  }
}
