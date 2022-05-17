<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog title="选择图形类型" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		
		<div class="row">
			<div class="col-sm-3">
				<ul>
				<template v-for="item in charts">
					<li :key="item.cid" :class="item.show==true?'select':''" @click="selectchart(item.cid)">{{item.cname}}</li>
				</template>
				</ul>
			</div>
			<div class="col-sm-9">
				<template v-for="item in charts">
					<div class="one" :key="item.cid"  v-show="item.show">
						<template v-for="c in item.children">
						<span :key="item.type + c.index" :class="c.select===true?'select':''" @click="selectone(c.index, item.type)">
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
	import {ajax, newGuid} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show:false,
				mapArea:"china",
				mapAreaname:null,
				layoutId:null,
				comp:null,
				opts:{
					areas:[{
						code:"china",name:"全国"
					}]
				},
				charts:[
					{cid:"1", cname:"曲线图", type:"line",show:false,children:[
						{img:"c1.gif", index:"1", name:"曲线图", select:true},
						{img:"c12.gif", index:"2", name:"双轴曲线图"}
					]},
					{cid:"2", cname:"柱状图",type:"column",show:false,children:[
						{img:"c2.gif",  index:"1", name:"柱状图"},
						{img:"c22.gif", index:"2", name:"双轴柱状图"},
						{img:"c23.gif",  index:"3", name:"堆积图"},
						{img:"c24.gif", index:"4", name:"双轴堆积图"}
					]},
					{cid:"3", cname:"条形图",type:"bar",show:false,children:[
						{img:"bar.gif",  index:"1", name:"条形图"}
					]},
					{cid:"4", cname:"面积图",type:"area",show:false,children:[
						{img:"area.gif", index:"1", name:"面积图"}
					]},
					{cid:"5", cname:"饼图",type:"pie", show:false,children:[
						{img:"c3.gif", index:"1", name:"饼图"},
						{img:"c32.gif", index:"2", name:"环形图"},
						{img:"c33.gif", index:"3", name:"嵌套环形图"}
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
						{img:"c8.gif", index:"1", name:"地图"},
						{img:"c82.gif", index:"2", name:"地图散点图"}
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
				var ts = this;
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
				let index = null;
				$(this.charts).each((a, b)=>{
					$(b.children).each((c, d)=>{
						if(d.select === true){
							tp = b.type;
							index = d.index;
						}
					});
				})
				if(this.comp){
					let comp = this.comp;
					comp.chartJson.type = tp;
					comp.chartJson.maparea = this.mapArea;
					comp.chartJson.typeIndex = index;
					this.$parent.$refs['mv_'+comp.id].chartView();
				}else{
					var compId = newGuid();
					var name = "图表";
					var comp = {"id":compId, "name":name, "type":"chart"};
					comp.chartJson = {"type":tp, maparea:this.mapArea, typeIndex:index, xcol:{}, ycol:{}, scol:{}, params:[],height:tp == 'map' ? '400':'250'};
					comp.kpiJson = [null, null, null];

					this.$parent.addComp(this.layoutId, comp);
					this.$parent.$forceUpdate();
				}
			},
			insertChart(layoutId){
				this.layoutId = layoutId;
				this.show = true;
				this.comp = null;
				//选中第一个
				$(this.charts).each((a, b)=>{
					b.show=false;
					$(b.children).each((c, d)=>{
						d.select = false;
					});
				});
				this.charts[0].show = true;
				this.charts[0].children[0].select = true;
			},
			//更改图形类型
			changeType(comp){
				this.show = true;
				this.comp = comp;
				let type = comp.chartJson.type;
				let index = comp.chartJson.typeIndex;
				$(this.charts).each((a, b)=>{
					b.show=false;
					$(b.children).each((c, d)=>{
						d.select = false;
					});
				});
				//选中值
				$(this.charts).each((a, b)=>{
					$(b.children).each((c, d)=>{
						if(b.type === type && d.index == index){
							d.select = true;
							b.show = true;
							return false;
						}
					});
				})
				this.mapArea = comp.chartJson.maparea;
				this.$forceUpdate();
			},
			selectchart(chartId){
				$(this.charts).each((a, b)=>{
					$(b.children).each((c, d)=>{
						d.select = false;
					});
				})

				$(this.charts).each((a, b)=>{
					if(b.cid == chartId){
						b.show = true
						//选中第一个
						b.children[0].select = true;
					}else{
						b.show = false;
					}
					this.$forceUpdate();
				});
				
			},
			selectone(index, type){
				$(this.charts).each((a, b)=>{
					$(b.children).each((c, d)=>{
						if(b.type === type && d.index == index){
							d.select = true;
						}else{
							d.select = false;
						}
					});
				})
				this.$forceUpdate();
			}
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
	span.select {
			border:solid 1px #666;
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
			text-align: left;
		}
		li.select {
			background-color:#FFF;
		}
	}
}
</style>
