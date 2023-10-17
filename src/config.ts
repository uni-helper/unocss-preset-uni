import { defineConfig as defineUnoCSSConfig } from 'unocss'
import type { UserConfig } from 'unocss'
import type { Theme } from '@unocss/preset-mini'
import type { UserUniPresetOptions } from './types'
import { resolveOptions } from './options'
import { presetUni } from './presetUni'
import { createTransformers } from './transformers'

export function defineConfig<T extends object = Theme>(config: UserConfig<T> & UserUniPresetOptions) {
  const options: UserUniPresetOptions = {
    uno: config.uno,
    attributify: config.attributify,
  }
  if (!config.presets)
    // @ts-expect-error ignore
    config.presets = [presetUni(options)]

  const transformers = createTransformers(resolveOptions(options))

  if (!config.transformers)
    config.transformers = transformers
  else
    config.transformers = [...config.transformers, ...transformers]

  return defineUnoCSSConfig(config)
}
