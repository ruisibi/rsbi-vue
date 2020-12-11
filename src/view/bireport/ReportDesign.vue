<template>
  	<div class="wrapper-content-nomargin">
		<el-menu :default-active="activeIndex" class="el-menu-demo" background-color="#f6f8f8" text-color="#777" mode="horizontal">
			<el-submenu index="1">
				<template slot="title"><i class="fa fa-file"></i> 文件</template>
				<el-menu-item index="1-1">打开</el-menu-item>
				<el-menu-item index="1-2">新建</el-menu-item>
				<el-menu-item index="1-3">保存</el-menu-item>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title"><i class="fa fa-file-excel-o"></i> 导出</template>
				<el-menu-item index="2-1">HTML</el-menu-item>
				<el-menu-item index="2-2">CSV</el-menu-item>
				<el-menu-item index="2-3">EXCEL</el-menu-item>
				<el-menu-item index="2-3">WORD</el-menu-item>
				<el-menu-item index="2-3">PDF</el-menu-item>
			</el-submenu>
			<el-menu-item index="3"><i class="fa fa-print"></i> 打印</el-menu-item>
			<el-menu-item index="4"><i class="fa fa-list-alt"></i> 解释</el-menu-item>
		</el-menu>
		<div class="wrapper-content">
			<div class="row">
				<div class="col-sm-3">
					<div class="ibox">
						<div class="ibox-content" style="padding:0px;">
							<div style="padding:15px 20px 0px 20px">
								<button class="btn btn-block btn-primary" @click="selectCube()"><i class="fa fa-refresh"></i> 切换数据</button>
								<p class="text-warning">拖拽数据到表格或图形中展现</p>
							</div>
							<div id="datasettree"></div>
						</div>
					</div>
				</div>
				
				<div class="col-sm-9 animated fadeInRight">
					<div class="ibox" style="margin-bottom:20px;">
						<div class="ibox-content" id="p_param" style="padding:5px;">
							<div class="ptabhelpr">拖拽维度到此处作为筛选条件</div>
						</div>
					</div>
					
					<el-tabs v-model="showtype" type="border-card">
						<el-tab-pane label="表格" name="table">表格</el-tab-pane>
						<el-tab-pane label="图形" name="chart">图形</el-tab-pane>
					</el-tabs>
							
					
				</div>
			</div>
		</div>
		<selectCube ref="selectCubeForm"></selectCube>
  	</div>
</template>

<script>
	import {baseUrl} from '@/common/biConfig'
	import $ from 'jquery'
	import selectCube from "@/view/bireport/SelectCube";

	export default {
	    data(){
			return {
				activeIndex:"1",
				showtype:"table",
				selectDs:""
			}
		},
		components: {
			selectCube
    	},
		mounted(){
			this.initdataset();
		},
		computed: {
		},
		methods: {	
			selectCube(){
				this.$refs['selectCubeForm'].select();
			},
			initdataset(){
				if (this.selectDs.length === 0) {
					$('#datasettree').jstree({
						core: {
							data: {
								id: 'nodata',
								text: '您还未创建立方体',
								icon: 'fa fa-warning icon_kpi'
							}
						},
						"plugins": ["wholerow"]
					});
					return;
				} else {
					$('#datasettree').jstree({
						core: {
							data: {
								url: 'model/cubeTree.action?selectDsIds=' + this.selectDs + '&t=' + Math.random()
							},
							check_callback: false
						},
						"plugins": ["wholerow"]
					}).bind("ready.jstree", function (a, b) {
						//dragfunc();
					}).bind("after_open.jstree", function () {
						//dragfunc();
					});
				}
			}

		},
		watch: {
		}
	}
</script>

<style lang="css">
#p_param .ptabhelpr{
	padding:5px;
	color: #999999;
    font-size: 14px;
}
</style>
