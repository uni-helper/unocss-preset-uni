// @ts-check

import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'
import process from 'node:process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const _require = createRequire(import.meta.url)
const moduleName = '@unocss/vite'
const moduleRoot = dirname(_require.resolve(moduleName))

/**
 * @param {string} file
 */
function replaceUnoCSSResolveId(file) {
  const indexPath = join(moduleRoot, file)
  if (!existsSync(indexPath))
    return
  let code = readFileSync(indexPath, 'utf-8')

  code = code.replace(/const RESOLVED_ID_WITH_QUERY_RE = .*?;/, 'const RESOLVED_ID_WITH_QUERY_RE = /__uno(?:(_.*?))?\\.css(\\?.*)?$/;')
  code = code.replace(/const RESOLVED_ID_RE = .*?;/, 'const RESOLVED_ID_RE = /__uno(?:(_.*?))?\\.css$/;')
  code = code.replace(/(["`])\/(__uno_?)/gm, '$1$2')
  writeFileSync(indexPath, code)
}

if (/^win/i.test(process.platform)) {
  console.log(`ℹ unocss-preset-uni: Starting automatic patching of \`${moduleName}\`\n\n  In here see why patch is needed: https://github.com/vitejs/vite/issues/13234.\n`)
  try {
    replaceUnoCSSResolveId('index.cjs')
    replaceUnoCSSResolveId('index.mjs')
    console.log(`✔ unocss-preset-uni: Successful Patched \`${moduleName}\`.`)
  }
  catch (error) {
    console.error(`❌ unocss-preset-uni: Unable to automatically patch \`${moduleName}\`, please manually patch!\n\n   See https://github.com/dcloudio/uni-app/issues/3603#issuecomment-1567623311\n`)
  }
}
