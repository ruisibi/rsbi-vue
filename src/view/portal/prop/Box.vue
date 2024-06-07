<template>
  <el-form :model="prop" ref="propForm" label-position="left" size="mini">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('message.report.box.text')" name="1">
            <el-form-item :label="$t('message.report.box.title')" label-width="70px">
              <el-input v-model="prop.title" @blur="changevalue('title')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.box.unit')" label-width="70px">
              <el-input v-model="prop.unit" @blur="changevalue('unit')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.box.fmt')" label-width="70px">
               <el-select v-model="prop.fmt" :placeholder="$t('message.base.select')" @change="changevalue('fmt')">
                  <el-option
                    v-for="item in opts.fmt"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.report.box.rate')" label-width="70px">
               <el-select v-model="prop.rate" :placeholder="$t('message.base.select')" @change="changevalue('rate')">
                  <el-option
                    v-for="item in opts.rates"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.report.box.fontsize')" label-width="70px">
              <el-slider v-model="prop.tfontsize" :max="99" :min="9" @change="changevalue('tfontsize')"></el-slider>
            </el-form-item>
            <el-form-item :label="$t('message.report.box.color')" label-width="180px">
              <el-color-picker v-model="prop.tfontcolor" @change="changevalue('tfontcolor')"></el-color-picker>
            </el-form-item>
            <el-form-item :label="$t('message.report.box.bgcolor')" label-width="180px">
              <el-color-picker v-model="prop.bgcolor" @change="changevalue('bgcolor')"></el-color-picker>
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
        title:null,
        unit:null,
        fmt:null,
        rate:null,
        tfontsize:32,
        tfontcolor:null,
        bgcolor:null
      },
      opts:{
        fmt:utils.fmtJson,
        rates: utils.rates
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
      if(c.kpiJson){
        p.unit = c.kpiJson.unit;
        p.fmt = c.kpiJson.fmt;
        p.rate = c.kpiJson.rate;
        p.tfontsize = c.kpiJson.tfontsize;
        p.tfontcolor = c.kpiJson.tfontcolor;
      }
      p.bgcolor = c.bgcolor;
    },
    boxView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].boxView();
    },
    compRender(){
      this.$parent.$parent.$refs['optarea'].$forceUpdate();
    },
    changevalue(prop){
      let c = this.comp;
      let v = this.prop[prop];
      if(prop === 'title'){
        c.name = v;
      }else if(prop === 'unit' || prop === 'fmt' || prop == 'rate' || prop === 'tfontsize' || prop === 'tfontcolor'){
        if(!c.kpiJson){
          return;
        }
        c.kpiJson[prop] = v;
        this.boxView();
      }else if(prop === 'bgcolor'){
        this.comp[prop] = v;
        this.compRender();
      }
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  
</style>
