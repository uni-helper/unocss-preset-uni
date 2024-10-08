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

完整配置示例可参考 [uni-helper/vitesse-uni-app](https://github.com/uni-helper/vitesse-uni-app)。

### 选项

#### uno

- 默认值：`true`

是否启用 [@unocss/preset-uno](https://unocss.dev/presets/uno)。对于小程序平台，使用基于 @unocss/preset-uno 分叉而来的 [@unocss-applet/preset-applet](https://github.com/unocss-applet/unocss-applet) 以获取更佳支持。

默认启用。要禁用，请传递 `false`。

除了传递 boolean 值，你也可以传递 @unocss/preset-uno 以及 @unocss-applet/preset-applet 的选项，具体选项请查看上方提供的文档链接，此时仍视为开启。

#### remRpx

- 默认值：`true`

是否启用 [@unocss-applet/preset-rem-rpx](https://github.com/unocss-applet/unocss-applet/tree/main/packages/preset-rem-rpx)。

默认启用，将 rpx 转换成 rem（即 `mode: "rpx2rem"`）。要禁用，请传递 `false`。

除了传递 boolean 值，你也可以传递 @unocss-applet/preset-rem-rpx 的选项，具体选项请查看上方提供的文档链接，此时仍视为开启。

#### attributify

- 默认值：`true`

是否启用 [@unocss/preset-attributify](https://unocss.dev/presets/attributify)。对于小程序平台，还会自动启用 [@unocss-applet/transformer-attributify](https://github.com/unocss-applet/unocss-applet/tree/main/packages/transformer-attributify) 以获取更佳支持。

默认启用，匹配属性，忽略 `block` 和 `fixed`。要禁用，请传递 `false`。

除了传递 boolean 值，你也可以传递 @unocss/preset-attributify 的选项，具体选项请查看上方提供的文档链接，此时仍视为开启。

注意：部分情况下组件库的属性命名可能会与此模式冲突，如果出现样式无效的情况，请尝试关闭此选项，或者设置 `prefixedOnly` 选项值为 `true`，只扫描前缀匹配的属性。

```ts
import { defineConfig } from 'unocss'
import { isMp } from '@uni-helper/uni-env'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni({
      attributify: {
        prefixedOnly: true,
      }
    })
  ]
})
```

## 示例

默认地，用法与 [@unocss/preset-uno](https://unocss.dev/presets/uno) 一致，额外支持以下功能。

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
