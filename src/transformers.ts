import type {
  SourceCodeTransformer,
} from 'unocss'
import type { ResolvedUniPresetOptions } from './types'
import { isMp } from '@uni-helper/uni-env'
import {
} from 'unocss'
import { transformerAttributify } from 'unocss-applet'

/**
 * Creates an array of source code transformers for UnoCSS.
 *
 * @remarks
 * Generates transformers based on the provided options, specifically adding the Attributify transformer for mini-program environments.
 *
 * @param options - Configuration options for UnoCSS preset
 * @returns An array of source code transformers
 *
 * @beta
 */
export function createTransformers(options: ResolvedUniPresetOptions) {
  const transformers: SourceCodeTransformer[] = []
  if (isMp && options.attributify)
    transformers.push(transformerAttributify(options.attributify))

  return transformers
}
