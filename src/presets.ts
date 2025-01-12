import type { Preset } from 'unocss'
import type { ResolvedUniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'
import { presetAttributify, presetUno as presetUnoRaw } from 'unocss'
import { presetApplet, presetRemRpx } from 'unocss-applet'

export function createPresets(options: ResolvedUniPresetOptions) {
  const presets: Preset<any>[] = []
  let presetUno = presetUnoRaw
  if (isMp) {
    presetUno = presetApplet
    // 解决在小程序端不支持oklch与oklab等问题
    presets.push(presetLegacyCompat({
      commaStyleColorFunction: true,
      legacyColorSpace: true,
    }))
  }

  if (options.uno)
    presets.push(presetUno(options.uno))

  if (options.remRpx)
    presets.push(presetRemRpx(options.remRpx))

  if (options.attributify)
    presets.push(presetAttributify(options.attributify))

  return presets
}
