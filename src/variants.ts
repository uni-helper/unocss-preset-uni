import type { VariantContext, VariantObject } from 'unocss'
import { h } from '@unocss/preset-mini/utils'
import { platform } from '@uni-helper/uni-env'
import { variantGetParameter } from '@unocss/rule-utils'

export function createVariants() {
  const platformVariants: VariantObject = {
    name: 'platform',
    match(matcher: string, ctx: Readonly<VariantContext<object>>) {
      const variant = variantGetParameter('uni-', matcher, ctx.generator.config.separators)
      if (variant) {
        const [match, rest] = variant
        let matchPlatform = h.bracket(match) ?? ''
        if (matchPlatform === '')
          matchPlatform = (ctx.theme as any).platform?.[match] ?? ''
        if (platform && platform.startsWith(matchPlatform)) {
          return {
            matcher: rest,
          }
        }
      }
    },
    autocomplete: 'uni-$platform:',
  }

  return [platformVariants]
}
