<template>
  <div>
    <div class="btn-group optbtncls" role="group">
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.add')"
        @click="addDset(false)"
      >
        <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.modify')"
        @click="addDset(true)"
      >
        <i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.model.dset.flush')"
        @click="flashDset()"
      >
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.delete')"
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
          :label="$t('message.model.dset.name')"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="priTable"
          :label="$t('message.model.dset.priTable')"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="dsname"
          :label="$t('message.model.dset.dsname')"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="useType"
          :label="$t('message.model.dset.useType')"
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
    dsetAdd,
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
      if(isupdate && !this.checked ){
        this.$notify.error(this.$t("message.base.err1"));
        return;
      }
      let o = this.$parent.$parent.$parent;
      let oper =  o.$refs['dsetOper'];
      o.dsetOperTitle = isupdate===false? this.$t('message.model.dset.crt') :this.$t('message.model.dset.update') ;
      oper.showDailog();
      o.$refs["dsetAddForm"].addDset(isupdate, this.checked);
    },
    delDset(){
      if(!this.checked){
        this.$notify.error({
          title: this.$t("message.base.err1"),
          offset: 50,
        });
        return;
      }
      if(confirm(this.$t('message.base.confirm'))){
        ajax({
          url:"model/deleteDset.action",
          type:"GET",
          data:{dsetId:this.checked},
          success:(resp)=>{
            this.loadData();
          }
        });
      }
    },
    flashDset(){
      if(!this.checked){
        this.$notify.error({
          title: this.$t("message.base.err1"),
          offset: 50,
        });
        return;
      }
      let dset = null;
      let ts = this;
      this.tableData.forEach(val=>{
        if(val.dsetId === ts.checked){
          dset = val;
          return false;
        }
      });
      ajax({
        url:"model/reloadDset.action",
        type:"GET",
        data:{dsetId:dset.dsetId, dsid:dset.dsid},
        success:(r)=>{
          this.$notify.success(ts.$t('message.model.dset.suc1'));
        }
      }, this);
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
