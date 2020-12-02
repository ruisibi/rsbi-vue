<template>
  <div>
    <div class="btn-group optbtncls" role="group">
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="新增"
        @click="addCube(false)"
      >
        <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="修改"
        @click="addCube(true)"
      >
        <i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline btn-default"
        title="删除"
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
          label="标识"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cubeName"
          label="立方体名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="desc"
          label="立方体说明"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="dsetName"
          label="数据集"
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
      let o = this.$parent.$parent.$parent;
      let oper =  o.$refs['cubeOper'];
      o.cubeOperTitle = isupdate===false?"创建立方体":"编辑立方体";
      oper.showDailog();
      o.$refs["cubeForm"].addCube(isupdate, this.checked);
    },
    delCube(){
      if(!this.checked){
        this.$notify.error({
          title: "未勾选数据",
          offset: 50,
        });
        return;
      }
      if(confirm("是否确认？")){
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
