import {sendRequest} from "./service-utils"
export const globalPlugin = {
  install(Vue){
    Vue.config.productionTip = false;
    Vue.prototype.sendRequest = sendRequest.bind(Vue.prototype,Vue.prototype);
  }
}
export const globalMixins = {
  data(){
    return{

    }
  },
  methods:{},
  mounted(){
    (window.comps || (window.comps = {}))[this.$options.name || "anonymous"] = this;
  }
}
