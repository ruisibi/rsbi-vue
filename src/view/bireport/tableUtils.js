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