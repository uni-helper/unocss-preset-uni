import type { VariantContext, VariantObject } from 'unocss'
import { platform } from '@uni-helper/uni-env'
import { h } from '@unocss/preset-mini/utils'
import { variantGetParameter } from '@unocss/rule-utils'

/**
 * 构造 `uni-<platform>:` 平台条件变体，实现按平台编写样式。
 * 命中当前编译平台时保留选择器，否则追加 `-pass` 使该工具类不生效。
 */
export function createVariants() {
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
          return {
            matcher: rest,
            // 当前编译平台命中时保留选择器；否则追加 `-pass` 后缀，生成的类名不会匹配任何元素，
            // 等同于「该平台不生成此样式」。依赖 UnoCSS 不会校验选择器有效性这一行为。
            selector: s => platform !== undefined && platform.startsWith(matchPlatform) ? s : `${s}-pass`,
          }
        }
      }
    },
    // multiPass：平台变体可与其他变体（响应式、状态等）叠加匹配，而非只消费一次后即结束。
    multiPass: true,
    autocomplete: 'uni-$platforms:',
  }

  return [platformVariants]
}
