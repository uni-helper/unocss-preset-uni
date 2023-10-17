# @uni-helper/unocss-uni

专为 uni-app 打造的 UnoCSS 预设

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

## 特性

- ⚡️ 几乎零配置启动
- 👍 内置 `Attributify` 支持！
- ⚙️ 随时停用或自定义预设的配置
- 🦾 按平台编写样式！

## 使用

安装

```shell
pnpm add @uni-helper/unocss-preset-uni
```
配置

```ts
// uno.config.ts
import { defineConfig, presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni,
  ]
})
```

## 示例

### 按平台编写

```html
<div class='uni-h5:mx-auto'></div>
<div class='uni-app:mx-auto'></div>
<div class='uni-app-android:mx-auto'></div>
<div class='uni-mp:mx-auto'></div>
<div class='uni-mp-weixin:mx-auto'></div>
...
```

你还可以使用 uno.config 的 theme 来自定义平台匹配规则:

```ts
export default defineConfig({
  theme: {
    platform: {
      'wechat': 'mp-weixin', // alias 到 mp-weixin
      'my-app': 'my-app', // 自定义平台
    }
  }
})
```
```html
<div class='uni-wechat:mx-auto'></div>
<div class='uni-my-app:mx-auto'></div>
```

## 感谢

- [unocss](https://github.com/unocss/unocss.git) 提供大部分函数
- [unocss-applet](https://github.com/unocss-applet/unocss-applet.git) 提供小程序支持
- [uni-unocss](https://github.com/okxiaoliang4/uni-unocss) 提供按平台编写灵感

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@uni-helper/unocss-preset-uni?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@uni-helper/unocss-preset-uni
[npm-downloads-src]: https://img.shields.io/npm/dm/@uni-helper/unocss-preset-uni?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@uni-helper/unocss-preset-uni
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@uni-helper/unocss-preset-uni?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@uni-helper/unocss-preset-uni
[license-src]: https://img.shields.io/github/license/uni-helper/unocss-preset-uni.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/uni-helper/unocss-preset-uni/blob/main/LICENSE
