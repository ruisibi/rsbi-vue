<template>
  <el-form :model="prop" ref="propForm" label-position="left" size="mini">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('message.report.chartProp.title')" name="1">
        <el-form-item :label="$t('message.report.chartProp.title2')" label-width="70px">
          <el-input v-model="prop.title" @blur="changevalue('title')"></el-input>
        </el-form-item>
        <template v-if="ctp != 'gauge'">
          <el-form-item :label="$t('message.report.chartProp.showLegend')" label-width="170px">
            <el-switch v-model="prop.showLegend" @change="changevalue('showLegend')"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('message.report.chartProp.legendpos')" label-width="70px">
              <el-select v-model="prop.legendpos" :placeholder="$t('message.base.select')" @change="changevalue('legendpos')">
                <el-option
                  v-for="item in opts.legendpos"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.report.chartProp.legendLayout')" label-width="100px">
            <el-radio-group v-model="prop.legendLayout" size="mini" @change="changevalue('legendLayout')">
            <el-radio-button label="vertical">{{ $t('message.report.chartProp.vertical') }}</el-radio-button>
            <el-radio-button label="horizontal">{{ $t('message.report.chartProp.horizontal') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-if="ctp == 'line' || ctp == 'area' || ctp == 'radar'">
         <el-form-item :label="$t('message.report.chartProp.markerEnabled')" label-width="170px">
          <el-switch v-model="prop.markerEnabled" @change="changevalue('markerEnabled')"></el-switch>
         </el-form-item>
        </template>
         <template v-if="ctp == 'line' || ctp == 'column' || ctp == 'area' || ctp == 'bar' || ctp =='scatter' || ctp == 'bubble' || ctp =='map'">
          <el-form-item :label="$t('message.report.chartProp.marginLeft')" label-width="70px">
            <el-slider v-model="prop.marginLeft" :max="300" :min="1" @change="changevalue('marginLeft')"></el-slider>
          </el-form-item>
          <el-form-item :label="$t('message.report.chartProp.marginRight')" label-width="70px">
            <el-slider v-model="prop.marginRight" :max="300" :min="1" @change="changevalue('marginRight')"></el-slider>
          </el-form-item>
          <el-form-item :label="$t('message.report.chartProp.dataLabel')" label-width="170px">
            <el-switch v-model="prop.dataLabel" @change="changevalue('dataLabel')"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('message.report.chartProp.dataLabelColor')" label-width="180px">
              <el-color-picker v-model="prop.dataLabelColor" @change="changevalue('dataLabelColor')"></el-color-picker>
            </el-form-item>
            <template v-if="ctp === 'pie'">
                <el-form-item :label="$t('message.report.chartProp.labelType')" label-width="106px">
                    <el-select v-model="prop.labelType" :placeholder="$t('message.base.select')" @change="changevalue('labelType')">
                      <el-option
                        v-for="item in opts.pielabels"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                </el-form-item>
            </template>
          </template>
      </el-collapse-item>
      <el-collapse-item :title="$t('message.report.chartProp.xcol')" name="3">
        <el-form-item :label="$t('message.report.chartProp.xdispName')" label-width="70px">
          <el-input v-model="prop.xdispName" @blur="changevalue('xdispName')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.report.chartProp.tickInterval')" label-width="70px">
          <el-slider v-model="prop.tickInterval" :max="20" :min="0" @change="changevalue('tickInterval')"></el-slider>
        </el-form-item>
         <el-form-item :label="$t('message.report.chartProp.routeXaxisLable')" label-width="70px">
          <el-slider v-model="prop.routeXaxisLable" :max="360" :min="0" @change="changevalue('routeXaxisLable')"></el-slider>
        </el-form-item>
        <el-form-item :label="$t('message.report.chartProp.top')" label-width="70px">
          <el-slider v-model="prop.top" :max="100" :min="1" @change="changevalue('top')"></el-slider>
        </el-form-item>
      </el-collapse-item>
       <el-collapse-item :title="$t('message.report.chartProp.ycol')" name="2">
             <el-form-item :label="$t('message.report.chartProp.ydispName')" label-width="70px">
              <el-input v-model="prop.ydispName" @blur="changevalue('ydispName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.chartProp.unit')" label-width="70px">
              <el-input v-model="prop.unit" @blur="changevalue('unit')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.chartProp.fmt')" label-width="70px">
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
            <template v-if="!(ctp == 'pie' || ctp == 'scatter' || ctp == 'bubble' || ctp == 'map' || ctp == 'radar')">
              <el-form-item :label="$t('message.report.chartProp.min')" label-width="80px">
                <el-input-number v-model="prop.min" size="small" @change="changevalue('min')" :precision="2"></el-input-number>
              </el-form-item>
            </template>
            <template v-if="ctp == 'gauge'">
              <el-form-item :label="$t('message.report.chartProp.max')" label-width="80px">
                  <el-input-number v-model="prop.max" size="small" @change="changevalue('max')" :precision="2"></el-input-number>
                </el-form-item>
            </template>
            <el-form-item :label="$t('message.report.chartProp.rate')" label-width="70px">
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
       </el-collapse-item>
       <template v-if="isy2()">
        <el-collapse-item :title="$t('message.report.chartProp.y2')" name="4">
            <el-form-item :label="$t('message.report.chartProp.y2dispName')" label-width="70px">
              <el-input v-model="prop.y2dispName" @blur="changevalue('y2dispName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.chartProp.unit2')" label-width="70px">
                <el-input v-model="prop.unit2" @blur="changevalue('unit2')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('message.report.chartProp.fmt2')" label-width="70px">
                <el-select v-model="prop.fmt2" :placeholder="$t('message.base.select')" @change="changevalue('fmt2')">
                    <el-option
                      v-for="item in opts.fmt"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('message.report.chartProp.rate2')" label-width="70px">
                <el-select v-model="prop.rate2" placeholder="请选择" @change="changevalue('rate2')">
                    <el-option
                      v-for="item in opts.rates"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
              </el-form-item>
              <template v-if="(ctp == 'column' || ctp == 'line') && (typeIndex==2 || typeIndex==4)">
              <el-form-item :label="$t('message.report.chartProp.mergeData')" label-width="170px">
                <el-switch v-model="prop.mergeData" @change="changevalue('mergeData')"></el-switch>
              </el-form-item>
              </template>
        </el-collapse-item>
       </template>
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
        required:true,
        default:{}
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
        showLegend:false,
        legendLayout:"horizontal",
        markerEnabled:false,
        marginLeft:65,
        marginRight:10,
        dataLabel:false,
        dataLabelColor:null,
        xdispName:"",
        tickInterval:null,
        routeXaxisLable:null,
        top:null,
        ydispName:"",
        min:null,
        max:null,
        labelType:null,
        y2dispName:null,
        unit2:null,
        fmt2:null,
        rate2:null,
        mergeData:null
      },
      ctp:null, //图形类型
      typeIndex:null, //选择的第几个图
      opts:{
        fmt:utils.fmtJson,
        rates: utils.rates,
        legendpos:utils.legendpos,
        pielabels:utils.pielabels
      }
    }
  },
  mounted(){
    
  },
  computed: {
  },
  methods: {
    //是否显示y2
    isy2(){
      let ctp = this.ctp;
      let typeIndex = this.typeIndex;
      if(ctp =="scatter" || ctp == "bubble"){  	//散点图或气泡图需要y2轴的属性
        return true;
      }
      if((ctp == 'column' || ctp == 'line') && (typeIndex==2 || typeIndex==4)){   //双坐标设置第二坐标
        return true;
      }
    },
    init(){
      let p = this.prop;
      let c = this.comp;
      p.title = c.name;
      this.ctp = c.chartJson.type;
      this.typeIndex = c.chartJson.typeIndex;
      if(c.chartJson.xcol){
        p.xdispName = c.chartJson.xcol.xdispName;
      }
    },
    chartView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].chartView();
    },
    compRender(){
      this.$parent.$parent.$refs['optarea'].$forceUpdate();
    },
    changevalue(prop){
      let c = this.comp;
      let v = this.prop[prop];
      let col = prop;
      if(prop === 'title'){
        c.name = v;
        this.$parent.$forceUpdate();
      }else if(col === 'showLegend' || col == "legendLayout" || col == "legendpos" || col == "dataLabel"  || col ==='dataLabelColor' || col == "markerEnabled" || col == "marginLeft" || col == "marginRight"){
        c.chartJson[prop] = v;
        this.chartView();
      }else if(col == "tickInterval" || col == "routeXaxisLable" || col == "xdispName" || col == "top"){
        c.chartJson.xcol[prop] = v;
         this.chartView();
      }else if(col == "ydispName" || col == "unit" || col == "fmt" || col == "min" || col == "max" || col == "rate"){
        var o = c.kpiJson[0];
        o[col] = v;
        this.chartView();
      }else if(col == "y2dispName" || col == "unit2" || col == "fmt2" || col == "rate2" || col == "mergeData"){	//处理y2col y2轴
        var o = c.kpiJson[1];
				
				if(col == "y2dispName"){
					o.ydispName = v;
				}else if(col == "unit2"){
					o.unit = v;
				}else if(col == "fmt2"){
					o.fmt = v;
				}else if(col == "rate2"){
					o.rate = v;
				}else if(col == "mergeData"){
					o.mergeData = v;
        }     
        this.chartView();
      }

    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  
</style>
