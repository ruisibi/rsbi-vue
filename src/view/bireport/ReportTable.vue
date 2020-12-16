<!-- 表格渲染类 -->
<script>
import { ajax } from "@/common/biConfig";
import $ from "jquery";
import * as tools from '@/view/bireport/bireportUtils'
import { Loading } from "element-ui";

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
  render(h){
	  //一个 table, 2个tr, 一个 tr 里 2个td
	  let trtd1 = h('td', {class:"blank", attrs:{valign:"bottom"}}, this.renderCrossList(h));
	  let trtd2 = h('td', [h("div", {attrs:{id:"d_colDims"}}, this.renderColDimsList(h))]);
	  let tr2td1 = h('td', [h('div', {attrs:{id:"d_rowDims"}}, this.renderRowDimsList(h))]);
	  let tr2td2 = h('td', this.renderKpisList(h));
	  let tr = [h('tr', [trtd1, trtd2])];
	  let tr2 = [h('tr', [tr2td1, tr2td2])];
	  let table = h('table', {class:"d_table"}, [h('tbody', [tr, tr2])]);
	  return h('div', {attrs:{tp:"table", class:"comp_table", id:"T"+this.tableId}}, [table]);
  },
  mounted() {
	  this.bindDropEvent(this.tableId);
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
						ths.push(h('th', {attrs:{colspan:d.colSpan, rowspan:d.rowSpan}},[h('span', {class:"s_rowDim"}, d.value)]));
					});
					trs.push(h('tr', ths));
				});
				ret.push(h('table',[h('tbody', trs)]));
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
				  {attrs:{class:"fa fa-gear set tableDimOpt",href:"javascript:;"},on:{click:()=>{ts.setDimInfo(b.id)}}}, " ")])]));
			  });
			  return [(h("table", {class:"grid5"}, [h("tbody", [h('tr', tds)])]))];
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
					 {attrs:{class:"fa fa-gear set tableDimOpt", href:"javascript:;"},on:{click:()=>ts.setDimInfo(b.id)}}, ' ')]));
				 });
				 ret.push(h('div', {attrs:{class:"colDimsList"}}, nodes));

			}else{
				ret.push(h('div', {class:"tabhelpr"},'将维度拖到此处作为列标签'));
			}
			if(this.datas){
				let trs = [];
				$(this.datas.header).each((a, b)=>{
					let ths = [];
					$(b).each((c, d)=>{
						if(d.isCross){
							return true;
						}
						ths.push(h('th', {attrs:{colspan:d.colSpan, rowspan:d.rowSpan}},[h('span', {class:"colkpi"},[
							h('span', {attrs:{class:"kpiname", title:d.desc}},d.desc), 
							h('a',{attrs:{class:"tableKpiBtn dimoptbtn set",href:"javascript:;",on:{click:()=>{}}}},' ')
						])]));
					});
					trs.push(h('tr', ths));
				});
				ret.push(h('table',[h('tbody', trs)]));
			}
			return ret;
	   },
	   /**
		* 渲染指标区域数据
	    */
	   renderKpisList(h){
		   let ret = [];
		   //const comp = tools.findCompById(this.tableId, this.pageInfo);
		   if(this.datas){
				let trs = [];
				$(this.datas.datas).each((a, b)=>{
					let ths = [];
					$(b).each((c, d)=>{
						if(d.isRow === true){
							return true;
						}
						console.log(d);
						ths.push(h('td', {attrs:{class:"kpiData1 grid5-td", align:"right"}},[h('span', {class:"kpiValue"}, d.value)]));
					});
					trs.push(h('tr', ths));
				});
				ret.push(h('table',[h('tbody', trs)]));
		   }else{
		 	  ret.push(h('div', {class:"tabhelpr"}, '将度量拖到此处查询数据'));
		   }
		   return [h("div", {attrs:{id:"d_kpi"}}, ret)];
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
					ts.$parent.$parent.$parent.setIsUpdate();
					ts.tableView(json);
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
						ts.$parent.$parent.$parent.setIsUpdate();
						ts.tableView(json);
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
						ts.$parent.$parent.$parent.setIsUpdate();
						ts.tableView(json);
					}
				}
			}
		});
	 },
	 tableView(json){
		let load = Loading.service({ fullscreen: true });
		 ajax({
			 url:"bireport/TableView.action",
			 data:JSON.stringify(json),
			 postJSON:true,
			 type:"POST",
			 success:(resp)=>{
				 this.datas = JSON.parse(resp.rows);
				 this.$forceUpdate();
			 }
		 },this, load);
	 },
	 setDimInfo(dimId){
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
					var compId =  o.parents(".comp_table").attr("id");
					curTmpInfo.ckid = o.attr("cid");
					curTmpInfo.compId = compId
					curTmpInfo.pos = o.attr("cpos");
					curTmpInfo.dimname = o.attr("cname");
					if(key == 'asc' || key == 'desc'){
						dimsort(key);
					}else if(key == 'hlhh'){
						changecolrow(true);
					}else if(key == "left" || key == "right"){
						dimmove(key);
					}else if(key == "moveTo"){
						dimexchange();
					}else if(key == "filter"){
						filterDims();
					}else if(key == "aggre"){
						aggreDim();
					}else if(key == "top"){
						getDimTop('table');
					}else if(key == "remove"){
						delJsonKpiOrDim('dim');
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
	 }
  },
  watch: {},
};
</script>

<style lang="css">
table.d_table {
  border-collapse: collapse;
  border-spacing: 0px;
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
  border: 1px solid #dee5e7;
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
	width:18px;
	height:16px;
	text-decoration:none;
}
</style>
