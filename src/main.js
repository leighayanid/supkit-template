import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// plugins
import Toaster from '@meforma/vue-toaster'
import { vfmPlugin } from 'vue-final-modal'

// css
import './index.css'

const app = createApp(App)
app.use(vfmPlugin)
app.use(Toaster).provide('toast', app.config.globalProperties.$toast)
app.use(createPinia())
app.use(router)
app.mount('#app')
