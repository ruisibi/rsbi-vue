<template>
  	<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
      <el-input
        type="textarea"
        :rows="5"
        v-model="ctx">
      </el-input>
      <div slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
				<el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
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
      this.title =this.$t('message.report.text.title');
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
        Message.error({message:this.$t('message.report.text.note'), type:"error",showClose: true});
        return;
      }
      if(this.comp){
        this.comp.desc = this.ctx;
        this.$parent.setUpdate();
        this.show = false;
        this.$parent.$forceUpdate();
      }else{
        var obj = {"id":newGuid(), type:'text', name:this.$t('message.report.text.name'), desc:this.ctx};
        this.$parent.addComp(this.layoutId, obj);
        this.$parent.setUpdate();
        this.show = false;
        this.$parent.$forceUpdate();
        this.$parent.$nextTick(()=>{
          this.$parent.bindCompEvent(obj);
        });
      }
      
      
    }
  }
}
</script>

<style lang="less" scoped>

</style>
