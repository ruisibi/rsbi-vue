<template>
  <el-form :model="prop" ref="propForm" label-position="left" size="mini">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="交叉表属性" name="1">
            <el-form-item label="标题" label-width="70px">
              <el-input v-model="prop.title" @blur="changevalue('title')"></el-input>
            </el-form-item>
            <el-form-item label="是否显示标题" label-width="170px">
              <el-switch v-model="prop.showtitle" @change="changevalue('showtitle')"></el-switch>
            </el-form-item>
            <el-form-item label="交叉表下钻" label-width="170px">
              <el-switch v-model="prop.usedrill" @change="changevalue('usedrill')"></el-switch>
            </el-form-item>
            <template v-if="prop.usedrill == true">
            <el-form-item label="钻取维" label-width="70px">
              <el-select v-model="prop.drillDim" placeholder="请选择" style="width:100%">
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
        drillDim:""
      },
      cols:[]
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
      p.showtitle = c.showtitle;
      p.usedrill = c.usedrill;
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
      }
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  
</style>
