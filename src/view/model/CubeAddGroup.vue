<template>
  <el-dialog title="创建维度分组" :visible.sync="show">
    <el-form :model="group" ref="groupForm" :rules="rule">
        <el-form-item label="分组名称" label-width="100px" prop="groupName">
          <el-input v-model="group.groupName"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { baseUrl, ajax, newGuid } from "@/common/biConfig";
import $ from "jquery"

export default {
   name: 'cubeGroup',
  data() {
    return {
      show:false,
      isupdate:false,
     group: {
       groupName:""
     },
      rule:{
        groupName: [{ required: true, message: "必填", trigger: "blur" }],
      }
    }
  },
  components: {
		
	},
  mounted() {
    
  },
  computed: {},
  methods: {
    save(){
      this.$refs['groupForm'].validate(v=>{
        if(v){
          let name = this.group.groupName;
          var ref = $("#cuberighttree").jstree(true);
          if(this.isupdate){
             let node = ref.get_selected(true)[0];
             node.li_attr.dispName = name;
             ref.rename_node(node, name);
          }else{
            var cid = newGuid();
            var dt = {id:cid,text:name, "icon": "fa fa-tasks", li_attr:{tp:'group',dispName:name,drag:true}};
            ref.create_node('cubewd', dt);
            if (ref.is_closed('cubewd')) {
              ref.open_node('cubewd');
            }
          }
          this.show = false;
        }
      });
        
    },
    create(isupdate, node){
      this.isupdate = isupdate;
      this.show = true;
      if(this.$refs['groupForm']){
        this.$refs['groupForm'].resetFields();
     }
     if(isupdate){
       this.group.groupName = node.li_attr.dispName;
     }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
