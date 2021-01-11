<template>
    <div id="optparam" style="height:44px; overflow: auto;" class="ui-droppable">
    	<span class="charttip" style="font-size:14px; text-align:left; padding: 10px;">把参数拖放此处</span>
    </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'

export default {
  components:{
    
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
     newparam(type, ptype){

     }
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
    span.charttip {
      color:#999999;
      padding:3px;
      display:block;
    }
    #optparam {
      border: 1px solid #D3D3D3;
      background-color: #ffffff;
    }
    #optparam span.pppp {
        background-color: #f6f8f8;
        border: 1px solid #cacaca;
        display: inline-block;
        margin: 4px;
        padding: 2px;
        text-align: center;
      width:180px;
      border-radius:3px;
    }
    #optparam span.text {
        cursor: pointer;
      display: inline-block;
      width:120px;
      overflow:hidden;
      white-space:nowrap;
      margin-top:5px;
    }
    #optparam b {
        color: #555;
        font-size: 13px;
        font-weight: normal;
        margin-left: 5px;
    }
</style>
