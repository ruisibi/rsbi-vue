<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog title="通过表格创建图形" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="chart" ref="chartForm" label-position="left">
			<el-form-item label="图表类型" label-width="100px">
				<el-select
					v-model="chart.type"
					placeholder="请选择"
					>
					<el-option
						v-for="item in opt.types"
						:key="item.value"
						:label="item.text"
						:value="item.value"
					>
				</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="横轴" label-width="100px">
				<el-select
					v-model="chart.xcol"
					placeholder="请选择"
					>
					<el-option
						v-for="item in opt.xcols"
						:key="item.value"
						:label="item.text"
						:value="item.value"
					>
				</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="图例" label-width="100px">
				<el-select
					v-model="chart.scol"
					placeholder="请选择"
					>
					<el-option
						v-for="item in opt.scols"
						:key="item.value"
						:label="item.text"
						:value="item.value"
					>
				</el-option>
				</el-select>
			</el-form-item>
		  </el-form>
			
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
				comp:null,
				chart:{
					type:"line",
					xcol:null,
					scol:null
				},
				opt:{
					types:[
						{value:'line', text:'曲线图'},
						{value:'column', text:'柱状图'},
						{value:'pie', text:'饼图'},
						{value:'area', text:'面积图'},
						{value:'bar', text:'条形图'},
						{value:'radar', text:'雷达图'}
					],
					cols:null,
					rows:null
				}
			}
		},
		mounted(){
			
		},
		computed: {
		},
		methods: {	
			save(){
				var ts = this;
				var tp = ts.chart.type;
				var comp = ts.comp;
				var xcol = ts.chart.xcol;
				var scol = ts.chart.scol;
				var chart = {id:2, name:"图表组件", type:"chart", chartJson:{type:tp,ycol:{type:"kpi"}, params:[]}, cubeId:comp.cubeId, tname:comp.tname, kpiJson:[], dsid:comp.dsid, dsetId:comp.dsetId};
				//设置度量
				var k = eval("(" + JSON.stringify(ts.kpi) + ")");
				chart.kpiJson.push(k);
				//设置y,ser
				if(xcol != null){
					var o = comp.rows.filter(m=>m.id===xcol)[0];
					chart.chartJson.xcol = JSON.parse(JSON.stringify(o));
				}
				if(scol != null){
					var o = comp.cols.filter(m=>m.id===scol)[0];
					chart.chartJson.scol = JSON.parse(JSON.stringify(o));
				}
				/**
				//设置参数维
				for(let k=0; k<comp.rows.length; k++){
					if(comp.rows[k].id == xcol || comp.rows[k].id == scol){
					}else{
						chart.chartJson.params.push(comp.rows[k]);
					}
				}
				for(let k=0; k<comp.cols.length; k++){
					if(comp.cols[k].id == xcol || comp.cols[k].id == scol){
					}else{
						chart.chartJson.params.push(comp.cols[k]);
					}
				}
				 */
				ts.$parent.pageInfo.comps[1] = chart;
				ts.$parent.pageInfo.showtype = 'chart';
				ts.show = false;
				var o = ts.$parent.$parent.$parent.$parent.$refs['chartForm'];
				o.$forceUpdate();
				o.$nextTick(()=>{
					o.chartView();
				});
			},
			showDailog(kpi, comp){
				this.comp = comp;
				this.kpi = kpi;
				this.show = true;
				this.chart.scol = null;
				this.chart.xcol = null;
				//设置横轴
				var cols = [];
				for(let i=0; i<comp.rows.length; i++){
					cols.push({value:comp.rows[i].id, text:comp.rows[i].dimdesc});
					this.chart.xcol = comp.rows[i].id;
				}
				this.opt.xcols = cols;
				//设置图例
				var scols = [];
				for(let i=0; i<comp.cols.length; i++){
					scols.push({value:comp.cols[i].id, text:comp.cols[i].dimdesc});
					this.chart.scol = comp.cols[i].id;
				}
				this.opt.scols = scols;
			}
		},
		watch: {
		}
	}
</script>