<template>
  <el-dialog :title="$t('message.model.group.title')" :visible.sync="show">
    <el-form :model="group" ref="groupForm" :rules="rule">
        <el-form-item :label="$t('message.model.group.name')" label-width="100px" prop="groupName">
          <el-input v-model="group.groupName"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">{{ $t('message.base.ok') }}</el-button>
      <el-button @click="show = false">{{ $t('message.base.cancel') }}</el-button>
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
        groupName: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
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
