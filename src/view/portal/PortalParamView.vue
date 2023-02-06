<template>
    <div>
      <!-- 参数区域 -->
      <template v-if="pms.filter(m=>m.type != 'hidden').length > 0 ">
        <el-form :model="reportParam" ref="paramForm" size="mini" label-position="left" >
          <div class="ibox reportParams" style="margin:5px;">
              <div class="row">
                <div class="ibox-content" style="padding:5px;border:none;">
                    <template v-for="item in pms.filter(m=>m.type != 'hidden')">
                      <div class="col-sm-3" :key="item.id">
                            <el-form-item :label="item.desc" label-width="80px">
                              <template v-if="item.inputType==='text'">
                                <el-input v-model="reportParam[item.id]" :disabled="!showSearchBtn" placeholder="请录入"></el-input>
                              </template>
                              <template v-if="item.inputType==='select'">
                                <el-select v-model="reportParam[item.id]" :disabled="!showSearchBtn" clearable placeholder="请选择" style="width:100%">
                                  <el-option v-for="item in item.options" :key="item.value" :label="item.text" :value="item.value">
                                  </el-option>
                                </el-select>
                              </template>
                              <template v-if="item.inputType==='mselect'">
                                <el-select v-model="reportParam[item.id]" :disabled="!showSearchBtn" multiple clearable placeholder="请选择" style="width:100%">
                                  <el-option v-for="item in item.options" :key="item.value" :label="item.text" :value="item.value">
                                  </el-option>
                                </el-select>
                              </template>
                              <template v-if="item.inputType === 'dateSelect'">
                                <el-date-picker v-model="reportParam[item.id]" :disabled="!showSearchBtn" :format="item.dateFormat" 
                                style="width:100%" :type="item.dateType" placeholder="选择日期" :value-format="item.dateFormat"></el-date-picker>
                              </template>
                            </el-form-item>
                      </div>
                    </template>
                    <template v-if="showSearchBtn==true">
                      <div class="col-sm-3">
                            <button type="button" class="btn btn-info btn-sm" @click="search">查询</button>
                            <button type="button" class="btn btn-success btn-sm" @click="cleardata">清除</button>
                      </div>
                    </template>
                </div>
              </div>
          </div>
        </el-form>
      </template>
    </div>
</template>
<script>
import {baseUrl, ajax} from '@/common/biConfig'
import LayoutView from './LayoutView.vue'
import { Loading } from 'element-ui'
import $ from 'jquery'

export default {
  name: "portalParamView",
  components: {
    LayoutView
  },
  props: {
    pms:{
        type:Array,
        required:true,
        default:[]
     },
     showSearchBtn:{
       type:Boolean,
       required:true,
       default:true
     }
  },
  data() {
    return {
      reportParam:{

      }
    }
  },

  methods: {
    cleardata(){
      $(this.pms).each((a, b)=>{
        this.reportParam[b.id] = null;
      });
    },
    /**
     * 获取参数值
     */
    getParamValues(){
      let dt = JSON.parse(JSON.stringify(this.reportParam));
      //处理多选参数
      $(this.pms).each((a, b)=>{
        if(b.inputType === 'mselect' && dt[b.id]){
          if(dt[b.id]){
           dt[b.id] = dt[b.id].join(",");
          }else{
            dt[b.id] = '';
          }
        }
      });
      return dt;
    },
    search(){
      let dt = this.getParamValues();
      let reportId = this.$parent.reportId;
      dt['serviceid'] = "ext.sys.tab.ajax";
      dt['t_from_id'] = "mv_" + reportId;
      dt['mvid'] = "mv_" + reportId;
     
      let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('.wrapper-content-nomargin')});
      ajax({
        url:"control/extControl",
        data:dt,
        type:"POST",
        success:(resp)=>{
          //重新渲染报表
          this.$parent.$refs['optarea'].setCompData(resp.rows);
        }
      }, this, loadingInstance);
    },
    //初始化参数字段
    initReportParam(urlParam, pms){
      //把URL上的参数赋给报表参数
      $(pms).each((a, b)=>{
        if(urlParam[b.id]){
          b.value = urlParam[b.id];
        }
      });
      $(pms).each((a, b)=>{
        if(b.type === 'checkbox' && b.value){
          let v = b.value;
          //this.reportParam[b.id] = v.split(",");
          this.$set(this.reportParam,b.id, v.split(","));
        }else{
          //this.reportParam[b.id] = b.value;
          this.$set(this.reportParam,b.id, b.value);
        }
      });

      

    }
  },
  mounted(){

  },
  watch: {

  }
}
</script>
<style lang="less" scoped>

</style>
