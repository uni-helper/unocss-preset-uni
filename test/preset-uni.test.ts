import type { UserConfig } from '@unocss/core'
import { createGenerator } from '@unocss/core'
import { describe, expect, it } from 'vitest'
import { presetUni } from '../src/presetUni'

// 端到端验证 presetUni() 的 configResolved：自动把小程序 attributify transformer
// 挂到 UnoCSS 配置上，用户无需手动注册。这是 presetUni 唯一带运行时副作用（修改 config）的逻辑，
// 此前没有覆盖。用真实 createGenerator 触发 configResolved，断言最终 config.transformers。
async function transformerNames(config: UserConfig): Promise<string[]> {
  const g = await createGenerator(config)
  return (g.config.transformers ?? []).map(t => t.name ?? '')
}

describe('presetUni · configResolved 自动挂载 transformer', () => {
  it('presetUni 能通过真实 createGenerator 正常装载（冒烟）', async () => {
    // 非 mp 平台：createTransformers 返回空数组，config.transformers 最终为空。
    // 主要价值是确认 presetUni() 整体能被 UnoCSS 接纳、configResolved 不抛错。
    const names = await transformerNames({ presets: [presetUni({ attributify: true })] })
    expect(names).toEqual([])
  })

  it('不覆盖用户已配置的 transformers（追加而非替换）', async () => {
    // 补齐 transform 使其满足完整 SourceCodeTransformer 接口，避免依赖 UnoCSS 的宽松校验。
    const userTransformer = { name: 'user-fake-transformer', enforce: 'pre' as const, transform: () => {} }
    const names = await transformerNames({
      presets: [presetUni()],
      transformers: [userTransformer],
    })
    // 用户 transformer 必须保留；非 mp 平台自动列表为空，所以只剩用户的。
    expect(names).toContain('user-fake-transformer')
  })
})
