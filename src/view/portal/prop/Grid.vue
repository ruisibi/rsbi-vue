<template>
  <el-form :model="prop" ref="propForm" label-position="left" size="mini">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('message.report.gridProp.name')" name="1">
            <el-form-item :label="$t('message.report.gridProp.title')" label-width="70px">
              <el-input v-model="prop.title" @blur="changevalue('title')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.gridProp.showtitle')" label-width="170px">
              <el-switch v-model="prop.showtitle" @change="changevalue('showtitle')"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('message.report.gridProp.isnotfy')" label-width="170px">
              <el-switch v-model="prop.isnotfy" @change="changevalue('isnotfy')"></el-switch>
            </el-form-item>
            <template v-if="!(prop.isnotfy === true)">
            <el-form-item :label="$t('message.report.gridProp.pageSize')" label-width="80px">
               <el-input-number size="small" v-model="prop.pageSize" @change="changevalue('pageSize')"></el-input-number>
            </el-form-item>
            </template>
      </el-collapse-item>
      
    </el-collapse>
  </el-form>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
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
        isnotfy:null,
        pageSize:10
      }
    }
  },
  mounted(){
    
  },
  computed: {
  },
  methods: {
    init(){
      let p = this.prop;
      let c = this.comp;
      p.title = c.name;
      if(c.showtitle != null){
        p.showtitle = c.showtitle;
      }
      if(c.pageSize){
        p.pageSize = c.pageSize;
      }
      p.isnotfy = c.isnotfy;
    },
    gridView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].gridView();
    },
    compRender(){
      this.$parent.$parent.$refs['optarea'].$forceUpdate();
    },
    changevalue(prop){
      let c = this.comp;
      let v = this.prop[prop];
      if(prop === 'title'){
        c.name = v;
      }else if(prop === 'showtitle'){
        c.showtitle = v;
      }else if(prop === 'pageSize' || prop === 'isnotfy'){
        c[prop] = v;
        this.gridView();
      }
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  
</style>
