/**
 * 多维分析的工具类
 */
import $ from 'jquery'

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