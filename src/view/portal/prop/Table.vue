<template>
  <el-form :model="prop" ref="propForm" label-position="left" size="mini">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('message.report.tableProp.name')" name="1">
            <el-form-item :label="$t('message.report.tableProp.title')" label-width="70px">
              <el-input v-model="prop.title" @blur="changevalue('title')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.tableProp.showtitle')" label-width="170px">
              <el-switch v-model="prop.showtitle" @change="changevalue('showtitle')"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('message.report.tableProp.usedrill')" label-width="170px">
              <el-switch v-model="prop.usedrill" @change="changevalue('usedrill')"></el-switch>
            </el-form-item>
            <template v-if="prop.usedrill == true">
            <el-form-item :label="$t('message.report.tableProp.drillDim')" label-width="70px">
              <el-select v-model="prop.drillDim" @change="changevalue('drillDim')" :placeholder="$t('message.base.select')" style="width:100%">
                <el-option
                v-for="item in cols"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            </template>
      </el-collapse-item>
      
    </el-collapse>
  </el-form>
</template>

<script>
import {baseUrl, ajax} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'

export default {
  components:{
    
  },
  props:{
      comp:{
        type:Object,
        required:true
      }
  },
  data(){
    return {
      activeName:"1",
      prop:{
        title:null,
        showtitle:true,
        usedrill:false,
        drillDim: null,
      },
      cols:[],
      dims:[],
    }
  },
  mounted(){
    
  },
  computed: {
  },
  methods: {
    loadCols(){
      ajax({
        type:"post",
        url:"bireport/queryDims.action",
        data: {cubeId: this.comp.cubeId},
        success:(resp)=>{
          this.dims = resp.rows;
          this.cols = resp.rows.map(m=>{
            return {lable:m.dim_desc, value:m.alias}
          });
        }
      });
    },
    init(){
      let p = this.prop;
      let c = this.comp;
      p.title = c.name;
      if(c.showtitle != null){
        p.showtitle = c.showtitle;
      }
      p.usedrill = c.usedrill;
      if(c.drillDim && c.drillDim.length > 0){
        p.drillDim = c.drillDim[0].code;
      }else{
        p.drillDim = null;
      }
      this.loadCols();
    },
   
    tableView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].gridView();
    },
    compRender(){
      this.$parent.$parent.$refs['optarea'].$forceUpdate();
    },
    changevalue(prop){
      let c = this.comp;
      let v = this.prop[prop];
      if(prop === 'title' || prop === 'showtitle' || prop === 'usedrill'){
        c[prop] = v;
        if(prop == 'usedrill' && v == false){
          delete c.drillDim;
        }
      }
      if(prop === 'drillDim'){
        if(c['usedrill'] == true){
          let dim = this.dims.filter(m=>m.alias === this.prop.drillDim)[0];
          if(!c.drillDim){
            c.drillDim = [];
          }
          c.drillDim[0] = {name:dim.dimdesc,code:dim.alias,type:dim.dim_type,tableColKey:dim.tableColKey,tableColName:dim.tableColName,cubeId:dim.cubeId,dimord:dim.dimord,colname:dim.col_name,calc:dim.calc,tname:dim.tname};
        }else{
          delete c.drillDim;
        }
      }
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  
</style>
