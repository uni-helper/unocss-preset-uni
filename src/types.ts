import type { presetAttributify } from 'unocss'

import type { PresetAppletOptions, RemRpxOptions, TransformerAttributifyOptions } from 'unocss-applet'

export type PresetAttributifyOptions = Parameters<typeof presetAttributify>[number] & TransformerAttributifyOptions

export interface UniPresetOptions {
  /**
   * 开关/配置 wind3（默认）/ wind4 预设
   *
   * @default true
   * @summary 小程序平台将自动使用 PresetApplet
   *
   * `preset` / `presetOptions` 在小程序与其它平台两端均生效：
   * 小程序整体透传给 presetApplet，其它平台（H5、App、快应用等）直接据此选择 presetWind3 / presetWind4。
   */
  uno: boolean | PresetAppletOptions
  /**
   * 开关/配置 presetRemRpx
   * @default true
   * @default { mode: 'rpx2rem' } // 其它平台；小程序端不传 mode，由 presetRemRpx 默认走 rem2rpx
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
