<!--
编辑窗口， 在本页面打开页面
 -->
<template>
  <div v-show="dailogShow">
    <div class="ibox" style="margin-bottom:0px;">
        <div class="ibox-title" style="height:33px;">
            {{title}} &nbsp;
            <button class="btn btn-outline btn-info btn-xs" @click="goback()"><i class="fa fa-chevron-left"></i>返回</button>
        </div>
        <div class="ibox-content" :style="autoHeight()" style="padding-bottom: 0px;overflow:auto;">
            <slot></slot>
        </div>
        <div class="ibox-footer">
            <el-button type="primary" @click="saveForm()">确 定</el-button>
			<el-button @click="closeDailog()">取 消</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
  
export default {
  name: 'operationDailog',
  props:{
      title:{
          type:String,
          required:true
      },
      mainDiv:{
          type:String,
          required:true
      },
      callback:{
          type:Function,
          required:true
      }
  },
  data () {
    return {
        dailogShow:false,
    }
  },
  computed:{
      
  },
  methods:{
      //动态计算div高度
    autoHeight:function(){
        let h = $(".page-wrapper").height();
        if(h){
            return  "height:"+ (h - 135 )+ "px;";
        }else{
            return "height:460px;";
        }
    },
    showDailog:function(){
        this.dailogShow = true;
        $("#" + this.mainDiv).hide();
    },
    closeDailog:function(){
        this.dailogShow = false;
        $("#" + this.mainDiv).fadeIn('slow');
    },
    saveForm:function(){
        if(this.callback()){
            this.closeDailog();
        }
    },
     goback(){
      this.closeDailog();
    }
  }
}
</script>

<style scoped lang="less">
  @import '../style/mixin';
  .ibox-footer {
	text-align:center;
	padding:6px; 
	background-color: #f6f8f8;
	border-top: 1px solid #edf1f2;
}
</style>
