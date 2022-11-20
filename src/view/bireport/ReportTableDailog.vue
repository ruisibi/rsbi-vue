<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="val" ref="valForm" label-position="left">
			<template v-if="type === 'dimAggre'">
				<el-form-item label="聚合方式" label-width="100px">
					<el-select v-model="val.aggreType" style="width:100%" placeholder="请选择">
						<el-option
						v-for="item in opt.aggres"
						:key="item.value"
						:label="item.name"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label-width="100px">
					<button type="button" class="btn btn-danger btn-rounded btn-outline btn-xs" @click="clearAggre()">清除聚合</button>
				</el-form-item>
			</template>
			<template v-if="type === 'top'">
				<el-form-item label="维度取Top" label-width="100px">
					<el-input-number v-model="val.top" :min="1" :max="100" label="描述文字" size="small"></el-input-number>
				</el-form-item>
				<el-form-item label="" label-width="100px">
					<el-select v-model="val.topType" placeholder="请选择">
						<el-option
						v-for="item in opt.tops"
						:key="item.value"
						:label="item.name"
						:value="item.value">
						</el-option>
					</el-select>
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
					v-model="val.unit"
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
			<template v-if="type === 'kpiwarning'">
				<el-form-item label="图片样式" label-width="160px">
					<el-select v-model="val.wctype" placeholder="请选择" @change="chgpic">
						<el-option
							v-for="item in opt.wctypes"
							:key="item.value"
							:label="item.text"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<el-switch
						v-model="val.fztp"
						inactive-text="反转图片"
						@change="fztpfunc"
						>
					</el-switch>
				</el-form-item>
				<el-form-item label="" label-width="160px">
					<span slot="label">
						<span id="ww1" class="warning6"></span>
						当前值
					</span>
					<el-select v-model="val.logic1" style="width:100px;" placeholder="请选择" >
						<el-option
							v-for="item in opt.logics"
							:key="item.value"
							:label="item.value"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<el-input-number v-model="val.value1" controls-position="right" @change="handleChange(1)" size="small"></el-input-number>
				</el-form-item>
				<el-form-item label-width="160px">
					<span slot="label">
						<span id="ww2" class="warning5">
						</span> 当前值 &lt; <span id="and1"></span> 且 
					</span>
					<el-select v-model="val.logic2" style="width:100px;" placeholder="请选择" >
						<el-option
							v-for="item in opt.logics"
							:key="item.value"
							:label="item.value"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<el-input-number v-model="val.value2" controls-position="right" @change="handleChange(2)" size="small"></el-input-number>
				</el-form-item>
				<el-form-item label-width="160px">
					<span slot="label">
						<span id="ww3" class="warning4"></span>
						当前值 &lt; <span id="and2"></span>
					
					</span>
				</el-form-item>
				<button type="button" class="btn btn-danger btn-rounded btn-outline btn-xs" @click="clearwarning">清除预警</button>
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
	import {findParamById,msginfo} from '@/view/bireport/bireportUtils'

	export default {
	    data(){
			return {
				show:false,
				title:"",
				type:"",
				comp:null,
				dim:null,
				kpi:null,
				opt:{
					aggres:[
						{name:"求和",value:"sum"},
						{name:"计数",value:"count"},
						{name:"平均",value:"avg"},
						{name:"最大",value:"max"},
						{name:"最小",value:"min"},
						{name:"方差",value:"var"},
						{name:"标准差",value:"sd"},
						{name:"中位数",value:"middle"}
					],
					tops:[
						{name:"数字", value:"number"},
						{name:"百分比", value:"percent"}
					],
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
						{value:">", text:"大于"},
						{value:"<", text:"小于"},
						{value:"=", text:"等于"},
						{value:"between", text:"区间"}
					],
					wctypes:[{value:"1",text:"交通灯"},{value:"2",text:"箭头"}],
					logics:[{value:">="},{value:">"}]
				},
				val:{
					aggreType:"",
					top:null,
					topType:"number",
					unit:null,
					fmt:null,
					oper:null,
					value1:null,
					value2:null,
					wctype:"1",
					logic1:">=",
					logic2:">=",
					fztp:false
				}
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {	
			dimAggre(dim, comp){
				this.title = "维度聚合";
				this.type = "dimAggre";
				this.show = true;
				this.dim = dim;
				if(this.type === 'dimAggre'){
					this.val.aggreType = dim.aggre;
				}
			},
			dimTop(dim, comp){
				this.title = "维度取Top";
				this.type = "top";
				this.show = true;
				this.dim = dim;
				this.val.top = dim.top;
				this.val.topType = dim.topType;
			},
			kpiProperty(kpi, comp){
				this.title = "度量属性";
				this.type = "kpiprop";
				this.show = true;
				this.kpi = kpi;
				this.val.fmt = kpi.fmt;
				this.val.unit = kpi.rate;
			},
			kpiFilter(kpi, comp){
				this.title = "度量筛选";
				this.type = "kpifilter";
				this.show = true;
				this.kpi = kpi;
			},
			kpiwarning(kpi, comp){
				this.title = "指标预警";
				this.type = "kpiwarning";
				this.show = true;
				this.kpi = kpi;
				if(kpi.warning){
					this.val.wctype = kpi.warning.pictype;
					this.val.fztp === kpi.warning.reverse === "y";
					this.val.logic1 = kpi.warning.logic1;
					this.val.value1 = kpi.warning.val1;
					this.val.logic2 = kpi.warning.logic2;
					this.val.value2 = kpi.warning.val2;
				}
			},
			save(){
				let dim = this.dim;
				let kpi = this.kpi;
				if(this.type === 'dimAggre'){
					if(dim.issum == 'y'){
						dim.issum = "n";
						delete dim.aggre;
					}else{
						dim.issum = 'y';
						dim.aggre = this.val.aggreType;
					}
				}else if(this.type === 'top'){
					dim.top = this.val.top;
					dim.topType = this.val.topType;
				}else if(this.type === "kpiprop"){
					kpi.fmt = this.val.fmt;
					kpi.rate = this.val.unit;
				}else if(this.type === 'kpifilter'){
					var ft = this.val.oper;
					var sv = this.val.value1;
					var ev = this.val.value2;
					if( !ft || !sv){
						delete kpi.filter;
					}else{
						var filter = {"kpi":kpi.kpi_id,"filterType":ft,"val1":Number(sv),"val2":(ev == ""?0:Number(ev))};
						kpi.filter = filter;
					}
				}else if(this.type === 'kpiwarning'){
					var pictype = this.val.wctype;
					var reverse = this.val.fztp?"y":"n";
					var logic1 = this.val.logic1;
					var val1 = this.val.value1;
					var logic2 = this.val.logic2;
					var val2 = this.val.value2;
					var pic1 = $("#ww1").attr("class");
					var pic2 = $("#ww2").attr("class");
					var pic3 = $("#ww3").attr("class");
					kpi.warning = {pictype:pictype,reverse:reverse,logic1:logic1,val1:val1,logic2:logic2,val2:val2,pic1:pic1,pic2:pic2,pic3:pic3}
					
				}
				this.show = false;
				let o = this.$parent;
				o.setUpdate();
				o.tableView();
			},
			clearAggre(){
				this.val.aggreType = null;
			},
			handleChange(idx){
				$("#and" + idx).text(idx === 1?this.val.value1:this.val.value2);
			},
			chgpic(){
				if(this.val.wctype == 1){
					$("#ww1").attr("class", "warning6");
					$("#ww2").attr("class", "warning5");
					$("#ww3").attr("class", "warning4");
				}else if(this.val.wctype == 2){
					$("#ww1").attr("class", "warning3");
					$("#ww2").attr("class", "warning2");
					$("#ww3").attr("class", "warning1");
				}
			},
			fztpfunc(){
				if(this.val.fztp === true){
					if(this.val.wctype == 1){
						$("#ww1").attr("class", "warning4");
						//$("#ww2").attr("class", "warning5");
						$("#ww3").attr("class", "warning6");
					}else if(this.val.wctype == 2){
						$("#ww1").attr("class", "warning1");
						//$("#ww2").attr("class", "warning2");
						$("#ww3").attr("class", "warning3");
					}
				}else{
					if(this.val.wctype == 1){
						$("#ww1").attr("class", "warning6");
						//$("#ww2").attr("class", "warning5");
						$("#ww3").attr("class", "warning4");
					}else if(this.val.wctype == 2){
						$("#ww1").attr("class", "warning3");
						//$("#ww2").attr("class", "warning2");
						$("#ww3").attr("class", "warning1");
					}
				}
			},
			clearwarning(){
				delete this.kpi.warning;
				this.show = false;
				let o = this.$parent;
				o.setUpdate();
				o.tableView();
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
