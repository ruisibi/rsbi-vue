<template>
  	<el-dialog :title="$t('message.olap.open.title')" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  		<div class="btn-group optbtncls" role="group">
					<button type="button" class="btn btn-outline btn-default" :title="$t('message.olap.open.remove')" @click="deleteReport()">
						<i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
					</button>
				</div>
		  		<el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
					<el-table-column label="" width="45">
						<template slot-scope="scope">
							<el-radio v-model="checked" name="myselect" :label="scope.row.pageId">&nbsp;</el-radio>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="pageName" :label="$t('message.olap.open.pageName')"></el-table-column>
					<el-table-column align="center" prop="crtuser" :label="$t('message.olap.open.crtuser')"></el-table-column>
					<el-table-column align="center" prop="crtDate" :label="$t('message.olap.open.crtDate')"></el-table-column>
					<el-table-column align="center" prop="updateDate" :label="$t('message.olap.open.updateDate')"></el-table-column>
				</el-table>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
			<el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
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
						title: this.$t('message.base.err1'),
						offset: 50
					});
					return;
				}
				if(this.$parent.isupdate){
					if(!confirm(this.$t('message.olap.open.err1'))){
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
						title: this.$t('message.base.err1'),
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
							title: this.$t('message.olap.open.suc1'),
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
