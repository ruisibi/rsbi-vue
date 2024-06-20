<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="$t('message.report.chart.title')" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		
			<div class="row">
			<div class="col-sm-3">
				<ul>
				<template v-for="item in charts">
					<li :key="item.cid" :class="item.show?'select':''" @click="selectchart(item.cid)">{{item.cname}}</li>
				</template>
				</ul>
			</div>
			<div class="col-sm-9">
				<template v-for="item in charts">
					<div class="one" :key="item.cid"  v-show="item.show">
						<template v-for="c in item.children">
						<span :key="c.index">
							<img :src="require('../../assets/chart/' + c.img)">
							<br/>
							{{ c.name }}
						</span>
						</template>
						<template v-if="item.type == 'map'">
							 <el-select v-model="mapArea" :placeholder="$t('message.report.chart.maparea')" style="width:100%">
								<el-option
								v-for="item in opts.areas"
								:key="item.code"
								:label="item.name"
								:value="item.code">
								</el-option>
							</el-select>
						</template>
					</div>
				</template>
			</div>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
			<el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
		</div>
  </el-dialog>
</template>

<script>
	import {ajax} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show:false,
				mapArea:"china",
				mapAreaname:null,
				opts:{
					areas:[{code:"china",name:this.$t('message.report.chart.china')}]
				},
				chart:null,
				charts:[
					{cid:"1", cname:this.$t('message.report.chart.line'), type:"line",show:true,children:[
						{img:"c1.gif", index:"1", name:this.$t('message.report.chart.line1')}
					]},
					{cid:"2", cname:this.$t('message.report.chart.column'),type:"column",show:false,children:[
						{img:"c2.gif",  index:"1", name:this.$t('message.report.chart.column1')}
					]},
					{cid:"3", cname:this.$t('message.report.chart.bar'),type:"bar",show:false,children:[
						{img:"bar.gif",  index:"1", name:this.$t('message.report.chart.bar1')}
					]},
					{cid:"4", cname:this.$t('message.report.chart.area'),type:"area",show:false,children:[
						{img:"area.gif", index:"1", name:this.$t('message.report.chart.area1')}
					]},
					{cid:"5", cname:this.$t('message.report.chart.pie'),type:"pie", show:false,children:[
						{img:"c3.gif", index:"1", name:this.$t('message.report.chart.pie1')}
					]},
					{cid:"6", cname:this.$t('message.report.chart.gauge'),type:"gauge",show:false,children:[
						{img:"c4.gif", index:"1", name:this.$t('message.report.chart.gauge1')}
					]},
					{cid:"7", cname:this.$t('message.report.chart.radar'), type:"radar", show:false,children:[
						{img:"c5.gif",  index:"1", name:this.$t('message.report.chart.radar1')}
					]},
					{cid:"8", cname:this.$t('message.report.chart.scatter'),type:"scatter",show:false,children:[
						{img:"c6.gif",  index:"1", name:this.$t('message.report.chart.scatter1')}
					]},
					{cid:"9", cname:this.$t('message.report.chart.bubble'),type:"bubble",show:false,children:[
						{img:"c7.gif",  index:"1", name:this.$t('message.report.chart.bubble1')}
					]},
					{cid:"10", cname:this.$t('message.report.chart.map'),type:"map", show:false,children:[
						{img:"c8.gif", index:"1", name:this.$t('message.report.chart.map1')}
					]},
				]
			}
		},
		mounted(){
			this.initAreas();
		},
		computed: {
		},
		methods: {	
			initAreas(){
				let ts = this;
				ajax({
					url:"bireport/listAreas.action",
					data:{},
					type:"GET",
					success:(resp)=>{
						$(resp.rows).each((a, b)=>{
							ts.opts.areas.push(b);
						});
					}

				}, this);
			},
			save(){
				this.show = false;
				let tp = null;
				$(this.charts).each((a, b)=>{
					if(b.show === true){
						tp = b.type;
					}
				});
				this.chart.chartJson.type = tp;
				if(tp === 'map'){
					this.chart.chartJson.maparea = this.mapArea;
				}
				this.$parent.resetChart();
				//重新绑定拖拽事件
				this.$parent.initChartKpiDrop(2);
				this.$parent.chartView();
				this.$parent.setUpdate();
			},
			
			open(chart){
				this.show = true;
				this.chart = chart;
			},
			selectchart(chartId){
				$(this.charts).each((a, b)=>{
					if(b.cid == chartId){
						b.show = true
					}else{
						b.show = false;
					}
				});
			},
			
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
.one{
	margin:10px;
	padding:10px;
	cursor:pointer;
	text-align:left;
	span {
		width:130px;
		height:143px;
		display:inline-block;
		margin-right:10px;
		overflow:hidden;
		text-align:center;
		cursor:pointer;
	}
}
.row {
	ul {
		margin:0px;
		padding:0px;
		li {
			margin:0px;
			padding:6px;
			background-color:#EEE;
			border-bottom:solid 1px #CCCCCC;
			cursor:pointer;
			list-style: none;
		}
		li.select {
			background-color:#FFF;
		}
	}
}
</style>
