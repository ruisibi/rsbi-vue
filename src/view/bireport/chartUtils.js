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