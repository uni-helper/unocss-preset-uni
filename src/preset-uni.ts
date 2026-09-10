import type { PresetFactory } from 'unocss'
import type { UserUniPresetOptions } from './types'
import { definePreset } from 'unocss'
import { resolveOptions } from './options'
import { detectPlatform } from './platform'
import { createPresets } from './presets'
import { theme } from './theme'
import { createTransformers } from './transformers'
import { createVariants } from './variants'

export type { PlatformProfile } from './platform'

export { createPresets, createTransformers, createVariants, detectPlatform, resolveOptions, theme }
export type { Theme } from '@unocss/preset-mini'

/**
 * uni-app 的 UnoCSS 预设入口。
 *
 * 会根据当前编译平台（`@uni-helper/uni-env` 的 `isMp`）自动选择底层预设：
 * - 小程序平台：用 presetApplet（在 wind3/wind4 外包一层，做小程序语法兼容），
 *   并自动叠加 presetLegacyCompat（色彩空间回退）和 transformerAttributify
 *   （把属性写法编译成 class，因为小程序 wxss 不支持属性选择器）；
 * - 其它平台（H5、App、快应用等）：直接用 presetWind3（默认）或 presetWind4。
 *
 * 另外还内置了 presetRemRpx、presetAttributify，以及按平台写样式的 variants（`uni-xxx:`）。
 *
 * 平台在入口探测一次（`detectPlatform()`），然后作为 `PlatformProfile` 值传给各个 builder，
 * 避免每个 builder 都自己去 import env，把平台选择这条最值得测的代码锁死在模块级常量上。
 *
 * @param userOptions 选项，都可以不传；把某一项设成 `false` 就关掉对应预设。
 * @returns UnoCSS Preset。
 */
export const presetUni: PresetFactory<object, UserUniPresetOptions> = definePreset((userOptions = {}) => {
  const profile = detectPlatform()
  const options = resolveOptions(userOptions, profile)
  const presets = createPresets(options, profile)
  const variants = createVariants(profile)
  const transformers = createTransformers(options, profile)

  return {
    name: 'unocss-preset-uni',
    presets,
    variants,
    theme,
    configResolved(config) {
      // 自动把小程序 attributify transformer 挂到 UnoCSS 配置上，用户不用自己注册。
      if (!config.transformers)
        config.transformers = transformers
      else
        config.transformers = [...config.transformers, ...transformers]
    },
  }
})
