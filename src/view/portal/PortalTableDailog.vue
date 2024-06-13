<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="val" ref="valForm" label-position="left">
			<template v-if="type === 'dimAggre'">
				<el-form-item :label="$t('message.report.tableSet.autoaggre')" label-width="150px">
					<el-switch v-model="val.autoaggre"></el-switch>
					({{$t('message.report.tableSet.note')}}) 
				</el-form-item>
				<template v-if="val.autoaggre == false">
				<el-form-item :label="$t('message.report.tableSet.aggreType')" label-width="150px">
					<el-select v-model="val.aggreType" style="width:100%" :placeholder="$t('message.base.select')">
						<el-option
						v-for="item in opt.aggres"
						:key="item.value"
						:label="item.name"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				</template>
				<el-form-item label-width="150px">
					<button type="button" class="btn btn-danger btn-rounded btn-outline btn-xs" @click="clearAggre()">{{$t('message.report.tableSet.clearAggre')}}</button>
				</el-form-item>
			</template>
			<template v-if="type === 'top'">
				<el-form-item :label="$t('message.report.tableSet.top')" label-width="150px">
					<el-input-number v-model="val.top" :min="1" :max="100" size="small"></el-input-number>
				</el-form-item>
				<el-form-item label="" label-width="150px">
					<el-select v-model="val.topType" :placeholder="$t('message.base.select')">
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
					<el-tab-pane :label="$t('message.report.tableSet.base')" name="base">
						<el-form-item :label="$t('message.report.tableSet.kpiName')" label-width="150px">
						{{kpi.kpi_name}}
						</el-form-item>
						<el-form-item :label="$t('message.report.tableSet.aggre')" label-width="150px">
							{{kpi.aggre}}
						</el-form-item>
						<el-form-item :label="$t('message.report.tableSet.unit')" label-width="150px">
							<el-select
							v-model="val.unit"
							:placeholder="$t('message.base.select')"
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
						<el-form-item :label="$t('message.report.tableSet.fmt')" label-width="150px">
							<el-select
								v-model="val.fmt"
								:placeholder="$t('message.base.select')"
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
						<el-form-item :label="$t('message.report.tableSet.order')" label-width="150px">
							<el-switch v-model="val.order" active-value="y" inactive-value="n"></el-switch>
						</el-form-item>
					</el-tab-pane>
    				<el-tab-pane :label="$t('message.report.tableSet.cb')" name="cb">
						function 
						{{ val.funcname }}
						(<b>value</b>, <b>col</b>, <b>row</b>, <b>data</b>)
						{<br>
						<el-input type="textarea" rows="6" v-model="val.code" size="medium"></el-input>
						<br>}<br>
						<p class="text-warning">{{ $t('message.report.tableSet.note2')}}</p>
					</el-tab-pane>
				</el-tabs>
				
			</template>
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
						{name:this.$t('message.report.tableSet.sum'),value:"sum"},
						{name:this.$t('message.report.tableSet.count'),value:"count"},
						{name:this.$t('message.report.tableSet.avg'),value:"avg"},
						{name:this.$t('message.report.tableSet.max'),value:"max"},
						{name:this.$t('message.report.tableSet.min'),value:"min"},
						{name:this.$t('message.report.tableSet.var'),value:"var"},
						{name:this.$t('message.report.tableSet.sd'),value:"sd"},
						{name:this.$t('message.report.tableSet.middle'),value:"middle"}
					],
					tops:[
						{name:this.$t('message.report.tableSet.number'), value:"number"},
						{name:this.$t('message.report.tableSet.percent'), value:"percent"}
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
				this.title = this.$t('message.report.tableSet.title1');
				this.type = "dimAggre";
				this.show = true;
				this.dim = dim;
					this.val.aggreType = dim.aggre;
				if(dim.aggre === 'auto'){
					this.val.autoaggre = true;
				}
			},
			
			dimTop(dim, comp){
				this.title = this.$t('message.report.tableSet.title2');
				this.type = "top";
				this.show = true;
				this.dim = dim;
				this.val.top = dim.top;
				this.val.topType = dim.topType?dim.topType:"number";
			},
			kpiProperty(kpi, comp){
				this.title = this.$t('message.report.tableSet.title3');
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
