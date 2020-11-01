<template>
  <div>
    <div class="btn-group optbtncls" role="group">
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="新增"
        @click="addDsource(false)"
      >
        <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="修改"
        @click="addDsource(true)"
      >
        <i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="删除"
        @click="delDsource()"
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
          <el-radio v-model="checked" name="myselect2" :label="scope.row.dsid"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="dsname"
        label="名称"
      ></el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="use"
        label="类型"
      ></el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="linkType"
        label="数据库"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="linkUrl"
        label="链接字符串"
      ></el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="linkName"
        label="用户名"
      ></el-table-column>
    </el-table>
    <dsourceAdd ref="dsourceadd" :isupdate="isupdate"></dsourceAdd>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import dsourceAdd from "@/view/model/DsourceAdd";
import $ from "jquery";

export default {
  name: "dsource",
  data() {
    return {
      tableData: [],
      checked: null,
      isupdate: false,
    };
  },
  components: {
    dsourceAdd,
  },
  mounted() {
    this.loadData();
  },
  computed: {},
  methods: {
    selectme: function (a, b) {
      this.checked = a.dsid;
    },
    loadData: function () {
      let ts = this;
      ajax(
        {
          type: "GET",
          url: "model/listDataSource.action",
          dataType: "JSON",
          data: {},
          success: function (resp) {
            ts.tableData = resp.rows;
          },
        },
        ts
      );
    },
    addDsource(isupdate) {
      this.isupdate = isupdate;
      this.$refs["dsourceadd"].addDsource(isupdate, this.checked);
    },
    delDsource() {
      if (!this.checked) {
        this.$notify.error({
          title: "未勾选数据",
          offset: 50,
        });
      }
      if (confirm("是否确认?")) {
        ajax(
          {
            type: "GET",
            url: "model/deleteDataSource.action",
            data: { dsid: this.checked },
            success: () => {
              this.$notify.success({
                title: "删除成功！",
                offset: 50,
              });
              this.loadData();
            },
          },
          this
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
