import type { PresetFactory } from 'unocss'
import type { UserUniPresetOptions } from './types'
import { definePreset } from 'unocss'
import { resolveOptions } from './options'
import { createPresets } from './presets'
import { theme } from './theme'
import { createTransformers } from './transformers'
import { createVariants } from './variants'

export type { Theme } from '@unocss/preset-mini'

export { createPresets, createTransformers, createVariants, resolveOptions, theme }

/**
 * uni-app 的 UnoCSS 预设入口。
 *
 * 根据当前编译平台（`@uni-helper/uni-env` 的 `isMp`）自动选择底层预设：
 * - 小程序平台：使用 presetApplet（包裹 wind3/wind4 做小程序语法兼容），
 *   并自动叠加 presetLegacyCompat（色彩空间回退）与 transformerAttributify
 *   （把属性用法编译成 class，因小程序 wxss 不支持属性选择器）；
 * - 其它平台（H5、App、快应用等）：直接使用 presetWind3（默认）/ presetWind4。
 *
 * 同时内置 presetRemRpx、presetAttributify 与按平台编写样式（`uni-xxx:`）的 variants。
 *
 * @param userOptions 选项，均为可选；任一能力传 `false` 可关闭对应预设。
 * @returns UnoCSS Preset。
 */
export const presetUni: PresetFactory<object, UserUniPresetOptions> = definePreset((userOptions = {}) => {
  const options = resolveOptions(userOptions)
  const presets = createPresets(options)
  const variants = createVariants()
  const transformers = createTransformers(options)

  return {
    name: 'unocss-preset-uni',
    presets,
    variants,
    theme,
    configResolved(config) {
      // 把小程序 attributify transformer 自动挂到 UnoCSS 配置上，用户无需手动注册。
      if (!config.transformers)
        config.transformers = transformers
      else
        config.transformers = [...config.transformers, ...transformers]
    },
  }
})
