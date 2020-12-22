<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="val" ref="valForm">
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
					]
				},
				val:{
					aggreType:""
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
			save(){
				if(this.type === 'dimAggre'){
					let dim = this.dim;
					if(dim.issum == 'y'){
						dim.issum = "n";
						delete dim.aggre;
					}else{
						dim.issum = 'y';
						dim.aggre = this.val.aggreType;
					}
					this.show = false;
					let o = this.$parent;
					o.setUpdate();
					o.tableView();
				}
			},
			clearAggre(){
				this.val.aggreType = null;
			}
		},
		watch: {
		}
	}
</script>

<style lang="css" scoped>
</style>
