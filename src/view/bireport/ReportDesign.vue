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
					<reportParam :pageInfo="pageInfo" ref="paramForm"></reportParam>
					
					<el-tabs v-model="showtype" type="border-card">
						<el-tab-pane label="表格" name="table">
							<reportTable :pageInfo="pageInfo" ref="tableForm"></reportTable>
						</el-tab-pane>
						<el-tab-pane label="图形" name="chart">
							<report-chart :pageInfo="pageInfo" ref="chartForm"></report-chart>
						</el-tab-pane>
					</el-tabs>
					<div class="clearbtn">
						<button type="button" class="btn btn-default btn-xs" @click="cleanData()">清除数据</button>
					</div>
					
				</div>
			</div>
		</div>
		<selectCube ref="selectCubeForm"></selectCube>
		<paramFilter :pageInfo="pageInfo" ref="paramFilterForm"></paramFilter>
  	</div>
</template>

<script>
	import {baseUrl} from '@/common/biConfig'
	import $ from 'jquery'
	import selectCube from "@/view/bireport/SelectCube";
	import reportParam from "@/view/bireport/ReportParam";
	import reportTable from "@/view/bireport/ReportTable";
	import reportChart from "@/view/bireport/ReportChart";
	import paramFilter from "@/view/bireport/ParamFilter";
	import reportTableDailog from "@/view/bireport/ReportTableDailog";
	import "jstree";
	import "jstree/dist/themes/default/style.min.css";
	import 'jquery-ui-dist/jquery-ui'
	import "jquery-contextmenu";
	import "jquery-contextmenu/dist/jquery.contextMenu.min.css";

	export default {
		name:"reportDesign",
	    data(){
			return {
				activeIndex:"1",
				showtype:"table",
				pageInfo:{
					selectDs:"",
					comps:[
						{"name":"表格组件","id":1, "type":"table"},
						{"name":"","id":2, "type":"chart",chartJson:{type:"line",params:[]},kpiJson:[]}], 
					params:[]
				},  //多维分析的配置对象
				isupdate:false  //是否发生了变动
			}
		},
		components: {
			selectCube,reportParam,reportTable,reportChart,paramFilter
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
				let ref = $("#datasettree").jstree(true);
				if(ref){
					ref.destroy();
				}
				if (this.pageInfo.selectDs.length === 0) {
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
					const dragfunc = () => {
						$("#datasettree .jstree-node").draggable({
							cursor: "point",
							appendTo: "body",
							revert: 'invalid',
							revertDuration: 250,
							cursorAt: { top: 0, left: -35 },
							helper:function(e){
								var id = $(this).find("a.jstree-anchor:first").text();
								return "<div class=\"vakata-dnd\"><span class=\"miconcancel glyphicon glyphicon-remove\"></span>"+id+"</div>";
							},
							start:function(e){
								var ref = $('#datasettree').jstree(true),node = ref.get_node(this);
								var attr = node.li_attr;
								delete attr.id;
								if($.isEmptyObject(attr)){
									return false;
								}
								return true;
							}
						});
					}
					$('#datasettree').jstree({
						core: {
							data: {
								url: 'model/treeCube.action?cubeId=' + this.pageInfo.selectDs + '&t=' + Math.random()
							},
							check_callback: false
						},
						"plugins": ["wholerow"]
					}).bind("ready.jstree", function (a, b) {
						dragfunc();
					}).bind("after_open.jstree", function () {
						dragfunc();
					});
				}
			},
			cleanData(){
				if(this.showtype==="table"){ //清除表格
					this.pageInfo.comps[0] = {"name":"表格组件","id":1, "type":"table"};
					this.$refs['tableForm'].datas = null;
					this.$refs['tableForm'].$forceUpdate();
				}else{ //清除图形
					this.pageInfo.comps[1] = {"name":"","id":2, "type":"chart",chartJson:{type:"line",params:[]},kpiJson:[]};
					this.$refs['chartForm'].$forceUpdate();
				}
			},
			setIsUpdate(){
				this.isupdate = true;
			}
		},
		watch: {
		}
	}
</script>

<style lang="css">
.icon_kpi {
	color:#e07900;
}
.icon_dim {
	color:#006ae1;
}
.vakata-dnd {
	border:solid 1px #ddd;
	background-color:#f5f5f5;
	border-radius:3px;
	z-index:9999;
	padding:3px;
	box-shadow:0 2px 3px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.12);
}
.vakata-dnd .miconcancel {
	display:inline-block;
	width:16px;
	height:16px;
	color:#3f36c3;
}
.el-tabs--border-card {
	box-shadow:none;
}
.clearbtn {
	position: absolute;
	z-index:10;
	right:20px;
	top:73px;
}
/**固定弹出窗口的高度 */
 .el-dialog-div{
    height: 60vh;
    overflow: auto;
 }
 .el-tabs--border-card>.el-tabs__content {
	 padding: 5px;
 }
</style>
