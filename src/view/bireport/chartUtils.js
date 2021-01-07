/**
 * 图形的工具类
 */
import $ from 'jquery'
import * as tools from '@/view/bireport/bireportUtils'

export function findDimById(dimId, dims){
	var ret = null;
	if(!dims || dims == null){
		return ret;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimId){
			ret = dims[i];
			break;
		}
	}
	return ret;
}

export function delChartKpiOrDim(tp, json, cb){
	if(tp == 'xcol'){
		delete json.chartJson.xcol;
	}
	if(tp == 'ycol'){
		json.chartJson.ycol = {};
		if(json.kpiJson.length > 1){
			json.kpiJson[0] = null;
		}else{
			json.kpiJson = [];
		}
	}
	if(tp == 'y2col'){
		if(json.kpiJson.length > 1){
			json.kpiJson[1] = null;
		}else{
			json.kpiJson = [];
		}
	}
	if(tp == 'y3col'){
		json.kpiJson[2] = null;
	}
	if(tp == 'scol'){
		delete json.chartJson.scol;
	}
	if(cb){
		cb();
	}
}
export function chartsort(sorttp, tp, json, cb){
	if(tp == 'xcol'){
		//清除度量排序,因为度量排序最优先
		delete json.kpiJson[0].sort;
		json.chartJson.xcol.dimord = sorttp;
	}
	if(tp == 'ycol'){
		json.kpiJson[0].sort = sorttp;
	}
	if(tp == 'scol'){
		//清除度量排序
		delete json.kpiJson[0].sort;
		json.chartJson.scol.dimord = sorttp;
	}
	if(cb){
		cb();
	}
}
//开始钻取图形
export const drillingChart = (dimId, comp, pos, xvalue, oldDimId, cb)=>{
	//设置当前维度值为过滤条件
	if(pos == "row"){
		comp.chartJson.xcol.vals = [xvalue + ""];
		//comp.chartJson.xcol.valDesc = xvalueDesc;
		comp.chartJson.xcol.pos = "row";
	}else{
		comp.chartJson.scol.vals = [xvalue + ""];
		//comp.chartJson.scol.valDesc = xvalueDesc;
		comp.chartJson.scol.pos = "col";
	}
	
	
	var dim = pos == "row" ? comp.chartJson.xcol : comp.chartJson.scol;
	dim.filtertype = 2; // 按值钻取
	if(dim.type == 'month'){
		delete dim.startmt;
		delete dim.endmt;
	}
	if(dim.type == 'day'){
		delete dim.startdt;
		delete dim.enddt;
	}
	//把当前维放入params
	//如果当前维度是合计，不用加入
	if(xvalue == '合计' && xvalueDesc == '合计'){
	}else{
		comp.chartJson.params.push(pos=="row"?comp.chartJson.xcol:comp.chartJson.scol);
	}
	//更新x轴
	var json = null;
	for(let j=0;j<comp.dims.length; j++){
		if(comp.dims[j].dim_id == dimId){
			json = comp.dims[j];
			break;
		}
	}
	var nxcol = {"id":json.dim_id, "dimdesc" : json.dim_desc, "type":json.dim_type, "colname":json.col_name,"alias":json.alias,"cubeId":json.cubeId,tname:json.tname,"iscas":'', "tableName":(json.dim_tname == null ? "" : json.dim_tname), "tableColKey":(json.tableColKey == null ? "" : json.tableColKey),"tableColName":(json.tableColName == null ? "" : json.tableColName), "dimord":json.dim_ord, "dim_name":json.dim_name, "iscas":(json.iscas == null ? "" : json.iscas),"grouptype":json.grouptype,"valType":json.valType, "ordcol":(json.ordcol==null?"":json.ordcol), "dateformat":(json.dateformat==null?"":json.dateformat),calc:json.calc};
	if(pos == "row"){
		comp.chartJson.xcol = nxcol;
	}else{
		comp.chartJson.scol = nxcol;
	}
	if(cb){
		cb();
	}
}
//图形上卷
export const chartGoupDim = (comp,dimId, pos, cb) => {
	var dims = comp.chartJson.params;
	//清除过滤条件
	//删除该维度以后的维度
	var idx = 0;
	var xcol = null;
	for(let i=0; i<dims.length;i++){
		if(dims[i].id == dimId){
			delete dims[i].vals;
			//dims[i].valDesc = "";
			delete dims[i].filtertype;
			idx = i;
			xcol = dims[i];
			break;
		}
	}
	if(pos == "row"){
		comp.chartJson.xcol = xcol;
	}else{
		comp.chartJson.scol = xcol;
	}
	dims.splice(idx, dims.length);
	
	if(cb){
		cb();
	}
}