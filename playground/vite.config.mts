import Uni from '@uni-helper/plugin-uni'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default async () => {
  return defineConfig({
    plugins: [
      Uni(),
      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      UnoCSS(),
    ],
  })
}
