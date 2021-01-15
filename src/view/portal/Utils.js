import $ from 'jquery'
import { Message } from 'element-ui'

//默认5种布局
export const layout = {
    l1 : {tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]},
    l2 : {tr1:[{colspan:1, rowspan:1, width:50, height:100, id:1},{colspan:1, rowspan:1, width:50, height:100, id:2}]},
    l3: {tr1:[{colspan:2, rowspan:1, width:100, height:50, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:50, id:2},{colspan:1, rowspan:1, width:50, height:50, id:3}]},
    l4: {tr1:[{colspan:2, rowspan:1, width:100, height:33, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:33, id:2},{colspan:1, rowspan:1, width:50, height:33, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:33, id:4}]},
    l5:{tr1:[{colspan:2, rowspan:1, width:100, height:20, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:20, id:2},{colspan:1, rowspan:1, width:50, height:20, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:20, id:4}],tr4:[{colspan:1, rowspan:1, width:50, height:20, id:5},{colspan:1, rowspan:1, width:50, height:20, id:6}],tr5:[{colspan:2, rowspan:1, width:100, height:20, id:7}]}
}

export const msginfo = (msg, type)=>{
	if(!type || type === 'error'){
		Message.error({message:msg, type:"error",showClose: true});
	}else{
		Message.success({message:msg, type:"success",showClose: true});
	}
}

export const findParamById = (pageInfo, id, retIndex) => {
	var ret = null;
	for(let i=0; pageInfo.params&&i<pageInfo.params.length; i++){
		var p = pageInfo.params[i];
		if(p.id == id){
			if(retIndex){
				ret = i;
			}else{
				ret = p;
			}
		}
	}
	return ret;
}

export const getParamTypeDesc = (paramType)=>{
	var tpname = "";
	if(paramType == "text"){
	  tpname = "输入框";
	}else if(paramType == "radio"){
	  tpname = "单选框";
	}else if(paramType == "checkbox"){
	  tpname = "多选框";
	}else if(paramType == "dateselect"){
	  tpname = "日历框";
	}else if(paramType == "monthselect"){
	  tpname = "月份框";
	}else if(paramType == "yearselect"){
	  tpname = "年份框";
	}
	return tpname;
}
