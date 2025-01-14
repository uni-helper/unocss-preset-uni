import type { Theme } from '@unocss/preset-mini'
import { builtInPlatforms } from '@uni-helper/uni-env'

declare module '@unocss/preset-mini' {
  interface Theme {
    platforms: Record<string, string>
  }
}

export const theme: Theme = {
  platforms: builtInPlatforms.reduce((acc, platform) => {
    acc[platform] = platform
    const withoutPrefix = platform.replace(/^mp-/, '')
    if (withoutPrefix && withoutPrefix !== platform)
      acc[withoutPrefix] = platform
    return acc
  }, { mp: 'mp', app: 'app', quickapp: 'quickapp' } as any),
} as const
