<template>
  <div class="customizLayout">
      <el-menu @select="handleSelect" class="el-menu-demo" background-color="#f6f8f8" text-color="#777" mode="horizontal">
        <el-menu-item index="back"><i class="fa fa-arrow-left"></i> 返回</el-menu-item>
        <el-menu-item index="save"><i class="glyphicon glyphicon-save"></i> 保存</el-menu-item>
        <el-menu-item index="layout"><i class="glyphicon glyphicon-th-large"></i> 布局</el-menu-item>
        <el-submenu index="data">
          <template slot="title"><i class="fa fa-database"></i> 数据</template>
          <el-menu-item index="data-1">选择立方体</el-menu-item>
          <el-menu-item index="data-2">选择数据表</el-menu-item>
        </el-submenu>
        <el-menu-item index="view"><i class="glyphicon glyphicon-file"></i> 预览</el-menu-item>
      </el-menu>
      <div class="report-layut">
        <layout-left :pageInfo="pageInfo" ref="layoutleftForm"></layout-left>
        <layout-right :pageInfo="pageInfo" ref="layoutRightForm"></layout-right>
        <div class="layout-center">
          <layout-param ref="paramForm" :pageInfo="pageInfo"></layout-param>
          <layout-optarea ref="optarea" :pageInfo="pageInfo"></layout-optarea>
        </div>
        <layoutBottom :pageInfo="pageInfo" ref="layoutBottomForm"></layoutBottom>
      </div>
      <portal-layout :pageInfo="pageInfo" ref="layout"></portal-layout>
      <selectCube ref="selectCubeForm" :callback="selectCubeCallback"></selectCube>
      <select-dset ref="selectDsetForm"></select-dset>
       <layout-param-add ref="prarmAddForm" :pageInfo="pageInfo"></layout-param-add>
       <auto-layout ref="autoLayoutForm" v-if="showAutoLayout" :pageInfo="pageInfo"></auto-layout>

      <!-- 保存框 -->
       <el-dialog title="报表保存" :visible.sync="saveShow" :close-on-click-modal="false" custom-class="nopadding">
         <el-form :model="saveInfo" ref="saveForm" :rules="rules" label-position="left">
             <el-form-item label="报表名称" label-width="100px" prop="name">
              <el-input v-model="saveInfo.name"></el-input>
            </el-form-item>
         </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="savePage()">确 定</el-button>
          <el-button @click="saveShow = false">取 消</el-button>
        </div>
      </el-dialog>
  </div> 
</template>
<script>
import {baseUrl, ajax} from '@/common/biConfig'
import layoutLeft from "./LayoutLeft.vue"
import PortalLayout from "./PortalLayoutDailog.vue"
import AutoLayout from "./PortalLayoutAuto.vue"
import selectCube from "@/view/bireport/SelectCube"
import SelectDset from "./SelectDset"
import layoutParam from "./LayoutParam.vue"
import LayoutOptarea from './LayoutOptarea.vue'
import LayoutParamAdd from './LayoutParamAdd.vue'
import LayoutBottom from './LayoutBottom.vue'
import * as utils from './Utils'
import $ from 'jquery'
import "jquery-contextmenu";
import "jquery-contextmenu/dist/jquery.contextMenu.min.css";
import 'jquery-ui-dist/jquery-ui'
import 'jquery-ui-dist/jquery-ui.css'
  
import LayoutRight from './LayoutRight.vue'

export default {
  name: "customizer",
  components: {layoutLeft, PortalLayout, selectCube, SelectDset, layoutParam, LayoutOptarea, LayoutParamAdd, LayoutBottom, LayoutRight,AutoLayout},
  props: {

  },
  data() {
    return {
        pageInfo:{"layout":1,"body":{tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]}},
        isupdate:false,
        saveShow:false,
        dataPanelShow:false,
        showAutoLayout:false,
        saveInfo:{
          name:null
        },
        rules:{
          name:[
						{ required: true, message: '必填', trigger: 'blur' }
          ]
        },
        isbindTdEvent:false  //是否给布局器table的 td 绑定拖拽事件
    }
  },
  methods: {
    //回写报表
    init(pageId){
      ajax({
        url:"portal/get.action",
        data:{pageId:pageId},
        type:"GET",
        success:(resp)=>{
          this.pageInfo = JSON.parse(resp.rows);
          this.isbindTdEvent = true; //需要重新绑定事件

          let o = this.$refs['layoutleftForm'];
          o.initdset( this.pageInfo.table);
          o.initcubes( this.pageInfo.selectDs);
        }

      }, this);
    },
    //显示数据面板
    showDataPanel(comp){
        this.$refs['layoutBottomForm'].showPanel(comp);
        this.$refs['layoutRightForm'].closeproperty();
    },
    hidePanel(){
      this.$refs['layoutRightForm'].closeproperty();
      this.$refs['layoutBottomForm'].closeDatapanel();
    },
    showPropPanel(comp){
      this.$refs['layoutBottomForm'].closeDatapanel();
      this.$refs['layoutRightForm'].showPanel(comp);
    },
    handleSelect(key, keyPath){
      if(key === 'back'){
        if(this.isupdate == true){
          if(confirm("您还未保存报表，是否确认退出？")){
            this.$router.push("/portal/Index");
          }
        }else{ //保存过了，直接退出
          this.$router.push("/portal/Index");
        }
      }
      if(key ==='layout'){
        this.$refs['layout'].setLayout();
      }
      if(key === 'data-1'){
        this.$refs['selectCubeForm'].select();
      }
      if(key === 'data-2'){
        this.$refs['selectDsetForm'].select();
      }
      if(key === 'view'){
        if(!this.pageInfo.id){
          this.$notify.error({
            title: '报表还未保存，不能预览!',
            offset: 50
          });
          return;
        }
        this.$router.push({path:"/portal/View", query:{id:this.pageInfo.id}});
      }
      if(key === 'save'){
        if(!this.pageInfo.id){
          this.saveShow = true;
        }else{
           this.savePage();
        }
      }
    },
    selectCubeCallback(cubeId){
      this.pageInfo.selectDs = cubeId;
      var o = this.$refs['layoutleftForm'];
      o.tabActive = 'data-tab-2';
      o.initcubes(cubeId);
    },
    savePage(){
      let ts = this;
      var pageId = this.pageInfo.id;
      //删除组件分页信息
      utils.findAllComps(this.pageInfo).forEach(element => {
        delete element.curPage;
      });
      if(!pageId){
        this.$refs['saveForm'].validate((valid) => {
           if(valid){
             ajax({
               url:"portal/save.action",
               type:"POST",
               data:{"pageInfo": JSON.stringify(ts.pageInfo), pageName:ts.saveInfo.name},
               success:(resp)=>{
                 ts.$notify.success({
                    title: '保存成功!',
                    offset: 50
                  });
                  ts.saveShow = false;
                  ts.pageInfo.id = resp.rows;
                  ts.isupdate = false;
               }
             }, ts);
           }
        });
      }else{
        ajax({
          url:"portal/save.action",
          type:"POST",
          data:{"pageInfo": JSON.stringify(ts.pageInfo), pageId:pageId},
          success:(resp)=>{
            ts.$notify.success({
              title: '更新成功!',
              offset: 50
            });
            ts.isupdate = false;
          }
        }, ts);
      }
    }
  },
  watch: {
    
  },
  mounted() {
    let id =  this.$route.query.id;
    if(id){
      this.init(id);
    }
  },
  beforeRouteLeave: function(to, from, next) {
    this.$destroy();
    next();
  }
}
</script>
<style lang="less" scoped>
  .customizLayout {
    width: 100%;
    height: calc(100% - 32px);
  }
  .layout-center {
        position: inherit;
        margin: 0 0 0 223px;
        height: 100%;
    }
    .report-layut {
       width: 100%;
       height: calc(100% - 35px);
    }
</style>
