<template>
    <el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
         <div class="el-dialog-div">
           <el-form :model="param" ref="paramForm" :rules="rules" label-position="left">
             <el-form-item label="参数标识" label-width="100px" prop="paramid">
              <el-input v-model="param.paramid"></el-input>
            </el-form-item>
             <el-form-item label="显示名称" label-width="100px" prop="paramname">
              <el-input v-model="param.paramname"></el-input>
            </el-form-item>
            <el-form-item label="长度" label-width="100px">
              <el-input-number v-model="param.size" :min="5" :max="30"></el-input-number>
            </el-form-item>
            <template v-if="datetype == 'dateselect' || datetype ==='monthselect' || datetype ==='yearselect'">
              <el-form-item label="时间格式" label-width="100px">
                <el-select v-model="param.tableId" placeholder="请选择" style="width:100%">
                  <el-option v-for="item in opts.dtformats[datetype]" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>				    
              </el-form-item>
              <el-form-item label="最小值" label-width="100px">
                <el-input v-model="param.minval"></el-input>
              </el-form-item>
              <el-form-item label="最大值" label-width="100px">
                <el-input v-model="param.maxval" ></el-input>
              </el-form-item>
            </template>
            <el-form-item label="默认值" label-width="100px">
              <el-input v-model="param.defvalue"></el-input>
            </el-form-item>
            <el-form-item label="隐藏参数" label-width="100px">
              <el-switch v-model="param.hiddenprm" active-color="#13ce66" inactive-color="#dbdcdc" active-value="y" inactive-value="n">
              </el-switch>
              <span class="text-warning"> 隐藏参数不会在页面中显示</span>
            </el-form-item>

            <template v-if="datetype == 'radio' || datetype ==='checkbox'">
            <fieldset>
                <legend>值列表</legend>
                <el-radio v-model="param.valtype" label="static">静态值</el-radio>
                <el-radio v-model="param.valtype" label="dynamic">动态值</el-radio>
                <template v-if="param.valtype === 'static'">
                  <div>
                  <el-button @click="handleClick()" type="primary" size="small">添加</el-button>
                  </div>
                   <el-table :data="param.values" style="width: 100%" border header-row-class-name="tableHeadbg">
                    <el-table-column
                      prop="value"
                      label="Value">
                    </el-table-column>
                    <el-table-column
                      prop="text"
                      label="Text">
                    </el-table-column>
                   <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button @click="handleClick(scope.value)" type="text" size="small">编辑</el-button>
                      <el-button type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                  </el-table>
                </template>
                <template v-if="param.valtype === 'dynamic'">
                   <el-form-item label="数据" label-width="100px">
                    <el-select v-model="param.tableId" @change="selectcube()" placeholder="请选择" style="width:100%">
                      <el-option
                      v-for="item in opts.datasetlist"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>				    
                  </el-form-item>
                  <el-form-item label="映射字段" label-width="100px" >
                    <el-select v-model="param.alias" placeholder="请选择" style="width:100%">
                      <el-option
                      v-for="item in opts.collist"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>				    
                  </el-form-item>
                </template>
            </fieldset>          
            </template>  
           </el-form>
         </div>
         <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save()">确 定</el-button>
          <el-button @click="show = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {baseUrl, ajax, newGuid} from '@/common/biConfig'
import $ from 'jquery'
import * as tools from './Utils'

export default {
  components:{

  },
  props:{
      
  },
  data(){
    return {
        title:"",
        show:false,
        param:{
          paramid:null,
          paramname:null,
          size:20,
          defvalue:null,
          hiddenprm:null,
          valtype:"static",
          tableId:null,
          alias:null,
          values:null,
          dtformat:null,
          minval:null,
          maxval:null,
        },
        datetype:'day',
        isupdate:false,
        opts:{
          datasetlist:[],
          collist:[],
          dtformats:{
            yearselect: ['yyyy', 'yyyy年'],
            monthselect:['yyyyMM', 'yyyy-MM', 'yyyy年MM月'],
            dateselect:['yyyyMMdd', 'yyyy-MM-dd', 'yyyy年MM月dd日']
          }
        },
        rules:{
          paramid:[
						{ required: true, message: '必填', trigger: 'blur' }
          ],
          paramname:[
						{ required: true, message: '必填', trigger: 'blur' }
					]
        }
    }
  },
  mounted(){
    this.loadCubes();
  },
  computed: {
     
  },
  methods: {
     newparam(type, ptype, paramId){
       this.title = "创建参数 - " + this.getParamTypeDesc(ptype);
       this.show = true;
       this.datetype = ptype;
       if(!paramId){
        this.isupdate = false;
        this.param.paramid = "p"+ Math.round( Math.random() * 10000);
       }else{
         this.isupdate = true;
       }
     },
     save(){
        let ts = this;
				this.$refs['paramForm'].validate((valid) => {
           if(valid){
             if(ts.datetype === 'radio' || ts.datetype === 'checkbox'){
               var r = ts.param.valtype;
                if(r == 'static'){
                  if(!ts.param.values || ts.param.values.length === 0){
                    tools.msginfo("您还未设置参数值。");
                    return;
                  }
                }else {
                  if(!ts.param.tableId || !ts.param.alias){
                    tools.msginfo("您的参数还未绑定到数据。");
                    return;
                  }
                }
             }
             if(ts.datetype == 'dateselect' || ts.datetype ==='monthselect' || ts.datetype ==='yearselect'){
               if(!ts.param.dtformat){
                 tools.msginfo("未设置时间格式。");
                 return;
               }
             }
             if(ts.isupdate){  //修改

             }else{
                 var obj = {id:newGuid(), type:ts.datetype, paramid:ts.param.paramid, name:ts.param.paramname,defvalue:ts.param.defvalue, size:ts.param.size, hiddenprm:ts.param.hiddenprm};
                let paramType = ts.datetype;
                if(paramType == "dateselect" || paramType == "monthselect" || paramType == "yearselect"){
                    obj.maxval = ts.param.maxval;
                    obj.minval = ts.param.minval;
                    obj.dtformat = ts.param.dtformat;
                  }
                  if( paramType == 'radio' || paramType == 'checkbox'){
                    obj.valtype = ts.param.valtype;
                    if(obj.valtype == 'static'){
                      obj.values = ts.param.values;
                    }else{
                      let table = null;
                      $(ts.opts.datasetlist).each((a, b)=>{
                        if(b.value === ts.param.tableId){
                          table = b;
                        }
                        return false;
                      });
                      let dim = ts.opts.collist.filter(m=>m.value === ts.param.alias);
                      this.param.tableId;
                      obj.option = {"tableId":table.value, "tname":table.label,"dsource":table.dsource,"dimId":dim.dimId, "alias":dim.value};
                    }
                  }
             }
             this.show = false;
           }
        });
     },
     getParamTypeDesc(paramType){
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
    },
    loadCubes(){
      ajax({
        url:"model/listCube.action",
        data:{},
        type:"GET",
        success:(resp)=>{
          this.opts.datasetlist = resp.rows.map(m=>{
            return {value:m.cubeId, label:m.cubeName, dsource:m.dsId}
          });
          //清空字段列表
          this.param.alias = null;
        }
      }, this);
    },
    selectcube(){
      ajax({
        url:"bireport/queryDims.action",
        data:{cubeId:this.param.tableId},
        type:"GET",
        success:resp=>{
          this.opts.collist = resp.rows.map(m=>{
            return {value:m.alias, label:m.col_name, dimId:m.dim_id}
          });
        }
      }, this);
    }
  },
  watch:{
    show:function(v){
      if(v === false){
        let ts = this.$data;
        //清空值
        for(let v in ts.param){
          if(v === 'size'){
            ts.param[v] = 20;
          }else if(v === 'valtype'){
           ts.param[v] = 'static';
          }else{
            ts.param[v] = null;
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
    @import "../../style/mixin";
</style>
