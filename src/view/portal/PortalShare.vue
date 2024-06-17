<template>
    <el-dialog :title="$t('message.report.share.title')" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
      <el-form :model="form" label-width="100px" size="mini">

      <div class="el-dialog-div">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane :label="$t('message.report.share.url')" name="url">
            <el-form-item :label="$t('message.report.share.yxq')">
              <el-radio v-model="form.yxq" label="1" border>{{$t('message.report.share.hour')}}</el-radio>
              <el-radio v-model="form.yxq" label="24" border>{{$t('message.report.share.day')}}</el-radio>
              <el-radio v-model="form.yxq" label="-1" border>{{$t('message.report.share.all')}}</el-radio>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('message.report.share.menu')" name="menu">
            <el-form-item :label="$t('message.report.share.menuName')">
              <el-input v-model="form.menuName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.report.share.menuOrder')">
              <el-input-number size="small" v-model="form.menuOrder" :min="1" :max="10000"></el-input-number>
            </el-form-item>
             <el-form-item :label="$t('message.report.share.menuTree')">
              <div id="menuTree" class="treestyle"></div>
            </el-form-item>
          </el-tab-pane>
          
        </el-tabs>
      </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
        <el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {baseUrl, ajax} from '@/common/biConfig'
import $ from 'jquery'
import "jstree";
import "jstree/dist/themes/default/style.min.css";

export default {
  components:{

  },
  data(){
    return {
        show:false,
        reportId:null,
        activeName:"url",
        form:{
          yxq:"1",
          menuName:null,
          menuOrder:1,
          pid:null
        }
    }
  },
  mounted(){

  },
  computed: {
     
  },
  methods: {
    share(reportId){
      this.show = true;
      this.reportId = reportId;
      this.$nextTick(()=>{
        this.initMenuTree();
      });
    },
    save(){
      let v = this.form;
      if(this.activeName==='menu'){  //推送到菜单
        if(!v.menuName){
          this.$notify.error({ title: this.$t('message.report.share.err1'), offset: 50});
          return;
        }
        const ref = $("#menuTree").jstree(true);
        let nodes = ref.get_selected(true);
        if(nodes.length === 0){
          this.$notify.error({ title: this.$t('message.report.share.err2'), offset: 50});
          return;
        }
        ajax({
          type:"POST",
          data: {menuPid:nodes[0].id, menuName:v.menuName,menuOrder:v.menuOrder, menuUrl:'/portal/PushView?id='+this.reportId},
          postJSON:false,
          url:"frame/menu/save.action",
          success:(resp)=>{
             this.$notify.success({ title: this.$t('message.report.share.suc1'), offset: 50});
             this.show = false;
          }
        }, this);
        
      }else if(this.activeName==='url'){  //推送URL
        ajax({
          type:"POST",
          data:{yxq:this.form.yxq, reportId:this.reportId, islogin:0},
          url:"portal/copyUrl.action",
          success:(resp)=>{
            let base = window.location.href.split("#")[0];
            let u = base + '#' + "/portal/ShareView?token=" + resp.rows;
            window.setTimeout(()=>{
              this.$alert('<a target="_blank" href="'+u+'">'+u+'</a><br/><img src="portal/generateqrcode.action?url='+escape(u)+'">',this.$t('message.report.share.suc2'), {
                center: true,
                confirmButtonText: this.$t('message.base.ok'),
                dangerouslyUseHTMLString: true
              });
            }, 200);
           
            this.show = false;
          }
        }, this);
        
      }
      
    },
    initMenuTree(){
      let ts = this;
      let ref = $("#menuTree").jstree(true);
      if(ref){
        ref.destroy();
      }
      $("#menuTree").jstree({
        core: {
            check_callback: true,
            data: function (obj, callback) {
              let id = obj.id;
              if(obj.id === '#'){
                id = '0';
              }
              ajax({
                type: "GET",
                data: {id: id},
                postJSON: false,
                url: 'frame/menu/loadData.action',
                success: function (resp) {
                  callback.call(this, resp.rows);
                },
              }, ts);
            },
          },
          plugins: ["wholerow"],
      });
    }
  }
}
</script>

<style lang="less" scoped>
 .treestyle{
    height: 160px;
    overflow: auto;
    border: 1px solid #cfdadd;
    border-radius: 5px;
 }
</style>
