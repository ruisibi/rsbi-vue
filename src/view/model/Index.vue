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
            <dset ref="dsetGrid"></dset>
          </el-tab-pane>
          <el-tab-pane label="立方体">
            <cube></cube>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <operationDailog
      mainDiv="mainDiv"
      :title="dsetOperTitle"
      ref="dsetOper"
      :callback="saveDset"
    >
      <dsetAdd ref="dsetAddForm"></dsetAdd>
    </operationDailog>
    <dsetTableJoin ref="tableJoinForm"></dsetTableJoin>
    <dsetColModify ref="colModifyForm"></dsetColModify>
    <dynaCol ref="dynaColForm"></dynaCol>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import operationDailog from "@/components/OperationDailog";
import $ from "jquery";
import cube from "@/view/model/Cube";
import dset from "@/view/model/Dset";
import dsource from "@/view/model/Dsource";
import dsetAdd from "@/view/model/DsetAdd";
import dsetTableJoin from "@/view/model/DsetTableJoin";
import dsetColModify from "@/view/model/DsetColModify";
import dynaCol from "@/view/model/DsetDynaCol";

export default {
  name:"modelIndex",
  data() {
    return {
      dsetOperTitle:""

    };
  },
  components: {
    cube,
    dset,
    dsource,
    operationDailog,
    dsetAdd,
    dsetTableJoin,
    dsetColModify,
    dynaCol
  },
  mounted() {},
  computed: {},
  methods: {
    autoHeight: function () {
      let h = $(".page-wrapper").height();
      if (h) {
        return "height:" + (h - 110) + "px;";
      } else {
        return "height:460px;";
      }
    },
    saveDset(){
      let update = this.$refs['dsetGrid'].isupdate;
      return this.$refs['dsetAddForm'].saveDset(update);
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
