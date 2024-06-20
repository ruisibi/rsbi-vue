<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="val" ref="valForm" label-position="left">
			<template v-if="type === 'dimAggre'">
				<el-form-item :label="$t('message.olap.tableDlg.aggreType')" label-width="100px">
					<el-select v-model="val.aggreType" style="width:100%" :placeholder="$t('message.base.select')">
						<el-option
						v-for="item in opt.aggres"
						:key="item.value"
						:label="item.name"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label-width="100px">
					<button type="button" class="btn btn-danger btn-rounded btn-outline btn-xs" @click="clearAggre()">{{$t('message.olap.tableDlg.clear')}}</button>
				</el-form-item>
			</template>
			<template v-if="type === 'top'">
				<el-form-item :label="$t('message.olap.tableDlg.top')" label-width="100px">
					<el-input-number v-model="val.top" :min="1" :max="100" size="small"></el-input-number>
				</el-form-item>
				<el-form-item label="" label-width="100px">
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
				<el-form-item :label="$t('message.olap.tableDlg.kpiName')" label-width="100px">
					{{kpi.kpi_name}}
				</el-form-item>
				<el-form-item :label="$t('message.olap.tableDlg.tname')" label-width="100px">
					{{kpi.tname}}
				</el-form-item>
				<el-form-item :label="$t('message.olap.tableDlg.aggre')" label-width="100px">
					{{kpi.aggre}}
				</el-form-item>
				<el-form-item :label="$t('message.olap.tableDlg.unit')" label-width="100px">
					<el-select
					v-model="val.unit"
					:placeholder="$t('message.base.select')"
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
				<el-form-item :label="$t('message.olap.tableDlg.fmt')" label-width="100px">
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
			</template>
			<template v-if="type === 'kpifilter'">
				<el-form-item :label="$t('message.olap.tableDlg.kpiName')" label-width="100px">
					{{kpi.kpi_name}}
				</el-form-item>
				<el-form-item :label="$t('message.base.oper')" label-width="100px">
					<el-select
						v-model="val.oper"
						:placeholder="$t('message.base.select')"
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
				<el-form-item :label="$t('message.olap.tableDlg.val1')" label-width="100px">
					<el-input-number v-model="val.value1" size="small"></el-input-number>
				</el-form-item>
				<el-form-item :label="$t('message.olap.tableDlg.val2')" v-show="val.oper === 'between'" label-width="100px">
					<el-input-number v-model="val.value2" size="small"></el-input-number>
				</el-form-item>
			</template>
			<template v-if="type === 'kpiwarning'">
				<el-form-item :label="$t('message.olap.tableDlg.wctype')" label-width="160px">
					<el-select v-model="val.wctype" :placeholder="$t('message.base.select')" @change="chgpic">
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
						:inactive-text="$t('message.olap.tableDlg.fztp')"
						@change="fztpfunc"
						>
					</el-switch>
				</el-form-item>
				<el-form-item label="" label-width="160px">
					<span slot="label">
						<span id="ww1" class="warning6"></span>
						{{$t('message.olap.tableDlg.cval') }}
					</span>
					<el-select v-model="val.logic1" style="width:100px;" :placeholder="$t('message.base.select')" >
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
						</span> {{$t('message.olap.tableDlg.cval') }} &lt; <span id="and1"></span> {{$t('message.olap.tableDlg.and') }}
					</span>
					<el-select v-model="val.logic2" style="width:100px;" :placeholder="$t('message.base.select')" >
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
						{{$t('message.olap.tableDlg.cval') }} &lt; <span id="and2"></span>
					
					</span>
				</el-form-item>
				<button type="button" class="btn btn-danger btn-rounded btn-outline btn-xs" @click="clearwarning">{{$t('message.olap.tableDlg.clearwarn') }}</button>
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
						{name:this.$t('message.report.tableSet.sum'),value:"sum"},
						{name: this.$t('message.report.tableSet.count'),value:"count"},
						{name:this.$t('message.report.tableSet.avg'),value:"avg"},
						{name: this.$t('message.report.tableSet.max'),value:"max"},
						{name: this.$t('message.report.tableSet.min'),value:"min"},
						{name: this.$t('message.report.tableSet.var'),value:"var"},
						{name:this.$t('message.report.tableSet.sd'),value:"sd"},
						{name:this.$t('message.report.tableSet.middle'),value:"middle"}
					],
					tops:[
						{name:this.$t('message.report.tableSet.number'), value:"number"},
						{name:this.$t('message.report.tableSet.percent'), value:"percent"}
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
						value:"#,###", text: this.$t("message.model.fmt.int")
						},{
						value:"#,##0.00", text: this.$t("message.model.fmt.double")
						},{
						value:"#,##0.0000", text: this.$t("message.model.fmt.double2")
						},{
						value:"0.00%", text: this.$t("message.model.fmt.percentage")
						}
					],
					oper:[
						{value:">", text:this.$t('message.olap.chartDailog.bigger')},
						{value:"<", text:this.$t('message.olap.chartDailog.smaller')},
						{value:"=", text:this.$t('message.olap.chartDailog.equal')},
						{value:"between", text:this.$t('message.olap.chartDailog.between')}
					],
					wctypes:[{value:"1",text:this.$t('message.olap.tableDlg.wctp1')},{value:"2",text:this.$t('message.olap.tableDlg.wctp2')}],
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
				this.title = this.$t('message.olap.tableDlg.title1');
				this.type = "dimAggre";
				this.show = true;
				this.dim = dim;
				if(this.type === 'dimAggre'){
					this.val.aggreType = dim.aggre;
				}
			},
			dimTop(dim, comp){
				this.title = this.$t('message.olap.tableDlg.title2');
				this.type = "top";
				this.show = true;
				this.dim = dim;
				this.val.top = dim.top;
				this.val.topType = dim.topType;
			},
			kpiProperty(kpi, comp){
				this.title = this.$t('message.olap.tableDlg.title3');
				this.type = "kpiprop";
				this.show = true;
				this.kpi = kpi;
				this.val.fmt = kpi.fmt;
				this.val.unit = kpi.rate;
			},
			kpiFilter(kpi, comp){
				this.title = this.$t('message.olap.tableDlg.title4');
				this.type = "kpifilter";
				this.show = true;
				this.kpi = kpi;
			},
			kpiwarning(kpi, comp){
				this.title = this.$t('message.olap.tableDlg.title5');
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
