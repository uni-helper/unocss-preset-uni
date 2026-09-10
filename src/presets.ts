import type { Preset } from 'unocss'
import type { PresetWind3Options } from 'unocss/preset-wind3'
import type { PresetWind4Options } from 'unocss/preset-wind4'
import type { PlatformProfile } from './platform'
import type { ResolvedUniPresetOptions } from './types'
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'
import { presetAttributify, presetWind3, presetWind4 } from 'unocss'
import { presetApplet, presetRemRpx } from 'unocss-applet'
import { detectPlatform } from './platform'

/**
 * 根据处理好的选项组装预设列表：
 * 小程序端额外叠加 presetLegacyCompat，并按平台在 presetApplet / presetWind3(4) 之间切换；
 * 再按开关加上 presetRemRpx、presetAttributify。
 *
 * 第二个参数 `profile` 表示当前编译平台，不传就自动探测。测试时可以手动传入，方便分别跑两种平台。
 */
export function createPresets(options: ResolvedUniPresetOptions, profile: PlatformProfile = detectPlatform()): Preset<any>[] {
  const presets: Preset<any>[] = []

  if (profile.isMp) {
    // 小程序 wxss 不支持 oklch/oklab 这些新色彩空间，用 legacy-compat 回退成兼容写法。
    presets.push(presetLegacyCompat({
      commaStyleColorFunction: true,
      legacyColorSpace: true,
    }))
  }

  if (options.uno) {
    // options.uno 此时一定是 PresetAppletOptions 类型（经过 ResolvedUniPresetOptions 处理），
    // 里面的 `preset` / `presetOptions` 两端都生效：
    //   - 小程序平台：整个透传给 presetApplet，由它内部按 preset 选 wind3/wind4；
    //   - 其它平台（H5、App、快应用等）：在这里直接按 preset 选 presetWind3 / presetWind4。
    // 这样 README 说的 `uno: { preset: 'wind4' }` 两端表现一致。
    if (profile.isMp) {
      presets.push(presetApplet(options.uno))
    }
    else if (options.uno.preset === 'wind4') {
      // PresetAppletOptions.presetOptions 是 wind3/wind4 的联合类型，TS 没法根据 preset 字段自动收窄，
      // 所以这里按 preset 显式断言（和 presetApplet 内部处理方式一样）。
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
