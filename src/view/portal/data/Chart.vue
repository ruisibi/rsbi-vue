<!-- 图形数据设置 -->
<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'
import * as chartUtils from '@/view/bireport/chartUtils'
import * as tools from '@/view/bireport/bireportUtils'

export default {
  components:{
    
  },
  props:{
      comp:{
        type:Object,
        required:true
      }
  },
  data(){
    return {
      
    }
  },
  render(h){
      let leftCols = []; 
	  let comp = this.comp;
			let tp = comp.chartJson.type;
			let isscatter = tp === 'scatter' || tp === 'bubble';
			let isbubble = tp === 'bubble';

			if(isscatter){
				let xcol = null;
				if(comp.kpiJson && comp.kpiJson.length >0 && comp.kpiJson[0]){
					let o = comp.kpiJson[0];
					xcol = [h('span', {class:"charttxt",attrs:{title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'ycol')}})]
				}else{
					xcol = [h('span', {class:"charttip"}, this.$t('message.report.chartData.tip1'))]
				}
				//横轴　
				let xcolobj = h('div', {class:"ts_h"}, [h('div', {class:"h_tit"}, this.$t('message.report.chartData.xcol')), h('div', {attrs:{class:"h_ctx", id:"ycol"}}, xcol)]);
				leftCols.push(xcolobj);

				let ycol = null;
				if(comp.kpiJson && comp.kpiJson.length >0 && comp.kpiJson[1]){
					let o = comp.kpiJson[1];
					ycol = [h('span', {class:"charttxt",attrs:{ title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'y2col')}})]
				}else{
					ycol = [h('span', {class:"charttip"}, this.$t('message.report.chartData.tip1'))]
				}
				let ycolobj = h('div', {class:"ts_h"}, [h('div', {class:"h_tit"},this.$t('message.report.chartData.ycol')), h('div', {attrs:{class:"h_ctx", id:"y2col"}}, ycol)]);
				leftCols.push(ycolobj);

				//气泡大小
				if(isbubble){
					let qp = null;
					if(comp.kpiJson && comp.kpiJson.length >0 && comp.kpiJson[2]){
						let o = comp.kpiJson[2];
						qp = [h('span', {class:"charttxt", attrs:{ title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'ycol')}})]
					}else{
						qp = [h('span', {class:"charttip"}, this.$t('message.report.chartData.tip1'))]
					}
					let qpobj = h('div', {class:"ts_h"}, [h('div', {class:"h_tit"}, this.$t('message.report.chartData.size')), h('div', {attrs:{class:"h_ctx", id:"y3col"}}, qp)]);
					leftCols.push(qpobj);
				}
			}

			let xcol = null;
			if(!$.isEmptyObject(comp.chartJson.xcol)){
				let o = comp.chartJson.xcol;
				xcol = [h('span', {class:"charttxt",attrs:{title:o.dimdesc}}, o.dimdesc), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'xcol')}})]
			}else{
				xcol = [h('span', {class:"charttip"}, this.$t('message.report.chartData.tip2'))]
			}
			//横轴　
			let xcolobj = h('div', {class:"ts_h"}, [h('div', {class:"h_tit"},isscatter?this.$t('message.report.chartData.dim'):this.$t('message.report.chartData.xcol')), h('div', {attrs:{class:"h_ctx", id:"xcol"}}, xcol)]);
			leftCols.push(xcolobj);

			if(!isscatter){
				let ycol = null;
				if(comp.kpiJson && comp.kpiJson.length > 0 && comp.kpiJson[0] != null){
					let o = comp.kpiJson[0];
					ycol = [h('span', {class:"charttxt", attrs:{ title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'ycol')}})]
				}else{
					ycol = [h('span', {class:"charttip"}, this.$t('message.report.chartData.tip1'))];
				}
				//纵轴
				let ycolobj = h('div', {class:"ts_h"}, [h('div',{class:"h_tit"}, this.$t('message.report.chartData.ycol')), h('div', {attrs:{class:"h_ctx", id:"ycol"}}, ycol)]);
				leftCols.push(ycolobj);
			}

			if(tp !== 'map'){  //地图没有图例　
				let scol = null;
				if(!$.isEmptyObject(comp.chartJson.scol)){
					let o = comp.chartJson.scol;
					scol = [h('span', {class:"charttxt", attrs:{ title:o.dimdesc}}, o.dimdesc), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'scol')}})]
				}else{
					scol = [h('span', {class:"charttip"}, this.$t('message.report.chartData.tip2'))]
				}
				//图例 Ser
				let scolobj = h('div', {class:"ts_h"}, [h('div', {class:"h_tit"},this.$t('message.report.chartData.ser')), h('div', {attrs:{class:"h_ctx", id:"scol"}},scol)]);
				leftCols.push(scolobj);
			}
			let typeIndex = comp.chartJson.typeIndex;
			//第二纵轴
			if((tp==='column' || tp === 'line') && (typeIndex == 2 || typeIndex == 4) ){
				let y2col = null;
				if(comp.kpiJson && comp.kpiJson.length > 1 && comp.kpiJson[1] != null){
					let o = comp.kpiJson[1];
					y2col = [h('span', {class:"charttxt", attrs:{ title:o.kpi_name}}, o.kpi_name), h('a', {attrs:{class:"charticon"},domProps:{innerHTML:`<i class="fa fa-gear"></i>`},on:{click:()=>this.chartmenu(o, 'y2col')}})]
				}else{
					y2col = [h('span', {class:"charttip"}, this.$t('message.report.chartData.tip1'))]
				}
				let y2obj = h('div', {class:"ts_h"}, [h('div',{class:"h_tit"}, this.$t('message.report.chartData.ycol2')), h('div', {attrs:{class:"h_ctx", id:"y2col"}},y2col)]);
				leftCols.push(y2obj);
			}
			//更新拖拽事件
			this.$nextTick(()=>{
				this.initChartKpiDrop();
			});
			return h('div', {class:"tsbd", attrs:{id:"chartData"}}, leftCols);
		},
  mounted(){

  },
  computed: {
     
  },
  methods: {
    setUpdate(){
      this.$parent.$parent.isupdate = true;
      this.$forceUpdate();
    },
    chartView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].chartView();
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
				var comp = ts.comp;
				if(key == 'asc' || key == 'desc'){
					chartUtils.chartsort(key, pos, comp, ()=>{
						ts.setUpdate();
						ts.chartView();
					});
				}else if(key == "remove"){
					chartUtils.delChartKpiOrDim(pos, comp, ()=>{
						ts.setUpdate();
						ts.chartView();
					});
				}
			},
			items: {
				"asc": {name: this.$t('message.report.chartData.asc'), icon: "fa-sort-amount-asc"},
				"desc": {name: this.$t('message.report.chartData.desc'), icon: 'fa-sort-amount-desc'},
				"remove": {name: this.$t('message.report.chartData.remove'),icon:"fa-remove"}
			}
		});
	},
    initChartKpiDrop(){
        const ts = this;
		let comp = this.comp;
				$("#chartData #xcol, #chartData #ycol, #chartData #y2col, #chartData #y3col, #chartData #ycols, #chartData #scol").droppable({
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
						$(this).css("border-color", "#dcdfe6");
					},
					drop:function(e, ui){
						var id = ts.chartId;
						var json = comp;
						//清除边框样式
						$("#chartData #"+$(this).attr("id")).css("border-color", "#dcdfe6");
						//获取TREE
						var ref = $("#datasettree").jstree(true);
						var node = ref.get_node(ui.draggable[0]);

						//判断拖入的维度及度量是否和以前维度及度量在同一个表。
						if(json.cubeId != undefined){
							if(json.cubeId != node.li_attr.cubeId){
								utils.msginfo(ts.$t('message.report.chartData.err5')+ (node.li_attr.col_type == 2 ? ts.$t('message.model.cube.kpi') : ts.$t('message.model.cube.dim')) + ts.$t('message.report.chartData.err6'));
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
								utils.msginfo(ts.$t('message.report.chartData.err1'))
								return;
							}
						}
						let dropId = $(this).attr("id");
						if(node.li_attr.col_type == 2 && (dropId == "ycol" || dropId == 'y2col' || dropId == 'y3col')){
							let o = {"kpi_id":node.li_attr.col_id, "kpi_name" : node.text, "ydispName":node.text, "col_name":node.li_attr.col_name, "aggre":node.li_attr.aggre, "fmt":node.li_attr.fmt, "alias":node.li_attr.alias,"tname":node.li_attr.tname,"unit":node.li_attr.unit,"rate":node.li_attr.rate,"calc":node.li_attr.calc};
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
								utils.msginfo(ts.$t('message.report.chartData.err2'))
								return;
							}
							
							//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
							var gt = node.li_attr.grouptype;
							if(gt != null && gt != ''){
								if(json.chartJson.scol != undefined && json.chartJson.scol.grouptype == gt){
									utils.msginfo(ts.$t('message.report.chartData.err3'))
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
								utils.msginfo(ts.$t('message.report.chartData.err4'))
								return;
							}
							
							//判断xcol 和 scol 是否属于一个分组，如果是，不让拖动
							var gt = node.li_attr.grouptype;
							if(gt != null && gt != ''){
								if(json.chartJson.xcol != undefined && json.chartJson.xcol.grouptype == gt){
									utils.msginfo(ts.$t('message.report.chartData.err3'))
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
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  .tsbd {
     .ts_h{
       font-size:13px;
      margin:5px 10px 5px 5px;
      width:205px;
	  float:left;
	  padding-top: 20px;
	}
	.h_tit {
		float: left;
		border:1px solid #dcdfe6;
		height:32px;
		color: #909399;
		font-size: 14px;
		padding:5px 0px 3px 5px;
		border-radius:5px;
		background-color: #f5f7fa;
		 width:80px;
		 border-right: 0;
		 border-top-right-radius: 0;
		 border-bottom-right-radius: 0;
	}
    .h_ctx{
      border:1px solid #dcdfe6;
      height:32px;
      overflow:hidden;
      border-radius:5px;
	  padding:2px;
	  font-size: 14px;
	  border-top-left-radius: 0;
		border-bottom-left-radius: 0;
    }
  }
  span.charttip {
    color:#999999;
    padding:3px;
	display:block;
  }
  span.charttxt {
    display:inline-block;
    width:99px;
    white-space:nowrap;
    overflow:hidden;
	margin-left:3px;
	margin-top:3px;
  }
 a.charticon {
    display:inline-block;
    width:16px;
    height:16px;
    cursor:pointer;
	font-size: 14px;
	position: absolute;
	margin-top:3px;
	color: #909399;
  }
  a.charticon :hover {
	  color: black;
  }

</style>
