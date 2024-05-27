// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap3/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import {globalMixins,globalPlugin} from "./common/globalMixins.js"
import {store} from "./store/index.js";

import zh from './language/zh.js'
import zhHant from './language/zh-hant.js'
import en from './language/en.js'

Vue.use(ElementUI);
Vue.use(globalPlugin);
Vue.mixin(globalMixins);
Vue.use(VueI18n);

const messages = {
  en: en,
  zh: zh,
  zhHant: zhHant
}

const i18n = new VueI18n({
  locale: 'zh',  // 设置默认语言
  fallbackLocale:'zh',
  messages
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

export {
  i18n
}
