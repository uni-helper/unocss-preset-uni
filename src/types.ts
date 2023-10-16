import type { PresetAppletOptions } from 'unocss-applet/dist/preset-applet'
import type { TransformerAttributifyOptions } from 'unocss-applet/dist/transformer-attributify'
import type { presetAttributify } from 'unocss'

export type PresetAttributifyOptions = Parameters<typeof presetAttributify>[number] & TransformerAttributifyOptions

export interface UniPresetOptions {
  uno: boolean | PresetAppletOptions
  attributify: boolean | PresetAttributifyOptions
}

export interface UserUniPresetOptions extends Partial<UniPresetOptions> {}

export interface ResolvedUniPresetOptions extends UniPresetOptions {
  uno: false | PresetAppletOptions
  attributify: false | PresetAttributifyOptions
}
