import { createSSRApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

// eslint-disable-next-line ts/explicit-function-return-type
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
