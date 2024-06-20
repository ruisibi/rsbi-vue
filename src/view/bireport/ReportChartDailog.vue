<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="val" ref="valForm" label-position="left">
			<template v-if="type === 'top'">
				<el-form-item :label="$t('message.olap.chartDailog.top')" label-width="150px">
					<el-input-number v-model="val.top" :min="1" :max="100" size="small"></el-input-number>
				</el-form-item>
			</template>
			<template v-if="type === 'kpiprop'">
				<el-form-item :label="$t('message.olap.chartDailog.kpiName')" label-width="150px">
					{{kpi.kpi_name}}
				</el-form-item>
				<el-form-item :label="$t('message.olap.chartDailog.tname')" label-width="150px">
					{{kpi.tname}}
				</el-form-item>
				<el-form-item :label="$t('message.olap.chartDailog.aggre')" label-width="150px">
					{{kpi.aggre}}
				</el-form-item>
				<el-form-item :label="$t('message.olap.chartDailog.rate')" label-width="150px">
					<el-select
					v-model="val.rate"
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
				<el-form-item :label="$t('message.olap.chartDailog.fmt')" label-width="150px">
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
				<el-form-item :label="$t('message.olap.chartDailog.kpiName')" label-width="150px">
					{{kpi.kpi_name}}
				</el-form-item>
				<el-form-item :label="$t('message.base.oper')" label-width="150px">
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
				<el-form-item :label="$t('message.olap.chartDailog.val')" label-width="150px">
					<el-input-number v-model="val.value1" size="small"></el-input-number>
				</el-form-item>
				<el-form-item :label="$t('message.olap.chartDailog.val2')" v-show="val.oper === 'between'" label-width="150px">
					<el-input-number v-model="val.value2" size="small"></el-input-number>
				</el-form-item>
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
						{value:null, text:this.$t('message.olap.chartDailog.empty')},
						{value:">", text:this.$t('message.olap.chartDailog.bigger')},
						{value:"<", text:this.$t('message.olap.chartDailog.smaller')},
						{value:"=", text:this.$t('message.olap.chartDailog.equal')},
						{value:"between", text:this.$t('message.olap.chartDailog.between')}
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
				this.title = this.$t('message.olap.chartDailog.title1');
				this.show = true;
				this.type = "top";
				this.dim = dim;
				this.comp = comp;
				this.val.top = dim.top;
			},
			setChartKpi(kpi, comp){
				this.title = this.$t('message.olap.chartDailog.title2');
				this.show = true;
				this.type = "kpiprop";
				this.kpi = kpi;
				this.comp = comp;
				this.val.fmt = kpi.fmt;
				this.val.rate = kpi.rate;
			},
			kpifilter(kpi, comp){
				this.title = this.$t('message.olap.chartDailog.title3');
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
