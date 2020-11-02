<template>
  <el-form :model="dset" :rules="rules" ref="dsetForm">
    <el-tabs v-model="active" type="card">
      <el-tab-pane label="基本信息" name="base">
        <el-form-item label="数据集名称" label-width="100px" prop="name">
          <el-input v-model="dset.name"></el-input>
        </el-form-item>
        <el-form-item label="数据源" label-width="100px" prop="dsid">
          <el-select v-model="dset.dsid" placeholder="请选择" @change="selectds">
            <el-option
              v-for="item in dsourceList"
              :key="item.dsid"
              :label="item.dsname"
              :value="item.dsid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择表" label-width="100px">
          <div class="row">
            <div class="col-sm-4" style="padding-left: 0">
              <div class="ibox">
                <div class="ibox-title" style="line-height: normal">待选表</div>
                <div class="ibox-content" style="padding: 0px">
                  <div
                    id="allTablesTree"
                    style="height: 300px; overflow: auto"
                  ></div>
                </div>
              </div>
            </div>
            <div class="col-sm-2" style="text-align: center">
              <button
                type="button"
                id="left2right"
                style="margin-top: 120px"
                class="btn btn-success btn-circle"
              >
                <i class="fa fa-chevron-right"></i></button
              ><br /><br /><button
                type="button"
                id="right2left"
                class="btn btn-success btn-circle"
              >
                <i class="fa fa-chevron-left"></i>
              </button>
            </div>
            <div class="col-sm-4" style="padding-left: 0">
              <div class="ibox">
                <div class="ibox-title" style="line-height: normal">已选表</div>
                <div class="ibox-content" style="padding: 0px">
                  <div
                    id="selTablesTree"
                    style="height: 300px; overflow: auto"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="表关联" name="join"> </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import $ from "jquery";

export default {
  data() {
    return {
      operDailogTitle: "创建数据集",
      dset: {
        name: null,
        dsid: null,
      },
      dsourceList: [],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        dsid: [{ required: true, message: "必填", trigger: "blur" }],
      },
      active: "base",
    };
  },
  components: {},
  mounted() {
    this.loadDsource();
  },
  computed: {},
  methods: {
    selectds(){
      let dsid = this.dset.dsid;
      ajax({
        type:"POST",
        url:"model/listTables.action",
        data:{dsid:dsid},
        success:(resp)=>{
          this.initLeftTree(false, resp.rows);
        }
      }, this);
    },
    saveDset(isupdate) {
      let ret = true;
      this.$refs["dsetForm"].validate((valid) => {
        if (valid) {
        } else {
          ret = false;
        }
      });
      return ret;
    },
    addDset(isupdate) {
      this.initLeftTree(isupdate, []);
      this.initRightTree(isupdate);
    },
    loadDsource() {
      ajax(
        {
          type: "GET",
          url: "model/listDataSource.action",
          data: {},
          success: (resp) => {
            this.dsourceList = resp.rows;
          },
        },
        this
      );
    },
    initLeftTree(isupdate, dts) {
      let ref = $("#allTablesTree").jstree(true);
      if(ref){
        ref.destroy();
      }
      $("#allTablesTree")
        .jstree({
          core: {
            check_callback: true,
            data: dts,
          },
          plugins: ["wholerow"],
        })
        .bind("ready.jstree", function () {
          if (isupdate) {
            //隐藏已经选择的表
            var ref = $("#allTablesTree").jstree(true);
            ref.hide_node(transform.master);

            for (
              k = 0;
              transform.joininfo && k < transform.joininfo.length;
              k++
            ) {
              var j = transform.joininfo[k];
              ref.hide_node(j.ref);
            }
          }
        });
    },
    initRightTree(isupdate) {
      $("#selTablesTree").jstree({
        core: {
          check_callback: true,
          data: [],
        },
        plugins: ["wholerow"],
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
.btn-circle {
  width: 30px;
  height: 30px;
  padding: 6px 0;
  border-radius: 15px;
  text-align: center;
  font-size: 12px;
  line-height: 1.428571429;
}
</style>
