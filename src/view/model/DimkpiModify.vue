<template>
  <el-dialog title="编辑维度及度量" :visible.sync="show">
    <el-form :model="node" ref="nodeForm" :rules="rule">
        <template v-if="type === 'dim'">
          <el-form-item label="维度字段" label-width="100px">
            {{ node.col }}
          </el-form-item>
        </template>
        <template v-if="type === 'kpi'">
          <el-form-item label="度量字段" label-width="100px">
            {{ node.col }}
          </el-form-item>
        </template>
        <el-form-item label="别名" label-width="100px">
            {{ node.alias }}
          </el-form-item>
         <el-form-item label="显示名称" label-width="100px" prop="dimname">
          <el-input v-model="node.dimname"></el-input>
         </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ajax, newGuid } from "@/common/biConfig";
import $ from "jquery"

export default {
   name: 'dimkpiModify',
  data() {
    return {
      show:false,
      tit:"",
     node: {
      dimname:"",
      col:"",
      alias:"",
     },
      rule:{
        dimname: [{ required: true, message: "必填", trigger: "blur" }],
      },
      type:''  //dim/kpi/group 三种
    }
  },
  components: {
		
	},
  mounted() {
    
  },
  computed: {},
  methods: {
    save(){
      let ts = this;
      this.$refs['nodeForm'].validate(v=>{
       if(v){
					
          ts.show = false;
       }
      });
    },
    modify(selectNode){
      this.show = true;
      if(this.$refs['nodeForm']){
        this.$refs['nodeForm'].resetFields();
      }
      this.type = selectNode.li_attr.tp;
      this.node.col = selectNode.li_attr.col;
      this.node.alias = selectNode.li_attr.alias;
      this.node.dimname = selectNode.li_attr.dispName;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
