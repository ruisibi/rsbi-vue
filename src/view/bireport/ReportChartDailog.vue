<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="val" ref="valForm" label-position="left">
			<template v-if="type === 'top'">
				<el-form-item label="维度取Top" label-width="100px">
					<el-input-number v-model="val.top" :min="1" :max="100" label="描述文字" size="small"></el-input-number>
				</el-form-item>
			</template>
			<template v-if="type === 'kpiprop'">
				<el-form-item label="度量名称" label-width="100px">
					{{kpi.kpi_name}}
				</el-form-item>
				<el-form-item label="所属表" label-width="100px">
					{{kpi.tname}}
				</el-form-item>
				<el-form-item label="聚合方式" label-width="100px">
					{{kpi.aggre}}
				</el-form-item>
				<el-form-item label="度量单位" label-width="100px">
					<el-select
					v-model="val.rate"
					placeholder="请选择"
					>
					<el-option
						v-for="item in opt.unit"
						:key="item.value"
						:label="item.name"
						:value="item.value"
					>
				</el-option>
				</el-select>
				</el-form-item>
				<el-form-item label="格式化" label-width="100px">
					<el-select
						v-model="val.fmt"
						placeholder="请选择"
						>
						<el-option
							v-for="item in opt.fmt"
							:key="item.value"
							:label="item.text"
							:value="item.value"
						>
					</el-option>
					</el-select>
				</el-form-item>
			</template>
			<template v-if="type === 'kpifilter'">
				<el-form-item label="度量名称" label-width="100px">
					{{kpi.kpi_name}}
				</el-form-item>
				<el-form-item label="操作" label-width="100px">
					<el-select
						v-model="val.oper"
						placeholder="请选择"
						>
						<el-option
							v-for="item in opt.oper"
							:key="item.value"
							:label="item.text"
							:value="item.value"
						>
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="值" label-width="100px">
					<el-input-number v-model="val.value1" label="描述文字" size="small"></el-input-number>
				</el-form-item>
				<el-form-item label="值2" v-show="val.oper === 'between'" label-width="100px">
					<el-input-number v-model="val.value2" label="描述文字" size="small"></el-input-number>
				</el-form-item>
			</template>
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
	import {msginfo} from '@/view/bireport/bireportUtils'

	export default {
	    data(){
			return {
				show :false,
				title:"",
				type:"",
				comp:null,
				dim:null,
				kpi:null,
				val:{
					top:null,
					rate:null,
					fmt:null,
					oper:null,
					value1:null,
					value2:null
				},
				opt:{
					unit:[{
						name:"", value:"1"
					},{
						name:"千", value:"1000"
					},{
						name:"万", value:"10000"
					},{
						name:"百万", value:"1000000"
					},{
						name:"亿", value:"100000000"
					}],
					fmt:[{
						value:"#,###", text:"整数"
						},{
						value:"#,##0.00", text:"小数(保留两位)"
						},{
						value:"#,##0.0000", text:"小数(保留四位)"
						},{
						value:"0.00%", text: "百分比"
						}
					],
					oper:[
						{value:null, text:"清除"},
						{value:">", text:"大于"},
						{value:"<", text:"小于"},
						{value:"=", text:"等于"},
						{value:"between", text:"区间"}
					]
				}
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {	
			dimTop(dim, comp){
				this.title = "维度取Top";
				this.show = true;
				this.type = "top";
				this.dim = dim;
				this.comp = comp;
				this.val.top = dim.top;
			},
			setChartKpi(kpi, comp){
				this.title = "度量属性";
				this.show = true;
				this.type = "kpiprop";
				this.kpi = kpi;
				this.comp = comp;
				this.val.fmt = kpi.fmt;
				this.val.rate = kpi.rate;
			},
			kpifilter(kpi, comp){
				this.title = "度量筛选";
				this.type = "kpifilter";
				this.show = true;
				this.kpi = kpi;
			},
			save(){
				let dim = this.dim;
				let kpi = this.kpi;
				if(this.type === 'top'){
					dim.top = this.val.top;
				}else if(this.type === 'kpiprop'){
					kpi.fmt = this.val.fmt;
					kpi.rate = this.val.rate;
				}else if(this.type === 'kpifilter'){
						var ft = this.val.oper;
						var sv = this.val.value1;
						var ev = this.val.value2;
						if(ft == null){
							delete kpi.filter;
						}else{
							var filter = {"kpi":kpi.kpi_id,"filterType":ft,"val1":Number(sv),"val2":(ev == ""?0:Number(ev))};
							kpi.filter = filter;
						}
				}
				let o = this.$parent;
				o.setUpdate();
				o.chartView();
				this.show = false;
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
