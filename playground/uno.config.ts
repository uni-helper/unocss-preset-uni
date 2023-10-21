import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetUni } from '../src'

export default defineConfig({
  rules: [
    [
      /^intrinsic-h-(\d+)$/,
      ([, d]) => ({ 'content-visibility': 'auto', 'contain-intrinsic-height': `auto ${Number(d) / 4}rem` }),
    ],
  ],
  presets: [
    presetUni(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    platforms: {
      wechat: 'mp-weixin',
      web: 'h5',
    },
  },
})
