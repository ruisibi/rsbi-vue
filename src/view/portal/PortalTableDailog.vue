<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="val" ref="valForm" label-position="left">
			<template v-if="type === 'dimAggre'">
				<el-form-item label="自动聚合" label-width="100px">
					<el-switch v-model="val.autoaggre"></el-switch>
					(设置后，聚合方式的选择功能既无效) 
				</el-form-item>
				<template v-if="val.autoaggre == false">
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
				</template>
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
				<el-tabs v-model="activeName" type="card">
					<el-tab-pane label="基本信息" name="base">
						<el-form-item label="度量名称" label-width="100px">
						{{kpi.kpi_name}}
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
								:label="item.text"
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
						<el-form-item label="表头排序" label-width="100px">
							<el-switch v-model="val.order" active-value="y" inactive-value="n"></el-switch>
						</el-form-item>
					</el-tab-pane>
    				<el-tab-pane label="回调函数" name="cb">
						function 
						{{ val.funcname }}
						(<b>value</b>, <b>col</b>, <b>row</b>, <b>data</b>)
						{<br>
						<el-input type="textarea" rows="6" v-model="val.code" size="medium"></el-input>
						<br>}<br>
						<p class="text-warning">通过回调函数 return 你想要的数据。</p>
					</el-tab-pane>
				</el-tabs>
				
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
	import * as utils from '@/view/portal/Utils'

	export default {
	    data(){
			return {
				show:false,
				title:"",
				type:"",
				comp:null,
				dim:null,
				kpi:null,
				activeName:"base",
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
					unit:utils.rates,
					fmt:utils.fmtJson
				},
				val:{
					aggreType:"",
					autoaggre:false,
					top:null,
					topType:null,
					unit:null,
					fmt:null,
					oper:null,
					order:null,
					funcname:null,
					code:null
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
					this.val.aggreType = dim.aggre;
				if(dim.aggre === 'auto'){
					this.val.autoaggre = true;
				}
			},
			
			dimTop(dim, comp){
				this.title = "维度取Top";
				this.type = "top";
				this.show = true;
				this.dim = dim;
				this.val.top = dim.top;
				this.val.topType = dim.topType?dim.topType:"number";
			},
			kpiProperty(kpi, comp){
				this.title = "度量属性";
				this.type = "kpiprop";
				this.show = true;
				this.kpi = kpi;
				this.val.fmt = kpi.fmt;
				this.val.unit = kpi.rate;
				this.val.order = kpi.order;
				if(kpi.funcname){
					this.val.funcname = (kpi.funcname);
				}else{
					this.val.funcname = "f"+ Math.round(Math.random() * 10000);
				}
				this.val.code = kpi.code?unescape(kpi.code):null;
			},
			clearAggre(){
				let dim = this.dim;
				dim.issum = 'n';
				delete dim.aggre;
				this.show = false;
				let p = this.$parent;
				p.setUpdate();
				p.tableView();
			},
			save(){
				let dim = this.dim;
				let kpi = this.kpi;
				if(this.type === 'dimAggre'){
					dim.issum = 'y';
					if(this.val.autoaggre===true){
						dim.aggre = "auto";
					}else{
						dim.aggre = this.val.aggreType;
					}
				}else if(this.type === 'top'){
					dim.top = this.val.top;
					dim.topType = this.val.topType;
				}else if(this.type === "kpiprop"){
					kpi.fmt = this.val.fmt;
					kpi.rate = this.val.unit;
					kpi.order = this.val.order;
					kpi.funcname = this.val.funcname;
					if(this.val.code){
						kpi.code = escape(this.val.code);
					}
				}
				this.show = false;
				let p = this.$parent;
				p.setUpdate();
				p.tableView();
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
