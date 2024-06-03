<template>
  <el-dialog :title="$t('message.model.dset.col.title')" :visible.sync="show">
    <el-form :model="col" ref="colForm">
        <el-form-item :label="$t('message.model.dset.col.name')" label-width="120px" >
          {{ col.name }}
          </el-form-item>
         <el-form-item :label="$t('message.model.dset.col.dispName')" label-width="120px">
            <el-input v-model="col.dispName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.model.dset.col.type')" label-width="120px">
            <el-select v-model="col.type" :placeholder="$t('message.base.select')">
              <el-option
                v-for="item in opts.types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.dset.col.tname')" label-width="120px" >
          {{ col.tname }}
          </el-form-item>
          <el-form-item :label="$t('message.model.dset.col.join')" label-width="120px" >
          {{ col.join }}
          </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">{{ $t('message.base.ok') }}</el-button>
      <el-button @click="show = false">{{ $t('message.base.cancel') }}</el-button>
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
      ts.col.join = joinInfo==null?ts.$t('message.model.dset.col.err1'):master+"."+joinInfo.col+" -> " + joinInfo.ref+"."+joinInfo.refKey;
 
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
