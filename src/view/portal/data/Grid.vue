<template>
    <div style="margin:10px;">
       <div class="tableDatasty" id="gridData">
        <template v-if="!comp.cols || comp.cols.length === 0">
          <div class="tipinfo">拖拽数据表字段到此处作为表格的列字段</div>
        </template>
        <template v-if="comp.cols.length > 0">
          <b>
            表格字段：
          </b>
          <template v-for="item in comp.cols">
            <span :key="item.id" class="dimcol">
              <span class="text">{{item.name}}</span>
              <div class="ibox-tools"><button class="btn btn-outline btn-success btn-xs"><i class="fa fa-wrench"></i></button>
              </div>
           </span>
          </template>
        </template>
       </div>
    </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'

export default {
  components:{
    
  },
  props:{
      comp:{
        type:Object,
        required:true
      }
  },
  data(){
    return {
      
    }
  },
  mounted(){
    this.bindDropEvent();
  },
  computed: {
     
  },
  methods: {
     setUpdate(){
      this.$parent.$parent.isupdate = true;
    },
    gridView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].gridView();
    },
    bindDropEvent(){
      let ts = this;
      $("#gridData").droppable({
          accept:"#tabletree .jstree-node",
		      tolerance:"pointer",
         over:function(e, ui){
            //对维度拖拽设置图标
            $(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
            $("#gridData").css("border", "1px solid #ff0000");
          },
          out:function(e, ui){
            $(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
            $("#gridData").css("border", "1px dotted #666");
          },
         drop:function(e, ui){
           let grid = ts.comp;
            //清除边框颜色
            $("#gridData").css("border", "1px dotted #666");
            
           //获取TREE
          var ref = $("#tabletree").jstree(true);
          var node = ref.get_node(ui.draggable[0]);
            
            if(grid.dsetId && grid.dsetId != node.li_attr.dsetId){
              utils.msginfo("你拖入的字段"+node.text+"与表格已有的内容不在同一个表中，拖放失败！");
              return;
            }else{
              grid.dsetId = node.li_attr.dsetId;
              grid.dsid = node.li_attr.dsid;
            }
            if(!grid.cols){
              grid.cols = [];
            }
            //判断是否存在
            var exist = function(gid){
              var r = false;
              for(let j=0; j<grid.cols.length; j++){
                if(grid.cols[j].id == gid){
                  r = true;
                  break;
                }
              }
              return r;
            };
            if(exist(node.id)){
              utils.msginfo("您拖拽的字段 " + node.text+" 已经存在。");
              return;
            }
            grid.cols.push({id:node.id,name:node.li_attr.name,tname:node.li_attr.tname,type:node.li_attr.type,expression:node.li_attr.expression});
            
           ts.setUpdate();
           ts.gridView();
          }
        });
        
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  .tipinfo {
    color:#999;
    padding:10px;
  }
  .tableDatasty{
    border: 1px dotted #666;
    padding:5px;
    border-radius:5px;
    .col {
      border: 1px solid #DF7809;
      display: inline-block;
      margin: 5px;
      padding: 5px;
      text-align: center;
      width:120px;
      font-size:14px;
      border-radius:5px;
    }
    .dimcol {
        border: 1px solid #0C6ADF;
        display: inline-block;
        margin: 5px;
        padding: 5px;
        text-align: left;
      font-size:14px;
      width:120px;
      border-radius:5px;
    }
  }
  .ibox-tools {
    display: inline-block;
    float: right;
    margin-top: 0;
    position: relative;
    padding: 0;
}
</style>
