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
			let leftCols = [];  //左边显示的列表
			
			//切换图表
			let cgbtn = h('button', {attrs:{class:"btn btn-block btn-default"}, on:{click:()=>{this.changeChartType()}}}, '切换图形类型');
			leftCols.push(cgbtn);

			const comp = tools.findCompById(this.chartId, this.pageInfo);
			let tp = comp.chartJson.type;
			let isscatter = tp === 'scatter' || tp === 'bubble';
			let isbubble = tp === 'bubble';

			if(isscatter){
				let xcol = null;
				if(comp.kpiJson && comp.kpiJson.length >0 && comp.kpiJson[0]){
					let o = comp.kpiJson[0];
					xcol = [h('span', {attrs:{class:"charttxt", title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'ycol')}})]
				}else{
					xcol = [h('span', {class:"charttip"}, '将度量拖到这里')]
				}
				//横轴　
				let xcolobj = h('div', {class:"ts_h"}, [h('div', '横轴：'), h('div', {attrs:{class:"h_ctx", id:"ycol"}}, xcol)]);
				leftCols.push(xcolobj);

				let ycol = null;
				if(comp.kpiJson && comp.kpiJson.length >0 && comp.kpiJson[1]){
					let o = comp.kpiJson[1];
					ycol = [h('span', {attrs:{class:"charttxt", title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'y2col')}})]
				}else{
					ycol = [h('span', {class:"charttip"}, '将度量拖到这里')]
				}
				let ycolobj = h('div', {class:"ts_h"}, [h('div', '纵轴'), h('div', {attrs:{class:"h_ctx", id:"y2col"}}, ycol)]);
				leftCols.push(ycolobj);

				//气泡大小
				if(isbubble){
					let qp = null;
					if(comp.kpiJson && comp.kpiJson.length >0 && comp.kpiJson[2]){
						let o = comp.kpiJson[2];
						qp = [h('span', {attrs:{class:"charttxt", title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'ycol')}})]
					}else{
						qp = [h('span', {class:"charttip"}, '将度量拖到这里')]
					}
					let qpobj = h('div', {class:"ts_h"}, [h('div', '气泡大小'), h('div', {attrs:{class:"h_ctx", id:"y3col"}}, qp)]);
					leftCols.push(qpobj);
				}
			}

			let xcol = null;
			if(comp.chartJson && comp.chartJson.xcol){
				let o = comp.chartJson.xcol;
				xcol = [h('span', {attrs:{class:"charttxt", title:o.dimdesc}}, o.dimdesc), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'xcol')}})]
			}else{
				xcol = [h('span', {class:"charttip"}, '将维度拖到这里')]
			}
			//横轴　
			let xcolobj = h('div', {class:"ts_h"}, [h('div', isscatter?'观察维度：':'横轴：'), h('div', {attrs:{class:"h_ctx", id:"xcol"}}, xcol)]);
			leftCols.push(xcolobj);

			if(!isscatter){
				let ycol = null;
				if(comp.kpiJson && comp.kpiJson.length > 0 && comp.kpiJson[0] != null){
					let o = comp.kpiJson[0];
					ycol = [h('span', {attrs:{class:"charttxt", title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'ycol')}})]
				}else{
					ycol = [h('span', {class:"charttip"}, '将度量拖到这里')];
				}
				//纵轴
				let ycolobj = h('div', {class:"ts_h"}, [h('div', '纵轴：'), h('div', {attrs:{class:"h_ctx", id:"ycol"}}, ycol)]);
				leftCols.push(ycolobj);
			}

			if(tp !== 'map'){  //地图没有图例　
				let scol = null;
				if(comp.chartJson && comp.chartJson.scol){
					let o = comp.chartJson.scol;
					scol = [h('span', {attrs:{class:"charttxt", title:o.dimdesc}}, o.dimdesc), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'scol')}})]
				}else{
					scol = [h('span', {class:"charttip"}, '将维度拖到这里')]
				}
				//图例 Ser
				let scolobj = h('div', {class:"ts_h"}, [h('div', '图例'), h('div', {attrs:{class:"h_ctx", id:"scol"}},scol)]);
				leftCols.push(scolobj);
			}
			//启用多指标查询
			//let mkpi = h('div', {class:"ts_h"}, [h('el-checkbox' ,{domProps:{value:this.mkpi}}, "启用多指标")]);

			//维度交换
			let exchange = [
				h('div',{style:{height:"40px"}},''),
				h("img", {attrs:{src:require("../../assets/image/exchangexs1.gif")}}),
				h('a',{attrs:{href:"javascript:;"}, on:{click:()=>{this.exchangexs();}}}, [h("img", {attrs:{src:require("../../assets/image/reload.png")}})]),
				h("img", {attrs:{src:require("../../assets/image/exchangexs2.gif")}})
			];
			
			let rh = [];
			rh.push(h('div', {class:"tsbd"}, leftCols));
			let disp = "none";
			if(!(isscatter || tp === 'map')){  //不支持交换维度
				disp = "block";
			}
			rh.push(h('div', {class:"exchangexs", style:{display:disp}}, exchange));
			let zqw = [];
			if(comp.chartJson.params && comp.chartJson.params.length > 0){
				let clds = [h('b', '钻取维：')];
				$(comp.chartJson.params).each((a,b)=>{
					clds.push(h('span', {class:"chartdrillDim"}, [h('a', {class:"fa fa-minus-square-o",attrs:{href:'javascript:;',title:"上卷"},on:{click:()=>{chartUtils.chartGoupDim(comp, b.id,b.pos, ()=>{this.chartView()})}}}), h('b', b.dimdesc)]));
				});
				zqw.push(h('span', {class:"chartdrillmenu"}, clds));
			}
			zqw.push(h("div", {attrs:{id:"chart"+this.chartId}}, "图表预览区域"));
			rh.push(h('div',{class:"chartctx"}, zqw ));
			
			let r = h('div', {attrs:{class:"ctx", id:"T"+this.chartId}}, rh);
			return h('div', [r, h('div', {attrs:{id:"chartDirllBtn"}, style:{display:"block"}}, ''), h('chgChartDailog', {ref:"chgChartForm"}, ''), h('reportChartDailog', {ref:"reportChartForm"}, '')]);
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
				$("#T" + id + " #xcol, #T" + id +" #ycol, #T"+id+" #y2col, #T"+id+" #y3col, #T"+id+" #ycols, #T"+id+" #scol").droppable({
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
						
						if(tp == 2 && (nodeId == "ycol" || nodeId ==='y2col' || nodeId==='y3col')){
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
						let dropId = $(this).attr("id");
						if(node.li_attr.col_type == 2 && (dropId == "ycol" || dropId == 'y2col' || dropId == 'y3col')){
							let o = {"kpi_id":node.li_attr.col_id, "kpi_name" : node.text, "col_name":node.li_attr.col_name, "aggre":node.li_attr.aggre, "fmt":node.li_attr.fmt, "alias":node.li_attr.alias,"tname":node.li_attr.tname,"unit":node.li_attr.unit,"rate":node.li_attr.rate,"calc":node.li_attr.calc};
							if(dropId === 'ycol'){
								json.kpiJson[0] = o;
							}else if(dropId === 'y2col'){
								json.kpiJson[1] = o;
							}else if(dropId === 'y3col'){
								json.kpiJson[2] = o;
							}
							json.chartJson.ycol = {"type":"kpi"};
							
							ts.setUpdate();
							ts.chartView();
						}
						if(node.li_attr.col_type == 1 && dropId == "xcol"){
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
						if(node.li_attr.col_type == 1 &&  dropId == "scol"){
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
			/**
			 * 重置图形
			 */
			resetChart(){
				var echarts = require('echarts');
				var myChart = echarts.getInstanceByDom(document.getElementById('chart2'));
				if(myChart){
					myChart.dispose();
				}
				let comp = tools.findCompById(this.chartId, this.pageInfo);
				comp.kpiJson = [comp.kpiJson[0]];
				let tp = comp.chartJson.type;
				if(tp == "pie" || tp == "gauge"){
					delete comp.chartJson.scol;
				}
				this.$forceUpdate();
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
				let ts = this;
				var kpiType = json.ttype;
				json = {id:"chart"+this.chartId,"chartJson":json.chartJson, "kpiJson":json.kpiJson, "params":this.pageInfo.params, dsid:json.dsid, dsetId:json.dsetId};
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
							myChart = echarts.init(document.getElementById('chart'+this.chartId),"default", {width:640, height:320});
						}
						myChart.setOption(option, true);
						//图形下钻事件
						myChart.off("click").on('click', function(params){
							var xvalue = params.name;
							var yvalue = params.value;
							var svalue = params.seriesName;
							var pos = {left:params.event.event.clientX, top:params.event.event.clientY};
							var oldDimId = json.chartJson.xcol.alias;
							ts.drillChart(xvalue, yvalue, svalue, pos, tools.findCompById(ts.chartId, ts.pageInfo), oldDimId); 
						});
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
								ts.$refs['reportChartForm'].kpifilter(o, comp);
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
			},
			drillChart(xvalue, yvalue, svalue, pos, comp, oldDimId){
				let ts = this;
				$.contextMenu( 'destroy');
				//查询度量已有维
				var offset = pos;
				var opts = function(resp){
					//如果图形类型是地图，直接从省到市下钻
					var ctp = comp.chartJson.type;
					if(ctp == "map" ){
						if(comp.chartJson.xcol.type == "prov"){  //是省钻到市
							//查找市
							var areaDim = null;
							for(j=0;j<resp.length; j++){
								if(resp[j].type == "city"){
									areaDim = resp[j];
								}
							}
							if(areaDim == null){
								tools.msginfo("未找到地市维度。");
								return;
							}
							/**
							post("getProvByName.action", {name:xvalueDesc}, function(r){
								comp.chartJson.maparea = r.provCode;
								comp.chartJson.mapAreaName = r.provName;
								chartUtils.drillingChart(areaDim.id, compId, 'row', xvalue, xvalueDesc, oldDimId, true);
							},"JSON");
							**/
							return;
						}else if(comp.chartJson.xcol.type == "city"){
							//查找县
							var areaDim = null;
							for(j=0;j<resp.length; j++){
								if(resp[j].type == "town"){
									areaDim = resp[j];
								}
							}
							if(areaDim == null){
								tools.msginfo("未找到县维度。");
								return;
							}
							/**
							$.post("getCityByName.action", {name:xvalueDesc}, function(r){
								comp.chartJson.maparea = r.cityCode;
								comp.chartJson.mapAreaName = r.cityName;
								chartUtils.drillingChart(areaDim.id, compId, 'row', xvalue, xvalueDesc, oldDimId, true);
							},"JSON");
							**/
							return;
						}else{
							tools.msginfo("地图只支持从省市县三级。");
							return;
						}
					}
					var items = {};
					var cnt = 0;
					var ignoreGroup = []; 
					var groupExist = function(ignoreGroup, group){
						var r = false;
						for(let k=0; k<ignoreGroup.length; k++){
							if(ignoreGroup[k] == group){
								r = true;
							}
						}
						return r;
					};
					var findGroupChild = function(grouptype){
						var dimret = [];
						for(let j=0; j<resp.length; j++){
							if(resp[j].grouptype == grouptype){
								dimret.push(resp[j]);
							}
						}
						return dimret;
					};
					for(let i=0; i<resp.length; i++){
						//忽略用户已经选择的维度
						if(tools.dimExist(resp[i].dim_id, comp.chartJson.params) ){
							continue;
						}
						if(comp.chartJson.xcol && resp[i].dim_id == comp.chartJson.xcol.id){
							continue;
						} 
						if(comp.chartJson.scol && resp[i].dim_id == comp.chartJson.scol.id){
							continue;
						}
						if(resp[i].grouptype == '' || resp[i].grouptype == null){ //无分组的，直接显示维度
							var id  = resp[i].dim_id;
							items["dim_"+id] = {name:'<span style="color:#ccc">下钻</span>'+resp[i].dim_desc,isHtmlName: true, callback:function(itemKey, opt, e){
								var dimid = itemKey.split("_")[1];
								chartUtils.drillingChart(dimid, comp, 'row', xvalue, oldDimId, ()=>{
									ts.setUpdate();
									ts.chartView();
								});
							}};
							cnt = cnt + 1;	
						}else{ //有分组，显示分组, 对于分组，如果下级分组已选择，不能再选择上级分组
							if(!groupExist(ignoreGroup, resp[i].grouptype)){
								//var groups = "<div><span style=\"color:#ccc\">下钻</span><span>" + resp[i].groupname+"</span><div style=\"width:150px;\">"
								var o = items["g"+resp[i].grouptype] = {name:"<span style=\"color:#ccc\">下钻</span>"+resp[i].groupname,isHtmlName: true, items:{}};
								ignoreGroup.push(resp[i].grouptype);
								//查询分组的内容
								var lsdim = findGroupChild(resp[i].grouptype);
								var ss = "";
								var ccnt = 0;
								for(let kl = 0; kl<lsdim.length; kl++){
									var tmp = lsdim[kl];
									var cz = tools.dimExist(tmp.dim_id, comp.chartJson.params) ||  (comp.chartJson.xcol && tmp.dim_id == comp.chartJson.xcol.id) || (comp.chartJson.scol && tmp.dim_id == comp.chartJson.scol.id);
									if(!cz){
										o.items['dim_'+tmp.dim_id] = {name:'<span style="color:#ccc">下钻</span>' + tmp.dim_desc, isHtmlName: true, callback:function(itemKey, opt, e){
											var dimid = itemKey.split("_")[1];
											chartUtils.drillingChart(dimid, comp, 'row', xvalue, oldDimId, ()=>{
												ts.setUpdate();
												ts.chartView();
											});
										}};
										ccnt = ccnt + 1;	
									}else{
										ss = "";
										ccnt = 0;
									}
								}
								cnt = cnt + ccnt;
							}
						}
						
					}
					if(cnt == 0){
						tools.msginfo("数据已钻透。", "error");
						return;
					}
					//drillmenu
					$.contextMenu({
						selector: '#chartDirllBtn',
						className: "chartDrillMenu",
						trigger: 'left',
						delay: 500,
						autoHide:true,
						zIndex:2000,
						position: function(opt, x, y){
							opt.$menu.css({left:pos.left, top:pos.top});
						},
						items:items
					});
					$("#chartDirllBtn").trigger("click");
				}
				if(comp.dims){
					opts(comp.dims);
				}else{
					ajax({
						type:"POST",
						url: "bireport/queryDims.action",
						data:{"cubeId": comp.cubeId},
						dataType:"json",
						success:function(resp){
							comp.dims = resp.rows;
							opts(comp.dims);
						}
					}, this);
					
				}
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
.chartdrillmenu {
    margin-top: 5px;
	margin-left: 5px;
	display: block;
}
.chartdrillDim{
	display:-moz-inline-box;  
	display:inline-block;
	text-align:center;
	background-color: #FFFFCC;
	border: 1px solid #CACACA;
	padding: 2px;
	margin:0px 3px 0px 3px;
}
.chartdrillDim a {
	display:-moz-inline-box;  
	display:inline-block;
	width:18px;
	height:12px;
	text-decoration:none;
}
</style>
