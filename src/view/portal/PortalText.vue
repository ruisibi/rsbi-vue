<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
      <el-input
        type="textarea"
        :rows="5"
        v-model="ctx">
      </el-input>
      <div slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="save()">确 定</el-button>
				<el-button @click="show = false">取 消</el-button>
			  </div>
  	</el-dialog>
</template>

<script>
import {baseUrl,newGuid} from '@/common/biConfig'
import PortalIndex from "./PortalIndex.vue"
import { Message } from 'element-ui'
import * as utils from './Utils'


export default {
  components:{

  },
  data(){
    return {
      ctx:"",
      title:"",
      show:false,
      layoutId:null,
      comp:null
    }
  },
  mounted(){

  },
  computed: {
  },
  methods: {
    insertText(tp, layoutId, comp){
      this.title = "请输入文本内容 - 文本框";
      this.show = true;
      this.ctx = "";
      this.layoutId = layoutId;
      this.comp = comp;
      if(comp){
        this.ctx = comp.desc;
      }
    },
    save(){
      if(this.ctx.length === 0 ){
        Message.error({message:"请录入文本内容", type:"error",showClose: true});
        return;
      }
      if(this.comp){
        this.comp.desc = this.ctx;
      }else{
        var obj = {"id":newGuid(), type:'text', name:"文本", desc:this.ctx};
        this.$parent.addComp(this.layoutId, obj);
      }
      this.$parent.setUpdate();
      this.$parent.$forceUpdate();
      this.show = false;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
