import type { VariantContext, VariantObject } from 'unocss'
import type { PlatformProfile } from './platform'
import { h } from '@unocss/preset-mini/utils'
import { variantGetParameter } from '@unocss/rule-utils'
import { detectPlatform } from './platform'

/**
 * 构造 `uni-<platform>:` 平台条件变体，实现按平台编写样式。
 *
 * 剥离 `uni-xxx:` 前缀的判定分两种场景：
 * - 构建场景（`profile.platform` 有值，由 uni-app 构建注入 `UNI_PLATFORM`）：
 *   仅当前编译平台命中时剥离前缀；其余平台返回 undefined，走 UnoCSS 变体「无匹配即不产出」契约，
 *   该工具类在该平台完全不生成 CSS。
 * - 非构建场景（`profile.platform === undefined`，即未在 uni-app 构建上下文中——
 *   典型是 VSCode 语言服务直接加载 uno.config.ts）：剥离所有平台前缀、保留工具类，
 *   使编辑器对 `uni-xxx:mx-auto` 正常产出 CSS，从而提供悬浮提示与补全。
 *   真实生效与否仍由构建时的平台过滤决定（`@dcloudio/vite-plugin-uni` 在加载 uno.config.ts 前
 *   即注入 `UNI_PLATFORM`，故受支持的 vite 构建路径不会落入此分支）。
 *
 * @param profile 当前编译平台。默认探测真实环境；测试可显式传入以覆盖两场景。
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
          // 构建场景仅命中当前编译平台时剥离前缀；不命中平台返回 undefined，走 UnoCSS 变体的
          // 「无匹配即不产出」契约（@unocss/core matchVariants 对 falsy 返回值 continue），该工具类
          // 在该平台完全不生成 CSS。
          // 非构建场景（platform === undefined，VSCode 等不走 uni-app 构建）剥离所有平台前缀、保留工具类，
          // 使编辑器能产出 CSS 并提供悬浮提示；真实生效与否仍由构建时的平台过滤决定。
          if (profile.platform !== undefined && !profile.platform.startsWith(matchPlatform))
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
