import type { SourceCodeTransformer } from 'unocss'
import type { PlatformProfile } from './platform'
import type { ResolvedUniPresetOptions } from './types'
import { transformerAttributify } from 'unocss-applet'
import { detectPlatform } from './platform'

/**
 * 构造需要自动注册的源码 transformer 列表。
 * 仅小程序平台且开启 attributify 时返回 transformerAttributify；其它平台返回空数组。
 *
 * 第二个参数 `profile` 为当前编译平台，默认探测真实环境；测试可显式传入以覆盖两端分支。
 */
export function createTransformers(options: ResolvedUniPresetOptions, profile: PlatformProfile = detectPlatform()): SourceCodeTransformer[] {
  const transformers: SourceCodeTransformer[] = []
  // 仅小程序平台需要 attributify transformer：小程序 wxss 不支持属性选择器（如 [un-text='']），
  // 必须在构建期把属性用法编译成 class。其它平台上游 preset-attributify 的属性选择器即可工作，无需 transformer。
  if (profile.isMp && options.attributify)
    transformers.push(transformerAttributify(options.attributify))

  return transformers
}
