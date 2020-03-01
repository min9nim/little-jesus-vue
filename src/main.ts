import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCompositionApi from '@vue/composition-api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import Tag from 'element-ui/lib/tag'
// import Input from 'element-ui/lib/input'
// import Tabs from 'element-ui/lib/tabs'
// import TabPane from 'element-ui/lib/tab-pane'

import store from './store'
import locale from 'element-ui/lib/locale/lang/ko'
// import {ko} from 'element-ui/locale' // not exist
import {setApiServer, initSentry} from '@/utils'

setApiServer()
initSentry(Vue)

Vue.config.productionTip = false
Vue.use(VueCompositionApi)
Vue.use(ElementUI, {locale})
// Vue.use(Input)
// Vue.use(Tabs)
// Vue.use(TabPane)
// Vue.use(Tag)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
