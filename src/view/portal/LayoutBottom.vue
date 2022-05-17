<template>
     <div class="layout-bottom" v-show="show">
        <div class="ibox" style="margin-bottom:0px;">
          <div class="ibox-title" style="height:30px;">
            <h5> {{ title }} </h5>
            <div class="ibox-tools">
            <button class="btn btn-outline btn-danger btn-xs" @click="closeDatapanel()"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <div class="ibox-content" style="padding:0px; overflow:auto; height:150px; width:100%;">
            <dbox v-if="showBox" :comp="comp" ref="boxForm"></dbox>
            <dchart v-if="showChart" :comp="comp" ref="chartForm"></dchart>
            <dgrid v-if="showGrid" :comp="comp" ref="gridForm"></dgrid>
            <dtable v-if="showTable" :comp="comp" ref="tableForm"></dtable>
          </div>
        </div>
      </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from './Utils'
import dbox from './data/Box'
import dchart from './data/Chart'
import dgrid from './data/Grid'
import dtable from './data/Table'

export default {
  components:{
    dbox, dchart, dgrid, dtable
  },
  props:{
      pageInfo:{
        type:Object,
        required:true
     }
  },
  data(){
    return {
      title:"数据面板",
      show:false,
      showBox:false,
      showChart:false,
      showGrid:false,
      showTable:false,
      comp:null
    }
  },
  mounted(){

  },
  computed: {
     
  },
  methods: {
    showPanel(comp){
      this.title = utils.getCompTypeDesc(comp.type) + "数据面板";
      $(".layout-left").css("height", "calc(100% - 296px)");
      $(".layout-center").css("height", "calc(100% - 180px)");
      this.show = true;

      this.showBox = false;
      this.showChart = false;
      this.showGrid = false;
      this.showTable = false;

      if(comp.type === 'box'){
        this.showBox = true;
      }else if(comp.type === 'chart'){
        this.showChart = true;
      }else if(comp.type ==='grid'){
        this.showGrid = true;
      }else if(comp.type === 'table'){
        this.showTable = true;
      }
      this.comp = comp;
    },
   closeDatapanel(){
      $(".layout-left").css("height", "100%");
      $(".layout-center").css("height", "100%");
      this.show = false;
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
</style>
