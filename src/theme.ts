import type { Theme } from '@unocss/preset-mini'
import { builtInPlatforms } from '@uni-helper/uni-env'

declare module '@unocss/preset-mini' {
  interface Theme {
    platforms: Record<string, string>
  }
}

// 由内置平台列表派生 platforms 主题表：
// - 每个平台名映射到自身（如 'mp-weixin' -> 'mp-weixin'）；
// - 额外生成去掉 'mp-' 前缀的别名（如 'weixin' -> 'mp-weixin'），方便书写 `uni-weixin:mx-auto`。
// variants.ts 的查表逻辑依赖这张表决定 `uni-xxx:` 是否命中当前平台。
export const theme: Theme = {
  platforms: builtInPlatforms.reduce((acc, platform) => {
    acc[platform] = platform
    const withoutPrefix = platform.replace(/^mp-/, '')
    if (withoutPrefix && withoutPrefix !== platform)
      acc[withoutPrefix] = platform
    return acc
    // 种子补充 builtInPlatforms 里没有的聚合平台名（`mp` 泛指所有小程序、`quickapp` 泛指快应用）；
    // `app` 已在 builtInPlatforms 中，这里保留仅为稳妥，reduce 会再次写入同值。
    // `as any` 让这个部分填充的初始值通过 Record 类型校验。
  }, { mp: 'mp', app: 'app', quickapp: 'quickapp' } as any),
} as const
