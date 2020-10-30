<template>
  <div class="wrapper-content">

    <div class="ibox" id="mainDiv">
      <div class="ibox-title">数据建模</div>
      <div class="ibox-content">
        <el-tabs tab-position="left" :style="autoHeight()">
          <el-tab-pane label="数据源">
              <dsource></dsource>
          </el-tab-pane>
          <el-tab-pane label="数据集">
              <dset></dset>
          </el-tab-pane>
          <el-tab-pane label="立方体">
              <cube></cube>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import operationDailog from '@/components/OperationDailog'
import $ from "jquery"
import cube from '@/view/model/Cube'
import dset from '@/view/model/Dset'
import dsource from '@/view/model/Dsource'

export default {
  data() {
    return {
    }
  },
  components: {
		cube, dset, dsource
	},
  mounted() {
    
  },
  computed: {},
  methods: {
	  autoHeight:function(){
        let h = $(".page-wrapper").height();
        if(h){
            return  "height:"+ (h - 110 )+ "px;";
        }else{
            return "height:460px;";
        }
    }
  },
  watch: {

  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
