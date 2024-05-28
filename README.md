# @uni-helper/unocss-preset-uni

专为 uni-app 打造的 UnoCSS 预设

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

## 特性

- 🥰 适配 uni-app 所有支持平台！
- 🚀 几乎零配置启动！
- ⚡️ 内置 `presetUno` 和 `presetAttributify` 支持！
- ⚙️ 随时停用或自定义预设的配置
- 🦾 按平台编写样式！
- 👻 Windows 用户？告别烦人的崩溃！[#3603](https://github.com/dcloudio/uni-app/issues/3603)

## 使用

> UnoCSS 从 v0.59 开始只提供 ESM 支持，相关信息请参考 [Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)。

### 安装

```shell
pnpm add @uni-helper/unocss-preset-uni -D

# unocss v0.59 或以上
pnpm add unocss unocss-applet -D

# unocss v0.58
pnpm add unocss@0.58.9 unocss-applet@0.7.8 -D
```

### 配置

```ts
// vite.config.ts，支持 HBuilderX
import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'

export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return defineConfig({
    plugins: [
      Uni(),
      UnoCSS()
    ]
  })
}
```

```ts
// vite.config.mts，不支持 HBuilderX
import { defineConfig } from 'vite'
import uniModule from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'

// @ts-expect-error missing types
const Uni = uniModule.default || uniModule

export default defineConfig({
  plugins: [
    Uni(),
    UnoCSS()
  ]
})
```

```ts
// uno.config.ts，支持 HBuilderX
import { defineConfig } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni()
  ]
})
```

## 示例

用法与 UnoCSS 官方提供的 `presetUno` 一致，请参考 [文档](https://unocss.dev/presets/uno)。

### 按平台编写

开箱即用的平台支持，允许你按平台编写相应样式。

```html
<!-- 只在 H5 编译出 mx-auto 类 -->
<div class='uni-h5:mx-auto'></div>

<!-- 只在 APP 编译出 mx-auto 类 -->
<div class='uni-app:mx-auto'></div>

<!-- 只在小程序编译出 mx-auto 类 -->
<div class='uni-mp:mx-auto'></div>

<!-- 只在微信小程序编译出 mx-auto 类，类名也可以写成 uni-mp-weixin:mx-auto -->
<div class='uni-weixin:mx-auto'></div>

<!-- 只在支付宝小程序编译出 mx-auto 类，类名也可以写成 uni-alipay:mx-auto -->
<div class='uni-mp-alipay:mx-auto'></div>
...
```

你也可以通过自定义 `theme.platforms` 来自定义平台匹配规则:

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni()
  ],
  theme: {
    platforms: {
      'wechat': 'mp-weixin', // 支持 uni-wechat，等同于 uni-mp-weixin
      'my-app': 'my-app', // 自定义平台，支持 uni-my-app
    }
  }
})
```

```html
<!-- 注意：你不能省略 uni- 的类名前缀 -->
<div class='uni-wechat:mx-auto'></div>
<div class='uni-my-app:mx-auto'></div>
```

<details>

<summary>点击展开查看内置的平台匹配规则</summary>

```js
platforms = {
  '360': 'mp-360',
  'mp': 'mp',
  'app': 'app',
  'quickapp': 'quickapp',
  'app-plus': 'app-plus',
  'h5': 'h5',
  'mp-360': 'mp-360',
  'mp-alipay': 'mp-alipay',
  'alipay': 'mp-alipay',
  'mp-baidu': 'mp-baidu',
  'baidu': 'mp-baidu',
  'mp-jd': 'mp-jd',
  'jd': 'mp-jd',
  'mp-kuaishou': 'mp-kuaishou',
  'kuaishou': 'mp-kuaishou',
  'mp-lark': 'mp-lark',
  'lark': 'mp-lark',
  'mp-qq': 'mp-qq',
  'qq': 'mp-qq',
  'mp-toutiao': 'mp-toutiao',
  'toutiao': 'mp-toutiao',
  'mp-weixin': 'mp-weixin',
  'weixin': 'mp-weixin',
  'quickapp-webview': 'quickapp-webview',
  'quickapp-webview-huawei': 'quickapp-webview-huawei',
  'quickapp-webview-union': 'quickapp-webview-union'
}
```

</details>

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
