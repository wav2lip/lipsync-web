import { createApp } from 'vue'
import Router from './routes'
import { createPinia } from 'pinia'
import '@/assets/index.scss'
import App from './App.vue'

import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

const Pinia = createPinia();

createApp(App)
.use(Router)
.use(Pinia)
.mount('#app')
