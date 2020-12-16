<template>
  <div class="wrapper wrapper-content">
    <div class="row">
      <div class="col-sm-3">
        <div class="ibox float-e-margins">
          <div class="ibox-content">
            <button @click="customizationAction" class="btn btn-sm btn-primary">新建报表</button>
            <p class="text-warning">定制个性化的数据可视化界面</p>
          </div>
        </div>
      </div>
      <div class="col-sm-9  animated fadeInRight">

      <!-- <div class="file-box">
        <div class="file">
          <span class="corner"></span>
          <div class="tooltip" align="right" style="position:absolute; display:none; margin:3px;" >
            <button class="btn btn-default btn-xs" type="button" onclick="renamereport('${e.pageId}')" title="改名"><i class="fa fa-paste"></i></button>
            <button class="btn btn-default btn-xs" type="button" onclick="editreport('${e.pageId}')" title="定制"><i class="fa fa-edit"></i></button>
            <button class="btn btn-default btn-xs" type="button" onclick="delreport('${e.pageId}')" title="删除"><i class="fa fa-remove"></i></button>
          </div>
          <a href="show.action?pageId=${e.pageId}">
          <div class="icon">
            <i class="fa fa-bar-chart"></i>
          </div>
          </a>

          <div class="file-name" align="center">
            <a href="show.action?pageId=${e.pageId}">${e.pageName} </a>
          </div>
        </div>
      </div> -->


      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Main",
  components: {},
  props: {

  },
  data() {
    return {

    }
  },

  methods: {
    initPage(){
     
    },
    customizationAction(){

    }
  },
  watch: {

  },
  filters: {

  },
  mounted() {
   
  },
}
</script>
<style lang="less" scoped>

</style>
