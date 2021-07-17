<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">

		<template v-if="!(param.type === 'month' || param.type === 'day')">
			<el-input v-model="search"	size="mini" placeholder="输入关键字搜索">
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
				<span class="demonstration">开始月份</span>
				<el-date-picker
				v-model="st"
				type="month"
				value-format="yyyy-MM"
				placeholder="选择月份">
				</el-date-picker>
			</div>
			<div class="block">
				<span class="demonstration">结束月份</span>
				<el-date-picker
				v-model="end"
				type="month"
				value-format="yyyy-MM"
				placeholder="选择月份">
				</el-date-picker>
			</div>
			</div>
		</template>
		<template v-if="param.type === 'day'">
			<div class="el-dialog-div">
			<div class="block">
				<span class="demonstration">开始日期</span>
				<el-date-picker
				v-model="st"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期">
				</el-date-picker>
			</div>
			<div class="block">
				<span class="demonstration">结束日期</span>
				<el-date-picker
				v-model="end"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期">
				</el-date-picker>
			</div>
			</div>
		</template>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save()">确 定</el-button>
			<el-button @click="show = false">取 消</el-button>
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
				this.title = dim.dimdesc+" - 维度筛选";
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
				this.title = p.name + " - 参数筛选";
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
						msginfo("您选择的开始月份不能大于结束月份。", "error");
						return;
					}
				}else if(p.type === 'day'){
					p.st =  this.st;
					p.end =  this.end;
					//判断是否st < ed
					if(Number(p.st.replace(/-/g, "")) > Number(p.end.replace(/-/g, ""))){
						msginfo("您选择的开始日期不能大于结束日期。", "error");
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
