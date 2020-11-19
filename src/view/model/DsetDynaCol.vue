<template>
  <el-dialog title="创建表达式(主表)" :visible.sync="show">
    <el-form :model="dyna" ref="dynaForm" :rules="rule">
         <el-form-item label="字段名" label-width="100px" prop="name">
          <el-input v-model="dyna.name" placeholder="英文字符" id="dynaName"></el-input>
          </el-form-item>
         <el-form-item label="表达式" label-width="100px" prop="expression">
            <el-input id="mybds" type="textarea" v-model="dyna.expression"></el-input>
          </el-form-item>
          <div style="line-height:25px;">
          <template v-for="c in cols">
              <button @click="selectCol(c.name)" style="margin-right:5px;" type="button" :key="c.name" :name="c.name" class="btn btn-primary btn-xs">{{ c.name }}</button>
          </template>
          </div>
          <el-form-item label="字段类型" label-width="100px" prop="type">
            <el-select v-model="dyna.type" placeholder="请选择">
              <el-option
                v-for="item in opts.types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { baseUrl, ajax, insertText2focus } from "@/common/biConfig";
import $ from "jquery"

export default {
   name: 'dynaCol',
  data() {
    return {
      show:false,
      dyna:{
        name:"",
        tname:"",
        type:"",
        expression:""
      },
      rule:{
        name: [{ required: true, message: "必填", trigger: "blur" }],
        expression: [{ required: true, message: "必填", trigger: "blur" }],
        type: [{ required: true, message: "必填", trigger: "blur" }]
      },
      opts:{
        types:[{
          value:"String",label:"String"
        },{
          value:"Int",label:"Int"
        },{
          value:"Double",label:"Double"
        },{
          value:"Date",label:"Date"
        },{
          value:"Datetime",label:"Datetime"
        }]
      },
      cols:[],
      dynaCols:[],
      master:"",
      isupdate:false
    }
  },
  components: {
		
	},
  mounted() {
    
  },
  computed: {},
  methods: {
	 createDyna(isupdate, col, cols, dynaCols, master){
     let ts = this;
     this.show = true;
     if(this.$refs['dynaForm']){
        this.$refs['dynaForm'].resetFields();
     }
     //动态字段只显示主表字段
     this.cols = [];
     cols.forEach(e => {
       if(e.tname === master){
         ts.cols.push(e);
       }
     });
     this.dynaCols = dynaCols;
     this.master = master;
     this.isupdate = isupdate;
     if(isupdate){
       setTimeout(()=>$("#dynaName").prop("readOnly","true"), 200); 
       $(dynaCols).each((a, b)=>{
         if(b.name === col){
           ts.dyna = b;
           ts.dyna.name = b.name;
           ts.dyna.type = b.type;
           ts.dyna.expression = b.expression;
           return false;
         }
       });
     }else{
       ts.dyna= {name:"", type:"", expression:""};
       setTimeout(()=>{
         $("#dynaName").prop("readOnly","")
       }, 200); 
     }
   },
   save(){
     let ts = this;
     this.$refs['dynaForm'].validate(v=>{
       if(v){
         if(this.ischinese(ts.dyna.name)){
           ts.$notify.error("字段名必须是英文字符。");
           return;
         }
         if(ts.isupdate){
           $(ts.dynaCols).each((a, b)=>{
            if(b.name === ts.dyna.name){
              b.name = ts.dyna.name;
              b.type = ts.dyna.type;
              b.expression = ts.dyna.expression;
              return false;
            }
          });
         }else{
          this.dynaCols.push({name:ts.dyna.name, tname:ts.master,type:ts.dyna.type,expression:ts.dyna.expression});
         }
          this.show = false;
       }
     });
    
   },
   selectCol(v){
     insertText2focus(document.getElementById("mybds"), v);
   },
   ischinese(a){
      if (/[\u4E00-\u9FA5]/i.test(a)) {
        return true;  
      }else{    
        return false 
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
