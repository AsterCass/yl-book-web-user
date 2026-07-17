import {createApp} from 'vue'
import {i18n} from '@/i18n';
import router from "@/router";
import {Loading, Notify, Quasar} from 'quasar'
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/eva-icons/eva-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'animate.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import {createPersistedStatePlugin} from "@/utils/global-state";
import {captureLandingParams} from "@/utils/landing-params";


const app = createApp(App)

app.use(Quasar, {
    plugins: {Loading, Notify},
    config: {loading: {}, notify: {}},
})

const pinia = createPinia()
pinia.use(createPersistedStatePlugin())

app.use(pinia)
app.use(i18n)

// 必须早于 app.use(router)：安装 router 即触发首次导航，"/" 会 redirect 到 dashboard，
// 而 vue-router 不保留 query，届时 ?platform=/?ref= 已从地址栏消失
captureLandingParams()

app.use(router)

app.mount('#app')
