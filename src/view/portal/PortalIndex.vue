<template>
  <div class="wrapper-content">
    <div class="row">
      <div class="col-sm-3">
        <div class="ibox">
          <div class="ibox-content">
            <button @click="customizationAction" class="btn btn-block btn-sm btn-primary">新建报表</button>
            <p class="text-warning">定制个性化的数据可视化界面</p>
          </div>
        </div>
      </div>
      <div class="col-sm-9">


      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "portalMain",
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
      this.$parent.showIndex = false;
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
