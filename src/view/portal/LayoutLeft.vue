<template>
  	    <div class="layout-left">
            <div class="tabs-container">
                <ul class="nav nav-tabs">
                    <li :class="isActive('data-tab-1')"><a data-toggle="tab" @click="switchTabs('data-tab-1')" idx="0" aria-expanded="true">组件</a>
                    </li>
                    <li :class="isActive('data-tab-2')"><a data-toggle="tab" @click="switchTabs('data-tab-2')" idx="1" aria-expanded="false">立方体</a>
                    </li>
                    <li :class="isActive('data-tab-3')"><a data-toggle="tab" @click="switchTabs('data-tab-3')" idx="2" aria-expanded="false">数据表</a>
                    </li>
                </ul>
            </div>
            
            <div class="tab-content tab-content2">
                <div id="data-tab-1" class="tab-pane" :class="isActive('data-tab-1')">
                    <div class="panel-body" style="padding:0px;">
                        <div id="paramtree">a</div>
                        <div id="comptree"></div>
                    </div>
                </div>
                <div id="data-tab-2" class="tab-pane" :class="isActive('data-tab-2')">
                    <div class="panel-body" style="padding:0px;">
                        <div id="datasettree">b</div>
                    </div>
                </div>
                <div id="data-tab-3" class="tab-pane" :class="isActive('data-tab-3')">
                    <div class="panel-body" style="padding:0px;">
                        <div id="tabletree">c</div>
                    </div>
                </div>
            </div>
  	    </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
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
        tabActive:"data-tab-1"
    }
  },
  mounted(){

  },
  computed: {
     
  },
  methods: {
      switchTabs(val){
          this.tabActive = val;
      },
      isActive(p){
          return this.tabActive === p ? "active" : ""
      }
  },
  watch: {
  },
  beforeMount(){
   
  },
  beforeDestroy(){
    
  }
}
</script>

<style lang="less" scoped>
    @import "../../style/mixin";
    .layout-left {
        position: fixed;
        width: 220px;
        height: calc(100% - 35px);
        border-right: 1px solid #D3D3D3;
        padding-top: 3px;
        background-color: white;
    }
    .layout-left .nav-tabs > li > a {
        padding: 5px 10px 5px 10px;
        width:70px;
        text-align: center;
        font-size: 13px;
        color: #A7B1C2;
        font-weight: 600;
        cursor: pointer;
    }
    .nav-tabs > li.active > a {
        color: #555555;
        cursor: default;
    }
</style>
