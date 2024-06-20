<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">

		<template v-if="!(param.type === 'month' || param.type === 'day')">
			<el-input v-model="search"	size="mini" :placeholder="$t('message.olap.param.keyword')">
				<el-button slot="append" icon="el-icon-search" @click="searchme"></el-button>
			</el-input>
			<div class="el-dialog-div">
				<el-checkbox-group v-model="checkList">
					<template v-for="(item) in dimValus">
						<div :key="item.id">
							<el-checkbox name="vls" :key="item.id" :label="item.id">{{item.name}}</el-checkbox> 
						</div>
					</template>
				</el-checkbox-group>
			</div>
		</template>
		<template v-if="param.type === 'month'">
			<div class="el-dialog-div">
			<div class="block">
				<span class="demonstration">{{$t('message.olap.param.smonth')}}</span>
				<el-date-picker
				v-model="st"
				type="month"
				value-format="yyyy-MM"
				:placeholder="$t('message.olap.param.month')">
				</el-date-picker>
			</div>
			<div class="block">
				<span class="demonstration">{{$t('message.olap.param.emonth')}}</span>
				<el-date-picker
				v-model="end"
				type="month"
				value-format="yyyy-MM"
				:placeholder="$t('message.olap.param.month')">
				</el-date-picker>
			</div>
			</div>
		</template>
		<template v-if="param.type === 'day'">
			<div class="el-dialog-div">
			<div class="block">
				<span class="demonstration">{{$t('message.olap.param.sday')}}</span>
				<el-date-picker
				v-model="st"
				type="date"
				value-format="yyyy-MM-dd"
				:placeholder="$t('message.olap.param.day')">
				</el-date-picker>
			</div>
			<div class="block">
				<span class="demonstration">{{$t('message.olap.param.eday')}}</span>
				<el-date-picker
				v-model="end"
				type="date"
				value-format="yyyy-MM-dd"
				:placeholder="$t('message.olap.param.day')">
				</el-date-picker>
			</div>
			</div>
		</template>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
			<el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
		</div>
  </el-dialog>
</template>

<script>
	import {ajax} from '@/common/biConfig'
	import $ from 'jquery'
	import { Loading } from "element-ui"
	import {findParamById,msginfo} from '@/view/bireport/bireportUtils'

	export default {
		props:{
			pageInfo:{
				type:Object,
				required:true
			}
		},
	    data(){
			return {
				show:false,
				title:"",
				param:{},
				cubeId:null,
				dsid:null,
				checkList:[],
				dimValus:[],
				st:null,  //日期/月份的开始日期
				end:null,	//日期/月份的结束日期,
				search:null,
				useType: null
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {	
			createDimFilter(dim, comp, useType){   //用在维度
				this.show = true;
				this.title = dim.dimdesc+" - " + this.$t('message.olap.param.fdim');
				this.param = dim;
				this.cubeId = comp.cubeId;
				this.dsid = comp.dsid;
				this.search = null;
				this.dimValus = [];
				this.checkList = dim.vals || [];
				this.st = dim.st?dim.st: null;
				this.end = dim.end?dim.end:null;
				let load = Loading.service({ fullscreen: true });
				this.useType = useType;
				ajax({
					url:"bireport/paramFilter.action",
					data:{id:dim.id, cubeId:comp.cubeId, dsid:comp.dsid},
					success:(resp)=>{
						this.dimValus = resp.rows.datas;
					}
				}, this, load);
			},
			create(p){	//用在参数筛选
				this.show = true;
				this.title = p.name + " - "+ this.$t('message.olap.param.pdim');
				this.param = p;
				this.cubeId = p.cubeId;
				this.dsid = p.dsid;
				this.search = null;
				this.dimValus = [];
				this.checkList = p.vals || [];
				this.st = p.st?p.st: null;
				this.end = p.end?p.end:null;
				this.useType = 'param';
				let load = Loading.service({ fullscreen: true });
				ajax({
					url:"bireport/paramFilter.action",
					data:{id:p.id, cubeId:p.cubeId, dsid:p.dsid},
					success:(resp)=>{
						this.dimValus = resp.rows.datas;
					}
				}, this, load);
			},
			save(){
				let p = this.param;
				if(p.type === 'month'){
					p.st =  this.st;
					p.end =  this.end;
					//判断是否st < ed
					if(Number(p.st) > Number(p.end)){
						msginfo(this.$t('message.olap.param.err3'), "error");
						return;
					}
				}else if(p.type === 'day'){
					p.st =  this.st;
					p.end =  this.end;
					//判断是否st < ed
					if(Number(p.st.replace(/-/g, "")) > Number(p.end.replace(/-/g, ""))){
						msginfo(this.$t('message.olap.param.err4'), "error");
						return;
					}
				}else{
					this.param.vals = this.checkList;
					var strs = [];
					this.checkList.forEach(e=>{
						let t = this.dimValus.filter(m=>m.id===e)[0];
						strs.push(t.name);
					});
					this.param.valStrs = strs;
				}
				this.show = false;
				//刷新组件
				this.$parent.$refs['paramForm'].$forceUpdate();
				if(this.useType === 'param'){
					this.$parent.$refs['tableForm'].tableView();
					this.$parent.$refs['chartForm'].chartView();
				}else if(this.useType === 'chart'){
					this.$parent.$refs['chartForm'].chartView();
				}else if(this.useType === 'table'){
					this.$parent.$refs['tableForm'].tableView();
				}
			},
			searchme(){
				let load = Loading.service({ fullscreen: true });
				let p = this.param;
				ajax({
					url:"bireport/paramFilter.action",
					data:{id:p.id, cubeId:this.cubeId, keyword:this.search, dsid:this.dsid},
					success:(resp)=>{
						this.dimValus = resp.rows.datas;
					}
				}, this, load);
			}
		},
		watch: {
		}
	}
</script>

<style lang="css" scoped>
</style>
