<template>
  <div>
    <template v-if="dsetId != null">
      <el-table :data="tableData" style="width: 100%" height="420" border header-row-class-name="tableHeadbg">
        <template v-for="item in headData">
          <el-table-column :key="item" :prop="item" :label="item" min-width="130">
          </el-table-column>
        </template>
      </el-table>
    </template>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import $ from "jquery"

export default {
   name: 'dsetView',
  data() {
    return {
      tableData:[],
      headData:[],
      dsetId:null,
      dsid:null
    }
  },
  props: {

  },
  components: {
		
	},
  mounted() {
   
  },
  computed: {},
  methods: {
	 loadData(dsetId, dsid){
     this.dsetId = dsetId;
     ajax({
       type:"get",
       url:"model/queryDataset.action",
       data:{dsetId:dsetId, dsid:dsid},
       success:(resp)=>{
         this.headData = resp.rows.header;
         this.tableData = resp.rows.datas;
         this.$forceUpdate();
       }
     }, this);
   }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
