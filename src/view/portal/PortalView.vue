<template>
  <div class="wrapper-content-nomargin">
    <el-menu @select="handleSelect" class="el-menu-demo" background-color="#f6f8f8" text-color="#777" mode="horizontal">
			<el-menu-item index="1"><i class="fa fa-arrow-left"></i> 返回</el-menu-item>
      <el-menu-item index="2"><i class="fa fa-edit"></i> 定制</el-menu-item>
			<el-submenu index="3">
				<template slot="title"><i class="fa fa-file-excel-o"></i> 导出</template>
        <!--
				<el-menu-item index="html">HTML</el-menu-item>
        -->
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
      if(key === '1'){
         this.$router.push("/portal/Index");
      }else if(key === '2'){  //定制
         this.$router.push({path:"/portal/Customiz", query:{id:this.reportId}});
      }else if(key === '4'){  //打印
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
      }, this);
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
          let urlParam = JSON.parse(JSON.stringify(this.$route.query));
					delete urlParam.id;
          this.$refs['paramViewForm'].initReportParam(urlParam, this.pms);
        }
      }, this, loadingInstance);
    },
    exportReport(tp){
      let paramViewForm = this.$refs['paramViewForm'];;
      utils.exportReport(tp, this.reportId, paramViewForm, this.pageInfo);
    }
  },
  mounted(){
    this.reportId = this.$route.query.id;
    this.getCfg();
  },
  watch: {

  },
  beforeRouteLeave: function(to, from, next) {
    this.$destroy();
    next();
  }
}
</script>
<style lang="less" scoped>

</style>
