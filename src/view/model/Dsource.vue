<template>
  <div> 
    <div class="btn-group optbtncls" role="group">
						<button type="button" class="btn btn-outline btn-default" title="新增" @click="addRole(false)">
							<i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
						</button>
						<button type="button" class="btn btn-outline btn-default" title="修改" @click="addRole(true)">
							<i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
						</button>
						<button type="button" class="btn btn-outline btn-default" title="删除" @click="delRole()">
							<i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
						</button>
					</div>
					<el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
						<el-table-column label="" width="45">
							<template slot-scope="scope">
								<el-radio v-model="checked" name="myselect2" :label="scope.row.dsid">&nbsp;</el-radio>
							</template>
						</el-table-column>
						<el-table-column align="center" width="150" prop="dsname" label="名称"></el-table-column>
						<el-table-column align="center" width="150" prop="use" label="类型"></el-table-column>
						<el-table-column align="center" width="150" prop="linkType" label="数据库"></el-table-column>
						<el-table-column align="center" prop="linkUrl" label="链接字符串"></el-table-column>
						<el-table-column align="center" width="150" prop="linkName" label="用户名"></el-table-column>
					</el-table>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import operationDailog from '@/components/OperationDailog'
import $ from "jquery"

export default {
   name: 'dsource',
  data() {
    return {
		tableData:[],
		checked:""
    }
  },
  components: {
		
	},
  mounted() {
    this.loadData();
  },
  computed: {},
  methods: {
	 selectme:function(a, b){
		this.checked = a.dsid;
	},
	loadData:function(){
		let ts = this;
		ajax({
			type:"GET",
			url:"model/listDataSource.action",
			dataType:"JSON",
			data:{},
			success:function(resp){
				ts.tableData = resp.rows;
			}
		}, ts);
	}
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
