<template>
  <div class="wrapper-content">
    <div class="row">
      <div class="col-sm-3">
        <div class="ibox">
          <div class="ibox-content">
            <button @click="newReport" class="btn btn-block btn-sm btn-primary">{{$t('message.report.index.new')}}</button>
            <p class="text-warning">{{$t('message.report.index.note')}}</p>
          </div>
        </div>
      </div>
      <div class="col-sm-9">
        <div class="ibox">
          <div class="ibox-content">
            <div class="mail-box-header">
              <h2>{{$t('message.report.index.title')}}</h2>
            </div>
            <div class="btn-group optbtncls" role="group">
            <button type="button" class="btn btn-outline btn-default" :title="$t('message.report.index.view')" @click="viewReport(false)">
              <i class="glyphicon glyphicon-file" aria-hidden="true"></i>{{$t('message.report.index.view')}}
            </button>
            <button type="button" class="btn btn-outline btn-default" :title="$t('message.report.index.customization')" @click="customization()">
              <i class="glyphicon glyphicon-cog" aria-hidden="true"></i>{{$t('message.report.index.customization')}}
            </button>
            <button type="button" class="btn btn-outline btn-default" :title="$t('message.base.delete')" @click="deleteReport()">
              <i class="glyphicon glyphicon-trash" aria-hidden="true"></i>{{$t('message.base.delete')}}
            </button>
            <button type="button" class="btn btn-outline btn-default" :title="$t('message.report.index.share')" @click="shareReport()">
              <i class="glyphicon glyphicon-share" aria-hidden="true"></i>{{$t('message.report.index.share')}}
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
					<el-table-column align="center" prop="pageId" :label="$t('message.report.index.pageId')"></el-table-column>
					<el-table-column align="center" prop="pageName" :label="$t('message.report.index.pageName')"></el-table-column>
					<el-table-column align="center" prop="userName" :label="$t('message.report.index.userName')"></el-table-column>
					<el-table-column align="center" prop="crtDate" :label="$t('message.report.index.crtDate')"></el-table-column>
					
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
                title: this.$t('message.base.err1'),
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
                  title: this.$t('message.base.err1'),
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
                  title: this.$t('message.base.err1'),
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
                  title: this.$t('message.base.err1'),
                  offset: 50
                });
          return false;
        }
        if(confirm(this.$t('message.base.confirm'))){
          ajax({
            url:"portal/delete.action",
            type:"GET",
            data:{pageId: ts.checked},
            success:()=>{
              ts.$notify.success({
                    title: this.$t('message.model.dsource.suc1'),
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
