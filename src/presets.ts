import type { Preset } from 'unocss'
import type { PresetWind3Options } from 'unocss/preset-wind3'
import type { PresetWind4Options } from 'unocss/preset-wind4'
import type { ResolvedUniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'
import { presetAttributify, presetWind3, presetWind4 } from 'unocss'
import { presetApplet, presetRemRpx } from 'unocss-applet'

/**
 * 根据归一化后的选项构造预设列表：
 * 小程序叠加 presetLegacyCompat，并按 `isMp` 在 presetApplet / presetWind3(4) 间切换；
 * 再按开关加入 presetRemRpx、presetAttributify。
 */
export function createPresets(options: ResolvedUniPresetOptions) {
  const presets: Preset<any>[] = []

  if (isMp) {
    // 小程序 wxss 不支持 oklch/oklab 等新色彩空间，用 legacy-compat 回退到兼容写法。
    presets.push(presetLegacyCompat({
      commaStyleColorFunction: true,
      legacyColorSpace: true,
    }))
  }

  if (options.uno) {
    // options.uno 已被收窄为 PresetAppletOptions（来自 ResolvedUniPresetOptions），
    // 其 `preset` / `presetOptions` 字段同时驱动两端：
    //   - 小程序平台：整体透传给 presetApplet，由其内部按 preset 选择 wind3/wind4；
    //   - 其它平台（H5、App、快应用等）：在此处直接按 preset 选择 presetWind3 / presetWind4。
    // 这样 README 宣传的 `uno: { preset: 'wind4' }` 在两端行为一致。
    if (isMp) {
      presets.push(presetApplet(options.uno))
    }
    else if (options.uno.preset === 'wind4') {
      // PresetAppletOptions.presetOptions 是 wind3/wind4 的联合类型，无法由 preset 字段收窄，
      // 此处按 preset 显式断言（与 presetApplet 内部处理方式一致）。
      presets.push(presetWind4(options.uno.presetOptions as PresetWind4Options | undefined))
    }
    else {
      presets.push(presetWind3(options.uno.presetOptions as PresetWind3Options | undefined))
    }
  }

  if (options.remRpx)
    presets.push(presetRemRpx(options.remRpx))

  if (options.attributify)
    presets.push(presetAttributify(options.attributify))

  return presets
}
