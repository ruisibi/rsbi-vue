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

//配置elementui 的国际化
import enlang from 'element-ui/lib/locale/lang/en'
import zhlang from 'element-ui/lib/locale/lang/zh-CN'
import twlang from 'element-ui/lib/locale/lang/zh-TW'
import locale from 'element-ui/lib/locale'

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
  locale: 'en',  // 设置默认语言
  fallbackLocale:'zh',
  messages
})

if(i18n.locale == 'en'){
  locale.use(enlang)
}else if(i18n.locale == 'zh'){
  locale.use(zhlang)
}else if(i18n.locale == 'zhHant'){
  locale.use(twlang)
}

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
