import type { SourceCodeTransformer } from 'unocss'
import type { ResolvedUniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'
import { transformerAttributify } from 'unocss-applet'

/**
 * 构造需要自动注册的源码 transformer 列表。
 * 仅小程序平台且开启 attributify 时返回 transformerAttributify；其它平台返回空数组。
 */
export function createTransformers(options: ResolvedUniPresetOptions) {
  const transformers: SourceCodeTransformer[] = []
  // 仅小程序平台需要 attributify transformer：小程序 wxss 不支持属性选择器（如 [un-text='']），
  // 必须在构建期把属性用法编译成 class。其它平台上游 preset-attributify 的属性选择器即可工作，无需 transformer。
  if (isMp && options.attributify)
    transformers.push(transformerAttributify(options.attributify))

  return transformers
}
