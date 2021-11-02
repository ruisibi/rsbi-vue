<!-- 表格渲染类 -->
<script>
import { ajax } from "@/common/biConfig";
import $ from "jquery";
import * as tools from '@/view/bireport/bireportUtils'
import * as tableUtils from '@/view/bireport/tableUtils'
import { Loading } from "element-ui";
import reportTableDailog from '@/view/bireport/ReportTableDailog'
import table2chart from '@/view/bireport/Table2ChartDailog'
import detailLink from '@/view/bireport/TableDetailLink'

export default {
  name:"reportTable",
  data() {
	  return {
		  tableId:1,  //ID 写死
		  datas:null	//数据
		} 
  },
  props: {
    pageInfo: {
      type: Object,
      required: true,
    },
  },
  components:{
	reportTableDailog,detailLink,table2chart
  },
  render(h){
	  let tdborder = "1px solid #dee5e7";
	  //一个 table, 2个tr, 一个 tr 里 2个td
	  let trtd1 = h('td', {class:"blank", attrs:{valign:"bottom"}}, this.renderCrossList(h));
	  let trtd2 = h('td', {style:{border:this.datas?"":tdborder}},[h("div", {attrs:{id:"d_colDims"}}, this.renderColDimsList(h))]);
	  let tr2td1 = h('td', {style:{border:this.datas?"":tdborder}}, [h('div', {attrs:{id:"d_rowDims"}}, this.renderRowDimsList(h))]);
	  let tr2td2 = h('td', {style:{border:this.datas?"":tdborder}}, this.renderKpisList(h));
	  let tr = [h('tr', [trtd1, trtd2])];
	  let tr2 = [h('tr', [tr2td1, tr2td2])];
	  let table = h('table', {class:"d_table"}, [h('tbody', [tr, tr2])]);
	  return h('div', {attrs:{tp:"table", class:"comp_table", id:"T"+this.tableId}}, [table, h('reportTableDailog',{ref:"tableDailog"}, ''), h('detailLink', {ref:"detailLinkForm"}), h('table2chart', {ref:"table2chartForm"})]);
  },
  mounted() {
	  this.bindDropEvent(this.tableId);
	  //注册固定表头事件
	  tableUtils.fireTableScroll(tools.findCompById(this.tableId, this.pageInfo));
	  $(window).bind("resize",()=>{
		  tableUtils.fireTableScroll(tools.findCompById(this.tableId, this.pageInfo));
	  });
  },
  beforeDestroy(){
    $(window).unbind("resize");
  },
  computed: {},
  methods: {
	   /**
	   * 渲染交叉表rows维度列表
	   */
	  renderRowDimsList(h){
		   let ts = this;
		   let ret = [];
		   if(this.datas){
				let trs = [];
				$(this.datas.datas).each((a, b)=>{
					let ths = [];
					$(b).each((c, d)=>{
						if(d.isRow === false){
							return true;
						}
						let lastlvl = d.level === ts.datas.rowLevel - 1;
						ths.push(h('th', {attrs:{colspan:d.colSpan, rowspan:d.rowSpan,valign:"top"}},[h('span', {class:"s_rowDim", title:d.value}, [
							h('a',{attrs:{class:(d.nodeType==='none'?"":(lastlvl?"dimDrill fa fa-plus-square-o":"dimgoup fa fa-minus-square-o"))}, on:{click:()=>{lastlvl?ts.drillDim(d.nodeId, 'row', d.value):ts.dirllUp(d.nodeId, 'row')}}},' '),
							h('span', d.value)
						])]));
					});
					trs.push(h('tr', ths));
				});
				ret.push(h('table',{attrs:{class:"grid5"}},[h('tbody', trs)]));
			}else{
				ret = [h('div',{class:"tabhelpr"},[h('div','将维度拖到此处'), h('div','作为行标签')])];
			}

		  return ret;
	  },

		/**
		 * 渲染交叉区域
		 */
	  renderCrossList(h){
		  let ts = this;
		  const comp = tools.findCompById(this.tableId, this.pageInfo);
		  if(comp.rows && comp.rows.length > 0 ){
			  let tds = [];
			  $(comp.rows).each((a, b)=>{
				  tds.push(h('th', [h('span', [h('b',b.dimdesc), h('a', 
				  {attrs:{class:"fa fa-gear set tableDimOpt",href:"javascript:;"},on:{click:()=>{ts.setDimInfo(b, 'row')}}}, " ")])]));
			  });
			  let r = [(h("table", {class:"grid5"}, [h("tbody", [h('tr', tds)])]))];
			  return [h("div", {attrs:{class:"rowDimsList"}}, r)];
		  }else{
			  return [];
		  }
		
	  },
	  /**
	   * 渲染交叉表cols维度列表
	   */
	   renderColDimsList(h){
		    let ts = this;
			const comp = tools.findCompById(this.tableId, this.pageInfo);
			let ret = [];
		   	if(comp.cols && comp.cols.length > 0){
				 let nodes = [];
				 $(comp.cols).each((a, b)=>{
					 nodes.push(h('span', [h('b', b.dimdesc), h('a', 
					 {attrs:{class:"fa fa-gear set tableDimOpt", href:"javascript:;"},on:{click:()=>ts.setDimInfo(b, 'col')}}, ' ')]));
				 });
				 ret.push(h('div', {class:"colDimsList"}, nodes));

			}else{
				ret.push(h('div', {class:"tabhelpr"},'将维度拖到此处作为列标签'));
			}
			if(this.datas){
				let trs = [];
				let size = this.datas.header.length;
				$(this.datas.header).each((a, b)=>{
					let ths = [];
					$(b).each((c, d)=>{
						if(d.isCross){
							return true;
						}
						if(a === size - 1){ //最后一行是指标
							let isext = d.nodeId && d.nodeId.startsWith("ext_");  //该指标是指标的衍生指标
							let jstype = isext?d.nodeId.split("_")[2]:"";
							let jskpiId = isext?d.nodeId.split("_")[1]:"";
							ths.push(h('th', {attrs:{colspan:d.colSpan, rowspan:d.rowSpan}},[h('span', {class:"colkpi"},[
								h('span', {attrs:{class:"kpiname", title:d.desc}},d.desc), 
								h('a',{attrs:{class:isext?"fa fa-remove":"fa fa-gear" + "fa fa-gear set tableKpiBtn",href:"javascript:;"}, on:{click:()=>{isext?ts.delExtKpi(jskpiId,jstype):ts.setKpiInfo(d.col)}}},' ')
							])]));
						}else{ //其他是维度
							let lastlvl = d.level === ts.datas.colLevel - 2;
							ths.push(h('th', {attrs:{colspan:d.colSpan, rowspan:d.rowSpan}},[h('div', {class:"coldim"},[
								h('a', {attrs:{class:d.nodeType==='none'?"":(lastlvl?"dimDrill fa fa-plus-square-o":"dimgoup fa fa-minus-square-o")},on:{click:()=>{lastlvl?ts.drillDim(d.nodeId, 'col', d.value):ts.dirllUp(d.nodeId, 'col')}}},' '), 
								h('span',{attrs:{class:"s_colDim", title:d.desc}},d.desc)
							])]));
						}
						
					});
					trs.push(h('tr', ths));
				});
				ret.push(h('table',{attrs:{class:"grid5"}},[h('tbody', trs)]));
			}
			return ret;
	   },
	   /**
		* 渲染指标区域数据
	    */
	   renderKpisList(h){
		   let ret = [];
		   let ts = this;
		   const comp = tools.findCompById(this.tableId, this.pageInfo);
		   if(this.datas){
				let trs = [];
				$(this.datas.datas).each((a, b)=>{
					let ths = [];
					$(b).each((c, d)=>{
						if(d.isRow === true){
							return true;
						}
						//判断是否有预警
						let hasyj = false;
						comp.kpiJson.forEach(element => {
							if(element.kpi_id == d.colRef && element.warning){
								hasyj = true;
								return false;
							}
						});
						ths.push(h('td', {attrs:{class: (a%2===0?"kpiData1":"kpiData2")+ " grid5-td", align:"right"}},[h('span', {attrs:{class:"kpiValue"}}, [h('a', {
							attrs:{href:"javascript:;"},
							on:{
								click:()=>{
									ts.linkDetail(d);
								}
							}
						}, hasyj?[h('span', {domProps:{innerHTML:d.value}})]:d.value)])]));
					});
					trs.push(h('tr', ths));
				});
				ret.push(h('table',{class:"grid5"},[h('tbody', trs)]));
		   }else{
		 	  ret.push(h('div', {attrs:{class:"tabhelpr"},domProps:{innerHTML:"将度量拖到此处<br/>查询数据"}}));
		   }
		   return [h("div", {attrs:{id:"d_kpi"}}, ret)];
	   },
	   linkDetail(dt){
		   let comp = tools.findCompById(this.tableId, this.pageInfo);
		   this.$refs['detailLinkForm'].linkDetail(comp, dt.pms);
	   },
	 bindDropEvent(id){
		var ischg = false;
		const ts = this;
		$("#T" + id + " #d_colDims, #T" + id +" #d_rowDims, #T"+id+" #d_kpi").droppable({
			accept:"#datasettree .jstree-node",
			tolerance:"pointer",
			over:function(e, ui){
				var ref = $("#datasettree").jstree(true);
				var node = ref.get_node(ui.draggable[0]);
				var tp = node.li_attr.col_type;
				//对维度拖拽设置图标
				var id = $(this).attr("id");
				if(tp == 1 && (id == "d_colDims" || id == "d_rowDims")){
					$(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
					$(this).css("border", "1px solid #ff0000");
					ischg = true;
				}else{
					ischg = false;
				}
				//对度量拖拽设置图标
				if(tp == 2 && id == "d_kpi"){
					$(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
					$(this).css("border", "1px solid #ff0000");
					ischg = false;
				}
			},
			out:function(e, ui){
				if($(this).attr("id") == 'd_kpi' && ischg == true){
					
				}else{
					$(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
					$(this).css("border", "none");
				}
			},
			drop:function(e, ui){
				var id = $(this).parents(".comp_table").attr("id").replace("T","");
				var json = tools.findCompById(Number(id), ts.pageInfo);
				//清除边框颜色
				$("#T"+id+" #" + $(this).attr("id")).css("border", "none");
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
				
				//判断拖入的度量是否是（同比、环比），如果是，需要判断当前维度是否有date类型
				/**  放入度量计算菜单判断
				if(node.li_attr.calc_kpi == 1){
					if(!isExistDateDim(json, 'table')){
						tools.msginfo("您拖入的度量需要表格中先有时间类型的维度(年/季度/月/日)。");
						return;
					}
				}
				**/
				
				json.cubeId = node.li_attr.cubeId;
				json.dsid = node.li_attr.dsid;
				json.dsetId = node.li_attr.dsetId;
				
				if(json.kpiJson == undefined){
					json.kpiJson = [];
				};
				if(json.cols == undefined){
					json.cols = [];
				}
				if(json.rows == undefined){
					json.rows = [];
				}
				//写度量
				if(node.li_attr.col_type == 2 && $(this).attr("id") == "d_kpi"){
					//如果度量存在就忽略
					if(!tools.kpiExist(node.li_attr.col_id, json.kpiJson)){
						json.kpiJson.push({"kpi_id":node.li_attr.col_id, "kpi_name" : node.text, "col_name":node.li_attr.col_name, "aggre":node.li_attr.aggre, "fmt":node.li_attr.fmt, "alias":node.li_attr.alias,"tname":node.li_attr.tname,"unit":node.li_attr.unit,"rate":node.li_attr.rate,"calc":node.li_attr.calc});
					}else{
						tools.msginfo("度量已经存在。");
						return;
					}
					ts.setUpdate();
					ts.tableView();
				}
				//写维度
				if(node.li_attr.col_type == 1){
					//写col维度
					if($(this).attr("id") == "d_colDims"){
						if(tools.dimExist(node.li_attr.col_id, json.cols) || tools.dimExist(node.li_attr.col_id, json.rows)){
							tools.msginfo("维度已经存在。");
							return;
						}
						//如果维度有分组，分组必须相同
						var group = node.li_attr.grouptype;
						if(group != null && tools.findGroup(json.rows, group)){
							tools.msginfo("拖放失败，同一分组的维度必须在同一行/列标签。");
							return;
						}
						json.cols.push({"id":node.li_attr.col_id, "dimdesc" : node.text, "type":node.li_attr.dim_type, "colname":node.li_attr.col_name,"alias":node.li_attr.alias,"tname":node.li_attr.tname,"iscas":node.li_attr.iscas, "tableName":node.li_attr.tableName, "tableColKey":node.li_attr.tableColKey,"tableColName":node.li_attr.tableColName, "dimord":node.li_attr.dimord, "grouptype":node.li_attr.grouptype,"valType":node.li_attr.valType,ordcol:node.li_attr.ordcol,dateformat:node.li_attr.dateformat,"calc":node.li_attr.calc});
						ts.setUpdate();
						ts.tableView();
					}
					//写row维度
					if($(this).attr("id") == "d_rowDims"){
						if(tools.dimExist(node.li_attr.col_id, json.rows) || tools.dimExist(node.li_attr.col_id, json.cols)){
							tools.msginfo("维度已经存在。");
							return;
						}
						//如果维度有分组，分组必须相同
						var group = node.li_attr.grouptype;
						if(group != null && tools.findGroup(json.cols, group)){
							tools.msginfo("拖放失败，同一分组的维度必须在同一行/列标签。");
							return;
						}
						json.rows.push({"id":node.li_attr.col_id, "dimdesc" : node.text, "type":node.li_attr.dim_type, "colname":node.li_attr.col_name,"alias":node.li_attr.alias,"tname":node.li_attr.tname,"iscas":node.li_attr.iscas, "tableName":node.li_attr.tableName, "tableColKey":node.li_attr.tableColKey,"tableColName":node.li_attr.tableColName, "dimord":node.li_attr.dimord,"grouptype":node.li_attr.grouptype,"valType":node.li_attr.valType,ordcol:node.li_attr.ordcol,dateformat:node.li_attr.dateformat,"calc":node.li_attr.calc});
						ts.setUpdate();
						ts.tableView();
					}
				}
			}
		});
	 },
	 tableView(){
		 var json = tools.findCompById(this.tableId, this.pageInfo);
		 if(!json.kpiJson){
			return;
		 }
		 json = JSON.parse(JSON.stringify(json));
		 if(this.pageInfo.params){  //处理参数
			 json.params = this.pageInfo.params;
		 }
		 //删除dims
		 delete json.dims;
		let load = Loading.service({ fullscreen: true });
		 ajax({
			 url:"bireport/TableView.action",
			 data:JSON.stringify(json),
			 postJSON:true,
			 type:"POST",
			 success:(resp)=>{
				this.datas = resp.rows;
				this.$forceUpdate();
			 }
		 },this, load);
	 },
	 setUpdate(){
		 this.$parent.$parent.$parent.setIsUpdate();
	 },
	 setDimInfo(dim, pos){
		 $.contextMenu( 'destroy');
		 const comp = tools.findCompById(this.tableId, this.pageInfo);
		 let ts = this;
		 if($("ul.tableDimOpt").length == 0){
			$.contextMenu({
				selector: 'a.tableDimOpt', 
				className: "tableDimOpt",
				trigger: 'left',
				delay: 500,
				zIndex:300,
				autoHide:true,
				position: function(opt, x, y){
					var offset = $(this).offset();
					opt.$menu.css({left:offset.left, top:offset.top + 15});
				},
				callback: function(key, opt) {
					var o = $(this);
					if(key == 'asc' || key == 'desc'){
						tableUtils.dimsort(key, dim, pos, comp, ()=>{
							ts.tableView();
							ts.setUpdate();
						});
					}else if(key == 'hlhh'){
						tableUtils.changecolrow(comp, ()=>{
							ts.tableView();
							ts.setUpdate();
						});
					}else if(key == "left" || key == "right"){
						tableUtils.dimmove(key, dim, pos, comp, ()=>{
							ts.tableView();
							ts.setUpdate();
						});
					}else if(key == "moveTo"){
						tableUtils.dimexchange(dim, pos, comp, ()=>{
							ts.tableView();
							ts.setUpdate();
						});
					}else if(key == "filter"){
						ts.$parent.$parent.$parent.$refs['paramFilterForm'].createDimFilter(dim, comp, 'table');
					}else if(key == "aggre"){
						if(dim.issum === 'y'){
							dim.issum = 'n';
							delete dim.aggre;
							ts.tableView();
							ts.setUpdate();
							return;
						}
						ts.$refs['tableDailog'].dimAggre(dim, comp);
					}else if(key == "top"){
						ts.$refs['tableDailog'].dimTop(dim, comp);
					}else if(key == "remove"){
						tableUtils.delJsonKpiOrDim('dim', dim.id, pos, comp, ts.pageInfo,()=>{
							ts.tableView();
							ts.setUpdate();
						});
					}
				},
				items: {
					"asc": {name: "升序", icon: "fa-sort-amount-asc"},
					"desc": {name: "降序", icon: 'fa-sort-amount-desc'},
					"move":{name:"移动",items:{left:{name:"左移",icon:"fa-arrow-left"},right:{name:"右移", icon:"fa-arrow-right"},moveTo:{name:"移至行/列"}}},
					"hlhh": {name: "行列互换", icon:"fa-exchange"},
					"filter": {name: "筛选",icon:"fa-filter"},
					"aggre": {name: "聚合",icon:""},
					"top": {name: "取Top...",icon:""},
					"remove": {name: "删除",icon:"fa-remove"}
				}
			});
		}
	 },
	 delExtKpi(id, jstype){
		const comp = tools.findCompById(this.tableId, this.pageInfo);
		 //根据kpi_id查找kpiJson
		let kpi = comp.kpiJson.filter(k=>k.kpi_id == id)[0];
		tableUtils.delExtKpi(kpi, jstype, ()=>{
			this.tableView();
			this.setUpdate();
		});
	 },
	 setKpiInfo(col){
		$.contextMenu( 'destroy');
		const comp = tools.findCompById(this.tableId, this.pageInfo);
		 //根据col查找kpiJson
		let kpi = comp.kpiJson.filter(k=>k.alias === col)[0];
		let ts = this;
		$.contextMenu({
			selector: 'a.tableKpiBtn', 
			className: "tableKpiOpt",
			trigger: 'left',
			delay: 500,
			autoHide:true,
			zIndex:300,
			callback: function(key, opt) {
				//curTmpInfo.parentId = o.attr("parentId");
				//curTmpInfo.parentValue = o.attr("parentValue");
				if(key == "prop"){
					ts.$refs['tableDailog'].kpiProperty(kpi, comp);
				}else if(key == "chart"){
					//let linkpms = o.attr("toCharPms");
					ts.crtChartfromTab(kpi, comp);
				}else if(key == "filter"){
					ts.$refs['tableDailog'].kpiFilter(kpi, comp);
				}else if(key == 'warn'){
					ts.$refs['tableDailog'].kpiwarning(kpi, comp);
				}else if(key == 'asc' || key == 'desc' || key == 'def'){
					if(key == 'def'){
						key = "";
					}
					tableUtils.kpisort(key, kpi.kpi_id, comp, ()=>{
						ts.tableView();
						ts.setUpdate();
					});
				}else if(key == "remove"){
					tableUtils.delJsonKpiOrDim('kpi', kpi.kpi_id, null, comp, ts.pageInfo, ()=>{
						ts.tableView();
						ts.setUpdate();
					});
				}else if(key == "sq" || key == 'tq' || key == 'zje' || key == 'hb' || key == 'tb' 
					|| key =='sxpm' || key =='jxpm' || key =='zb' || key =='ydpj'){
					tableUtils.kpicompute(key, kpi, comp, ts.pageInfo,()=>{
						ts.tableView();
						ts.setUpdate();
					});
				}
			},
			items: {
				"compute": {name: "计算", items:{sq:{name:"上期"}, tq:{name:"同期"}, zje:{name:'增减额'}, hb:{name:'环比(%)'}, tb:{name:"同比(%)"},"sep1": "---------",
					sxpm:{name:"升序排名"}, jxpm:{name:"降序排名"}, zb:{name:"占比(%)"}}},
				"prop": {name: "属性..."},
				"chart": {name: "图表...",icon:"fa-line-chart"},
				"filter": {name: "筛选...",icon:"fa-filter"},
				"warn": {name: "预警...", icon:"fa-warning"},
				"sort":{name:"排序",items:{asc:{name:"升序",icon:"fa-sort-amount-asc"},desc:{name:"降序", icon:"fa-sort-amount-desc"},def:{name:"默认"}}},
				"remove": {name: "删除",icon:"fa-remove"}
			}
		});
	},
	dirllUp(dimId, pos){
		const comp = tools.findCompById(this.tableId, this.pageInfo);
		tableUtils.goupDim(comp, pos, dimId, this.pageInfo, ()=>{
			this.tableView();
			this.setUpdate();
		});
	},
	//下钻维度
	drillDim(oldDimId, pos, value){
		let ts = this;
		//查询度量已有维
		const comp = tools.findCompById(this.tableId, this.pageInfo);
		var oldDim = (pos=="row"?comp.rows:comp.cols).filter(d=>d.id == oldDimId)[0];
		const opts = (resp)=>{
			var items = {};
			var cnt = 0;
			var ignoreGroup = []; 
			const groupExist = (ignoreGroup, group)=>{
				let r = false;
				for(let k=0; k<ignoreGroup.length; k++){
					if(ignoreGroup[k] == group){
						r = true;
					}
				}
				return r;
			};
			const findGroupChild = function(grouptype){
				var dimret = [];
				for(let j=0; j<resp.length; j++){
					if(resp[j].grouptype == grouptype){
						dimret.push(resp[j]);
					}
				}
				return dimret;
			};
			for(let i=0; i<resp.length; i++){
				//忽略已存在的维
				if(tools.dimExist(resp[i].dim_id, comp.cols) || tools.dimExist(resp[i].dim_id, comp.rows)){
					continue;
				}
				
				if(resp[i].grouptype == '' || resp[i].grouptype == null){ //无分组的，直接显示维度
						var id  = resp[i].dim_id;
						//str = str +  "<div onclick=\"drill("+id+", "+comp.id+", '"+pos+"', '"+val+"', '"+vdesc+"', '"+oldDimId+"', true)\"><span style=\"color:#ccc\">下钻</span>" + resp[i].dimdesc+"</div>"
						items["dim_"+id] = {name:'<span style="color:#ccc">下钻</span>'+resp[i].dim_desc,isHtmlName: true,callback:function(itemKey, opt, e){
							var dimid = itemKey.split("_")[1];
							tableUtils.drill(oldDimId, dimid, comp, pos, value, "", ()=>{
								ts.tableView();
								ts.setUpdate();
							});
						}};
						cnt = cnt + 1;	
					}else{ //有分组，显示分组, 对于分组，如果下级分组已选择，不能再选择上级分组
						if(!groupExist(ignoreGroup, resp[i].grouptype)){
							var o = items["g"+resp[i].grouptype] = {name:"<span style=\"color:#ccc\">下钻</span>"+resp[i].groupname,isHtmlName: true, items:{}};
							ignoreGroup.push(resp[i].grouptype);
							//查询分组的内容
							var lsdim = findGroupChild(resp[i].grouptype);
							var ss = "";
							var ccnt = 0;
							for(let kl = 0; kl<lsdim.length; kl++){
								var tmp = lsdim[kl];
								var bcz = !tools.dimExist(tmp.dim_id, comp.cols) && !tools.dimExist(tmp.dim_id, comp.rows);
								if(bcz){
									o.items['dim_'+tmp.dim_id] = {name:'<span style="color:#ccc">下钻</span>' + tmp.dim_desc, isHtmlName: true, callback:function(itemKey, opt, e){
										var dimid = itemKey.split("_")[1];
										tableUtils.drill(oldDimId, dimid, comp, pos, value, "", ()=>{
											ts.tableView();
											ts.setUpdate();
										});
									}};
									ccnt = ccnt + 1;	
								}else{
									ss = "";
									ccnt = 0;
								}
							}
							if(ccnt == 0){
								//groups = "";
							}
							cnt = cnt + ccnt;
						}
					}
			}
			if(cnt == 0){
				tools.msginfo("数据已钻透。", "error");
				return;
			}
			$.contextMenu( 'destroy');
			//drillmenu
			$.contextMenu({
				selector: 'a.dimDrill',
				className: "tableDrillMenu",
				trigger: 'left',
				delay: 500,
				zIndex:300,
				autoHide:true,
				items:items
			});
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
			});
		}
	},
	//上卷维度
	goupDim(compId, ts, pos, dimId, islink){
		var dims = null;
		var comp = findCompById(compId);
		if(pos == 'row'){
			dims = comp.rows;
		}else{
			dims = comp.cols;
		}
		
		//清除过滤条件
		//删除该维度以后的维度
		var idx = 0;
		for(i=0; i<dims.length;i++){
			if(dims[i].id == dimId){
				dims[i].vals = "";
				if(dims[i].type == 'day'){
					delete dims[i].startdt;
					delete dims[i].enddt;
				}
				if(dims[i].type == 'month'){
					delete dims[i].startmt;
					delete dims[i].endmt;
				}
				idx = i;
				break;
			}
		}
		dims.splice(idx + 1, dims.length - 1);
		
		//如果删除维度后无时间维度，并且度量中含有计算度量，需要清除计算度量内容
		if(!isExistDateDim(comp, 'table')){
			for(var j=0; comp.kpiJson&&j<comp.kpiJson.length; j++){
				delete comp.kpiJson[j].compute;
			}
		}
		//如果有参数,并且参数是时间维度，如果参数时间类型表格中没有，移除计算度量
		if(!paramsamedimdate(comp)){
			for(var j=0; comp.kpiJson&&j<comp.kpiJson.length; j++){
				delete comp.kpiJson[j].compute;
			}
		}
		
		curTmpInfo.isupdate = true;
		tableView(comp, comp.id);
	},
	crtChartfromTab(kpi, comp){
		var o = this.$refs['table2chartForm'];
		o.showDailog(kpi, comp);
	}
  },
  watch: {},
};
</script>

<style lang="css">
table.d_table {
  border-collapse: collapse;
  border-spacing: 0px;
  color:rgba(0,0,0,.7);
}
table.d_table th {
  background-color: #eeeeee;
  border: 1px solid #cacaca;
  font-size: 12px;
  padding: 0;
}
table.d_table td.blank {
  border: none;
}
TABLE.d_table td {
  /**border: 1px solid #dee5e7; */
  padding: 0px;
  font-size: 12px;
}
#d_colDims {
  background-color: #f6f8f8;
  overflow: hidden;
}
#d_rowDims {
  background-color: #f6f8f8;
  overflow-y: hidden;
  overflow-x: hidden;
}
.tabhelpr {
  color: #999999;
  font-size: 14px;
  padding: 15px;
}
.colDimsList span{
	display:-moz-inline-box;  
	display:inline-block;
	width:110px;
	border:1px solid #CACACA;
	padding:5px;
	margin:3px 0px 3px 3px;
	background-color:#FFFFCC;
	text-align:center;
}
.rowDimsList span{
	display:-moz-inline-box;  
	display:inline-block;
	width:126px;
	border-right:none;
	background-color:#FFFFCC;
	text-align:center;
	padding:4px 2px 5px 2px;
}
span a.set {
	display:-moz-inline-box;  
	display:inline-block;
	width:16px;
	height:16px;
	text-decoration:none;
}
#d_kpi span.kpiValue{ 
	display:block;
	width:110px;
	padding-right: 3px;
}
/** olap 视图样式*/
TABLE.grid5 {
    border-collapse:collapse;
    border-spacing: 0px;
}
TABLE.grid5 THEAD {color: black;text-align: center}
TABLE.grid5 TH {
    border: 1px solid #dee5e7;
    font-size: 13px;
    height:26px;
    background-color: #f6f8f8;
    text-align: left;
	font-weight:normal;
}
TABLE.grid5 TD.grid5-td {
    border: 1px solid #dee5e7;
    font-size: 12px;
    height:26px;
	overflow:hidden;
}
TABLE.grid5 TD.kpiData1 {
	background-color:#FFF;
}
TABLE.grid5 TD.kpiData2 {
	background-color:#f6f8f8;
}
TABLE.grid5 td.pms, TABLE.grid3 td.pms {
    color: #ff0000;
    font-weight: bold;
    text-align: center;
}
span.coldim {
	display:inline-block;
	overflow:hidden;
}
span.colkpi{
	display:inline-block;
	width:110px;
	overflow:hidden;
	padding:5px 0px 0px 3px;
}
span.s_rowDim{  
	display:block;
	width:120px;
	white-space: nowrap;
	overflow:hidden;
	margin:0px 3px 0px 3px;
	line-height:17px;
}
span.kpiname {
	display: inline-block;
    white-space: nowrap;
    width: 89px;
}
.dimDrill{
	display: inline-block;
    text-decoration: none;
    width: 16px;
	height:14px;
	cursor:pointer;
}
.dimgoup{
	display: inline-block;
    text-decoration: none;
    width: 16px;
	height:14px;
	cursor:pointer;	
}
.warning1 {
	display: inline-block;
    width: 16px;
	height:16px;
	background-image:url(../../assets/image/j1.png);
	background-repeat: no-repeat;
	background-position: center center;
}
.warning2 {
	display: inline-block;
    width: 16px;
	height:16px;
	background-image:url(../../assets/image/j2.png);
	background-repeat: no-repeat;
	background-position: center center;
}
.warning3 {
	display: inline-block;
    width: 16px;
	height:16px;
	background-image:url(../../assets/image/j3.png);
	background-repeat: no-repeat;
	background-position: center center;
}
.warning4 {
	display: inline-block;
    width: 16px;
	height:16px;
	background-image:url(../../assets/image/w1.png);
	background-repeat: no-repeat;
	background-position: center center;
}
.warning5 {
	display: inline-block;
    width: 16px;
	height:16px;
	background-image:url(../../assets/image/w2.png);
	background-repeat: no-repeat;
	background-position: center center;
}
.warning6 {
	display: inline-block;
    width: 16px;
	height:16px;
	background-image:url(../../assets/image/w3.png);
	background-repeat: no-repeat;
	background-position: center center;
}
</style>
