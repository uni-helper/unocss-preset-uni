import { builtInPlatforms } from '@uni-helper/uni-env'

export const theme = {
  platforms: builtInPlatforms.reduce((acc, platform) => {
    acc[platform] = platform
    const withoutPrefix = platform.replace(/^mp-/, '')
    if (withoutPrefix && withoutPrefix !== platform)
      acc[withoutPrefix] = platform
    return acc
  }, { mp: 'mp', app: 'app', quickapp: 'quickapp' } as any),
} as any
