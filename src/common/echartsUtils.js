import $ from 'jquery'

export let cityPosJson = {};  //城市的经纬度信息

/**
 * 显示图形的 tooltip
 * @param params
 * @param fmt
 * @param unit
 * @param fmt2
 * @param unit2
 * @param y2ser 在曲线图，柱状图的多指标图形中，在第二纵轴显示的指标
 * @returns {string}
 */
export const toolTips = (params, fmt, unit, ydesc, fmt2, unit2, y2desc, thb, chartId, y2ser) => {
    if(params.length){  //数组
        //o = params[0];
        var s = '<b>' + params[0].name  + "</b><br/>";
        $(params).each(function(a, b){
            s += b.seriesName === "" ?"": b.seriesName +": ";
            if(y2ser){
                if(y2ser.indexOf(b.seriesName) >= 0){
                    s += formatNumber(b.data, fmt2) + unit2;
                }else{
                    s += formatNumber(b.data, fmt) + unit;
                }

            }else if(thb === true) {  //具体同环比计算等衍生指标
                if (b.seriesName.indexOf("同比") >= 0 || b.seriesName.indexOf("环比") >= 0) {
                    s += formatNumber(b.data, "0.00%");
                } else {
                    s += formatNumber(b.data, fmt) + unit;
                }
            }else{
                if (fmt2) { //双指标
                    var cid = "ct_" + chartId; //图形以ct_开头
                    var chart = echarts.getInstanceByDom(document.getElementById(cid));
                    var opts = chart.getOption();
                    $(opts.series).each(function(c, d){
                        if(d.name === b.seriesName){
                            if(d.yAxisIndex === 1 || d.xAxisIndex === 1) {
                                s += formatNumber(b.data, fmt2) + unit2;  //y2轴
                            }else{
                                s += formatNumber(b.data, fmt) + unit;	// y轴
                            }
                            return false;
                        }
                    });
                } else {
                    s += formatNumber(b.data, fmt) + unit;
                }
            }
            if(!(a === params.length - 1)){
                s += "<br/>";
            }
        });
        return s;
    }else{
        var o = params;
        return  o.name + ': '+ formatNumber(o.value, fmt)+unit;
    }
}
//数字格式化
export const formatNumber = (num,pattern, shortname)=>{
    if(!pattern || pattern.length == 0){
        return num;
    }
    var negative = false;  //负数
    if(num < 0 ){
        num = Math.abs(num);
        negative = true;
    }
    var shortdw;
     if(shortname && num > 100000000){
        num = num / 100000000;
        shortdw = "亿";
     }else if(shortname && num > 10000000){
        num = num / 10000000;
        shortdw = "千万";
     }else if(shortname && num > 1000000){
        num = num / 1000000;
        shortdw = "百万";
     }else if(shortname && num > 10000){
         num = num / 10000;
         shortdw = "万";
     }else if(shortname && num > 1000){
         num = num / 1000;
         shortdw = "千";
     }
     if(pattern.indexOf("%") <= 0 && shortname){
         return (negative?"-":"") + (Math.round(num * 10) / 10) + (shortdw?shortdw:"");
     }
     if(pattern.indexOf("%") > 0){
         num = num * 100;
     }
     var fmtarr = pattern?pattern.split('.'):[''];
     var retstr='';
     
     //先对数据做四舍五入
     var xsw = 0;
     if(fmtarr.length > 1){
         xsw = fmtarr[1].length;
     }
     var bl = 1;
     for(i=0; i<xsw; i++){
         bl = bl * 10;
     }
     num = num * bl;
     num = Math.round(num);
     num = num / bl;
     
     var strarr = num?num.toString().split('.'):['0'];
    
     // 整数部分
     var str = strarr[0];
     var fmt = fmtarr[0];
     var i = str.length-1;  
     var comma = false;
     for(var f=fmt.length-1;f>=0;f--){
       switch(fmt.substr(f,1)){
         case '#':
           if(i>=0 ) retstr = str.substr(i--,1) + retstr;
           break;
         case '0':
           if(i>=0) retstr = str.substr(i--,1) + retstr;
           else retstr = '0' + retstr;
           break;
         case ',':
           comma = true;
           retstr=','+retstr;
           break;
       }
     }
     if(i>=0){
       if(comma){
         var l = str.length;
         for(;i>=0;i--){
           retstr = str.substr(i,1) + retstr;
           if(i>0 && ((l-i)%3)==0) retstr = ',' + retstr; 
         }
       }
       else retstr = str.substr(0,i+1) + retstr;
     }

     retstr = retstr+'.';
     // 处理小数部分
     str=strarr.length>1?strarr[1]:'';
     fmt=fmtarr.length>1?fmtarr[1]:'';
     i=0;
     for(var f=0;f<fmt.length;f++){
       switch(fmt.substr(f,1)){
         case '#':
           if(i<str.length) retstr+=str.substr(i++,1);
           break;
         case '0':
           if(i<str.length) retstr+= str.substr(i++,1);
           else retstr+='0';
           break;
       }
     }

     var r = retstr.replace(/^,+/,'').replace(/\.$/,''); 
     if(pattern.indexOf("%") > 0){
         r = r + "%";
     } 
     if(shortdw){
         r = r + shortdw;
     }
     if(negative){
         r = "-" + r;
     }
     return r;
   }
/**
	 * 对于散点图的ToolTip,如果值相同，会覆盖后面的点，现在通过第一个点抓出值相同的所有点，显示再 tooltip中
	 * @returns
	 */
export const scatterTooltip = (option, params)=>{
    var target = {x:params.data[0], y:params.data[1], name:params.data[2]};
    var dts = option.series[params.seriesIndex].data;
    var r = [];
    for(let k=0; k<dts.length; k++){
        var t = dts[k];
        if(t[0] == target.x && t[1] == target.y){
            r.push(t[2]);
        }
    }
    return r.join(",");
}
/**
配置气泡大小
转换到 10 到 50
**/
export const bubbleSize = (maxval, minval, val, targetMax)=>{
	if(maxval == minval){
		return 40;
	}
	if(!targetMax){
		targetMax = 50;
	}
	var r = (targetMax-10)/(maxval-minval)*(val-minval)+10;
	return r;
}
export const converMapData2 = (name, value) => {
    var geoCoordMap = cityPosJson;
    var res;
    var geoCoord = geoCoordMap[name];
    if (geoCoord) {
        res = geoCoord.concat(value);
    }
    return res;
};