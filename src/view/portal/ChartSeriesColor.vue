<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		
		<div align="left">
			
			<template v-for="(item, index) in colors">
				<span :key="item" :class="index===cidx - 1 ?'selcolor':''">
					<span :style="'background-color:'+item+';'" class="seriesColor" @click="select(index + 1)"></span>
				</span>
			</template>
			<br/>
					<button class="btn btn-info btn-sm" @click="usedef()">使用默认色</button>

		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="show = false">关 闭</el-button>
		</div>
  </el-dialog>
</template>

<script>
	import {ajax, newGuid} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show:false,
				comp:null,
				title:null,
				colors:[],
				chartParams:null,
				cidx:1
			}
		},
		mounted(){
			this.loadColors();
		},
		computed: {
		},
		methods: {	
			showDailog(comp, chartParams){
				this.comp = comp;
				if(comp.chartJson.type == "pie" || comp.chartJson.type == "map"){
					return;
				}
				this.chartParams = chartParams;
				this.show = true;
				this.title = chartParams.seriesName + " - 设置系列颜色";
				let t = comp.colors[chartParams.seriesName];
				if(t){
					this.cidx = t;
				}
			},
			loadColors(){
				ajax({
					url:"portal/chartColors.action",
					data:{},
					type:"GET",
					success:(resp)=>{
						this.colors = resp.rows;
					}
				});
			},
			select(colorIdx){
				let comp = this.comp;
				if(!comp.colors){
					comp.colors = {};
				}
				comp.colors[this.chartParams.seriesName] = colorIdx;
				this.show = false;
				this.$parent.setUpdate();
				this.$parent.$refs['mv_'+comp.id].chartView();
			},
			usedef(){
				let comp = this.comp;
				if(comp.colors){
					delete comp.colors[this.chartParams.seriesName];
					this.show = false;
				}
				this.$parent.setUpdate();
				this.$parent.$refs['mv_'+comp.id].chartView();
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
.seriesColor {
	width: 16px;
	height: 16px;
	padding: 5px;
	display:inline-block;
	cursor:pointer;
	margin:5px;
}
.selcolor {
	border:1px solid #990000;
	height:30px;
	display:inline-block;
}
</style>
