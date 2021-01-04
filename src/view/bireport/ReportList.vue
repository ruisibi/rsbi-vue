<template>
  	<el-dialog title="多维分析列表" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  		<div class="btn-group optbtncls" role="group">
					<button type="button" class="btn btn-outline btn-default" title="删除" @click="deleteReport()">
						<i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
					</button>
				</div>
		  		<el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
					<el-table-column label="" width="45">
						<template slot-scope="scope">
							<el-radio v-model="checked" name="myselect" :label="scope.row.pageId">&nbsp;</el-radio>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="pageName" label="报表名称"></el-table-column>
					<el-table-column align="center" prop="crtuser" label="创建人"></el-table-column>
					<el-table-column align="center" prop="crtDate" label="创建时间"></el-table-column>
					<el-table-column align="center" prop="updateDate" label="修改时间"></el-table-column>
				</el-table>
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
				show :false,
				checked:null,
				tableData:[]
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {
			save(){
				if(!this.checked){
					this.$notify.error({
						title: '请勾选数据!',
						offset: 50
					});
					return;
				}
				if(this.$parent.isupdate){
					if(!confirm("多维分析未保存，是否继续打开？")){
						return
					}
				}
				ajax({
					type:"GET",
					url:"bireport/getReport.action",
					data:{pageId:this.checked},
					success:(resp)=>{
						var json = JSON.parse(resp.rows.pageInfo);
						this.show = false;
						this.$parent.pageInfo = json;
						this.$parent.resetOlap();
					}
				}, this);
			},
			selectme:function(a, b){
				this.checked = a.pageId;
			},
			open(){
				this.show = true;
				this.loadData();
			},
			loadData(){
				ajax({
					type:"GET",
					url:"bireport/listReport.action",
					data:{},
					success:(resp)=>{
						this.tableData = resp.rows;
					}
				}, this);
			},
			deleteReport(){
				if(!this.checked){
					this.$notify.error({
						title: '请勾选数据!',
						offset: 50
					});
					return;
				}
				ajax({
					url:"bireport/deleteReport.action",
					type:"GET",
					data:{id:this.checked},
					success:(resp)=>{
						this.$notify.success({
							title: '删除成功!',
							offset: 50
						});
						this.loadData();
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
