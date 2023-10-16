import { isMp } from '@uni-helper/uni-env'
import {
} from 'unocss'
import type {
  SourceCodeTransformer,
} from 'unocss'
import { transformerApplet, transformerAttributify } from 'unocss-applet'
import type { ResolvedUniPresetOptions } from './types'

export function createTransformers(options: ResolvedUniPresetOptions) {
  const transformers: SourceCodeTransformer[] = []
  if (isMp) {
    transformers.push(transformerApplet())
    if (options.attributify)
      transformers.push(transformerAttributify(options.attributify))
  }

  return transformers
}
