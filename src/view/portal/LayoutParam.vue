<template>
    <div id="optparam" style="height:44px; overflow: auto;" class="ui-droppable">
    	<span v-if="!pageInfo.params || pageInfo.params.length == 0" class="charttip" style="font-size:14px; text-align:left; padding: 10px;">把参数拖放此处</span>

      <template v-for="p in pageInfo.params">
        <span :key="p.id" class="pppp">
          <span class="text" @click="editParam(p.id)">{{outName(p.name, p.type)}}</span>
          <div class="ibox-tools" style="margin-top:3px;">
            <button class="btn btn-outline btn-success btn-xs" @click="optParam(p.id)" title="设置"><i class="fa fa-wrench"></i></button> 
            <button class="btn btn-outline btn-danger btn-xs" @click="deleteParam(p.id)" title="删除"><i class="fa fa-times"></i></button>
          </div>
          </span>
      </template>
    </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import * as tools from './Utils'

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
     editParam(pid){
        let p = tools.findParamById(this.pageInfo, pid);
        this.$parent.$refs['prarmAddForm'].newparam(p.type, p.id);
     },
     outName(name, type){
       return name + '('+tools.getParamTypeDesc(type)+')';
     },
     deleteParam(pid){
       let idx = tools.findParamById(this.pageInfo, pid, true);
       this.pageInfo.params.splice(idx, 1);
       this.$forceUpdate();
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
        padding: 1px;
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
    .ibox-tools {
      display: inline-block;
      float: right;
      margin-top: 0;
      position: relative;
      padding: 0;
  }
</style>
