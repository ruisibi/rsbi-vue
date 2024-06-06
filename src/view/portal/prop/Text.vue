<template>
  <el-form :model="prop" ref="propForm" label-position="left" size="mini">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('message.report.textProp.prop')" name="1">
            <el-form-item :label="$t('message.report.textProp.showtitle')" label-width="170px">
              <el-switch v-model="prop.showtitle" @change="changevalue('showtitle')"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('message.report.textProp.title')" label-width="70px">
              <el-input v-model="prop.title" @blur="changevalue('title')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.textProp.talign')" label-width="80px">
              <el-radio-group v-model="prop.talign" size="mini" @change="changevalue('talign')">
              <el-radio-button label="left">左</el-radio-button>
              <el-radio-button label="center">中</el-radio-button>
              <el-radio-button label="right">右</el-radio-button>
              </el-radio-group>
            </el-form-item>
             <el-form-item :label="$t('message.report.textProp.bgcolor')" label-width="180px">
              <el-color-picker v-model="prop.bgcolor" @change="changevalue('bgcolor')"></el-color-picker>
            </el-form-item>
      </el-collapse-item>
      <el-collapse-item :title="$t('message.report.textProp.font')" name="2">
            <el-form-item :label="$t('message.report.textProp.tfontsize')" label-width="70px">
              <el-slider v-model="prop.tfontsize" :max="99" :min="9" @change="changevalue('tfontsize')"></el-slider>
            </el-form-item>
            <el-form-item :label="$t('message.report.textProp.tfontcolor')" label-width="180px">
               <el-color-picker v-model="prop.tfontcolor" @change="changevalue('tfontcolor')"></el-color-picker>
            </el-form-item>
            <el-form-item :label="$t('message.report.textProp.tfontweight')" label-width="170px">
              <el-switch v-model="prop.tfontweight" @change="changevalue('tfontweight')"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('message.report.textProp.titalic')" label-width="170px">
              <el-switch v-model="prop.titalic" @change="changevalue('titalic')"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('message.report.textProp.tunderscore')" label-width="170px">
              <el-switch v-model="prop.tunderscore" @change="changevalue('tunderscore')"></el-switch>
            </el-form-item>
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
        showtitle:true,
        title:null,
        talign:"left",
        tfontsize:12,
        tfontcolor:null,
        tunderscore:null,
        titalic:null,
        tfontweight:null,
        bgcolor:null
      }
    }
  },
  mounted(){
    
  },
  computed: {
  },
  methods: {
    init(){
      this.prop.title = this.comp.name;
    },
    compRender(){
      this.$parent.$parent.$refs['optarea'].$forceUpdate();
    },
    changevalue(prop){
      let c = this.comp;
      let v = this.prop[prop];
      if(!c.style){
          c.style = {};
      }
      if(prop === 'title'){
        c.name = v;
      }else if(prop === 'showtitle'){
        c.showtitle = v;
      }else if(prop === 'talign' || prop === 'tfontsize' || prop ==='tfontcolor' || prop === 'tunderscore' 
        || prop ==='titalic' || prop ==='tfontweight'){
        c.style[prop] = v;
        this.compRender();
      }else if(prop === 'bgcolor'){
        c.bgcolor = v;
        this.compRender();
      }
    }
  },
  watch: {
    /**
    'prop.title':function(val){
      if(val != null){
        this.$props.comp.name = val;
      }
    },
    immediate: false
    **/
  }
}
</script>

<style lang="less" scoped>
  
</style>
