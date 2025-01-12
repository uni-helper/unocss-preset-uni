import type {
  SourceCodeTransformer,
} from 'unocss'
import type { ResolvedUniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'
import {
} from 'unocss'
import { transformerAttributify } from 'unocss-applet'

export function createTransformers(options: ResolvedUniPresetOptions) {
  const transformers: SourceCodeTransformer[] = []
  if (isMp && options.attributify)
    transformers.push(transformerAttributify(options.attributify))

  return transformers
}
