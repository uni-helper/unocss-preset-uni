import { isMp } from '@uni-helper/uni-env'
import {
} from 'unocss'
import type {
  SourceCodeTransformer,
} from 'unocss'
import { transformerAttributify } from 'unocss-applet'
import type { ResolvedUniPresetOptions } from './types'

export function createTransformers(options: ResolvedUniPresetOptions) {
  const transformers: SourceCodeTransformer[] = []
  if (isMp && options.attributify)
    transformers.push(transformerAttributify(options.attributify))

  return transformers
}
