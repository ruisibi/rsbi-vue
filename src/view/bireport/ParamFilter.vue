<template>
  	<el-dialog :title="title" :visible.sync="show">
		<template v-if="param.type === 'frd'">
			<el-checkbox-group v-model="checkList">
				<template v-for="(item) in dimValus">
					<div :key="item.id">
						<el-checkbox name="vls" :key="item.id" :label="item.id">{{item.name}}</el-checkbox> 
					</div>
				</template>
			</el-checkbox-group>
		</template>
		<template v-if="param.type === 'month'">
		</template>
		<template v-if="param.type === 'day'">
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
				dimValus:[]
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
				ajax({
					url:"bireport/paramFilter.action",
					data:{id:p.id, cubeId:p.cubeId, dsid:p.dsid},
					success:(resp)=>{
						this.dimValus = resp.rows.datas;
					}
				}, this);
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
			}
		},
		watch: {
		}
	}
</script>

<style lang="css" scoped>
</style>
