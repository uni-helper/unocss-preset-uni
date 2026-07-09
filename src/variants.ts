import type { VariantContext, VariantObject } from 'unocss'
import type { PlatformProfile } from './platform'
import { h } from '@unocss/preset-mini/utils'
import { variantGetParameter } from '@unocss/rule-utils'
import { detectPlatform } from './platform'

/**
 * 构造 `uni-<platform>:` 平台条件变体，实现按平台编写样式。
 * 命中当前编译平台时剥离 `uni-xxx:` 前缀；不命中时返回 undefined，
 * 走 UnoCSS 变体「无匹配即不产出」契约，该工具类在该平台完全不生成 CSS。
 *
 * @param profile 当前编译平台。默认探测真实环境；测试可显式传入以覆盖两端分支。
 */
export function createVariants(profile: PlatformProfile = detectPlatform()): VariantObject[] {
  const platformVariants: VariantObject = {
    name: 'unocss-preset-uni-platforms',
    match(matcher: string, ctx: Readonly<VariantContext>) {
      const variant = variantGetParameter('uni-', matcher, ctx.generator.config.separators)
      if (variant) {
        const [match, rest] = variant
        // 支持用方括号显式写平台名，如 `uni-[mp-weixin]:mx-auto`
        let matchPlatform = h.bracket(match) ?? ''
        const { platforms = {} } = ctx.theme as any
        // 没有方括号时，从 theme.platforms 查表（含别名，如 weixin -> mp-weixin）
        matchPlatform = matchPlatform === '' ? platforms[match] ?? '' : matchPlatform

        if (matchPlatform) {
          // 命中当前编译平台时剥离 `uni-xxx:` 前缀、保留原始选择器；
          // 不命中时返回 undefined，走 UnoCSS 变体的「无匹配即不产出」契约（matchVariants 对 falsy 返回值 continue），
          // 该工具类在该平台完全不生成 CSS。这比早先追加 `-pass` 后缀更干净——后者会留下一份选择器匹配不到任何元素、
          // 但仍进入产物包的死规则。
          if (!(profile.platform !== undefined && profile.platform.startsWith(matchPlatform)))
            return undefined
          return { matcher: rest }
        }
      }
    },
    // multiPass：平台变体可与其他变体（响应式、状态等）叠加匹配，而非只消费一次后即结束。
    multiPass: true,
    autocomplete: 'uni-$platforms:',
  }

  return [platformVariants]
}
