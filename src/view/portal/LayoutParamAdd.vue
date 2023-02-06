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
            <!--
            <el-form-item label="长度" label-width="100px">
              <el-input-number v-model="param.size" :min="5" :max="30" size="small"></el-input-number>
            </el-form-item>
            -->
            <template v-if="datetype == 'dateselect' || datetype ==='monthselect' || datetype ==='yearselect'">
              <el-form-item label="时间格式" label-width="100px">
                <el-select v-model="param.dtformat" placeholder="请选择" style="width:100%">
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
              <el-input v-model="param.defvalue" :placeholder="datetype == 'dateselect' || datetype ==='monthselect' || datetype ==='yearselect'? 'now 表示当前时间, now - 1 表示前一天':'参数默认值'"></el-input>
            </el-form-item>
            <el-form-item label="隐藏参数" label-width="100px">
              <el-switch v-model="param.hiddenprm" active-value="y" inactive-value="n">
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
                  <el-button @click="addStaticVal(false)" type="primary" size="small">添加</el-button>
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
                      <el-button @click="deleteStaticVal(scope.row.value)" type="text" size="small">删除</el-button>
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

      <el-dialog width="30%" :title="valaddtitle"
        :visible.sync="innerVisible" :close-on-click-modal="false" custom-class="nopadding"
        append-to-body>
        <el-form :model="pval" ref="pvalForm" :rules="pvalrules" label-position="left">
             <el-form-item label="Value" label-width="100px" prop="value">
              <el-input v-model="pval.value"></el-input>
            </el-form-item>
             <el-form-item label="Text" label-width="100px" prop="text">
              <el-input v-model="pval.text"></el-input>
            </el-form-item>
        </el-form>
         <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addValueSave()">确 定</el-button>
          <el-button @click="innerVisible = false">取 消</el-button>
        </div>
      </el-dialog>

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
      pageInfo:{
        type:Object,
        required:true,
        default:{}
     }
  },
  data(){
    return {
        title:"",
        show:false,
        innerVisible:false,
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
        valaddtitle:null,
        pval:{
          value:null,
          text:null
        },
        opts:{
          datasetlist:[],
          collist:[],
          dtformats:{
            yearselect: ['yyyy', 'yyyy年'],
            monthselect:['yyyyMM', 'yyyy-MM', 'yyyy年MM月'],
            dateselect:['yyyyMMdd', 'yyyy-MM-dd', 'yyyy年MM月dd日', "yyyy-MM-dd HH:mm:ss", "yyyyMMddHHmmss"]
          }
        },
        rules:{
          paramid:[
						{ required: true, message: '必填', trigger: 'blur' }
          ],
          paramname:[
						{ required: true, message: '必填', trigger: 'blur' }
					]
        },
        pvalrules:{
          value:[{ required: true, message: '必填', trigger: 'blur' }],
          text:[{ required: true, message: '必填', trigger: 'blur' }]
        }
    }
  },
  mounted(){
    this.loadCubes();
  },
  computed: {
     
  },
  methods: {
     setUpdate(){
      this.$parent.isupdate = true;
    },
     newparam(ptype, paramId){
       this.title = "创建参数 - " + tools.getParamTypeDesc(ptype);
       this.show = true;
       this.datetype = ptype;
       if(!paramId){
        this.isupdate = false;
        this.param.paramid = "p"+ Math.round( Math.random() * 10000);
       }else{
         this.param.paramid = paramId;
         this.isupdate = true;
         let p = tools.findParamById(this.pageInfo, paramId);

         this.param.paramname = p.name;
          this.param.size = p.size;
          this.param.defvalue = p.defvalue;
          this.param.hiddenprm = p.hiddenprm;
          this.param.valtype = p.valtype;
          if(p.option){
            this.param.tableId = p.option.tableId;
            this.param.alias = p.option.alias;
          }
          this.param.values = p.values;
          this.param.dtformat = p.dtformat;
          this.param.minval = p.minval;
          this.param.maxval = p.maxval;
          this.selectcube();
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
                let pid = ts.param.paramid;
                let param = tools.findParamById(ts.pageInfo, pid);
                param.name = ts.param.paramname;
                param.defvalue = ts.param.defvalue;
                param.size = ts.param.size;
                param.hiddenprm = ts.param.hiddenprm;
                let paramType = ts.datetype;
                if(paramType == "dateselect" || paramType == "monthselect" || paramType == "yearselect"){
                  param.maxval = ts.param.maxval;
                  param.minval = ts.param.minval;
                  param.dtformat = ts.param.dtformat;
                }
                if(paramType == 'radio' || paramType == 'checkbox'){
                  let r = param.valtype = ts.param.valtype;
                  if(r == 'static'){
                    param.values = ts.param.values;
                    delete param.option;
                  }else{
                    let table = null;
                    $(ts.opts.datasetlist).each((a, b)=>{
                      if(b.value === ts.param.tableId){
                        table = b;
                        return false;
                      }
                    });
                    let dim = ts.opts.collist.filter(m=>m.value === ts.param.alias)[0];
                    param.option = {"tableId":table.value, "tname":table.label,"dsource":table.dsource,"dimId":dim.dimId, "alias":dim.value};
                    delete param.values;
                  }
                }
             }else{
                 var obj = {id:ts.param.paramid, type:ts.datetype, paramid:ts.param.paramid, name:ts.param.paramname,defvalue:ts.param.defvalue, size:ts.param.size, hiddenprm:ts.param.hiddenprm};
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
                        return false;
                      }
                    });
                    let dim = ts.opts.collist.filter(m=>m.value === ts.param.alias)[0];
                    obj.option = {"tableId":table.value, "tname":table.label,"dsource":table.dsource,"dimId":dim.dimId, "alias":dim.value};
                  }
                }
                if(!ts.pageInfo.params){
                  ts.pageInfo.params = [];
                }
                ts.pageInfo.params.push(obj);
             }
             ts.$parent.$refs['paramForm'].$forceUpdate();
             ts.setUpdate();
             this.show = false;
           }
        });
     },
    addStaticVal(isupdate, id){
      this.innerVisible = true;
      if(this.$refs['pvalForm']){
        this.$refs['pvalForm'].resetFields();
      }
      if(isupdate){
        this.valaddtitle = "修改值";
        let ts = this;
         $(this.param.values).each((a, b)=>{
            if(b.value === id){
              ts.pval.value = b.value;
              ts.pval.text = b.text;
              return false;
            }
          });
      }else{
        this.valaddtitle = "添加值";
      }
    },
    deleteStaticVal(id){
      $(this.param.values).each((a, b)=>{
        if(b.value === id){
          this.param.values.splice(a, 1);
          return false;
        }
      });
    },
    addValueSave(){
       let ts = this;
				this.$refs['pvalForm'].validate((valid) => {
           if(valid){
             ts.innerVisible = false;
             if(!ts.param.values){
               ts.param.values = [];
             }
            // if(ts.valaddtitle === '添加值'){
            ts.param.values.push({value:ts.pval.value, text:ts.pval.text});
             
           }
        });
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
