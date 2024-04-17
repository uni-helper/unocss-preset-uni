import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return defineConfig({
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      uni(),
      UnoCSS(),
    ],
  })
}
