<!-- 表格明细数据提取 -->
<template>
  	<el-dialog fullscreen :append-to-body="true" title="明细数据提取" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
			<div>
				<button class="btn btn-sm btn-primary" @click="exportXls()">导出到Excel</button>
				<button class="btn btn-sm btn-danger" @click="show=false">关闭</button>
			</div>
			<el-table :data="tableData" :height="height" border style="width: 100%" header-row-class-name="tableHeadbg">
				<template v-for="(item, index) in cols">
					<el-table-column :key="item.name" align="center" :prop="'c'+index" :label="item.name"></el-table-column>
				</template>
			</el-table>
			<el-pagination
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-sizes="[10, 20, 50, 100]"
				:current-page="page"
				:page-size="rows"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
  </el-dialog>
</template>

<script>
	import {ajax,baseUrl} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show :false,
				cols:[],
				tableData:[],
				height:500,
				total:null,
				rows:20,
				page:1,
				header:[],
				comp:null,
				pms: null
			}
		},
		mounted(){
			this.height = $(window).height() - 150;
		},
		computed: {
		},
		methods: {	
			linkDetail(comp, pms){
				pms = eval("({" + pms + "})");
				this.pms = pms;
				this.comp = comp;
				let ts = this;
				this.show = true;
				ajax({
					type: "POST",
					url: "bireport/header.action",
					dataType:"JSON",
					data: {dsetId:comp.dsetId,dsid:comp.dsid},
					success: function(resp){
						ts.cols = resp.rows;
						ts.loadDatas(comp, pms);
					}
				}, this);
			},
			loadDatas(){
				let ts = this;
				let comp = this.comp;
				let pms = this.pms;
				var json = {pms:pms, dsetId:comp.dsetId,dsid:comp.dsid, page:ts.page, rows:ts.rows};
				ajax({
					type: "POST",
					url: "bireport/detail.action",
					data: JSON.stringify(json),
					postJSON:true,
					success: function(resp){
						ts.tableData = resp.rows;
						ts.total = resp.total;
					}
				},ts);
			},
			handleSizeChange(v){
				this.rows = v;
				this.loadDatas();
			},
			handleCurrentChange(v){
				this.page = v;
				this.loadDatas();
			},
			exportXls(){
				location.href = baseUrl + 'bireport/exportDetail.action';
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
