/**
 * 表格的工具类
 */
import $ from 'jquery'
import * as tools from '@/view/bireport/bireportUtils'

export const dimsort = (tp, dim, pos, comp, cb)=>{
	dim.dimord = tp;
	//进行维度排序时，清除度量的排序信息
	for(let i=0; i<comp.kpiJson.length; i++){
		comp.kpiJson[i].sort = '';
	}
	if(cb){
		cb();
	}
}
export function changecolrow(comp, cb){
	var tmp = comp.rows;
	comp.rows = comp.cols;
	comp.cols = tmp;
	if(cb){
		cb();
	}
}

export function dimmove(tp, dim, pos, comp, cb){
	var dims = null;
	if(pos == 'col'){
		dims = comp.cols;
	}else{
		dims = comp.rows;
	}
	if(dims.length <= 1){
		tools.msginfo('无效移动。', "error");
		return;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dim.id){
			if(tp == 'left'){
				if(i <= 0){
					tools.msginfo('无效移动。', "error");
					return;
				}else{
					var tp = dims[i - 1];
					dims[i - 1] = dims[i];
					dims[i] = tp;
					if(cb){
						cb();
					}
					return;
				}
			}else
			if(tp == 'right'){
				if( i >= dims.length - 1){
					tools.msginfo('无效移动。', "error");
					return;
				}else{
					var tp = dims[i + 1];
					dims[i + 1] = dims[i];
					dims[i] = tp;
					if(cb){
						cb();
					}
					return;
				}
			}
			break;
		}
	}
}
//维度交换行列
export function dimexchange(dim, pos, comp, cb){	
	if(pos == 'col'){
		//先移除维度
		var idx = 0;
		var tmp = null;
		var dims = comp.cols;
		for(var i=0; i<dims.length; i++){
			if(dims[i].id == dim.id){
				idx = i;
				tmp = dims[i];
				break;
			}
		}
		//如果维度有分组，分组必须相同
		var group = tmp.grouptype;
		if(group != null && tools.findGroup(comp.cols, group, tmp)){
			tools.msginfo("移动失败，同一分组的维度必须在同一行/列标签。", "error");
			return;
		}
		comp.cols.splice(idx, 1);
		//再添加维度
		comp.rows.push(tmp);
	}else
	if(pos == 'row'){
		//先移除维度
		var idx = 0;
		var tmp = null;
		var dims = comp.rows;
		for(var i=0; i<dims.length; i++){
			if(dims[i].id == dim.id){
				idx = i;
				tmp = dims[i];
				break;
			}
		}
		//如果维度有分组，分组必须相同
		var group = tmp.grouptype;
		if(group != null && tools.findGroup(comp.rows, group, tmp)){
			tools.msginfo("移动失败，同一分组的维度必须在同一行/列标签。", "error");
			return;
		}
		comp.rows.splice(idx, 1);
		//再添加维度
		comp.cols.push(tmp);
	}
	if(cb){
		cb();
	}
}
//从表格JSON中删除KPI
export function delJsonKpiOrDim(tp, id, pos, comp, pageInfo, cb){
	if(tp == 'kpi'){
		var kpis = comp.kpiJson;
		var idx = -1;
		for(var i=0; i<kpis.length; i++){
			if(kpis[i].kpi_id == id){
				idx = i;
				break;
			}
		}
		kpis.splice(idx, 1);
	}
	if(tp == 'dim'){
		var dims = null;
		if(pos == 'col'){
			dims = comp.cols;
		}else{
			dims = comp.rows;
		}
		var idx = -1;
		for(var i=0; i<dims.length; i++){
			if(dims[i].id == id){
				idx = i
				break;
			}
		}
		dims.splice(idx, 1);
		//如果删除维度后无时间维度，并且度量中含有计算度量，需要清除计算度量内容
		if(!isExistDateDim(comp, 'table')){
			for(var j=0; comp.kpiJson&&j<comp.kpiJson.length; j++){
				delete comp.kpiJson[j].compute;
			}
		}
		//如果有参数,并且参数是时间维度，如果参数时间类型表格中没有，移除计算度量
		if(!paramsamedimdate(comp, pageInfo)){
			for(var j=0; comp.kpiJson&&j<comp.kpiJson.length; j++){
				delete comp.kpiJson[j].compute;
			}
		}
	}
	if(cb){
		cb();
	}
}
/**
判断是否存在date类型的维度，比如day/month/quarter/year
**/
function isExistDateDim(comp, tp){
	var ret = false;
	if(tp == 'table'){
		if(!comp.cols){
			return ret;
		}
		for(var i=0; i<comp.cols.length; i++){
			var tp = comp.cols[i].type;
			if(tp == 'year' || tp == 'quarter' || tp == 'month' || tp == 'day'){
				ret = true;
				break;
			}
		}
		if(!comp.rows){
			return ret;
		}
		for(var i=0; i<comp.rows.length; i++){
			var tp = comp.rows[i].type;
			if(tp == 'year' || tp == 'quarter' || tp == 'month' || tp == 'day'){
				ret = true;
				break;
			}
		}
	}
	if(tp == 'chart'){
		if(!comp.chartJson || !comp.chartJson.params){
			return ret;
		}
		for(var i=0; i<comp.chartJson.params.length; i++){
			var tp = comp.chartJson.params[i].type;
			if(tp == 'year' || tp == 'quarter' || tp == 'month' || tp == 'day'){
				ret = true;
				break;
			}
		}
		if(!comp.chartJson || !comp.chartJson.xcol){
			return ret;
		}
		var xtype = comp.chartJson.xcol.type;
		if(xtype == 'year' || xtype == 'quarter' || xtype == 'month' || xtype == 'day'){
			ret = true;
		}
	}
	return ret;
}
/**
判断是否有时间参数，如果有，必须表格组件中也具有相同的参数
**/
function paramsamedimdate(comp, pageInfo){
	var same = true;
	var exist = function(input){
		var ret = false;
		for(var i=0; comp.cols&&i<comp.cols.length; i++){
			if(comp.cols[i].type == input){
				ret = true;
				break;
			}
		}
		for(var i=0; comp.rows&&i<comp.rows.length; i++){
			if(comp.rows[i].type == input){
				ret = true;
				break;
			}
		}
		return ret;
	}
	var params = pageInfo.params;
	for(let i=0; params&&i<params.length; i++){
		if(params[i].type == "year" || params[i].type == "quarter" || params[i].type == "month" || params[i].type == "day"){
			if(!exist(params[i].type)){
				same = false;
				break;
			}
		}
	}
	return same;
}
export function kpisort(tp, kpiId, comp, cb){
	for(let i=0; i<comp.kpiJson.length; i++){
		if(comp.kpiJson[i].kpi_id == kpiId){
			comp.kpiJson[i].sort = tp;
		}else{
			comp.kpiJson[i].sort = '';
		}
	}
	if(cb){
		cb();
	}
}
export function kpicompute(tp, kpi, comp, pageInfo, cb){
	//设置计算类型， 1表示不能同时存在，2表示可以同时存在。
	var tpobj = {"zb":1,"sxpm":1, "jxpm": 1, "ydpj":1, "sq":2, "tq":2, "zje":2, "hb":2, "tb":2}
	if(tp == "zb"){
		kpi.compute = "zb";
	}else if(tp == "sxpm"){
		kpi.compute = "sxpm";
	}else if(tp == "jxpm"){
		kpi.compute = "jxpm";
	}else{
		if(!isExistDateDim(comp, 'table')){
			tools.msginfo("当前度量计算需要表格中先有时间类型的维度(年/季度/月/日)。", "error");
			return;
		}		
		//如果有参数,并且参数是时间维度，需要判断表格中是否有同样的参数维度，如果没有提示用户添加
		if(!paramsamedimdate(comp, pageInfo)){
			tools.msginfo("度量计算时，需要表格中具有和参数相同的维度。", "error");
			return;
		}
		//先判断已经存在的，如果是时间偏移计算就追加，或者替换.
		var exist = kpi.compute;
		if(!exist || exist == ""){
			kpi.compute = tp;
		}else{
			var js = exist.split(",");
			if(tpobj[js[0]] == 1){
				kpi.compute = tp;
			}else{
				var cz = false;   //不存在才添加
				for(let j=0; j<js.length; j++){
					if(js[j] == tp){
						cz = true;
						break;
					}
				}
				if(!cz){
					kpi.compute = exist+","+tp;
				}
			}
		}
	}
	if(cb){
		cb();
	}
}
export function delExtKpi(kpi, compute, cb){
	//设置度量排序的标识
	var js = kpi.compute.split(",");
	if(js.length == 1){
		delete kpi.compute;
	}else{
		//剔除需要删除的计算度量
		var ret = "";
		for(let i=0; i<js.length; i++){
			if(js[i] != compute){
				ret = ret + js[i] + ",";
			}
		}
		kpi.compute = ret.substring(0, ret.length  - 1);
	}
	if(cb){
		cb();
	}
}
export function drill(oldDimId, dimId, comp, pos, val, vdesc, cb){
	var dims = null;
	if(pos == 'row'){
		dims = comp.rows;
	}else{
		dims = comp.cols;
	}
	//设置当前维度值为过滤条件
	var oldDim = null;
	var oldDimIndex = 0;
	for(let i=0; i<dims.length;i++){
		if(dims[i].id == oldDimId){
			oldDimIndex = i;
			if(dims[i].type == 'month'){
				dims[i].st = val;
				dims[i].end = val;
				delete dims[i].vals;
				oldDim = dims[i];
			}else
			if(dims[i].type == 'day'){
				var dateformat = dims[i].dateformat;
				var tmpval = val;;
				//if(dateformat.length == 8){
				//	tmpval = val.substring(0, 4) + "-" + val.substring(4, 6) + "-" + val.substring(6, 8);
				//}else{
				//}
				dims[i].st = tmpval;
				dims[i].end = dims[i].st;
				delete dims[i].vals;
				oldDim = dims[i];
			}else{
				var o = dims[i];
				delete o.st;
				delete o.end;
				dims[i].vals = [val];   //只展开当前，设置值筛选
			}
			
		}
	}
	var json = null;
	for(let j=0;j<comp.dims.length; j++){
		if(comp.dims[j].dim_id == dimId){
			json = comp.dims[j];
			break;
		}
	}
	var ooo = {"id":json.dim_id, "dimdesc" : json.dim_desc, "type":json.dim_type, "colname":json.col_name,"alias":json.alias,"cubeId":json.cubeId,"iscas":'', tname:json.tname, "tableName":(json.dim_tname == null ? "" : json.dim_tname), "tableColKey":(json.tableColKey == null ? "" : json.tableColKey),"tableColName":(json.tableColName == null ? "" : json.tableColName), "dimord":(json.dim_ord==null?"":json.dim_ord), "dim_name":json.dim_name, "iscas":(json.iscas == null ? "" : json.iscas), "grouptype":json.grouptype, "valType":json.valType,calc:json.calc, "ordcol":(json.ordcol == null ? "": json.ordcol), "dateformat":(json.dateformat==null?"":json.dateformat)};
	dims.splice(oldDimIndex + 1, 0, ooo);
	if(cb){
		cb();
	}
}
//上卷维度
export function goupDim(comp, pos, dimId, pageInfo, cb){
	var dims = null;
	if(pos == 'row'){
		dims = comp.rows;
	}else{
		dims = comp.cols;
	}
	//清除过滤条件
	//删除该维度以后的维度
	var idx = 0;
	for(let i=0; i<dims.length;i++){
		if(dims[i].id == dimId){
			delete dims[i].vals;
			if(dims[i].type == 'day'){
				delete dims[i].st;
				delete dims[i].end;
			}
			if(dims[i].type == 'month'){
				delete dims[i].st;
				delete dims[i].end;
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
	if(!paramsamedimdate(comp, pageInfo)){
		for(var j=0; comp.kpiJson&&j<comp.kpiJson.length; j++){
			delete comp.kpiJson[j].compute;
		}
	}
	if(cb){
		cb();
	}
}
export function fireTableScroll(comp){
	let id = comp.id;
	$("#T"+id+" #d_kpi").scroll(function(){
		var top = $(this).scrollTop();
		$("#d_rowDims table").css("margin-top", "-"+top+"px");
		//$("#T"+id+" #d_rowDims").scrollTop(top);
		var left = $(this).scrollLeft();
		$("#T"+id+" #d_colDims table").css("margin-left", "-"+left+"px");
	});
	/**
	$("#T"+id+" #d_rowDims").scroll(function(){
		var top = $(this).scrollTop();
		//$("#d_kpi table").css("margin-top", "-"+top+"px");
		$("#T"+id+" #d_kpi").scrollTop(top);
	});
	**/
	var rowLvl = comp.rows?comp.rows.length:1;
	if(rowLvl == 0){
		rowLvl = 1;
	}
	var w = Math.round($("#T"+id).width()), h = Math.round($(".wrapper-content").height());
	h = h - Math.round($("#d_colDims").height()) - 120;
	w = w - (127 * rowLvl);
	if(w <0){
		w = 200;
	}
	$("#T"+id+" #d_rowDims").height(h);
	$("#T"+id+" #d_colDims").width(w);
	$("#T"+id+" #d_kpi").width(w).height(h).css("overflow", "auto");
}