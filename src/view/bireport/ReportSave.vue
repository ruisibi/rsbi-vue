<template>
  	<el-dialog title="保存多维分析" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="saveInfo" ref="saveForm" :rules="rules" label-position="left">
			   <el-form-item label="名称" label-width="100px" prop="name">
					<el-input v-model="saveInfo.name" ></el-input>
			   </el-form-item>
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

	export default {
	    data(){
			return {
				show :false,
				json:null,
				saveInfo:{
					name:""
				},
				rules:{
					name:[{ required: true, message: '必填', trigger: 'blur' }]
				}
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {
			save(){
				let ts = this;
				this.$refs['saveForm'].validate((valid) => {
					if (valid) {
						ajax({
							url:"bireport/saveReport.action",
							type:"POST",
							data:{pageName:ts.saveInfo.name, pageInfo:JSON.stringify(ts.json)},
							success:(resp)=>{
								ts.json.id = resp.rows;
								ts.$notify.success({
									title: '保存成功!',
									offset: 50
								});
							}
						});
						this.$parent.isupdate = false;
						this.show = false;
					}
				});
			},
			open(json, activeIndex){
				if(json.id){  //id存在，修改
					let ts = this;
					ajax({
						url:"bireport/saveReport.action",
						type:"POST",
						data:{pageId:json.id, pageInfo:JSON.stringify(json)},
						success:(resp)=>{
							ts.$notify.success({
								title: '保存成功!',
								offset: 50
							});
							this.$parent.isupdate = false;
						}
					});
					return;
				}
				this.saveInfo.name = "";
				this.show = true;
				this.json = json;
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
