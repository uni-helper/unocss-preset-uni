import type { VariantContext, VariantObject } from 'unocss'
import { platform } from '@uni-helper/uni-env'
import { h } from '@unocss/preset-mini/utils'
import { variantGetParameter } from '@unocss/rule-utils'

/**
 * Creates platform-specific variants for Unocss styling in uni-app environments.
 *
 * @remarks
 * Generates a variant object that enables platform-specific style application
 * by conditionally applying styles based on the current platform.
 *
 * @returns An array containing a platform variant configuration object
 *
 * @example
 * // In a Unocss preset configuration
 * variants: [
 *   ...createVariants()
 * ]
 *
 * @beta
 */
export function createVariants() {
  const platformVariants: VariantObject = {
    name: 'unocss-preset-uni-platforms',
    match(matcher: string, ctx: Readonly<VariantContext>) {
      const variant = variantGetParameter('uni-', matcher, ctx.generator.config.separators)
      if (variant) {
        const [match, rest] = variant
        let matchPlatform = h.bracket(match) ?? ''
        const { platforms = {} } = ctx.theme as any
        matchPlatform = matchPlatform === '' ? platforms[match] ?? '' : matchPlatform

        if (matchPlatform) {
          return {
            matcher: rest,
            selector: s => platform !== undefined && platform.startsWith(matchPlatform) ? s : `${s}-pass`,
          }
        }
      }
    },
    multiPass: true,
    autocomplete: 'uni-$platforms:',
  }

  return [platformVariants]
}
