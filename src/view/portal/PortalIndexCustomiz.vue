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
      <layout-left :pageInfo="pageInfo"></layout-left>
      <layout-center :pageInfo="pageInfo"></layout-center>
      <portal-layout :pageInfo="pageInfo" ref="layout"></portal-layout>
  </div> 
</template>
<script>
import layoutLeft from "./LayoutLeft.vue"
import LayoutCenter from "./LayoutCenter.vue"
import PortalLayout from "./PortalLayoutDailog.vue"

export default {
  name: "customizer",
  components: {layoutLeft, LayoutCenter, PortalLayout},
  props: {

  },
  data() {
    return {
        pageInfo:null
    }
  },
  methods: {
    initPageInfo(){
        this.pageInfo = {"layout":1,"body":{tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]}}
    },
    handleSelect(key, keyPath){
      if(key === 'back'){
        this.$parent.showIndex = true;
      }
      if(key ==='layout'){
        this.$refs['layout'].setLayout();
      }
    }
  },
  watch: {

  },
  filters: {

  },
  mounted() {
    this.initPageInfo();
  }
}
</script>
<style lang="less" scoped>
  .customizLayout {
    height: 100%;
    width: 100%;
  }
</style>
