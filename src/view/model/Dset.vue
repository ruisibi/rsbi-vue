<template>
  <div>
    <div class="btn-group optbtncls" role="group">
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="新增"
        @click="addDset(false)"
      >
        <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="修改"
        @click="addDset(true)"
      >
        <i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="刷新"
        @click="flashDset()"
      >
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="删除"
        @click="delDset()"
      >
        <i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
      </button>
    </div>
    <el-table
        :data="tableData"
        @row-click="selectme"
        border
        style="width: 100%"
        header-row-class-name="tableHeadbg"
      >
        <el-table-column label="" width="45">
          <template slot-scope="scope">
            <el-radio v-model="checked" name="myselect2" :label="scope.row.dsetId"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="priTable"
          label="主表"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="dsname"
          label="数据源"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="useType"
          label="连接"
        ></el-table-column>
      </el-table>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import dsetAdd from "@/view/model/DsetAdd";
import $ from "jquery";

export default {
  name: "dset",
  data() {
    return {
      tableData: [],
      checked: null,
      isupdate: false
    };
  },
  components: {
    dsetAdd
  },
  mounted() {
    this.loadData();
  },
  computed: {},
  methods: {
    loadData(){
      ajax({
        type:"GET",
        data:{},
        url:"model/listDataset.action",
        success:(resp)=>{
          this.tableData = resp.rows;
        }
      }, this);
    },
    selectme: function (a, b) {
      this.checked = a.dsetId;
    },
    addDset(isupdate){
      this.isupdate = isupdate;
      let o = this.$parent.$parent.$parent;
      let oper =  o.$refs['dsetOper'];
      o.dsetOperTitle = isupdate===false?"创建数据集":"编辑数据集";
      oper.showDailog();
      o.$refs["dsetAddForm"].addDset(isupdate);
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
