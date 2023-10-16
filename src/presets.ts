import { isMp } from '@uni-helper/uni-env'
import {
  presetAttributify,
  presetUno as presetUnoRaw,
} from 'unocss'
import type {
  Preset,
} from 'unocss'
import { presetApplet, presetRemRpx } from 'unocss-applet'
import type { ResolvedUniPresetOptions } from './types'

export function createPresets(options: ResolvedUniPresetOptions) {
  const presets: Preset[] = [presetRemRpx({ mode: isMp ? undefined : 'rpx2rem' })]
  const presetUno = isMp ? presetApplet : presetUnoRaw
  if (options.uno)
    presets.push(presetUno(options.uno))

  if (!isMp && options.attributify)
    presets.push(presetAttributify(options.attributify))

  return presets
}
