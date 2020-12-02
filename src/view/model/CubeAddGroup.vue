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
          var cid = newGuid();
          var dt = {id:cid,text:this.group.groupName, "icon": "fa fa-tasks", li_attr:{tp:'group',dispName:name,drag:true}};
          var ref = $("#cuberighttree").jstree(true);
          ref.create_node('cubewd', dt);

          if (ref.is_closed('cubewd')) {
            ref.open_node('cubewd');
          }
          this.show = false;
        }
      });
        
    },
    create(){
      this.show = true;
      if(this.$refs['groupForm']){
        this.$refs['groupForm'].resetFields();
     }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
