import $ from 'jquery'
import { Message, Loading } from 'element-ui'
import {baseUrl, ajax} from '@/common/biConfig'

//默认5种布局
export const layout = {
    l1 : {tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]},
    l2 : {tr1:[{colspan:1, rowspan:1, width:50, height:100, id:1},{colspan:1, rowspan:1, width:50, height:100, id:2}]},
    l3: {tr1:[{colspan:2, rowspan:1, width:100, height:50, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:50, id:2},{colspan:1, rowspan:1, width:50, height:50, id:3}]},
    l4: {tr1:[{colspan:2, rowspan:1, width:100, height:33, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:33, id:2},{colspan:1, rowspan:1, width:50, height:33, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:33, id:4}]},
    l5:{tr1:[{colspan:2, rowspan:1, width:100, height:20, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:20, id:2},{colspan:1, rowspan:1, width:50, height:20, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:20, id:4}],tr4:[{colspan:1, rowspan:1, width:50, height:20, id:5},{colspan:1, rowspan:1, width:50, height:20, id:6}],tr5:[{colspan:2, rowspan:1, width:100, height:20, id:7}]}
}

export const fmtJson = [{
	"text":"整数",
	"value":"#,##0"
},{
	"text":"小数(保留一位)",
	"value":"#,##0.0"
},{
	"text":"小数(保留两位)",
	"value":"#,##0.00"
},{
	"text":"小数(保留四位)",
	"value":"#,##0.0000"
},{
	"text":"百分比",
	"value":"#,##0%"
},{
	"text": "百分比(保留一位小数)",
	"value": "#,##0.0%"
}, {
	"text": "百分比(保留两位小数)",
	"value": "#,##0.00%"
}, {
	"text": "百分比(保留四位小数)",
	"value": "#,##0.0000%"
}];

export const rates = [{
	"text":"1",
	"value":"1"
},{
	"text":"千",
	"value":"1000"
},{
	"text":"万",
	"value":"10000"
},{
	"text":"百万",
	"value":"1000000"
},{
	"text":"亿",
	"value":"100000000"
}];

export const pielabels = [{"text":"名称","value":"n"},{"text":"名称+值","value":"nv"},{"text":"名称+比例","value":"np"}];

export const legendpos = [{text: '右上', value: 'righttop'},{text: '中上', value: 'centertop'},{text: '中下', value: 'centerbottom'}];

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
	if(!pageInfo.body){
		return ret;
	}
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
/**
 * 组件事件调用，目前只支持图形，交叉表
 * @param {*} link 
 */
export const compFireEvent = (link, ts, paramName, value)=>{
	let target = link.target;
	let types = link.type.split(",");
	$(target.split(",")).each((a, b)=>{
		let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+b+" div.ccctx")});
		let dt = ts.$parent.$parent.$refs['paramViewForm'].getParamValues(); // 获取参数
		let tp = types[a];
		if(tp === 'chart'){
		  dt['serviceid'] = "ext.sys.chart.rebuild";
		}else if(tp ==='cross'){
		  dt['serviceid'] = "ext.sys.cross.rebuild";
		}
		dt['t_from_id'] = "mv_" + ts.$parent.pageInfo.id;
		dt['id'] = b;
		dt[paramName] = value;
		ajax({
		  url:"control/extControl",
		  type:"POST",
		  data:dt,
		  success:(resp)=>{
			loadingInstance.close();
			if(tp === 'chart'){
			  //更新图形
			  let c = ts.$parent.$refs['mv_'+b];
			  c.data = resp.rows;
			  c.$nextTick(()=>c.showChart());
			}else if(tp === 'cross'){
				//更新交叉表
				let c = ts.$parent.$refs['mv_'+b];
				c.data = resp.rows;
			}
		  }
		}, ts, loadingInstance);
	});
}

/**
 * 点击返回按钮触发事件返回
 * @param {*} link 
 * @param {*} ts 
 */
export const compBackEvent = (link, ts)=>{
	let target = link.target;
	let types = link.type.split(",");
	$(target.split(",")).each((a, b)=>{
		let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+b+" div.ccctx")});
		let dt = ts.$parent.$parent.$refs['paramViewForm'].getParamValues(); // 获取参数
		let tp = types[a];
		if(tp === 'chart'){
		  dt['serviceid'] = "ext.sys.chart.rebuild";
		}else if(tp ==='cross'){
		  dt['serviceid'] = "ext.sys.cross.rebuild";
		}
		dt['t_from_id'] = "mv_" + ts.$parent.pageInfo.id;
		dt['id'] = b;
		ajax({
		  url:"control/extControl",
		  type:"POST",
		  data:dt,
		  success:(resp)=>{
			loadingInstance.close();
			if(tp === 'chart'){
			  //更新图形
			  let c = ts.$parent.$refs['mv_'+b];
			  c.data = resp.rows;
			  c.$nextTick(()=>c.showChart());
			}else if(tp === 'cross'){
				//更新交叉表
				let c = ts.$parent.$refs['mv_'+b];
				c.data = resp.rows;
			}
		  }
		}, ts, loadingInstance);
	});
}
/**
 * 
 * @param {报表导出} tp 
 * @param {*} reportId 
 * @param {*} paramViewForm 
 * @param {*} pageInfo 
 */
export const exportReport = (tp, reportId, paramViewForm, pageInfo)=>{
	let pageId = reportId;
	let burl = baseUrl;
	var ctx = `
	<form name='expff' method='post' action="${burl}/portal/export.action" id='expff'>
	<input type='hidden' name='type' id='type' value='${tp}'>
	<input type='hidden' name='pageId' id='pageId' value='${pageId}'>
	<input type='hidden' name='picinfo' id='picinfo'>
	`;
	let pms = paramViewForm.getParamValues();
	$(pageInfo.params).each((a, b)=>{
	  let v = pms[b.id];
	  ctx += `<input type='hidden' name='${b.id}' value="${v}">`;
	});
	ctx += `</form>`;
	if($("#expff").length == 0 ){
	  $(ctx).appendTo("body");
	}
	//把图形转换成图片
	var strs = "";
	if(tp == "pdf" || tp == "excel" || tp == "word"){
	  let comps = findAllComps(pageInfo).filter(m=>m.type ==='chart');
	  $(comps).each(function(index, element) {
		var id = element.id;
		var chart = echarts.getInstanceByDom(document.getElementById("ct_"+id));
		var str = chart.getDataURL({type:'png', pixelRatio:1, backgroundColor: '#fff'});
		str = str.split(",")[1]; //去除base64标记
		str = element.id + "," + str+","+$("#ct_"+id).width(); //加上label标记,由于宽度是100%,需要加上宽度
		strs = strs  +  str;
		if(index != comps.length - 1){
		  strs = strs + "@";
		}
	  });
	}
	$("#expff #picinfo").val(strs);
	$("#expff").submit().remove();
  }

  export const resetWindows = (tp)=>{
	if(tp == 'min'){
	  $("div.cctx").hide();
	}else{
	  $("div.cctx").show();
	}
}