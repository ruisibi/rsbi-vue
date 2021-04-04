<script>
import {baseUrl, ajax, loopChartJson} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'
import { Loading } from 'element-ui'
import * as echartsUtils from '@/common/echartsUtils'

export default {
  components:{    
  },
  data(){
    return {
      data:null,
      islink:false //是否做了事件联动
    }
  },
  props:{
      comp:{
        type:Object,
        required:true,
        default:{}
      },
      editor:{
        type:Boolean,
        required:true,
        default:true
      },
      portalParams:{
        type:Array,
        required:false
      }
  },
  render(h){
    let ts = this;
    let comp = this.comp;
    if(this.data){
      let height = comp && comp.height?comp.height:250;
      let ch = h('div', {attrs:{id:"ct_"+comp.id}, style:{width:'100%', height: height + "px"}});
      if(this.islink == true){  //添加返回按钮
        return h('div', [h('span', {class:"eventback"}, [h('span', {class:"label label-success", on:{click:()=>{
          this.linkBack();
        }}, domProps:{innerHTML:"<i class=\"fa fa-arrow-left\"></i>返回"}})]), ch]);
      }else{
        return h('div', [ch]);
      }
    }else{
      if(this.editor === true){
        return h('div', {attrs:{align:"center", class:"tipinfo"}, domProps:{innerHTML:"(点击<i class=\"fa fa-wrench\"></i>按钮配置"+utils.getCompTypeDesc(comp.type)+")"}});
      }else{
        return h('div','数据加载中...');
      }
    }
  },
  mounted(){
    if(this.editor === true){
      this.chartView();
    }
    //放入window对象
    window.echartsUtils = echartsUtils;
    var echarts = require('echarts');
    window.echarts = echarts;
  },
  computed: {
  },
  methods: {
    chartView(){
      let ts = this;
      let json = this.comp;

      if(json.kpiJson[0] == null){
        return;
      }
      if(json.chartJson.type == "scatter" && json.kpiJson[1] == null  ){
        return;
      }
      if(json.chartJson.type == "bubble" && json.kpiJson[2] == null  ){
        return;
      }

      json = JSON.parse(JSON.stringify(json));
      json.portalParams = ts.portalParams;
      let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+json.id+" div.ccctx")});
      ajax({
        url:"portal/ChartView.action",
        type:"POST",
        data:JSON.stringify(json),
        postJSON:true,
        success:(resp)=>{
          ts.data = resp.rows;
          loadingInstance.close();
          //ts.$forceUpdate();
          ts.$nextTick(()=>ts.showChart());
        }
      }, this, loadingInstance);
    },
    //事件点击返回按钮
    linkBack(){
      this.islink = false;
      utils.compBackEvent(this.comp.chartJson.link, this);
    },
    /**
     * 调用echarts渲染图形
     */
    showChart(){
      let ts = this;
      let comp = this.comp;

      const exec = ()=>{
        let option = loopChartJson(this.data);
        let myChart = echarts.getInstanceByDom(document.getElementById('ct_'+comp.id));
        if(!myChart){
          myChart = echarts.init(document.getElementById('ct_'+comp.id), "default");
        }
        myChart.setOption(option, true);
        if(this.editor === true){  //编辑模式，设置图形显示颜色
            myChart.off("click").on('click', function(params){
              ts.$parent.$refs['ChartSeriesColorForm'].showDailog(comp, params);
            });
        }else{  //浏览模式，设置图形点击事件
          if(comp.chartJson.link && comp.chartJson.link.target && comp.chartJson.link.target.length > 0){
            myChart.off("click").on('click', function(params){
                utils.compFireEvent(comp.chartJson.link, ts, comp.chartJson.link.paramName, params.name);
                ts.islink = true;
            });
          }
        }
      }
      if(comp.chartJson.type === 'map' && comp.chartJson.typeIndex == 2){
         var u = baseUrl + "chartjson/city-baidu.json";
         if($.isEmptyObject(echartsUtils.cityPosJson)){
            $.getJSON(u, {}, (cityjson)=>{
              for(let k in cityjson){
                echartsUtils.cityPosJson[k] = cityjson[k];
              }
              var u2 = baseUrl + "chartjson/"+comp.chartJson.maparea+".json";
                $.getJSON(u2, {}, (resp)=>{
                    echarts.registerMap(comp.chartJson.maparea, resp);
                    exec();
              });
            });
         }else{
              var u2 = baseUrl + "chartjson/"+comp.chartJson.maparea+".json";
                $.getJSON(u2, {}, (resp)=>{
                    echarts.registerMap(comp.chartJson.maparea, resp);
                    exec();
              });
         }
         
      }else if(comp.chartJson.type === 'map'){ //地图，需要加载地图JSON数据
         var u = baseUrl + "chartjson/"+comp.chartJson.maparea+".json";
         $.getJSON(u, {}, (resp)=>{
            echarts.registerMap(comp.chartJson.maparea, resp);
            exec();
         });
      }else{
        exec();
      }
    }
  },
  watch: {
    
  },
  beforeDestroy(){
    delete window.echartsUtils;
    delete window.echarts;
  }
}
</script>

<style lang="less" scoped>
.eventback {
	position:absolute;
	width:50px;
	right:5px;
  cursor:pointer;
  display:block;
	z-index:9999;
}
</style>
