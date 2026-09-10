import type { Theme } from '@unocss/preset-mini'
import { builtInPlatforms } from '@uni-helper/uni-env'

declare module '@unocss/preset-mini' {
  interface Theme {
    platforms: Record<string, string>
  }
}

// 从内置平台列表生成 platforms 主题表：
// - 每个平台名都映射到自己（比如 'mp-weixin' -> 'mp-weixin'）；
// - 再生成去掉 'mp-' 前缀的别名（比如 'weixin' -> 'mp-weixin'），写 `uni-weixin:mx-auto` 更省事。
// variants.ts 查这张表来决定 `uni-xxx:` 有没有命中当前平台。
export const theme: Theme = {
  platforms: builtInPlatforms.reduce((acc, platform) => {
    acc[platform] = platform
    const withoutPrefix = platform.replace(/^mp-/, '')
    if (withoutPrefix && withoutPrefix !== platform)
      acc[withoutPrefix] = platform
    return acc
    // 初始值补充 builtInPlatforms 里没有的聚合平台名（`mp` 代表所有小程序、`quickapp` 代表快应用）；
    // `app` 已经在 builtInPlatforms 里了，留着只是为了稳妥，reduce 会再写一次同样的值。
    // `as any` 是为了让这个还没填完的初始值过类型检查。
  }, { mp: 'mp', app: 'app', quickapp: 'quickapp' } as any),
} as const
