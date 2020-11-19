<template>
  <el-dialog title="编辑字段" :visible.sync="show">
    <el-form :model="col" ref="colForm">
        <el-form-item label="字段名" label-width="100px" >
          {{ col.name }}
          </el-form-item>
         <el-form-item label="显示名" label-width="100px">
            <el-input v-model="col.dispName"></el-input>
          </el-form-item>
          <el-form-item label="字段类型" label-width="100px">
            <el-select v-model="col.type" placeholder="请选择">
              <el-option
                v-for="item in opts.types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源表" label-width="100px" >
          {{ col.tname }}
          </el-form-item>
          <el-form-item label="关联字段" label-width="100px" >
          {{ col.join }}
          </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import $ from "jquery"

export default {
   name: 'dsetColModify',
  data() {
    return {
      show:false,
      col:{
        name:"",
        dispName:"",
        type:"",
        tname:"",
        join:""
      },
      curcol:null,
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
      }
    }
  },
  components: {
		
	},
  mounted() {
    
  },
  computed: {},
  methods: {
	 modify(col, tname, cols, joininfo, master){
     let ts = this;
     this.show = true;
     cols.forEach(element => {
       if(element.name === col && element.tname === tname){
         ts.col = {name:element.name, dispName:element.dispName, type:element.type, tname:element.tname};
         ts.curcol = element;
         return false;
       }
     });
     //查询关联字段
      let joinInfo = null;
      for(let j=0; joininfo && j<joininfo.length; j++){
        //是主表，字段相同
        if( master==ts.col.tname && joininfo[j].col == ts.col.name){
          joinInfo = joininfo[j];
          break;
        }else
        if(ts.col.tname == joininfo[j].ref && ts.col.name == joininfo[j].refKey ){
          joinInfo =  joininfo[j];
          break;
        }
      }
      ts.col.join = joinInfo==null?"字段无关联":master+"."+joinInfo.col+" -> " + joinInfo.ref+"."+joinInfo.refKey;
 
   },
   save(){
     this.show = false;
     this.curcol.dispName = this.col.dispName;
     this.curcol.type = this.col.type;
   }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
