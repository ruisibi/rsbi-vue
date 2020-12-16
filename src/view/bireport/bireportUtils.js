/**
 * 多维分析的工具类
 */
import $ from 'jquery'
import { Message } from 'element-ui'

/**
 * 根据ID查找参数
 * @param {*} pid 
 * @param {*} params 
 */
export const findParamById = (pid, params)=>{
    var ret = null;
    for(var i=0; params&&i<params.length; i++){
        var p = params[i];
        if(p.id == pid){
            ret = p;
            break;
        }
    }
    return ret;
}

export const findCompById = (id, pageInfo)=>{
	var ret = null;
	for(let i=0;i<pageInfo.comps.length; i++){
		var t = pageInfo.comps[i];
		if(t.id == id){
			ret = t;
			break;
		}
	}
	return ret;
}
export const msginfo = (msg, type)=>{
	if(!type || type === 'error'){
		Message.error({message:msg, type:"error",showClose: true});
	}else{
		Message.success({message:msg, type:"success",showClose: true});
	}
}

export const kpiExist = (kpiId, kpis)=>{
	var ret = false;
	if(!kpis || kpis == null){
		return ret;
	}
	for(var i=0; i<kpis.length; i++){
		if(kpis[i].kpi_id == kpiId){
			ret = true;
			break;
		}
	}
	return ret;
}

export const dimExist = (dimId, dims) => {
	var ret = false;
	if(!dims || dims == null){
		return ret;
	}
	for(var i=0; i<dims.length; i++){
		if(dims[i].id == dimId){
			ret = true;
			break;
		}
	}
	return ret;
}
//查找维度分组
export const findGroup = (dims, group, curNode)=>{
	var ret = false;
	if(!dims || dims == null){
		return ret;
	}
	for(let m=0; m<dims.length; m++){
		if(curNode && curNode == dims[m]){  //curNode存在表示忽略当前节点
			continue; 
		}
		if(dims[m].grouptype == group){
			ret = true;
			break;
		}
	}
	return ret;
}