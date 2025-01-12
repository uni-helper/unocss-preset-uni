import type { Preset } from 'unocss'
import type { ResolvedUniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'
import { presetAttributify, presetUno as presetUnoRaw } from 'unocss'
import { presetApplet, presetRemRpx } from 'unocss-applet'

/**
 * Creates an array of UnoCSS presets based on the provided configuration options.
 *
 * @remarks
 * This function dynamically generates presets for UnoCSS, with special handling for mini program environments.
 * It supports conditional preset generation based on the input options.
 *
 * @param options - Configuration options for preset generation
 * @returns An array of UnoCSS presets configured according to the specified options
 *
 * @beta
 */
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
