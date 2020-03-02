import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCompositionApi from '@vue/composition-api'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Tag from 'element-ui/lib/tag'
import Input from 'element-ui/lib/input'
import Tabs from 'element-ui/lib/tabs'
import TabPane from 'element-ui/lib/tab-pane'
import Button from 'element-ui/lib/button'
import loading from 'element-ui/lib/loading'
import Card from 'element-ui/lib/card'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'
import DatePicker from 'element-ui/lib/date-picker'
import Table from 'element-ui/lib/table'
import TableColumn from 'element-ui/lib/table-column'

import store from './store'
// import locale from 'element-ui/lib/locale/lang/ko'
// import {ko} from 'element-ui/locale' // not exist
import {setApiServer, initSentry} from '@/utils'

setApiServer()
initSentry(Vue)

Vue.config.productionTip = false
Vue.use(VueCompositionApi)
// Vue.use(ElementUI, {locale})
Vue.use(Tag)
Vue.use(Input)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Button)
Vue.use(loading)
Vue.use(Card)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
