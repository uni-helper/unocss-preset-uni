import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UnoCSS from 'unocss/vite'
import { platform } from '@uni-helper/uni-env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // https://github.com/uni-helper/vite-plugin-uni-manifest
    UniHelperManifest(),
    // https://github.com/uni-helper/vite-plugin-uni-platform
    UniPlatform(),
    // https://github.com/uni-helper/vite-plugin-uni-pages
    UniHelperPages({
      homePage: 'pages/index',
      dts: 'src/uni-pages.d.ts',
      onBeforeWriteFile(ctx) {
        const pagesMap = new Map()
        const pages = ctx.pageMetaData
          .filter(v => !/\..*$/.test(v.path) || v.path.includes(platform))
          .map(v => ({ ...v, path: v.path.replace(/\..*$/, '') }))
        pages.forEach(v => pagesMap.set(v.path, v))
        ctx.pageMetaData = [...pagesMap.values()]
      },
    }),
    Uni(),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
  ],
})
