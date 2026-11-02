import uni from '@uni-helper/eslint-config'

export default uni({
  type: 'lib',
  unocss: true,
  ignores: [
    '**node_modules/**',
    '**/dist/**',
  ],
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
})
