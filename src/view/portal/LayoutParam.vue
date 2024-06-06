<template>
    <div id="optparam" style="height:44px; overflow: auto;" class="ui-droppable">
    	<span v-if="!pageInfo.params || pageInfo.params.length == 0" class="charttip" style="font-size:14px; text-align:left; padding: 10px;">{{this.$t('message.report.param.err1')}}</span>

      <template v-for="p in pageInfo.params">
        <span :key="p.id" class="pppp">
          <span class="text" @click="editParam(p.id)">{{outName(p.name, p.type)}}</span>
          <div class="ibox-tools" style="margin-top:3px;">
            <button class="btn btn-outline btn-success btn-xs" @click="optParam(p.id)" :title="$t('message.report.param.set')"><i class="fa fa-wrench"></i></button> 
            <button class="btn btn-outline btn-danger btn-xs" @click="deleteParam(p.id)" :title="$t('message.base.delete')"><i class="fa fa-times"></i></button>
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
    setUpdate(){
      this.$parent.isupdate = true;
    },
     editParam(pid){
        let p = tools.findParamById(this.pageInfo, pid);
        this.$parent.$refs['prarmAddForm'].newparam(p.type, p.id);
     },
     outName(name, type){
       return name + '('+tools.getParamTypeDesc(type)+')';
     },
     deleteParam(pid){
       if(confirm(this.$t('message.base.confirm'))){
        let idx = tools.findParamById(this.pageInfo, pid, true);
        this.pageInfo.params.splice(idx, 1);
        this.$forceUpdate();
        this.setUpdate();
       }
     },
     optParam(id){
       let ts = this;
       //let p = tools.findParamById(this.pageInfo, id);
        $.contextMenu( 'destroy');
        $.contextMenu({
              selector: '#optparam button.btn-success', 
              className: "m_optparam",
              trigger: 'left',
              delay: 500,
              autoHide:true,
              items: {
                "edit":{name:this.$t('message.base.modify'), icon:"fa-edit",callback:function(){
                  ts.editParam(id);
                }},
                "left":{name: this.$t('message.report.param.left'), icon:"fa-arrow-left", callback:function(){
                  ts.moveparam(id, 'left');
                      }},
                "right":{name: this.$t('message.report.param.right'), icon:"fa-arrow-right", callback:function(){
                  ts.moveparam(id, 'right');
                }}
           }
        });
     },
     moveparam(pid, pos){
       let pageInfo = this.pageInfo;
        var idx = tools.findParamById(pageInfo, pid, true);
        if(idx == 0 && pos == "left"){
          tools.msginfo(this.$t('message.report.param.err2'));
          return;
        }else if(idx == pageInfo.params.length - 1 && pos == "right"){
          tools.msginfo(this.$t('message.report.param.err3'));
          return;
        }
        var pms = pageInfo.params;
        if(pos == "left"){
          var tp = pms[idx - 1];
          pms[idx - 1] = pms[idx];
          pms[idx] = tp;
        }else if(pos == "right"){
          var tp = pms[idx + 1];
          pms[idx + 1] = pms[idx];
          pms[idx] = tp;
        }
        this.$forceUpdate();
        this.setUpdate();
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
