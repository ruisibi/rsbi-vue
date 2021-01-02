<template>
  	<el-dialog title="度量解释" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		
		<div class="el-dialog-div">
			<el-table :data="tableData" border style="width: 100%" header-row-class-name="tableHeadbg">
				<el-table-column align="center" prop="kpiName" label="度量"></el-table-column>
				<el-table-column min-width="200" align="center" prop="kpiDesc" label="解释"></el-table-column>
			</el-table>
		</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
	import {ajax} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show:false,
				tableData:[]
			}
		},
		mounted(){
			
		},
		computed: {
		},
		methods: {	
			openDailog(cubeId){
				this.show = true;
				ajax({
					url:"bireport/kpidesc.action",
					data:{cubeId},
					success:(resp)=>{
						this.tableData = resp.rows;
					}
				});
			}
		},
		watch: {
		}
	}
</script>

<style lang="css">

</style>
