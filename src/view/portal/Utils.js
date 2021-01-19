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

export const getCompTypeDesc = (compType)=>{
	var name = "";
	if(compType === 'text'){
		name = "文本";
	}else if(compType === 'box'){
		name = "数据块";
	}else if(compType === 'chart'){
		name = "图形";
	}else if(compType === 'grid'){
		name = "表格";
	}else if(compType === 'table'){
		name = "交叉表";
	}
	return name;
}

//从布局器中查询td(容器)
export const findLayoutById = (layoutId, pageInfo)=>{
	var ret = null;
	for(var i=1; true; i++){
		var tr = pageInfo.body["tr"+i];
		if(!tr || tr == null){
			break;
		}
		for(var j=0; j<tr.length; j++){
			var td = tr[j];
			if(td.id == layoutId){
				ret = td;
				break;
			}
		}
	}
	return ret;
}
//查询布局器中所以组件
export const findAllComps = (pageInfo)=>{
	let ret = [];
	for(var i=1; true; i++){
		var tr = pageInfo.body["tr"+i];
		if(!tr || tr == null){
		  break;
		}
		for(var j=0; j<tr.length; j++){
		  var td = tr[j];
		  if(td.children){
			td.children.forEach(element => {
			  ret.push(element);
			});
		  }
		}
	}
	return ret;
}
/**
//从布局器中查询组件
 * @param {*} pageInfo 
 * @param {*} compId 
 * @param {*} remove  是否移除查找到的对象
 */
export const findCompById = (pageInfo, compId, remove)=>{
	let ret = null;
	for(var i=1; true; i++){
		var tr = pageInfo.body["tr"+i];
		if(!tr || tr == null){
		  break;
		}
		for(var j=0; j<tr.length; j++){
		  var td = tr[j];
		  if(td.children){
			  $(td.children).each((a, b)=>{
				if(b.id === compId){
					ret = b;
					if(remove){
						td.children.splice(a, 1);
					}
					return false;
				}
			  });
		  }
		}
	}
	return ret;
}
