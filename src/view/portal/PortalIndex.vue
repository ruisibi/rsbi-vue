<template>
  <div class="wrapper-content">
    <div class="row">
      <div class="col-sm-3">
        <div class="ibox">
          <div class="ibox-content">
            <button @click="newReport" class="btn btn-block btn-sm btn-primary">新建报表</button>
            <p class="text-warning">定制个性化的数据可视化界面</p>
          </div>
        </div>
      </div>
      <div class="col-sm-9">
        <div class="ibox">
          <div class="ibox-content">
            <div class="mail-box-header">
              <h2>报表列表</h2>
            </div>
            <div class="btn-group optbtncls" role="group">
            <button type="button" class="btn btn-outline btn-default" title="查看" @click="viewReport(false)">
              <i class="glyphicon glyphicon-file" aria-hidden="true"></i>查看
            </button>
            <button type="button" class="btn btn-outline btn-default" title="定制" @click="customization()">
              <i class="glyphicon glyphicon-cog" aria-hidden="true"></i>定制
            </button>
            <button type="button" class="btn btn-outline btn-default" title="删除" @click="deleteReport()">
              <i class="glyphicon glyphicon-trash" aria-hidden="true"></i>删除
            </button>
            <button type="button" class="btn btn-outline btn-default" title="分享" @click="shareReport()">
              <i class="glyphicon glyphicon-share" aria-hidden="true"></i>分享
            </button>
          </div>
          <el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
					<!--
					<el-table-column type="selection" width="45"></el-table-column>
					-->
					<el-table-column label="" width="45">
						<template slot-scope="scope">
							<el-radio v-model="checked" name="myselect" :label="scope.row.pageId">&nbsp;</el-radio>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="pageId" label="标识"></el-table-column>
					<el-table-column align="center" prop="pageName" label="报表名称"></el-table-column>
					<el-table-column align="center" prop="userName" label="创建人"></el-table-column>
					<el-table-column align="center" prop="crtDate" label="创建时间"></el-table-column>
					
				</el-table>
				<el-pagination
					background
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[10, 20, 50, 100]"
					:current-page="page"
					:page-size="rows"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
				</el-pagination>
          </div>
        </div>
      </div>
    </div>
    <portalShare ref="portalShareForm"></portalShare>
  </div>
</template>
<script>
import {baseUrl, ajax} from '@/common/biConfig'
import portalShare from "./PortalShare.vue"

export default {
  name: "portalMain",
  components: {
    portalShare
  },
  props: {

  },
  data() {
    return {
        total:0,
				page:1,
        rows:10,
        checked:null,
        tableData:[]
    }
  },

  methods: {
    handleSizeChange(v){
        this.rows = v;
				this.loadDatas();
    },
    handleCurrentChange(v){
        this.page = v;
				this.loadDatas();
    },
    selectme:function(a, b){
				this.checked = a.pageId;
    },
    shareReport(){
      let ts = this;
      if(!ts.checked){
        ts.$notify.error({
                title: '未勾选数据',
                offset: 50
              });
        return false;
      }
      this.$refs['portalShareForm'].share(ts.checked);
    },
    loadDatas(){
      let ts = this;
      ajax({
          type:"GET",
					data:{page:ts.page, rows:ts.rows},
					url:"portal/list.action", 
					success:function(resp){
						ts.tableData = resp.rows;
            ts.total = resp.total;
					}
      }, this);
    },
    viewReport(){
      let ts = this;
        if(!ts.checked){
          ts.$notify.error({
                  title: '未勾选数据',
                  offset: 50
                });
          return false;
        }
        this.$router.push({path:"/portal/View", query:{id:ts.checked}});
    },
    customization(){
      let ts = this;
        if(!ts.checked){
          ts.$notify.error({
                  title: '未勾选数据',
                  offset: 50
                });
          return false;
        }
        this.$router.push({path:"/portal/Customiz", query:{id:ts.checked}});
    },
    deleteReport(){
      let ts = this;
      if(!ts.checked){
          ts.$notify.error({
                  title: '未勾选数据',
                  offset: 50
                });
          return false;
        }
        if(confirm('是否确认？')){
          ajax({
            url:"portal/delete.action",
            type:"GET",
            data:{pageId: ts.checked},
            success:()=>{
              ts.$notify.success({
                    title: '删除成功',
                    offset: 50
              });
              ts.loadDatas();
            }
          });
        }
    },
    newReport(){
      this.$router.push("/portal/Customiz");
    }
  },
  mounted(){
    //this.loadDatas();
  },
  beforeRouteEnter(to, from, next){
    next(vm=>vm.loadDatas());
  },
  watch: {

  },
  filters: {

  }
}
</script>
<style lang="less" scoped>

</style>
