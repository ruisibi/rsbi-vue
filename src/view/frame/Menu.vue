<template>
  <div class="wrapper-content">
    <div class="ibox" id="mainDiv">
      <div class="ibox-title">菜单管理</div>
      <div class="ibox-content">
        <div class="row">
          <div class="col-sm-6">
            <div id="menuTree"></div>
          </div>
          <div class="col-sm-6">
            <p class="text-warning">在菜单上点击鼠标右键来新建或编辑菜单。</p>
          </div>
        </div>
      </div>
    </div>
	<operationDailog mainDiv="mainDiv"  :title="operDailogTitle" ref="operForm" :callback="saveMenu">
		<div class="row">
			<div class="col-sm-6">
				<el-form :model="menu" :rules="rules" ref="menuForm">
				    <el-form-item label="名称" label-width="100px" prop="menuName">
				     	<el-input v-model="menu.menuName" ></el-input>
				    </el-form-item>
					<el-form-item label="URL" label-width="100px">
				     	<el-input v-model="menu.menuUrl" placeholder="如果创建目录则不用填写URL"></el-input>
				    </el-form-item>
					<el-form-item label="排序" label-width="100px">
						<el-input-number v-model="menu.menuOrder" :min="0" :max="100"></el-input-number>
					</el-form-item>
					<el-form-item label="备注" label-width="100px">
				     	<el-input v-model="menu.menuDesc" ></el-input>
				    </el-form-item>
					<el-form-item label="图标" label-width="100px">
				     	<div id="picview" style="font-size:20px;"></div>
				    </el-form-item>
			  	</el-form>
			</div>
			<div class="col-sm-6">
				<div style="height:400px; overflow:auto;">
				<template v-for="(m) in menuIcons">
					<a href="javascript:;" @click="showPic(m.cls)" style='color:#403a3a; text-decoration:none' :key="m.index"><i :class="m.cls"></i> &nbsp; </a>
				</template>
				</div>
			</div>
		</div>
	</operationDailog>
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import operationDailog from '@/components/OperationDailog'
import $ from "jquery";
import "jstree";
import "jstree/dist/themes/default/style.min.css";
import menuData from "@/assets/data/menu-icons.json"

export default {
  data() {
    return {
		menu:{
			menuId:null,
			menuPid:null,
			menuName:"",
			menuDesc:"",
			menuOrder:0,
			menuUrl:"",
			avatar:""
		},
		rules:{
			menuName:[
				{ required: true, message: '必填', trigger: 'blur' }
			]
		},
		operDailog:false,
		operDailogTitle:"",
		menuIcons : menuData
	};
  },
  components: {
		operationDailog
	},
  mounted() {
    this.initTree();
  },
  computed: {},
  methods: {
	  addMenu:function(node, isupdate){
		  this.operDailogTitle = isupdate?"修改菜单":"创建菜单";
		  this.$refs.operForm.showDailog();
	  },
	  delMenu:function(node){

	  },
	  showPic:function(cls){
		  $("#picview").html(`<i class='${cls}'></i>`);
	  },
	  //在 operationDailog 里面进行回掉的函数
	  saveMenu:function(){
		  return true;
	  },
    //初始化 jstree
    initTree: function () {
		let ts = this;
      $("#menuTree")
        .jstree({
          core: {
            check_callback: true,
            data: function (obj, callback) {
              if (obj.id == "#") {
                callback.call(this, [
                  {
                    id: "0",
                    text: "系统菜单",
                    children: true,
                    state: { opened: true },
                    icon: "fa fa-home",
                  },
                ]);
              } else {
                ajax({
                  type: "GET",
                  data: {id: obj.id},
                  postJSON: false,
                  url: 'frame/menu/loadData.action',
                  success: function (resp) {
                    callback.call(this, resp.rows);
                  },
                }, ts);
              }
            },
          },
          contextmenu: {
            items: {
              add: {
                label: "新增",
                icon: "glyphicon glyphicon-plus",
                action: function (data) {
                  const inst = $.jstree.reference(data.reference),
                    node = inst.get_node(data.reference);
                  ts.addMenu(node, false);
                },
              },
              modify: {
                label: "修改",
                icon: "glyphicon glyphicon-edit",
                action: function (data) {
                  const inst = $.jstree.reference(data.reference),
                    node = inst.get_node(data.reference);
                  ts.addMenu(node, true);
                },
                _disabled: function (data) {
                  const inst = $.jstree.reference(data.reference),
                    node = inst.get_node(data.reference);
                  if (node.id == "0") {
                    return true;
                  } else {
                    return false;
                  }
                },
              },
              remove: {
                label: "删除",
                icon: "glyphicon glyphicon-trash",
                _disabled: function (data) {
                  const inst = $.jstree.reference(data.reference),
                    node = inst.get_node(data.reference);
                  if (node.id == "0") {
                    return true;
                  } else {
                    return false;
                  }
                },
                action: function (data) {
                  const inst = $.jstree.reference(data.reference),
                    node = inst.get_node(data.reference);
                  ts.delMenu(node);
                },
              },
            },
          },
          plugins: ["wholerow", "contextmenu"],
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
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
