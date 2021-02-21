<template>
  <div class="wrapper-content-nomargin">
    <el-menu @select="handleSelect" class="el-menu-demo" background-color="#f6f8f8" text-color="#777" mode="horizontal">
			<el-submenu index="3">
				<template slot="title"><i class="fa fa-file-excel-o"></i> 导出</template>
				<el-menu-item index="html">HTML</el-menu-item>
				<el-menu-item index="csv">CSV</el-menu-item>
				<el-menu-item index="excel">EXCEL</el-menu-item>
				<el-menu-item index="word">WORD</el-menu-item>
				<el-menu-item index="pdf">PDF</el-menu-item>
			</el-submenu>
			<el-menu-item index="4"><i class="fa fa-print"></i> 打印</el-menu-item>
		</el-menu>
    <!-- 参数区域 -->
    <portal-param-view ref="paramViewForm" :showSearchBtn="true" :pms="pms"></portal-param-view>
    <!-- 组件区域 -->
    <layout-view ref="optarea" :pageInfo="pageInfo"></layout-view>
   
  </div>
</template>
<script>
import {baseUrl, ajax} from '@/common/biConfig'
import { Loading } from 'element-ui'
import LayoutView from './LayoutView.vue'
import PortalParamView from './PortalParamView.vue'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'

export default {
  name: "portalMain",
  components: {
    LayoutView,
    PortalParamView
  },
  props: {

  },
  data() {
    return {
      reportId:null,
      pageInfo:{},
      pms:[]
    }
  },

  methods: {
    handleSelect(key, keyPath){
      if(key === '4'){  //打印
          let p = this.$refs['paramViewForm'].getParamValues();
          p.id = this.reportId;  //参数
          let routeData = this.$router.resolve({path:"/portal/Print", query:p});
          window.open(routeData.href, '_blank');
      }else if(key === 'html' || key === 'csv' || key === 'excel' || key === 'pdf' || key === 'word'){  //导出
        this.exportReport(key);
      }
    },
    getCfg(){
      ajax({
        url:"portal/get.action",
        data:{pageId:this.reportId},
        type:"get",
        success:(resp)=>{
          this.pageInfo = JSON.parse(resp.rows);
          this.getReport();
        }
      });
    },
    getReport(){
      let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('.wrapper-content-nomargin')});
      ajax({
        url:"portal/view.action",
        type:"GET",
        data:{pageId:this.reportId},
        success:(resp)=>{
          //渲染组件
          this.$refs['optarea'].setCompData(resp.rows);
          this.pms = resp.rows.pms;
        }
      }, this, loadingInstance);
    },
    exportReport(tp){
      let pageId = this.reportId;
      let burl = baseUrl;
      var ctx = `
      <form name='expff' method='post' action="${burl}/portal/export.action" id='expff'>
      <input type='hidden' name='type' id='type' value='${tp}'>
      <input type='hidden' name='pageId' id='pageId' value='${pageId}'>
      <input type='hidden' name='picinfo' id='picinfo'>
      `;
      let pms = this.$refs['paramViewForm'].getParamValues();
      $(this.pageInfo.params).each((a, b)=>{
        let v = pms[b.id];
        ctx += `<input type='hidden' name='${b.id}' value="${v}">`;
      });
      ctx += `</form>`;
      if($("#expff").length == 0 ){
        $(ctx).appendTo("body");
      }
      //把图形转换成图片
      var strs = "";
      if(tp == "pdf" || tp == "excel" || tp == "word"){
        let comps = utils.findAllComps(this.pageInfo).filter(m=>m.type ==='chart');
        $(comps).each(function(index, element) {
          var id = element.id;
          var chart = echarts.getInstanceByDom(document.getElementById("ct_"+id));
          var str = chart.getDataURL({type:'png', pixelRatio:1, backgroundColor: '#fff'});
          str = str.split(",")[1]; //去除base64标记
          str = element.id + "," + str+","+$("#ct_"+id).width(); //加上label标记,由于宽度是100%,需要加上宽度
          strs = strs  +  str;
          if(index != comps.length - 1){
            strs = strs + "@";
          }
        });
      }
      $("#expff #picinfo").val(strs);
      $("#expff").submit().remove();
    }
  },
  mounted(){
    this.reportId = this.$route.query.id;
    this.getCfg();
  },
  computed:{
    getReportId:function(){
      return this.$route.query.id;
    }
  },
  watch: {
    getReportId:{  //监控参数变化
      handler(val){
        this.reportId = val;
        this.getCfg();
      },
      immediate: true
    }
  },
  /**
  beforeRouteLeave: function(to, from, next) {
    this.$destroy();
    next();
  }
   */
}
</script>
<style lang="less" scoped>

</style>
