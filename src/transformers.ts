import type { SourceCodeTransformer } from 'unocss'
import type { PlatformProfile } from './platform'
import type { ResolvedUniPresetOptions } from './types'
import { transformerAttributify } from 'unocss-applet'
import { detectPlatform } from './platform'

/**
 * 组装需要自动注册的源码 transformer 列表。
 * 只有小程序平台且开启 attributify 时才返回 transformerAttributify，其它平台返回空数组。
 *
 * 第二个参数 `profile` 表示当前编译平台，不传就自动探测。测试时可以手动传入，方便分别跑两种平台。
 */
export function createTransformers(options: ResolvedUniPresetOptions, profile: PlatformProfile = detectPlatform()): SourceCodeTransformer[] {
  const transformers: SourceCodeTransformer[] = []
  // 只有小程序才需要 attributify transformer：小程序 wxss 不支持属性选择器（比如 [un-text='']），
  // 必须在构建时把属性写法编译成 class。其它平台上游 preset-attributify 生成的属性选择器就能用，不需要 transformer。
  if (profile.isMp && options.attributify)
    transformers.push(transformerAttributify(options.attributify))

  return transformers
}
