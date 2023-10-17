import type { VariantObject } from 'unocss'
import { builtInPlatforms, platform } from '@uni-helper/uni-env'

export function createVariants() {
  let UniPlatformClassesAndElementsRE: RegExp

  const platformVariants: VariantObject = {
    name: 'platform',
    match(input, ctx) {
      if (!UniPlatformClassesAndElementsRE) {
        if (!platform)
          UniPlatformClassesAndElementsRE = new RegExp(`^(uni-(${builtInPlatforms.join('|')}))(${ctx.generator.config.separators.join('|')})`)
        else
          UniPlatformClassesAndElementsRE = new RegExp(`^(uni-(${platform}))(${ctx.generator.config.separators.join('|')})`)
      }
      const match = input.match(UniPlatformClassesAndElementsRE)
      if (match) {
        return {
          matcher: input.slice(match[0].length),
        }
      }
    },
    multiPass: true,
    autocomplete: `uni-(${builtInPlatforms.join('|')}):`,
  }

  return [platformVariants]
}
