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
import {flatLog} from '@mgsong/min-utils'
import {setApiServer} from '@/utils'

if (window.location.host === 'little-jesus.now.sh') {
  const {
    VUE_APP_SENTRY_DSN = 'https://0900362973204fe39f4d3c815e03ec9e@sentry.io/1839663',
  } = process.env
  flatLog('sentry-dsn:', VUE_APP_SENTRY_DSN)
  Sentry.init({
    dsn: VUE_APP_SENTRY_DSN,
    integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
  })
}

setApiServer()

Vue.config.productionTip = false
Vue.use(VueCompositionApi)
Vue.use(ElementUI, {locale})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
