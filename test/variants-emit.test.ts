import type { PlatformProfile } from '../src/platform'
import { createGenerator } from '@unocss/core'
import { presetApplet } from 'unocss-applet'
import { beforeEach, describe, expect, it } from 'vitest'
import { theme } from '../src/theme'
import { createVariants } from '../src/variants'

// 端到端验证：用真实 UnoCSS generator（presetApplet + createVariants + theme）生成 CSS，
// 确认 `uni-<platform>:` 变体在命中/不命中平台时的真实产出。
// 这一层此前没有覆盖——单元测试只断言 match() 返回值，这里断言最终 CSS，
// 顺带堵住「presetApplet 的 postprocess 是否依赖变体返回 selector」的回归口子。
async function generate(profile: PlatformProfile, input: string): Promise<string> {
  const g = await createGenerator({
    presets: [presetApplet()],
    variants: createVariants(profile),
    theme: theme as any,
  })
  return (await g.generate(input)).css
}

// 去掉 preflights 层（与变体逻辑无关的 CSS 变量重置），只看 default 层。
function defaultLayer(css: string): string {
  const match = css.match(/\/\* layer: default \*\/([\s\S]*)/)
  return (match?.[1] ?? '').trim()
}

describe('createVariants · 实际 CSS 产出', () => {
  const mpWeixin: PlatformProfile = { isMp: true, platform: 'mp-weixin' }
  const h5: PlatformProfile = { isMp: false, platform: 'h5' }
  let matchCss: string
  let mismatchCss: string

  beforeEach(async () => {
    ;[matchCss, mismatchCss] = await Promise.all([
      generate(mpWeixin, 'uni-weixin:mx-auto'),
      generate(h5, 'uni-weixin:mx-auto'),
    ])
  })

  // 断言声明体（margin-left:auto）而非选择器，避免与 presetApplet 的转义规则（如 `:` → `_a_`）耦合。
  it('命中平台时生成对应工具类', () => {
    const layer = defaultLayer(matchCss)
    expect(layer).toMatch(/margin-left:auto/)
    expect(layer).toMatch(/margin-right:auto/)
    expect(layer).not.toMatch(/-pass/)
  })

  it('不命中平台时不生成该工具类的任何 CSS（无死规则）', () => {
    expect(defaultLayer(mismatchCss)).toBe('')
  })

  it('无变体的普通工具类两端都正常生成（generator 接线基线）', async () => {
    expect(defaultLayer(await generate(mpWeixin, 'mx-auto'))).toMatch(/margin-left:auto/)
    expect(defaultLayer(await generate(h5, 'mx-auto'))).toMatch(/margin-left:auto/)
  })

  // multiPass: true 的意义只能通过真实 generator 的变体链验证——单元测试直接调 match() 触发不到。
  it('multiPass：命中平台时与其它变体（hover）叠加生成', async () => {
    const layer = defaultLayer(await generate(mpWeixin, 'uni-weixin:hover:mx-auto'))
    expect(layer).toMatch(/:hover/)
    expect(layer).toMatch(/margin-left:auto/)
  })

  it('multiPass：不命中平台时链式变体同样不产出', async () => {
    expect(defaultLayer(await generate(h5, 'uni-weixin:hover:mx-auto'))).toBe('')
  })
})

// 编辑器场景：VSCode 语言服务直接加载 uno.config.ts，不走 uni-app 构建，
// `UNI_PLATFORM` 未注入 → platform 为 undefined。此前变体一律返回 undefined，
// 导致 `uni-xxx:` 类在编辑器里既无补全也无悬浮提示。修复后应剥离所有平台前缀、正常产出 CSS。
describe('createVariants · 编辑器场景（platform 未定义）', () => {
  const editor: PlatformProfile = { isMp: false, platform: undefined }

  // 这里用的是内置 theme（theme.ts 从 builtInPlatforms 派生：mp、各平台全名、去 mp- 前缀的别名如 weixin）。
  // `wechat` 不在内置别名里（需用户在 uno.config.ts 自定义 theme.platforms.wechat），故不在此断言。
  it('内置平台变体都剥离前缀并产出 CSS', async () => {
    for (const input of ['uni-mp:mx-auto', 'uni-mp-weixin:mx-auto', 'uni-weixin:mx-auto']) {
      const layer = defaultLayer(await generate(editor, input))
      expect(layer, input).toMatch(/margin-left:auto/)
      expect(layer, input).toMatch(/margin-right:auto/)
    }
  })

  it('与其它变体叠加时链式仍产出', async () => {
    const layer = defaultLayer(await generate(editor, 'uni-weixin:hover:mx-auto'))
    expect(layer).toMatch(/:hover/)
    expect(layer).toMatch(/margin-left:auto/)
  })

  // 未知别名（未在 theme.platforms 注册）即便非构建场景也不产出：matchPlatform 解析为空，
  // `if (matchPlatform)` 门关拦下，match() 不返回 handler。这锁死「未知平台 = 永不产出」的边界契约。
  it('未知别名即使非构建场景也不产出 CSS', async () => {
    expect(defaultLayer(await generate(editor, 'uni-unknown:mx-auto'))).toBe('')
    // wechat 不在内置别名（仅 weixin / mp-weixin），默认同样不产出
    expect(defaultLayer(await generate(editor, 'uni-wechat:mx-auto'))).toBe('')
  })
})
