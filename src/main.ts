import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCompositionApi from '@vue/composition-api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import locale from 'element-ui/lib/locale/lang/ko'
// import {ko} from 'element-ui/locale'   // not exist
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

console.log('VUE_APP_SENTRY_DSN', process.env.VUE_APP_SENTRY_DSN)

Sentry.init({
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
})

Vue.config.productionTip = false
Vue.use(VueCompositionApi)
Vue.use(ElementUI, {locale})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
