import Vue from 'vue'
import Vuex from 'vuex'
import {plugin} from "./plugin.js"
Vue.use(Vuex)


let initState = {
  count: 0
}
let state = JSON.parse(localStorage.getItem("state")) || initState;
export const store = new Vuex.Store({
  plugins: [plugin],
  state: state,
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
