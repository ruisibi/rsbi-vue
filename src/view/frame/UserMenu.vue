<template>
  <div class="wrapper-content">
    <div class="ibox" id="mainDiv">
      <div class="ibox-title">用户管理 >> 所辖菜单</div>
      <div class="ibox-content">
        <div class="row">
          <div class="col-sm-6">
           <a href="javascript:;" @click="openall">全部展开</a> &nbsp;&nbsp; <a href="javascript:;" @click="closeall">全部关闭</a>
           <div id="menuTree"></div>
          </div>
          <div class="col-sm-6" align="right">
            <el-button type="primary" @click="save()">确 定</el-button>
			    	<el-button @click="backpage()">取 消</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import $ from "jquery";
import "jstree";
import "jstree/dist/themes/default/style.min.css";

export default {
  data() {
    return {
  	}
  },
  components: {
	},
  mounted() {
    this.initTree();
  },
  computed: {},
  methods: {
    //初始化 jstree
    initTree: function () {
		let ts = this;
      $("#menuTree")
        .jstree({
          core: {
            check_callback: true,
            data: function (obj, callback) {
                ajax({
                  type: "GET",
                  data: {userId:ts.$route.params.userId},
                  postJSON: false,
                  url: 'frame/user/userMenu.action',
                  success: function (resp) {
                    callback.call(this, resp.rows);
                  },
                }, ts);
            },
          },
          plugins: ["checkbox","wholerow"],
        })
        .bind("open_node.jstree", function (a, b) {
          if (b.node.id == "0") {
            return;
          }
          const ref = $("#menuTree").jstree(true);
          ref.set_icon(b.node, "fa fa-folder-open-o");
        })
        .bind("close_node.jstree", function (a, b) {
          if (b.node.id == "0") {
            return;
          }
          const ref = $("#menuTree").jstree(true);
          ref.set_icon(b.node, "fa fa-folder-o");
        });
        this.treeRef = $("#menuTree").jstree(true);
    },
    save:function(){
      const ts = this;
      let ids = "";
      let nodes = this.treeRef.get_selected(true);
      for(let i=0; nodes&&i<nodes.length; i++){
        var n = nodes[i];
        if(n.state.disabled){
          continue;
        }
        ids = ids + n.id + ",";
      }
      $("#menutree").find(".jstree-undetermined").each(function (i, element) {
        var id = $(element).closest('.jstree-node').attr("id");
        if(id != 'root'){
          ids = ids + id + ",";
        }
      });
      if(ids.length > 0){
        ids = ids.substring(0, ids.length - 1);
      }
      ajax({
        type:"POST",
        url:"/frame/user/userMenu/save.action",
        dataType:"JSON",
        data:{userId:ts.$route.params.userId, menuIds:ids},
        success:function(resp){
          ts.$notify.success({
            title: '授权成功',
            offset: 50
          });
          ts.backpage();
        }
      }, ts);
    },
    backpage:function(){
      this.$router.push('user')
    },
    openall:function(){
      this.treeRef.open_all();
    },
    closeall:function(){
        this.treeRef.close_all();
    }
  },
  watch: {},
  beforeRouteLeave: function(to, from, next) {
    this.$destroy();
    next();
  }
};
</script>

<style lang="css">
.jstree-default .jstree-disabled.jstree-clicked {
	background:none;
	text-decoration: line-through;
}
</style>
