<template>
    <el-dialog title="设置报表布局" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
      <div class="el-dialog-div">
        <el-radio-group v-model="layoutId">
          <template v-for="l in layouts">
            <span class="rlayout" :key="l">
              <div class="onelayout">
                <img :src="require('../../assets/layout/l'+l+'.png')" @click="selectRadio(l)">
                <el-radio :label="l"><template v-if="l === 6">自定义</template><template v-if="l !== 6">布局{{l}}</template></el-radio>
              </div>
            </span>
          </template>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">确 定</el-button>
        <el-button @click="show = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import * as layout from './Utils'
import $ from 'jquery'

export default {
  components:{

  },
  props:{
      pageInfo:{
        type:Object,
        required:true
     }
  },
  data(){
    return {
        show:false,
        layouts:[1,2,3,4,5,6],
        layoutId:1
    }
  },
  mounted(){

  },
  computed: {
     
  },
  methods: {
     setLayout(){
       this.layoutId = this.pageInfo.layout;
       this.show = true;
     },
     selectRadio(l){
       this.layoutId = l;
     },
     save(){
       let l = this.layoutId;
       if(l === 6){  //自定义
            this.show = false;
            var o = this.$parent;
            o.showAutoLayout = true;
            this.$nextTick(()=>{
              o.$refs['autoLayoutForm'].showDailog();
            });
       }else{
         let comps = layout.findAllComps(this.pageInfo);
         let json = layout.layout["l"+l];
         this.pageInfo.layout = l;
         this.pageInfo.body = json;
         json['tr1'][0].children = comps;  //都放入第一个布局td
         this.show = false;
         this.$parent.isbindTdEvent = true;
       }
     }
  }
}
</script>

<style lang="less" scoped>
   span.rlayout {
    display:inline-block;
    width:100px;
    height:100px;
    text-align:center;
    vertical-align:central;
  }
</style>
