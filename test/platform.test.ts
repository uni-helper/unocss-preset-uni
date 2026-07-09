import type { Preset, VariantContext } from 'unocss'
import type { PlatformProfile } from '../src/platform'
import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/options'
import { createPresets } from '../src/presets'
import { createTransformers } from '../src/transformers'
import { createVariants } from '../src/variants'

const mpWeixin: PlatformProfile = { isMp: true, platform: 'mp-weixin' }
const h5: PlatformProfile = { isMp: false, platform: 'h5' }

// UnoCSS 预设可能是 PresetFactory（definePreset 返回的函数）或已实例化的 Preset。
// 这里把 factory 调一次拿到真实 Preset 再读 name，与 UnoCSS 合并 presets 时的处理一致。
function nameOf(p: Preset<any> | ((...args: any[]) => Preset<any>)): string {
  return (typeof p === 'function' ? (p as any)({}) : p)?.name ?? ''
}

function names(profile: PlatformProfile, userOptions: Parameters<typeof resolveOptions>[0] = {}): {
  presets: string[]
  transformers: string[]
} {
  const options = resolveOptions(userOptions, profile)
  return {
    presets: createPresets(options, profile).map(nameOf),
    transformers: createTransformers(options, profile).map(t => t.name),
  }
}

describe('resolveOptions', () => {
  it('injects attributify ignoreAttributes only on mini-program', () => {
    expect(resolveOptions({}, mpWeixin).attributify).toMatchObject({ ignoreAttributes: ['block', 'fixed'] })
    expect(resolveOptions({}, h5).attributify).toMatchObject({ ignoreAttributes: undefined })
  })

  it('defaults remRpx mode to rpx2rem on non-mp and leaves mp unset (rem2rpx upstream default)', () => {
    expect(resolveOptions({}, h5).remRpx).toMatchObject({ mode: 'rpx2rem' })
    expect(resolveOptions({}, mpWeixin).remRpx).toMatchObject({ mode: undefined })
  })

  it('user config overrides platform defaults', () => {
    expect(resolveOptions({ remRpx: { mode: 'rem2rpx' } }, h5).remRpx).toMatchObject({ mode: 'rem2rpx' })
    expect(resolveOptions({ attributify: false }, mpWeixin).attributify).toBe(false)
  })

  it('false disables a capability regardless of platform', () => {
    expect(resolveOptions({ uno: false }, h5).uno).toBe(false)
    expect(resolveOptions({ remRpx: false }, mpWeixin).remRpx).toBe(false)
  })
})

describe('createPresets', () => {
  it('assembles legacy-compat + applet on mini-program', () => {
    const { presets } = names(mpWeixin)
    expect(presets).toContain('@unocss/preset-legacy-compat')
    expect(presets).toContain('unocss-preset-applet')
    expect(presets.some(n => n.includes('wind'))).toBe(false)
  })

  it('selects presetWind3 on non-mp by default', () => {
    const { presets } = names(h5)
    expect(presets).toContain('@unocss/preset-wind3')
    expect(presets.some(n => n.includes('wind4'))).toBe(false)
    expect(presets).not.toContain('@unocss/preset-legacy-compat')
  })

  it('selects presetWind4 on non-mp when uno.preset is wind4', () => {
    const { presets } = names(h5, { uno: { preset: 'wind4' } })
    expect(presets).toContain('@unocss/preset-wind4')
  })

  it('omits remRpx / attributify presets when disabled', () => {
    const { presets } = names(h5, { remRpx: false, attributify: false })
    expect(presets.some(n => n.includes('rem-rpx'))).toBe(false)
    expect(presets.some(n => n.includes('attributify'))).toBe(false)
  })

  it('includes remRpx preset on mini-program when enabled (default)', () => {
    expect(names(mpWeixin).presets.some(n => n.includes('rem-rpx'))).toBe(true)
  })

  it('adds no uno preset when uno is disabled, on both platforms', () => {
    expect(names(h5, { uno: false }).presets.some(n => n.includes('wind'))).toBe(false)
    expect(names(mpWeixin, { uno: false }).presets.some(n => n.includes('applet'))).toBe(false)
  })

  it('runs the same module against both platforms in one process', () => {
    const mp = names(mpWeixin).presets
    const web = names(h5).presets
    expect(mp).not.toEqual(web)
    expect(mp).toContain('unocss-preset-applet')
    expect(web).toContain('@unocss/preset-wind3')
  })
})

describe('createTransformers', () => {
  it('registers transformerAttributify only on mini-program with attributify on', () => {
    expect(names(mpWeixin).transformers.some(n => n.includes('attributify'))).toBe(true)
    expect(names(h5).transformers.some(n => n.includes('attributify'))).toBe(false)
  })

  it('returns empty when attributify disabled, even on mini-program', () => {
    expect(names(mpWeixin, { attributify: false }).transformers).toHaveLength(0)
  })
})

// createVariants 是唯一按平台字符串前缀（而非布尔 isMp）分支的 builder：
// 命中当前平台则剥离前缀保留原始 matcher，否则返回 undefined 走 UnoCSS「无匹配即不产出」契约，
// 该工具类在不命中平台完全不生成 CSS。这是 profile 线程化的核心收益之一。
describe('createVariants', () => {
  // UnoCSS 默认 separators 为 `[":", "-"]`（见 @unocss/core 的 configResolved 兜底），
  // 冒号优先于连字符切分，否则 `uni-weixin:mx-auto` 会在 `mx-auto` 的 `-` 处误切。
  const ctx = {
    generator: { config: { separators: [':', '-'] } },
    theme: { platforms: { 'weixin': 'mp-weixin', 'mp-weixin': 'mp-weixin', 'h5': 'h5', 'mp': 'mp' } },
  } as unknown as Readonly<VariantContext>

  it('strips the platform prefix and keeps the matcher when targeting the current platform', () => {
    const match = createVariants(mpWeixin)[0].match
    const r = match!('uni-weixin:mx-auto', ctx)!
    expect(r.matcher).toBe('mx-auto')
    expect(r.selector).toBeUndefined()
  })

  it('returns undefined when the variant targets a different platform', () => {
    const match = createVariants(h5)[0].match
    expect(match!('uni-weixin:mx-auto', ctx)).toBeUndefined()
  })

  it('matches by platform prefix, so uni-mp covers all mp-* platforms', () => {
    const match = createVariants(mpWeixin)[0].match
    const r = match!('uni-mp:mx-auto', ctx)!
    expect(r.matcher).toBe('mx-auto')
  })

  it('returns undefined for an unknown platform alias', () => {
    const match = createVariants(h5)[0].match
    expect(match!('uni-unknown:mx-auto', ctx)).toBeUndefined()
  })

  // 编辑器场景：VSCode 语言服务不走 uni-app 构建，platform 未定义。
  // 此时应剥离平台前缀、保留工具类，使编辑器能产出 CSS 并提供悬浮提示；
  // 真实生效与否仍由构建时的平台过滤决定。
  it('strips the prefix and keeps the utility when platform is unset (editor scene)', () => {
    const match = createVariants({ isMp: false, platform: undefined })[0].match
    const r = match!('uni-weixin:mx-auto', ctx)!
    expect(r.matcher).toBe('mx-auto')
  })

  it('supports bracket syntax for explicit platform names', () => {
    const match = createVariants(mpWeixin)[0].match
    const r = match!('uni-[mp-weixin]:mx-auto', ctx)!
    expect(r.matcher).toBe('mx-auto')
  })
})
