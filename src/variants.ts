import type { VariantContext, VariantObject } from 'unocss'
import type { PlatformProfile } from './platform'
import { h } from '@unocss/preset-mini/utils'
import { variantGetParameter } from '@unocss/rule-utils'
import { detectPlatform } from './platform'

/**
 * `uni-<platform>:` 平台条件变体，用来按平台写样式。
 *
 * 剥 `uni-xxx:` 前缀分两种场景：
 * - 构建场景（`profile.platform` 有值，uni-app 构建时会注入 `UNI_PLATFORM`）：
 *   只有命中当前编译平台才剥前缀；其它平台返回 undefined，
 *   走 UnoCSS 变体「没匹配就不产出」的约定，这个工具类在那个平台完全不会生成 CSS。
 * - 非构建场景（`profile.platform === undefined`，即不在 uni-app 构建环境里——
 *   典型是 VSCode 插件直接加载 uno.config.ts）：剥掉所有平台前缀、保留工具类，
 *   让编辑器对 `uni-xxx:mx-auto` 能正常生成 CSS，提供悬浮提示和补全。
 *   真正生不生效还是由构建时的平台过滤决定（`@dcloudio/vite-plugin-uni` 在加载 uno.config.ts 前
 *   就注入了 `UNI_PLATFORM`，所以正常的 vite 构建不会走到这个分支）。
 *
 * @param profile 当前编译平台。不传就自动探测；测试时可以手动传入，分别跑两种场景。
 */
export function createVariants(profile: PlatformProfile = detectPlatform()): VariantObject[] {
  const platformVariants: VariantObject = {
    name: 'unocss-preset-uni-platforms',
    match(matcher: string, ctx: Readonly<VariantContext>) {
      const variant = variantGetParameter('uni-', matcher, ctx.generator.config.separators)
      if (variant) {
        const [match, rest] = variant
        // 支持方括号里直接写平台名，比如 `uni-[mp-weixin]:mx-auto`
        let matchPlatform = h.bracket(match) ?? ''
        const { platforms = {} } = ctx.theme as any
        // 没写方括号就从 theme.platforms 查表（含别名，比如 weixin -> mp-weixin）
        matchPlatform = matchPlatform === '' ? platforms[match] ?? '' : matchPlatform

        if (matchPlatform) {
          // 构建场景：只有命中当前编译平台才剥前缀；不命中就返回 undefined，
          // 走 UnoCSS 变体「没匹配就不产出」的约定（@unocss/core 的 matchVariants 对 falsy 返回值直接 continue），
          // 这个工具类在那个平台完全不会生成 CSS。
          // 非构建场景（platform === undefined，比如 VSCode 不走 uni-app 构建）：剥掉所有平台前缀、保留工具类，
          // 让编辑器能生成 CSS 并提供悬浮提示；真正生不生效还是由构建时的平台过滤决定。
          if (profile.platform !== undefined && !profile.platform.startsWith(matchPlatform))
            return undefined
          return { matcher: rest }
        }
      }
    },
    // multiPass：平台变体要能和其它变体（响应式、状态等）叠加着匹配，而不是匹配一次就结束。
    multiPass: true,
    autocomplete: 'uni-$platforms:',
  }

  return [platformVariants]
}
