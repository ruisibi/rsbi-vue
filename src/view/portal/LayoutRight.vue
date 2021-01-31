<template>
     <div class="layout-right" v-show="show">
        <div class="ibox">
          <div class="ibox-title">
            <h5>{{title}}</h5>
            <div class="ibox-tools">
              <button class="btn btn-outline btn-danger btn-xs" @click="closeproperty()"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <div class="ibox-content" style="padding:0;">
            <pbox v-if="showBox" ref="boxForm" :comp="comp"></pbox>
            <ptext v-if="showText" ref="textForm" :comp="comp"></ptext>
            <pchart v-if="showChart" ref="chartForm" :comp="comp"></pchart>
            <pgrid v-if="showGrid" ref="gridForm" :comp="comp"></pgrid>
            <ptable v-if="showTable" ref="tableForm" :comp="comp"></ptable>
          </div>
        </div>
      </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from './Utils'
import pbox from './prop/Box'
import ptext from './prop/Text'
import pchart from './prop/Chart'
import pgrid from './prop/Grid'
import ptable from './prop/Table'

export default {
  components:{
    pbox,ptext,pchart,pgrid,ptable
  },
  props:{
      pageInfo:{
        type:Object,
        required:true
     }
  },
  data(){
    return {
      title:"属性面板",
      show:false,
      showBox:false,
      showChart:false,
      showGrid:false,
      showTable:false,
      showText:false,
      comp:null
    }
  },
  mounted(){

  },
  computed: {
     
  },
  methods: {
    showPanel(comp){
      this.title = utils.getCompTypeDesc(comp.type) + "属性面板";
      this.show = true;
      this.comp = comp;

      this.showBox = false;
      this.showChart = false;
      this.showGrid = false;
      this.showTable = false;
      this.showText = false;

      $(".layout-center").css("margin-right","220px");

      if(comp.type === 'box'){
        this.showBox = true;
        this.$nextTick(()=> this.$refs['boxForm'].init());
      }else if(comp.type === 'chart'){
        this.showChart = true;
        this.$nextTick(()=>this.$refs['chartForm'].init());
      }else if(comp.type ==='grid'){
        this.showGrid = true;
        this.$nextTick(()=>this.$refs['gridForm'].init());
      }else if(comp.type === 'table'){
        this.showTable = true;
        this.$nextTick(()=>this.$refs['tableForm'].init());
      }else if(comp.type === 'text'){
        this.showText = true;
        this.$nextTick(()=>this.$refs['textForm'].init());
      }
      //激发resize 事件
      $(window).trigger("resize");
    },
   closeproperty(){
      $(".layout-center").css("margin-right","");
      this.show = false;
      //激发resize 事件
      $(window).trigger("resize");
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
  .layout-right {
	  position: fixed;
    width: 217px;
    height: 100%;
    right: 0;
    .ibox {
      	height: 100%;
	      margin-bottom:0px;
	      overflow:auto;
    }

  .ibox-title h5 {
    display: inline-block;
    font-size: 14px;
    margin: 0 0 7px;
    padding: 0;
    text-overflow: ellipsis;
    float: left;
  }
  .ibox-tools {
    display: inline-block;
    float: right;
    margin-top: -3px;
    position: relative;
    padding: 0;
}
}
</style>
