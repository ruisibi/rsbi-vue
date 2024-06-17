<template>
  	<el-dialog :title="$t('message.olap.save.title')" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <el-form :model="saveInfo" ref="saveForm" :rules="rules" label-position="left">
			   <el-form-item :label="$t('message.olap.save.name')" label-width="100px" prop="name">
					<el-input v-model="saveInfo.name" ></el-input>
			   </el-form-item>
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

	export default {
	    data(){
			return {
				show :false,
				json:null,
				saveInfo:{
					name:""
				},
				rules:{
					name:[{ required: true, message: this.$t("message.base.required"), trigger: 'blur' }]
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
									title:  ts.$t('message.olap.save.suc1'),
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
								title: ts.$t('message.olap.save.suc1'),
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
