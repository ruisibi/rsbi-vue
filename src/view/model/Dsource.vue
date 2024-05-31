<template>
  <div>
    <div class="btn-group optbtncls" role="group">
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.add')"
        @click="addDsource(false)"
      >
        <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.modify')"
        @click="addDsource(true)"
      >
        <i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.delete')"
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
        :label="$t('message.model.dsource.name')"
      ></el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="use"
        :label="$t('message.model.dsource.use')"
      ></el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="linkType"
        :label="$t('message.model.dsource.linkType')"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="linkUrl"
        :label="$t('message.model.dsource.linkUrl')"
      ></el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="linkName"
        :label="$t('message.model.dsource.linkName')"
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
          title: this.$t("message.base.err1"),
          offset: 50,
        });
      }
      if (confirm(this.$t('message.base.confirm'))) {
        ajax(
          {
            type: "GET",
            url: "model/deleteDataSource.action",
            data: { dsid: this.checked },
            success: () => {
              this.$notify.success({
                title: this.$t('message.model.dsource.suc1'),
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
