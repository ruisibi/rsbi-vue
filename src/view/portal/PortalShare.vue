<template>
    <el-dialog title="报表分享" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
      <el-form :model="form" label-width="100px" size="mini">

      <div class="el-dialog-div">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="直接生成URL" name="url">
            <el-form-item label="有效期">
              <el-radio v-model="form.yxq" label="1" border>一小时</el-radio>
              <el-radio v-model="form.yxq" label="24" border>一天</el-radio>
              <el-radio v-model="form.yxq" label="-1" border>永久有效</el-radio>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="推送到菜单" name="menu">
            <el-form-item label="名称">
              <el-input v-model="form.menuName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number size="small" v-model="form.menuOrder" :min="1" :max="10000" label="描述文字"></el-input-number>
            </el-form-item>
             <el-form-item label="上级菜单">
              <div id="menuTree" class="treestyle"></div>
            </el-form-item>
          </el-tab-pane>
          
        </el-tabs>
      </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">确 定</el-button>
        <el-button @click="show = false">取 消</el-button>
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
          this.$notify.error({ title: '未填写菜单名称', offset: 50});
          return;
        }
        const ref = $("#menuTree").jstree(true);
        let nodes = ref.get_selected(true);
        if(nodes.length === 0){
          this.$notify.error({ title: '未选择上级菜单', offset: 50});
          return;
        }
        ajax({
          type:"POST",
          data: {menuPid:nodes[0].id, menuName:v.menuName,menuOrder:v.menuOrder, menuUrl:'/portal/PushView?id='+this.reportId},
          postJSON:false,
          url:"frame/menu/save.action",
          success:(resp)=>{
             this.$notify.success({ title: '推送成功。', offset: 50});
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
              this.$alert('<a target="_blank" href="'+u+'">'+u+'</a><br/><img src="portal/generateqrcode.action?url='+escape(u)+'">','生成URL成功', {
                center: true,
                confirmButtonText: '确定',
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
