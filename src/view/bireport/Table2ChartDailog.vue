<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="$t('message.olap.t2c.title')" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="chart" ref="chartForm" label-position="left">
			<el-form-item :label="$t('message.olap.t2c.ctype')" label-width="150px">
				<el-select
					v-model="chart.type"
					:placeholder="$t('message.base.select')"
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
			<el-form-item :label="$t('message.olap.t2c.xcol')" label-width="150px">
				<el-select
					v-model="chart.xcol"
					:placeholder="$t('message.base.select')"
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
			<el-form-item :label="$t('message.olap.t2c.scol')" label-width="150px">
				<el-select
					v-model="chart.scol"
					:placeholder="$t('message.base.select')"
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
				comp:null,
				chart:{
					type:"line",
					xcol:null,
					scol:null
				},
				opt:{
					types:[
						{value:'line', text:this.$t('message.report.chart.line')},
						{value:'column', text:this.$t('message.report.chart.column')},
						{value:'pie', text:this.$t('message.report.chart.pie')},
						{value:'area', text:this.$t('message.report.chart.area')},
						{value:'bar', text:this.$t('message.report.chart.bar')},
						{value:'radar', text:this.$t('message.report.chart.radar')}
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
				var chart = {id:2, name:"", type:"chart", chartJson:{type:tp,ycol:{type:"kpi"}, params:[]}, cubeId:comp.cubeId, tname:comp.tname, kpiJson:[], dsid:comp.dsid, dsetId:comp.dsetId};
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