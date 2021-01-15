<template>
  <div class="customizLayout">
      <el-menu @select="handleSelect" class="el-menu-demo" background-color="#f6f8f8" text-color="#777" mode="horizontal">
        <el-menu-item index="back"><i class="fa fa-arrow-left"></i> 返回</el-menu-item>
        <el-menu-item index="save"><i class="glyphicon glyphicon-save"></i> 保存</el-menu-item>
        <el-menu-item index="layout"><i class="glyphicon glyphicon-th-large"></i> 布局</el-menu-item>
        <el-submenu index="data">
          <template slot="title"><i class="fa fa-database"></i> 数据</template>
          <el-menu-item index="data-1">选择立方体</el-menu-item>
          <el-menu-item index="data-2">选择数据表</el-menu-item>
        </el-submenu>
      </el-menu>
      <layout-left :pageInfo="pageInfo" ref="layoutleftForm"></layout-left>
      <div class="layout-center">
        <layout-param ref="paramForm" :pageInfo="pageInfo"></layout-param>
        <layout-optarea ref="optarea" :pageInfo="pageInfo"></layout-optarea>
      </div>
      <portal-layout :pageInfo="pageInfo" ref="layout"></portal-layout>
      <selectCube ref="selectCubeForm" :callback="selectCubeCallback"></selectCube>
      <select-dset ref="selectDsetForm"></select-dset>
       <layout-param-add ref="prarmAddForm" :pageInfo="pageInfo"></layout-param-add>
  </div> 
</template>
<script>
import layoutLeft from "./LayoutLeft.vue"
import PortalLayout from "./PortalLayoutDailog.vue"
import selectCube from "@/view/bireport/SelectCube"
import SelectDset from "./SelectDset"
import layoutParam from "./LayoutParam.vue"
import LayoutOptarea from './LayoutOptarea.vue'
import LayoutParamAdd from './LayoutParamAdd.vue'

export default {
  name: "customizer",
  components: {layoutLeft, PortalLayout, selectCube, SelectDset, layoutParam, LayoutOptarea, LayoutParamAdd},
  props: {

  },
  data() {
    return {
        pageInfo:{"layout":1,"body":{tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]}},
        isupdate:false
    }
  },
  methods: {
    handleSelect(key, keyPath){
      if(key === 'back'){
        this.$parent.showIndex = true;
      }
      if(key ==='layout'){
        this.$refs['layout'].setLayout();
      }
      if(key === 'data-1'){
        this.$refs['selectCubeForm'].select();
      }
      if(key === 'data-2'){
        this.$refs['selectDsetForm'].select();
      }
    },
    selectCubeCallback(cubeId){
      this.pageInfo.selectDs = cubeId;
      var o = this.$refs['layoutleftForm'];
      o.tabActive = 'data-tab-2';
      o.initcubes();
    }
  },
  watch: {

  },
  filters: {

  },
  mounted() {
    //this.initPageInfo();
  }
}
</script>
<style lang="less" scoped>
  .customizLayout {
    height: 100%;
    width: 100%;
  }
  .layout-center {
        position: inherit;
        margin: 0 0 0 223px;
        height: calc(100% - 35px);
    }
</style>
