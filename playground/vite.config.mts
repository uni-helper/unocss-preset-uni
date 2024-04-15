import { defineConfig } from 'vite'
import uniModule from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'

// @ts-expect-error missing types
const Uni = uniModule.default || uniModule

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Uni(),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
  ],
})
