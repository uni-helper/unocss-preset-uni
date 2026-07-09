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
