import type { presetAttributify } from 'unocss'

import type { PresetAppletOptions, RemRpxOptions, TransformerAttributifyOptions } from 'unocss-applet'

export type PresetAttributifyOptions = Parameters<typeof presetAttributify>[number] & TransformerAttributifyOptions

export interface UniPresetOptions {
  /**
   * 开关/配置 PresetUno
   *
   * @default true
   * @summary 小程序平台将自动使用 PresetApplet
   */
  uno: boolean | PresetAppletOptions
  /**
   * 开关/配置 presetRemRpx
   * @default true
   * @default { mode: 'rpx2rem' } // 除了小程序平台
   */
  remRpx: boolean | RemRpxOptions
  /**
   * 开关/配置 presetAttributify
   * @default true
   * @default { ignoreAttributes: ['block', 'fixed'] } // 小程序平台
   * @summary 小程序平台将自动使用 transformerAttributify
   */
  attributify: boolean | PresetAttributifyOptions
}

export interface UserUniPresetOptions extends Partial<UniPresetOptions> {}

export interface ResolvedUniPresetOptions extends UniPresetOptions {
  uno: false | PresetAppletOptions
  attributify: false | PresetAttributifyOptions
  remRpx: false | RemRpxOptions
}
