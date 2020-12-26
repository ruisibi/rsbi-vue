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