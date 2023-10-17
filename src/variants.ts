import type { VariantContext, VariantObject } from 'unocss'
import { h } from '@unocss/preset-mini/utils'
import { platform } from '@uni-helper/uni-env'
import { variantGetParameter } from '@unocss/rule-utils'
import type { Theme } from '@unocss/preset-mini'

export function createVariants<T extends object = Theme>() {
  const platformVariants: VariantObject<T> = {
    name: 'platforms',
    match(matcher: string, ctx: Readonly<VariantContext<T>>) {
      const variant = variantGetParameter('uni-', matcher, ctx.generator.config.separators)
      if (variant) {
        const [match, rest] = variant
        let matchPlatform = h.bracket(match) ?? ''
        const { platforms = {} } = (ctx.theme as any)
        matchPlatform = matchPlatform === '' ? platforms[match] ?? '' : matchPlatform
        if (matchPlatform && (platform === undefined || platform.startsWith(matchPlatform))) {
          return {
            matcher: rest,
          }
        }
      }
    },
    multiPass: true,
  }

  return [platformVariants]
}
