<template>
  <div class="wrapper-content">
    <div class="ibox" id="mainDiv">
      <div class="ibox-title">{{ $t('message.manage.roleMenu.name') }}</div>
      <div class="ibox-content">
        <div class="row">
          <div class="col-sm-6">
           <a href="javascript:;" @click="openall">{{$t('message.manage.userMenu.open')}}</a> &nbsp;&nbsp; <a href="javascript:;" @click="closeall">{{$t('message.manage.userMenu.close')}}</a>
           <div id="menuTree"></div>
          </div>
          <div class="col-sm-6" align="right">
            <el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
			    	<el-button @click="backpage()">{{$t('message.base.cancel')}}</el-button>
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
                  data: {roleId:ts.$route.params.roleId},
                  postJSON: false,
                  url: 'frame/role/roleMenu.action',
                  success: function (resp) {
                    resp.rows.text = ts.$t(resp.rows.text);
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
      let nodes = ts.treeRef.get_selected(false);
      for(let i=0; nodes&&i<nodes.length; i++){
        ids = ids + nodes[i] + ",";
      }
      $("#menutree").find(".jstree-undetermined").each(function (i, element) {
          ids = ids + $(element).closest('.jstree-node').attr("id") + ",";
      });
      if(ids.length > 0){
        ids = ids.replace(",root", "");
        ids = ids.substring(0, ids.length - 1);
      }
      ajax({
        type:"POST",
        url:"frame/role/menuSave.action",
        dataType:"JSON",
        data:{roleId:ts.$route.params.roleId, menuIds:ids},
        success:function(resp){
           ts.$notify.success({title: ts.$t('message.manage.roleMenu.suc'),offset: 50});
           ts.backpage();
        }
      }, ts);
    },
    backpage:function(){
      this.$router.push('Role')
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

<style lang="less" scoped>
@import "../../style/mixin";
</style>
