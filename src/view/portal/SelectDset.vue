<template>
    <el-dialog title="选择数据集" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
      <div class="el-dialog-div">
        <el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
          <el-table-column label="" width="45">
            <template slot-scope="scope">
              <el-radio v-model="checked" name="myselect2" :label="scope.row.dsetId">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="名称"></el-table-column>
          <el-table-column align="center" prop="priTable" label="主表"></el-table-column>
          <el-table-column align="center" prop="dsname" label="数据源"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">确 定</el-button>
        <el-button @click="show = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {baseUrl, ajax} from '@/common/biConfig'
import $ from 'jquery'

export default {
  components:{

  },
  data(){
    return {
        show:false,
        tableData:[],
        checked:null
    }
  },
  mounted(){
    
  },
  computed: {
     
  },
  methods: {
     select(){
       this.show = true;
       this.loadData();
     },
     selectme:function(a, b){
				this.checked = a.dsetId;
			},
     save(){
        this.show = false;
        //回写 layoutLeft 组件
        let dset = null;
        $(this.tableData).each((a, b) => {
          if(b.dsetId === this.checked){
            dset = b;
            return false;
          }
        });
        let table = this.$parent.pageInfo.table = {dsetId:dset.dsetId, dsid:dset.dsid,dsetName:dset.name,priTable:dset.priTable};
        this.$parent.$refs['layoutleftForm'].tabActive = 'data-tab-3';
        this.$parent.$refs['layoutleftForm'].initdset(table);
     },
     loadData(){
				ajax({
					url:"model/listDataset.action",
					type:"GET",
					data:{},
					success:(resp)=>{
						this.tableData = resp.rows;
					}
				}, this);
			}
  }
}
</script>

<style lang="less" scoped>
  
</style>
