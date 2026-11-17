import { presetUni } from '@uni-helper/unocss-preset-uni'

import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  rules: [
    [
      /^intrinsic-h-(\d+)$/,
      ([, d]) => ({ 'content-visibility': 'auto', 'contain-intrinsic-height': `auto ${Number(d) / 4}rem` }),
    ],
  ],
  presets: [
    // attributify 从 0.7.0 起默认关闭。playground 显式开启，用来覆盖小程序端
    // transformerAttributify 的产物（属性 → class 的改写）；默认关闭的行为由单测覆盖。
    presetUni({ attributify: true }),
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
