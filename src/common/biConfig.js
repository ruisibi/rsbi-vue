/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * 
 */
import $ from 'jquery'
import { Message } from 'element-ui'

const baseUrl = 'http://localhost:8080/';
//const baseUrl = "http://112.124.13.251:8081/";

export {
	baseUrl
}
/**
 * 封装Ajax请求
 * @param {*} cfg 
 * @param {*} ts 
 * @param {*} loadingObj   loading对象，如果有
 */
export const ajax = (cfg, ts, loadingObj) => {
	let o = {
		type:cfg.type,
		data:cfg.data,
		dataType:"JSON",
		xhrFields: {withCredentials: true},
		contentType: "application/json; charset=utf-8",
		crossDomain: true,
		url:baseUrl+cfg.url,
		success:function(resp){
			if(loadingObj){
				loadingObj.close();
			}
			if(resp.result === 1){
				cfg.success(resp);
			}else if(resp.result === 2){
				ts.$notify.error({
					title: '登录信息失效',
					message:resp.msg,
					offset: 50
				});
				//if(ts.$route.path === '/'){
					ts.$router.push("/");
				//}
			}else{
				/** 
				ts.$notify.error({
					title: '系统出错',
					message:resp.msg,
					offset: 50
				});
				*/
				Message.error({message:resp.msg, type:"error",showClose: true});
			}
		},
		error: function(){
			if(loadingObj){
				loadingObj.close();
			}
			ts.$notify.error({
				title: '系统出错',
				offset: 50
			});
		}
	};
	if(!cfg.postJSON || cfg.postJSON === false){
		delete o.contentType;
	}
	$.ajax(o);
}

//生成唯一标识
export const newGuid = ()=>
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      //if((i==8)||(i==12)||(i==16)||(i==20))
      //  guid += "-";
    }
    return guid;    
}
//在textarea光标处插入文本
export const insertText2focus = (obj,str) => {
	str = str　+ " ";
	obj.focus();
	if (document.selection) {
		var sel = document.selection.createRange();
		sel.text = str;
	} else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
		var startPos = obj.selectionStart,
			endPos = obj.selectionEnd,
			cursorPos = startPos,
			tmpStr = obj.value;
		obj.value = tmpStr.substring(0, startPos) + "" + str + tmpStr.substring(endPos, tmpStr.length);
		cursorPos += str.length;
		obj.selectionStart = obj.selectionEnd = cursorPos;
	} else {
		obj.value += str;
	}
}

/**
 * list 转 String
 * @param {*} ls 
 */
export const list2string = (ls)=>{
	if(!ls){
		return "";
	}
	return ls.join(",");
}

/**
 * 解析图形JSON中的f$标志为字符串
 * @param json 
 */
export const loopChartJson = (json)=>{
	const exec = (jsons)=>{
		for(let key in jsons) {
			let o = jsons[key];
			if(typeof o  === 'object'){
				exec(o);  //如果是Object则递归
			}else if(typeof o === 'string'){
				if(o.indexOf&&o.indexOf('f$')>-1){  //吧f$字符串解析成函数
					jsons[key] = eval("("+o.replace("f$", "")+")");
				}
			}
			//else if(typeof o === 'number'){

			//}
		}
	}
	exec(json);
	return json;
}