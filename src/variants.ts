import type { VariantContext, VariantObject } from 'unocss'
import { h } from '@unocss/preset-mini/utils'
import { platform } from '@uni-helper/uni-env'
import { variantGetParameter } from '@unocss/rule-utils'

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
