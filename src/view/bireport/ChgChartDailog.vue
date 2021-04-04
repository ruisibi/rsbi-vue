<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog title="切换图形类型" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		
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
							 <el-select v-model="mapArea" placeholder="请选择地图区域" style="width:100%">
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
			<el-button type="primary" @click="save()">确 定</el-button>
			<el-button @click="show = false">取 消</el-button>
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
					areas:[{code:"china",name:"全国"}]
				},
				chart:null,
				charts:[
					{cid:"1", cname:"曲线图", type:"line",show:true,children:[
						{img:"c1.gif", index:"1", name:"曲线图"}
					]},
					{cid:"2", cname:"柱状图",type:"column",show:false,children:[
						{img:"c2.gif",  index:"1", name:"柱状图"}
					]},
					{cid:"3", cname:"条形图",type:"bar",show:false,children:[
						{img:"bar.gif",  index:"1", name:"条形图"}
					]},
					{cid:"4", cname:"面积图",type:"area",show:false,children:[
						{img:"area.gif", index:"1", name:"面积图"}
					]},
					{cid:"5", cname:"饼图",type:"pie", show:false,children:[
						{img:"c3.gif", index:"1", name:"饼图"}
					]},
					{cid:"6", cname:"仪表盘",type:"gauge",show:false,children:[
						{img:"c4.gif", index:"1", name:"仪表盘"}
					]},
					{cid:"7", cname:"雷达图", type:"radar", show:false,children:[
						{img:"c5.gif",  index:"1", name:"雷达图"}
					]},
					{cid:"8", cname:"散点图",type:"scatter",show:false,children:[
						{img:"c6.gif",  index:"1", name:"散点图"}
					]},
					{cid:"9", cname:"气泡图",type:"bubble",show:false,children:[
						{img:"c7.gif",  index:"1", name:"气泡图"}
					]},
					{cid:"10", cname:"地图",type:"map", show:false,children:[
						{img:"c8.gif", index:"1", name:"地图"}
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
