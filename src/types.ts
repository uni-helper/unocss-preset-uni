import type { presetAttributify } from 'unocss'

import type { PresetAppletOptions, RemRpxOptions, TransformerAttributifyOptions } from 'unocss-applet'

export type PresetAttributifyOptions = Parameters<typeof presetAttributify>[number] & TransformerAttributifyOptions

export interface UniPresetOptions {
  /**
   * 开关/配置 wind3（默认）/ wind4 预设
   *
   * @default true
   * @summary 小程序平台会自动使用 PresetApplet
   *
   * `preset` / `presetOptions` 在小程序和其它平台都生效：
   * 小程序端整个透传给 presetApplet，其它平台（H5、App、快应用等）直接用它选 presetWind3 / presetWind4。
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
   *
   * 默认关闭。上游作者建议默认写字面 `class`，把 attributify 当成需要明确约定才用的写法
   * （<https://github.com/antfu/skills/blob/main/skills/unocss/SKILL.md>、<https://x.com/antfu7/status/2122498642519150947>）；
   * 开启后小程序端还会多一层构建期改写（属性 → `class`），排查样式问题时多一个环节。
   * 需要用已有 attributify 代码的项目可以显式打开，或直接传选项。
   *
   * @default false
   * @example true // 小程序端自动忽略 block / fixed 属性
   * @example { prefixedOnly: true } // 只扫描带前缀的属性
   */
  attributify: boolean | PresetAttributifyOptions
}

export interface UserUniPresetOptions extends Partial<UniPresetOptions> {}

export interface ResolvedUniPresetOptions extends UniPresetOptions {
  uno: false | PresetAppletOptions
  attributify: false | PresetAttributifyOptions
  remRpx: false | RemRpxOptions
}
