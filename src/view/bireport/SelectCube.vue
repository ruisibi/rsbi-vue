<template>
  	<el-dialog title="选择数据模型" :visible.sync="show">
		<el-input v-model="search"	size="mini" placeholder="输入关键字搜索">
			<el-button slot="append" icon="el-icon-search" @click="searchme"></el-button>
		</el-input>
			<el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
				<el-table-column label="" width="45">
					<template slot-scope="scope">
						<el-radio v-model="checked" name="myselect2" :label="scope.row.cubeId">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="cubeName" label="模型名称"></el-table-column>
				<el-table-column align="center" prop="desc" label="说明"></el-table-column>
				<el-table-column align="center" prop="dsetName" label="数据集"></el-table-column>
			</el-table>
			<el-pagination
				layout="prev, pager, next"
				:total="total">
			</el-pagination>
			
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
	import {ajax} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show:false,
				checked:null,
				tableData:[],
				search:null,
				total:0,
				page:1,
				rows:10,
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {	
			select(){
				this.show = true;
				this.search = null;
				this.loadData();
			},
			save(){
				this.show = false;
			},
			selectme:function(a, b){
				this.checked = a.cubeId;
			},
			searchme(){
				this.loadData();
			},
			loadData(){
				ajax({
					url:"model/pageCube.action",
					type:"POST",
					data:{rows:this.rows, page:this.page,key:this.search},
					success:(resp)=>{
						this.total = resp.total;
						this.tableData = resp.rows.map(m=>{
							return {
								cubeId:m.cubeId,
								cubeName:m.cubeName,
								desc:m.desc,
								dsetName:m.dsetName
							}
						});
					}
				}, this);
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
</style>
