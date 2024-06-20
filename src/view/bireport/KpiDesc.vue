<template>
  	<el-dialog :title="$t('message.olap.explain.title')" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		
		<div class="el-dialog-div">
			<el-table :data="tableData" border style="width: 100%" header-row-class-name="tableHeadbg">
				<el-table-column align="center" prop="kpiName" :label="$t('message.olap.explain.kpi')"></el-table-column>
				<el-table-column min-width="200" align="center" prop="kpiDesc" :label="$t('message.olap.explain.desc')"></el-table-column>
			</el-table>
		</div>
    <div slot="footer" class="dialog-footer">
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
