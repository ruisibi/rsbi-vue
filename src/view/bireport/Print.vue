<template>
  <div>
	  <el-button mini round v-show="back" @click="backpage()"><i class="fa fa-arrow-left"></i></el-button>
	  <reportTablePrint ref="tableForm"></reportTablePrint>
	  <div id="printChart2"></div>
  </div>
</template>

<script>
	import {ajax, loopChartJson} from '@/common/biConfig'
	import $ from 'jquery'
	import { Loading } from "element-ui";
	import reportTablePrint from "@/view/bireport/ReportTablePrint";
	import * as echartsUtils from '@/common/echartsUtils'

	export default {
	    data(){
			return {
				back:false,
				type:null,
				chartId:2
			}
		},
		components: {
			reportTablePrint
		},
		mounted(){
			this.pageInfo = this.$route.params.json;
			this.type = this.$route.params.type;
			this.printReport();
			//图形对象
			window.echartsUtils = echartsUtils;
			var echarts = require('echarts');
			window.echarts = echarts;
		},
		beforeDestroy(){
			delete window.echartsUtils;
			delete window.echarts;
		},
		computed: {
		},
		methods: {	
			printReport(){
				window.document.title = "多维分析表格打印";
				if(this.type === 'table'){ 
					this.$refs['tableForm'].tableView(this.pageInfo, ()=>{
						setTimeout(()=>{
							window.print();
							this.back = true;
						}, 2000);
					});
				}else{  //打印图形
					let load = Loading.service({ fullscreen: true });
					ajax({
						url:"bireport/print.action",
						data:{pageInfo:JSON.stringify(this.pageInfo)},
						type:"POST",
						success:(resp)=>{
							let option = loopChartJson(resp.rows.comp);
							let myChart = echarts.getInstanceByDom(document.getElementById('printChart'+this.chartId));
							if(!myChart){
								myChart = echarts.init(document.getElementById('printChart'+this.chartId), "default", {width:640, height:320});
							}
							myChart.setOption(option, true);
							setTimeout(()=>{
								window.print();
								this.back = true;
							}, 2000);
						}
					},this, load);
				}
			},
			backpage(){
				this.$router.go(-1);
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
