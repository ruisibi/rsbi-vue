<template>
    <div class="layout-center">
        <layout-param :pageInfo="pageInfo"></layout-param>
        <layout-optarea :pageInfo="pageInfo"></layout-optarea>
    </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import layoutParam from "./LayoutParam.vue"
import LayoutOptarea from './LayoutOptarea.vue'

export default {
  components:{
    layoutParam,
    LayoutOptarea
  },
  props:{
      pageInfo:{
        type:Object,
        required:true
     }
  },
  data(){
    return {
        
    }
  },
  mounted(){

  },
  computed: {
     
  },
  methods: {
     
  },
  watch: {
  },
  beforeMount(){
   
  },
  beforeDestroy(){
    
  }
}
</script>

<style lang="less" scoped>
    @import "../../style/mixin";
    
    .layout-center {
        position: inherit;
        margin: 0 0 0 223px;
        height: calc(100% - 35px);
    }
</style>
