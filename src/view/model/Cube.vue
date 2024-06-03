<template>
  <div>
    <div class="btn-group optbtncls" role="group">
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.add')"
        @click="addCube(false)"
      >
        <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.modify')"
        @click="addCube(true)"
      >
        <i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        :title="$t('message.base.delete')"
        @click="delCube()"
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
            <el-radio v-model="checked" name="myselect" :label="scope.row.cubeId"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="cubeId"
          :label="$t('message.model.cube.id')"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cubeName"
          :label="$t('message.model.cube.name')"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="desc"
          :label="$t('message.model.cube.desc')"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="dsetName"
          :label="$t('message.model.cube.dsetName')"
        ></el-table-column>
      </el-table>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import operationDailog from '@/components/OperationDailog'
import $ from "jquery"

export default {
   name: 'cube',
  data() {
    return {
      tableData:[],
      checked:null,
      isupdate:false
    }
  },
  components: {
		
	},
  mounted() {
    this.loadData();
  },
  computed: {},
  methods: {
	 loadData(){
      ajax({
        url:"model/listCube.action",
        data:{},
        success:(r)=>{
          this.tableData = r.rows;
        }
      });
    },
    selectme(a, b){
      this.checked = a.cubeId;
    },
    addCube(isupdate){
      this.isupdate = isupdate;
      if(isupdate == true && !this.checked){
        this.$notify.error({
          title: this.$t("message.base.err1"),
          offset: 50,
        });
        return;
      }
      let o = this.$parent.$parent.$parent;
      let oper =  o.$refs['cubeOper'];
      o.cubeOperTitle = isupdate===false?this.$t('message.model.cube.add'):this.$t('message.model.cube.modify');
      oper.showDailog();
      o.$refs["cubeForm"].addCube(isupdate, this.checked);
    },
    delCube(){
      if(!this.checked){
        this.$notify.error({
          title: this.$t('message.base.err1'),
          offset: 50,
        });
        return;
      }
      if(confirm(this.$t('message.base.confirm'))){
        ajax({
          url:"model/delCube.action",
          type:"GET",
          data:{cubeId:this.checked},
          success:(resp)=>{
            this.loadData();
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
