# @uni-helper/unocss-preset-uni

专为 uni-app 打造的 UnoCSS 预设

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

## 特性

- 🥰 适配 uni-app 所有支持平台！
- 🚀 几乎零配置启动！
- ⚡️ 内置 `presetWind3`（默认）/ `presetWind4` 和 `presetAttributify` 支持！
- ⚙️ 随时停用或自定义预设的配置
- 🦾 按平台编写样式！

## 使用

> 参与贡献请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
>
> UnoCSS 从 v0.59 开始只提供 ESM 支持，相关信息请参考 [Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)。

### 安装

```shell
pnpm add @uni-helper/unocss-preset-uni -D
pnpm add unocss unocss-applet -D
```

本预设要求 `unocss` 与 `unocss-applet` 与之版本对齐：`unocss ~66.7.5`、`unocss-applet ^0.13.8`。安装时 pnpm 会按 peerDependencies 提示对齐。

### 配置

```ts
import Uni from '@dcloudio/vite-plugin-uni'
// vite.config.ts，支持 HBuilderX
import { defineConfig } from 'vite'

export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return defineConfig({
    plugins: [Uni(), UnoCSS()],
  })
}
```

```ts
import uniModule from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
// vite.config.mts，不支持 HBuilderX
import { defineConfig } from 'vite'

// @ts-expect-error missing types
const Uni = uniModule.default || uniModule

export default defineConfig({
  plugins: [Uni(), UnoCSS()],
})
```

```ts
import { presetUni } from '@uni-helper/unocss-preset-uni'
// uno.config.ts，支持 HBuilderX
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetUni()],
})
```

完整配置示例可参考 [uni-helper/vitesse-uni-app](https://github.com/uni-helper/vitesse-uni-app)。

### 选项

#### uno

- 默认值：`true`

是否启用 [@unocss/preset-wind3](https://unocss.dev/presets/wind3)（默认）/ [@unocss/preset-wind4](https://unocss.dev/presets/wind4)。对于小程序平台，使用 [@unocss-applet/preset-applet](https://github.com/unocss-applet/unocss-applet)（包裹 wind3/wind4 并做小程序语法兼容）以获取更佳支持。

默认启用（wind3）。要禁用，请传递 `false`。

除了传递 boolean 值，你也可以传递 [@unocss-applet/preset-applet 的选项](https://github.com/unocss-applet/unocss-applet/tree/main/packages/preset-applet)，其中 `preset: 'wind3' | 'wind4'` 与 `presetOptions` 在小程序与其它平台两端均生效，此时仍视为开启。

> 小程序平台会自动叠加 [`@unocss/preset-legacy-compat`](https://unocss.dev/presets/legacy-compat)，把 `color()` 中的 `oklch`/`oklab` 等新色彩空间回退为兼容写法（小程序 wxss 不支持这些色彩空间），无需手动配置。

#### remRpx

- 默认值：`true`

是否启用 [@unocss-applet/preset-rem-rpx](https://github.com/unocss-applet/unocss-applet/tree/main/packages/preset-rem-rpx)。控制底层预设输出的 `rem` / `rpx` 互转。

默认启用，两端默认 `mode` 不同：小程序端不显式传 `mode`，由 preset-rem-rpx 走默认的 `rem2rpx`（把 `rem` 转换成 `rpx`）；其它平台（H5、App、快应用等）传 `mode: 'rpx2rem'`（保留 `rem`）。要禁用，请传递 `false`。

> **建议禁用此项并直接用 `rem` / `px`**（见下方[单位换算：rem / px / rpx / vw](#单位换算rem--px--rpx--vw)）。`rpx` 仅小程序原生支持，跨端反而带来额外换算；`rem` / `px`（必要时配合 `vw`）在所有平台一致可用。

除了传递 boolean 值，你也可以传递 @unocss-applet/preset-rem-rpx 的选项，具体选项请查看上方提供的文档链接，此时仍视为开启。

#### attributify

- 默认值：`true`

是否启用 [@unocss/preset-attributify](https://unocss.dev/presets/attributify)。对于小程序平台，还会自动启用 [@unocss-applet/transformer-attributify](https://github.com/unocss-applet/unocss-applet/tree/main/packages/transformer-attributify) 以获取更佳支持。

默认启用，匹配属性。小程序端额外忽略 `block` 和 `fixed`（避免与小程序原生属性冲突），其它平台不忽略任何属性。要禁用，请传递 `false`。

除了传递 boolean 值，你也可以传递 @unocss/preset-attributify 的选项，具体选项请查看上方提供的文档链接，此时仍视为开启。

注意：部分情况下组件库的属性命名可能会与此模式冲突，如果出现样式无效的情况，请尝试关闭此选项，或者设置 `prefixedOnly` 选项值为 `true`，只扫描前缀匹配的属性。

```ts
import { isMp } from '@uni-helper/uni-env'
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetUni({
      attributify: {
        prefixedOnly: true,
      },
    }),
  ],
})
```

## 示例

默认地，用法与 [@unocss/preset-wind3](https://unocss.dev/presets/wind3) 一致，额外支持以下功能。

### 启用 Wind4

`uno.preset` 在小程序与其它平台两端均生效：小程序透传给 presetApplet，其它平台直接切换到 presetWind4。

```ts
import { presetUni } from '@uni-helper/unocss-preset-uni'
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetUni({
      uno: {
        preset: 'wind4',
      },
    }),
  ],
})
```

### 单位换算：rem / px / rpx / vw

底层 wind3/wind4 的工具类**默认输出 `rem`**（如 `p-4` → `1rem`、`text-base` → `1rem`）。预设内置的 `presetRemRpx` 负责小程序端的 `rem` → `rpx` 换算。视口单位 `vw` 由 wind 直接输出，不参与换算链。

> **建议直接用 `rem` / `px`（必要时配合 `vw`），不要使用 `rpx`。** `rem`（配合根字号缩放自适应）、`px`（固定尺寸）、`vw`（视口宽度比例）在所有平台都一致可用，足以覆盖绝大多数场景；`rpx` 仅小程序原生支持，跨端反而带来额外换算负担。仅当你清楚需要小程序的屏幕宽度自适应语义（750rpx = 屏幕宽度）时才考虑。

| 单位               | 机制                                              | 工具类示例 / 输出                                      |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------ |
| `rem`（wind 默认） | 不做转换                                          | `p-4` → `1rem`                                         |
| `px`               | `@unocss/preset-rem-to-px` 把 `rem` 转 `px`       | `p-4` → `16px`（默认 `baseFontSize: 16`）              |
| `rpx`              | `presetRemRpx` 的 `rem2rpx` 模式把 `rem` 转 `rpx` | `p-4` → `32rpx`（默认 `baseFontSize: 16`、`screenWidth: 375`） |
| `vw`               | wind 直接输出，不参与换算                         | `w-50vw` → `50vw`、`w-screen` → `100vw`                |

> 小程序端的 `presetRemRpx` 默认走 `rem2rpx`，因此 `presetUni()` 在小程序默认输出 `rpx`。若要统一用 `rem` / `px`，把 `remRpx` 关掉即可（见下）。
>
> `rpx2rem` 模式只对源值里的 `rpx` 生效；wind 工具类本身输出的是 `rem` 而非 `rpx`，所以在没有 rpx 来源时它不会改变输出。

#### 想要 rem（推荐，所有平台一致）

禁用 `remRpx`，保留 wind 原生的 `rem` 输出，两端都得到 `rem`：

```ts
// uno.config.ts
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetUni({ remRpx: false })],
})
```

> 小程序端用 `rem` 时，`1rem` 默认等于 `16px`（不随屏幕缩放，部分平台可能需要手动指定根字号）。若需自适应，自行让 `page` 根字号随屏幕宽度缩放（如动态设置 `html`/`page` 的 `font-size`）。

#### 想要 px

禁用 `remRpx`，再叠加 [`@unocss/preset-rem-to-px`](https://unocss.dev/presets/rem-to-px)（需单独安装），两端都得到 `px`：

```ts
// uno.config.ts
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { presetRemToPx } from '@unocss/preset-rem-to-px'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetUni({ remRpx: false }), presetRemToPx()],
})
```

> 使用 `presetRemToPx` 时**必须禁用 `remRpx`**（`presetUni({ remRpx: false })`）。否则在小程序端 `presetRemRpx` 会先把 `rem` 转成 `rpx`，`presetRemToPx` 就没有 `rem` 可转了。两者与 `presetUni()` 的先后顺序不影响结果（UnoCSS 会在预设合并后统一执行 postprocess）。

#### 想要 rpx（仅小程序，不推荐）

小程序默认即输出 `rpx`（无需改动）。其它平台若也要 `rpx`（一般不需要），把 `remRpx` 显式设为 `rem2rpx`：

```ts
presetUni({ remRpx: { mode: 'rem2rpx' } })
```

#### 想要 vw（视口宽度比例，无需配置）

`vw` 由 wind 直接输出，所有平台一致可用，且**不受 `remRpx` / `presetRemToPx` 影响**（两者只处理 `rem` / `rpx`，不碰 `vw`）。直接使用对应工具类即可：

```html
<!-- 任意 Nvw：1vw = 视口宽度的 1% -->
<div class="w-50vw"></div>   <!-- width: 50vw -->
<div class="h-50vw"></div>   <!-- height: 50vw -->

<!-- 屏幕宽/高 -->
<div class="w-screen"></div> <!-- width: 100vw -->
<div class="h-screen"></div> <!-- height: 100vh -->
```

> `vw`（视口宽度）、`vh`（视口高度）是 CSS 视口单位，按屏幕尺寸自适应，H5、App、小程序 webview 都支持。适合「占屏幕一定比例」的布局（如全宽容器、半屏高度），不需要任何换算配置。

### 按平台编写

开箱即用的平台支持，允许你按平台编写相应样式。

```html
<!-- 只在 H5 编译出 mx-auto 类 -->
<div class="uni-h5:mx-auto"></div>

<!-- 只在 APP 编译出 mx-auto 类 -->
<div class="uni-app:mx-auto"></div>

<!-- 只在小程序编译出 mx-auto 类 -->
<div class="uni-mp:mx-auto"></div>

<!-- 只在微信小程序编译出 mx-auto 类，类名也可以写成 uni-mp-weixin:mx-auto -->
<div class="uni-weixin:mx-auto"></div>

<!-- 只在支付宝小程序编译出 mx-auto 类，类名也可以写成 uni-alipay:mx-auto -->
<div class="uni-mp-alipay:mx-auto"></div>
...
```

你也可以通过自定义 `theme.platforms` 来自定义平台匹配规则:

```ts
import { presetUni } from '@uni-helper/unocss-preset-uni'
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetUni()],
  theme: {
    platforms: {
      'wechat': 'mp-weixin', // 支持 uni-wechat，等同于 uni-mp-weixin
      'my-app': 'my-app', // 自定义平台，支持 uni-my-app
    },
  },
})
```

```html
<!-- 注意：你不能省略 uni- 的类名前缀 -->
<div class="uni-wechat:mx-auto"></div>
<div class="uni-my-app:mx-auto"></div>
```

<details>

<summary>点击展开查看内置的平台匹配规则</summary>

```js
platforms = {
  'mp': 'mp',
  'app': 'app',
  'quickapp': 'quickapp',
  'h5': 'h5',
  'web': 'web',
  'app-plus': 'app-plus',
  'app-android': 'app-android',
  'app-ios': 'app-ios',
  'app-harmony': 'app-harmony',
  '360': 'mp-360',
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
  'mp-xhs': 'mp-xhs',
  'xhs': 'mp-xhs',
  'mp-harmony': 'mp-harmony',
  'harmony': 'mp-harmony',
  'quickapp-webview': 'quickapp-webview',
  'quickapp-webview-huawei': 'quickapp-webview-huawei',
  'quickapp-webview-union': 'quickapp-webview-union',
}
```

</details>

> **编辑器提示**：VSCode 的 UnoCSS 插件直接加载 `uno.config.ts`，不经过 uni-app 构建，因此无法知道当前编译平台。为此，非构建场景（`UNI_PLATFORM` 未注入）下预设会**剥离所有平台前缀**，让每个 `uni-xxx:` 工具类都正常产出 CSS 并提供悬浮提示与补全。

> 注意：编辑器预览只反映工具类本身的样式，不代表该类最终会出现在某平台产物中——是否产出仍取决于构建时的平台过滤。受支持的 vite 构建路径不受影响：`@dcloudio/vite-plugin-uni` 在加载 `uno.config.ts` 前即注入 `UNI_PLATFORM`。

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
