<template>
  <div class="wrapper-content-nomargin">
     <!-- 参数区域 -->
    <portal-param-view ref="paramViewForm" :showSearchBtn="true" :pms="pms"></portal-param-view>
    <!-- 组件区域 -->
    <layout-view ref="optarea" :selfAdaption="true" :pageInfo="pageInfo"></layout-view>
   
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
      token:null,
      reportId:null,
      pageInfo:{},
      pms:[]
    }
  },

  methods: {
    getCfg(){
      ajax({
        url:"portal/share/get.action",
        data:{token:this.token},
        type:"get",
        success:(resp)=>{
          this.pageInfo = JSON.parse(resp.rows);
          this.reportId = this.pageInfo.id;
          this.getReport();
        }
      }, this);
    },
    getReport(){
      let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('.wrapper-content-nomargin')});
      ajax({
        url:"portal/share/view.action",
        type:"GET",
        data:{token:this.token},
        success:(resp)=>{
          //渲染组件
          this.$refs['optarea'].setCompData(resp.rows);
          this.pms = resp.rows.pms;
        }
      }, this, loadingInstance);
    }
  },
  mounted(){
    this.token = this.$route.query.token;
    this.getCfg();
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
