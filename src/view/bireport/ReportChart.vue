<!-- 图形渲染类 -->
<script>
	import {ajax,loopChartJson} from '@/common/biConfig'
	import $ from 'jquery'
	import { Loading } from "element-ui";
	import * as tools from '@/view/bireport/bireportUtils'
	import * as chartUtils from '@/view/bireport/chartUtils'
	import * as echartsUtils from '@/common/echartsUtils'
	import chgChartDailog from '@/view/bireport/ChgChartDailog'
	import reportChartDailog from '@/view/bireport/ReportChartDailog'

	export default {
	    data(){
			return {
				mkpi:true,   //多指标查询
				chartId:2
			}
		},
		props: {
			pageInfo: {
				type: Object,
				required: true
			},
		},
		components:{
			chgChartDailog, reportChartDailog
		},
		render(h){
			const comp = tools.findCompById(this.chartId, this.pageInfo);
			let xcol = null;
			if(comp.chartJson && comp.chartJson.xcol){
				let o = comp.chartJson.xcol;
				xcol = [h('span', {attrs:{class:"charttxt", title:o.dimdesc}}, o.dimdesc), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'xcol')}})]
			}else{
				xcol = [h('span', {class:"charttip"}, '将维度拖到这里')]
			}
			//横轴　
			let xcolobj = h('div', {class:"ts_h"}, [h('div', '横轴：'), h('div', {attrs:{class:"h_ctx", id:"xcol"}}, xcol)]);

			let ycol = null;
			if(comp.kpiJson && comp.kpiJson.length > 0 && comp.kpiJson[0] != null){
				let o = comp.kpiJson[0];
				ycol = [h('span', {attrs:{class:"charttxt", title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'ycol')}})]
			}else{
				ycol = [h('span', {class:"charttip"}, '将度量拖到这里')];
			}
			//纵轴
			let ycolobj = h('div', {class:"ts_h"}, [h('div', '纵轴：'), h('div', {attrs:{class:"h_ctx", id:"ycol"}}, ycol)]);

			let scol = null;
			if(comp.chartJson && comp.chartJson.scol){
				let o = comp.chartJson.scol;
				scol = [h('span', {attrs:{class:"charttxt", title:o.dimdesc}}, o.dimdesc), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'scol')}})]
			}else{
				scol = [h('span', {class:"charttip"}, '将维度拖到这里')]
			}
			//图例 Ser
			let scolobj = h('div', {class:"ts_h"}, [h('div', '图例'), h('div', {attrs:{class:"h_ctx", id:"scol"}},scol)]);
			//切换图表
			let cgbtn = h('button', {attrs:{class:"btn btn-block btn-default"}, on:{click:()=>{this.changeChartType()}}}, '切换图形类型');
			//启用多指标查询
			//let mkpi = h('div', {class:"ts_h"}, [h('el-checkbox' ,{domProps:{value:this.mkpi}}, "启用多指标")]);

			//维度交换
			let exchange = [
				h('div',{style:{height:"40px"}},''),
				h("img", {attrs:{src:require("../../assets/image/exchangexs1.gif")}}),
				h('a',{attrs:{href:"javascript:;"}, on:{click:()=>{this.exchangexs();}}}, [h("img", {attrs:{src:require("../../assets/image/reload.png")}})]),
				h("img", {attrs:{src:require("../../assets/image/exchangexs2.gif")}})
			];
			let r = h('div', {attrs:{class:"ctx", id:"T"+this.chartId}}, [h('div', {class:"tsbd"}, [cgbtn, xcolobj, ycolobj, scolobj]), h('div', {class:"exchangexs"}, exchange), h("div", {attrs:{class:"chartctx", id:"chart"+this.chartId}}, "图表预览区域")]);
			return h('div', [r, h('chgChartDailog', {ref:"chgChartForm"}, ''), h('reportChartDailog', {ref:"reportChartForm"}, '')]);
		},
		mounted(){
			this.initChartKpiDrop(2);
			//放入window对象
			window.echartsUtils = echartsUtils;
			var echarts = require('echarts');
			window.echarts = echarts;
		},
		beforeDestroy(){
			delete window.echartsUtils;
			delete window.echarts;
		},
		computed: {
		},
		methods: {	
			exchangexs(){
				var comp = tools.findCompById(this.chartId, this.pageInfo);
				if(comp.chartJson == undefined || (comp.chartJson.xcol == undefined && comp.chartJson.scol == undefined)){
					tools.msginfo("您还未选择维度。");
				}
				var tmp = comp.chartJson.xcol;
				comp.chartJson.xcol = comp.chartJson.scol;
				comp.chartJson.scol = tmp;
				this.chartView();
			},
			changeChartType(){
				var comp = tools.findCompById(this.chartId, this.pageInfo);
				this.$refs['chgChartForm'].open(comp);
				
			},
			initChartKpiDrop(id){
				const ts = this;
				$("#T" + id + " #xcol, #T" + id +" #ycol, #T"+id+" #ycols, #T"+id+" #scol").droppable({
					accept:"#datasettree .jstree-node",
					tolerance:"pointer",
					over:function(e, ui){
						var ref = $("#datasettree").jstree(true);
						var node = ref.get_node(ui.draggable[0]);
						var tp = node.li_attr.col_type;
						var nodeId = $(this).attr("id");
						if(tp == 1 && (nodeId == 'xcol' || nodeId == 'scol')){
							$(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
							$(this).css("border", "1px solid #ff0000");
						}
						
						if(tp == 2 && (nodeId == "ycol")){
							$(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
							$(this).css("border", "1px solid #ff0000");
						}
					},
					out:function(e, ui){
						$(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
						$(this).css("border-color", "#7F9DB9");
					},
					drop:function(e, ui){
						var id = ts.chartId;
						var json = tools.findCompById(id, ts.pageInfo);
						//清除边框样式
						$("#T"+id+" #"+$(this).attr("id")).css("border-color", "#7F9DB9");
						//获取TREE
						var ref = $("#datasettree").jstree(true);
						var node = ref.get_node(ui.draggable[0]);

						//判断拖入的维度及度量是否和以前维度及度量在同一个表。
						if(json.cubeId != undefined){
							if(json.cubeId != node.li_attr.cubeId){
								tools.msginfo("您拖入的"+ (node.li_attr.col_type == 2 ? "度量" : "维度") +"与组件已有的内容不在同一个数据表中，拖放失败。");
								return;
							}
						}

						json.cubeId = node.li_attr.cubeId;
						json.dsid = node.li_attr.dsid;
						json.dsetId = node.li_attr.dsetId;
						json.chartJson.label = "PIC";
						
						if(json.kpiJson == undefined){
							json.kpiJson = [];
						};

						//拖放度量后，判断维度是否在params中
						if(node.li_attr.col_type == 1){
							var dimId = node.li_attr.col_id;
							if(chartUtils.findDimById(dimId, json.chartJson.params) != null){
								tools.msginfo("您拖放的维度已存在于钻取维中，不能拖放。")
								return;
							}
						}
						
						if(node.li_attr.col_type == 2 && $(this).attr("id") == "ycol"){
							json.kpiJson = [];
							json.kpiJson.push({"kpi_id":node.li_attr.col_id, "kpi_name" : node.text, "col_name":node.li_attr.col_name, "aggre":node.li_attr.aggre, "fmt":node.li_attr.fmt, "alias":node.li_attr.alias,"tname":node.li_attr.tname,"unit":node.li_attr.unit,"rate":node.li_attr.rate,"calc":node.li_attr.calc});
							json.chartJson.ycol = {"type":"kpi"};
							
							ts.setUpdate();
							ts.chartView();
						}
						if(node.li_attr.col_type == 1 && $(this).attr("id") == "xcol"){
							//判断是否在xcol中已经存在
							if(json.chartJson.scol != undefined && json.chartJson.scol.id == node.li_attr.col_id){
								tools.msginfo("您拖放的维度已存在于图例项中，不能拖放。")
								return;
							}
							
							//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
							var gt = node.li_attr.grouptype;
							if(gt != null && gt != ''){
								if(json.chartJson.scol != undefined && json.chartJson.scol.grouptype == gt){
									tools.msginfo("您拖放的维度与此图表中已有维度分组相同，不能拖放。")
									return;
								}
							}
							
							json.chartJson.xcol = {"id":node.li_attr.col_id, "dimdesc" : node.text, "type":node.li_attr.dim_type, "colname":node.li_attr.col_name,"alias":node.li_attr.alias,"tname":node.li_attr.tname,"iscas":node.li_attr.iscas, "tableName":node.li_attr.tableName, "tableColKey":node.li_attr.tableColKey,"tableColName":node.li_attr.tableColName, "dimord":node.li_attr.dimord, "dim_name":node.li_attr.dim_name, "grouptype":node.li_attr.grouptype,"valType":node.li_attr.valType, "ordcol":node.li_attr.ordcol,dateformat:node.li_attr.dateformat,"calc":node.li_attr.calc};
							ts.setUpdate();
							ts.chartView();
						}
						if(node.li_attr.col_type == 1 && $(this).attr("id") == "scol"){
							//判断是否在xcol中已经存在
							if(json.chartJson.xcol != undefined && json.chartJson.xcol.id == node.li_attr.col_id){
								tools.msginfo("您拖放的维度已存在于横轴中，不能拖放。")
								return;
							}
							
							//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
							var gt = node.li_attr.grouptype;
							if(gt != null && gt != ''){
								if(json.chartJson.xcol != undefined && json.chartJson.xcol.grouptype == gt){
									tools.msginfo("您拖放的维度与此图表中已有维度分组相同，不能拖放。")
									return;
								}
							}
							
							json.chartJson.scol = {"id":node.li_attr.col_id, "dimdesc" : node.text, "type":node.li_attr.dim_type, "colname":node.li_attr.col_name,"alias":node.li_attr.alias,"tname":node.li_attr.tname,"iscas":node.li_attr.iscas, "tableName":node.li_attr.tableName, "tableColKey":node.li_attr.tableColKey,"tableColName":node.li_attr.tableColName, "dimord":node.li_attr.dimord, "dim_name":node.li_attr.dim_name, "grouptype":node.li_attr.grouptype,"valType":node.li_attr.valType, "ordcol":node.li_attr.ordcol,"calc":node.li_attr.calc};
							
							ts.setUpdate();
							ts.chartView();
						}
					}
				});
			},
			setUpdate(){
				this.$parent.$parent.$parent.setIsUpdate();
			},
			chartView(){
				this.$forceUpdate();
				let json = tools.findCompById(this.chartId, this.pageInfo);
				if(!json.kpiJson || json.kpiJson.length == 0){
					return;
				}
				if(json.chartJson.type == "scatter" && (json.kpiJson.length < 2 || json.kpiJson[1] == null)  ){
					return;
				}
				if(json.chartJson.type == "bubble" && (json.kpiJson.length < 3 || json.kpiJson[2] == null ) ){
					return;
				}
				var kpiType = json.ttype;
				json = {"chartJson":json.chartJson, "kpiJson":json.kpiJson, "params":this.pageInfo.params, dsid:json.dsid, dsetId:json.dsetId};
				let load = Loading.service({ fullscreen: true });
				ajax({
					type: "POST",
					url: "bireport/ChartView.action",
					postJSON:true,
					data: JSON.stringify(json),
					success: (resp)=>{							
						let option = loopChartJson(resp.rows);
						let myChart = echarts.getInstanceByDom(document.getElementById('chart'+this.chartId));
						if(!myChart){
							myChart = echarts.init(document.getElementById('chart'+this.chartId));
						}
						myChart.setOption(option, true);
					}
				}, this, load);
			},
			chartmenu(o, pos){
				const ts = this;
				$.contextMenu( 'destroy');
				$.contextMenu({
					selector: 'a.charticon', 
					className: "chartDimOpt",
					trigger: 'left',
					delay: 500,
					autoHide:true,
					callback: function(key, opt) {
						var comp = tools.findCompById(ts.chartId, ts.pageInfo);
						if(key == 'asc' || key == 'desc'){
							chartUtils.chartsort(key, pos, comp, ()=>{
								ts.setUpdate();
								ts.chartView();
							});
						}else if(key == "filter"){
							if(pos === 'xcol' || pos === 'scol'){
								ts.$parent.$parent.$parent.$refs['paramFilterForm'].createDimFilter(o, comp, 'chart');
							}else{  //指标筛选

							}
						}else if(key == "prop"){
							ts.$refs['reportChartForm'].setChartKpi(o, comp);
						}else if(key == "top"){
							ts.$refs['reportChartForm'].dimTop(o, comp);
						}else if(key == "remove"){
							chartUtils.delChartKpiOrDim(pos, comp, ()=>{
								ts.setUpdate();
								ts.chartView();
							});
						}
					},
					items: {
						"asc": {name: "升序", icon: "fa-sort-amount-asc"},
						"desc": {name: "降序", icon: 'fa-sort-amount-desc'},
						"filter": {name: "筛选",icon:"fa-filter"},
						"top": {name: "取Top...",disabled:function(key, opt){
							if(pos == "xcol"){
								return false;
							}else{
								return true;
							}
						}},
						"prop": {name: "属性...",disabled:function(key, opt){
							let tp = pos;
							if(tp == 'ycol' || tp == 'y2col' || tp=='y3col'){
								return false;
							}else{
								return true;
							}
						}},
						"remove": {name: "删除",icon:"fa-remove"}
					}
				});
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
.tsbd {
	width:135px;
	float:left;
	.ts_h{
		font-size:14px;
		margin:10px;
		width:120px;
	}
	.h_ctx {
		border: 1px solid #7F9DB9;
		overflow: hidden;
		height: 26px;
		border-radius: 5px;
	}
}
span.charttip {
	color:#999999;
	padding:3px;
	display:block;
	font-size: 12px;
}
.exchangexs {
	width:20px;
	height:170px;
	float:left;
}
.chartctx {
	border:1px solid #CACACA;
	height:320px;
	margin-left:170px;
}
span.charttxt {
	display:-moz-inline-box;  
	display:inline-block;
	width:90px;
	padding:2px;
	float:left;
	overflow:hidden;
	white-space:nowrap;
}
a.charticon {
	display:-moz-inline-box;  
	display:inline-block;
	width:20px;
	height:16px;
	cursor:pointer;
	float:right;
	margin-top:1px;
}
</style>
