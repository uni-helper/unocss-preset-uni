import { definePreset } from '@unocss/core'
import { resolveOptions } from './options'
import { createPresets } from './presets'
import type { UserUniPresetOptions } from './types'
import { createTransformers } from './transformers'

export default definePreset((userOptions: UserUniPresetOptions = {}) => {
  const options = resolveOptions(userOptions)
  const presets = createPresets(options)
  const transformers = createTransformers(options)

  return {
    name: 'unocss-preset-uni',
    transformers,
    presets,
  }
})
