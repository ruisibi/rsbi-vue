<template>
  	<div class="wrapper-content-nomargin">
		<el-menu @select="handleSelect" class="el-menu-demo" background-color="#f6f8f8" text-color="#777" mode="horizontal">
			<el-submenu index="1">
				<template slot="title"><i class="fa fa-file"></i> 文件</template>
				<el-menu-item index="1-1">打开</el-menu-item>
				<el-menu-item index="1-2">新建</el-menu-item>
				<el-menu-item index="1-3">保存</el-menu-item>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title"><i class="fa fa-file-excel-o"></i> 导出</template>
				<el-menu-item index="html">HTML</el-menu-item>
				<el-menu-item index="csv">CSV</el-menu-item>
				<el-menu-item index="excel">EXCEL</el-menu-item>
				<el-menu-item index="word">WORD</el-menu-item>
				<el-menu-item index="pdf">PDF</el-menu-item>
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
					
					<el-tabs v-model="pageInfo.showtype" type="border-card">
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
		<selectCube ref="selectCubeForm" :callback="selectCubeCallback"></selectCube>
		<paramFilter :pageInfo="pageInfo" ref="paramFilterForm"></paramFilter>
		<kpi-desc ref="kpiDescForm"></kpi-desc>
		<report-save ref="reportSaveForm"></report-save>
		<report-list ref="reportListForm"></report-list>
  	</div>
</template>

<script>
	import {baseUrl, ajax} from '@/common/biConfig'
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
	import kpiDesc from './KpiDesc.vue';
	import * as tools from '@/view/bireport/bireportUtils'
	import reportSave from './ReportSave.vue';
	import reportList from './ReportList.vue';
	import ChildA from '@/view/bireport/Table2ChartDailog'

	export default {
		name:"reportDesign",
	    data(){
			return {
				pageInfo:{
					selectDs:"",
					showtype:"table",
					comps:[
						{"name":"表格组件","id":1, "type":"table"},
						{"name":"","id":2, "type":"chart",chartJson:{type:"line",params:[]},kpiJson:[]}], 
					params:[]
				},  //多维分析的配置对象
				isupdate:false  //是否发生了变动
			}
		},
		components: {
			selectCube,reportParam,reportTable,reportChart,paramFilter, kpiDesc,reportSave,reportList
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
			selectCubeCallback(cubeId){
				this.pageInfo.selectDs = cubeId;
				this.initdataset();
			},
			initdataset(){
				const ts = this;
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
							data: function (obj, callback) {
								ajax({
									url:"model/treeCube.action",
									data:{cubeId:ts.pageInfo.selectDs},
									success:(resp)=>{
										callback.call(this, resp.rows);
									}
								}, ts);
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
			cleanData(isall){
				if(this.pageInfo.showtype==="table" || isall === true){ //清除表格
					this.pageInfo.comps[0] = {"name":"表格组件","id":1, "type":"table"};
					this.$refs['tableForm'].datas = null;
					this.$refs['tableForm'].$forceUpdate();
				}
				if( this.pageInfo.showtype==="chart" || isall === true){ //清除图形
					this.pageInfo.comps[1] = {"name":"","id":2, "type":"chart",chartJson:{type:"line",params:[]},kpiJson:[]};
					var echarts = require('echarts');
					var myChart = echarts.getInstanceByDom(document.getElementById('chart2'));
					if(myChart){
						myChart.dispose();
					}
					this.$refs['chartForm'].$forceUpdate();
				}
			},
			setIsUpdate(){
				this.isupdate = true;
			},
			//根据pageInfo重置多维分析
			resetOlap(){
				this.initdataset();
				this.isupdate = false;
				this.$nextTick(()=>{  //不采用这种方式，会出现子组件 pageInfo 没更新的情况
					this.$refs['tableForm'].tableView();
					this.$refs['chartForm'].chartView();
					this.$refs['chartForm'].initChartKpiDrop(2);
				});
			},
			handleSelect(key, keyPath){
				if(key === '4'){
					this.$refs['kpiDescForm'].openDailog(this.pageInfo.selectDs);
				}else if(key === '3'){  //打印
					var comp = this.pageInfo.showtype === 'table' ? tools.findCompById(1, this.pageInfo) : tools.findCompById(2, this.pageInfo)
					if(this.pageInfo.showtype === 'table'){
						if(!comp.kpiJson){
							tools.msginfo("无数据");
							return;
						}
					}
					if(this.pageInfo.showtype ==='chart'){
						if(!comp.kpiJson || comp.kpiJson.length == 0){
							tools.msginfo("无数据");
							return;
						}
						if(comp.chartJson.type == "scatter" && (comp.kpiJson.length < 2 || comp.kpiJson[1] == null)  ){
							tools.msginfo("无数据");
							return;
						}
						if(comp.chartJson.type == "bubble" && (comp.kpiJson.length < 3 || comp.kpiJson[2] == null ) ){
							tools.msginfo("无数据");
							return;
						}
					}
					var info = JSON.parse(JSON.stringify(this.pageInfo));  //复制对象
					delete comp.dims;
					info.comps = [comp];
					this.$router.push({path:"/bireport/Print", name:"bireportPrint", params:{json:info,type:this.pageInfo.showtype}});
				}else if(key ==='1-3'){  //保存
					this.$refs['reportSaveForm'].open(this.pageInfo);
				}else if(key === '1-1'){  //打开
					this.$refs['reportListForm'].open();
				}else if(key ==='1-2'){ //新建
					if(this.isupdate){
						if(!confirm("多维分析未保存，是否继续新建？")){
							return
						}
					}
					this.cleanData(true);
					this.pageInfo = {
						selectDs:"",
						showtype:"table",
						comps:[
							{"name":"表格组件","id":1, "type":"table"},
							{"name":"","id":2, "type":"chart",chartJson:{type:"line",params:[]},kpiJson:[]}], 
						params:[]
					}
					this.initdataset();
				}else if(key == "html" || key === "csv" || key === "word" || key ==='excel' || key === "pdf"){
					this.exportPage(key);
				}
			},
			exportPage(tp){
				var ctx = "<form name='expff' method='post' action=\""+baseUrl+"/bireport/ReportExport.action\" id='expff'><input type='hidden' name='type' id='type'><input type='hidden' name='json' id='json'><input type='hidden' name='picinfo' id='picinfo'></form>";
				if($("#expff").length == 0){
					$(ctx).appendTo("body");
				}
				var info = JSON.parse(JSON.stringify(this.pageInfo));  //复制对象
				var comp = tools.findCompById(this.pageInfo.showtype ==='table'?1:2 , this.pageInfo);
				delete comp.dims;
				info.comps = [comp];
				$("#expff #type").val(tp);
				$("#expff #json").val(JSON.stringify(info));
				//把图形转换成图片
				var strs = "";
				if((tp == "pdf" || tp == "excel" || tp == "word") && comp.type ==='chart'){
					var echarts = require('echarts');
					var chart = echarts.getInstanceByDom(document.getElementById("chart2"));
					if(chart){
						var str = chart.getDataURL({type:'png', pixelRatio:1, backgroundColor: '#fff'});
						str = str.split(",")[1]; //去除base64标记
						str = comp.chartJson.label + "," + str; //加上label标记
						strs = strs  +  str;
					}
				}
				$("#expff #picinfo").val(strs);
				$("#expff").submit().remove();
			},
			table2chart(){
				alert(3);
			}
		},
		watch: {
			
		}
	}
</script>

<style lang="less">
@import "../../style/common";
.el-tabs--border-card {
	box-shadow:none;
}
.clearbtn {
	position: absolute;
	z-index:10;
	right:20px;
	top:73px;
}
 .el-tabs--border-card>.el-tabs__content {
	 padding: 5px;
 }
</style>
