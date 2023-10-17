import {
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { defineConfig, presetUni } from '../src'

export default defineConfig({
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
