<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">

		<template v-if="param.type === 'frd'">
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
				placeholder="选择月份">
				</el-date-picker>
			</div>
			<div class="block">
				<span class="demonstration">结束月份</span>
				<el-date-picker
				v-model="end"
				type="month"
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
				placeholder="选择日期">
				</el-date-picker>
			</div>
			<div class="block">
				<span class="demonstration">结束日期</span>
				<el-date-picker
				v-model="end"
				type="date"
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
	import {findParamById} from '@/view/bireport/bireportUtils'

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
				checkList:[],
				dimValus:[],
				st:"",  //日期/月份的开始日期
				end:"",	//日期/月份的结束日期,
				search:""
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {	
			create(paramId){
				this.show = true
				let p = findParamById(paramId, this.pageInfo.params);
				this.title = p.name + " - 参数筛选";
				this.param = p;
				this.dimValus = [];
				this.checkList = p.vals || [];
				this.st = [];
				this.end = [];
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
				this.param.vals = this.checkList;
				var strs = [];
				this.checkList.forEach(e=>{
					let t = this.dimValus.filter(m=>m.id===e)[0];
					strs.push(t.name);
				});
				this.param.valStrs = strs;
				this.show = false;
				//刷新组件
				this.$parent.$refs['paramForm'].$forceUpdate();
			},
			searchme(){
				let load = Loading.service({ fullscreen: true });
				let p = this.param;
				ajax({
					url:"bireport/paramFilter.action",
					data:{id:p.id, cubeId:p.cubeId, keyword:this.search, dsid:p.dsid},
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
