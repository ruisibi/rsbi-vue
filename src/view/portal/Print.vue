<template>
  <div>
	<!-- 参数区域 -->
    <portal-param-view ref="paramViewForm" :showSearchBtn="false" :pms="pms"></portal-param-view>
    <!-- 组件区域 -->
    <layout-view ref="optarea" :pageInfo="pageInfo"></layout-view>
  </div>
</template>

<script>
	import {ajax, loopChartJson} from '@/common/biConfig'
	import $ from 'jquery'
	import { Loading } from "element-ui";
	import LayoutView from './LayoutView.vue'
	import PortalParamView from './PortalParamView.vue'

	export default {
	    data(){
			return {
				reportId:null,
				pageInfo:{},
      			pms:[]
			}
		},
		components: {
			 LayoutView,
    		PortalParamView
		},
		mounted(){
			window.document.title = "报表打印";
			this.reportId = this.$route.query.id;
			this.getCfg();
		},
		beforeDestroy(){
			
		},
		computed: {
		},
		methods: {
		
			getCfg(){
				ajax({
					url:"portal/get.action",
					data:{pageId:this.reportId},
					type:"get",
					success:(resp)=>{
						this.pageInfo = JSON.parse(resp.rows);
						//初始化参数字段
						let urlParam = JSON.parse(JSON.stringify(this.$route.query));
						delete urlParam.id;
						this.$refs['paramViewForm'].initReportParam(urlParam, this.pageInfo.params);
						this.getReport(urlParam);
					}
				});
			},
			getReport(urlParam){
				urlParam.pageId = this.reportId;
				let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('.wrapper-content-nomargin')});
				ajax({
					url:"portal/view.action",
					type:"GET",
					data:urlParam,
					success:(resp)=>{
						this.pms = resp.rows.pms;
						//渲染组件
						this.$refs['optarea'].setCompData(resp.rows);
						this.$nextTick(()=>{
							window.print();
						});
					}
				}, this, loadingInstance);
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
