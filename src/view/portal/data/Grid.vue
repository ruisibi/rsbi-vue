<template>
    <div style="margin:10px;">
       <div class="tableDatasty" id="gridData">
        <template v-if="!comp.cols || comp.cols.length === 0">
          <div class="tipinfo">拖拽数据表字段到此处作为表格的列字段</div>
        </template>
        <template v-if="comp.cols && comp.cols.length > 0">
          <b>
            表格字段：
          </b>
          <template v-for="item in comp.cols">
            <span :key="item.id" class="dimcol">
              <span class="text">{{item.name}}</span>
              <div class="ibox-tools"><button class="btn btn-outline btn-success btn-xs" @click="setGridCol(item)"><i class="fa fa-wrench"></i></button>
              </div>
           </span>
          </template>
        </template>
       </div>
         	<el-dialog title="表格字段属性" :visible.sync="propshow" :close-on-click-modal="false" custom-class="nopadding">
             <el-form :model="val" ref="valForm" label-position="left">
                <el-form-item label="显示名称" label-width="100px">
                  <el-input v-model="val.dispName" label="名称"></el-input>
                </el-form-item>
                <el-form-item label="所属表" label-width="100px">
                  {{col.tname}}
                </el-form-item>
                <el-form-item label="对应字段" label-width="100px">
                  {{col.name}}
                </el-form-item>
                <el-form-item label="位置" label-width="100px">
                   <el-radio-group v-model="val.palign" size="small">
                    <el-radio-button label="left">居左</el-radio-button>
                    <el-radio-button label="center">居中</el-radio-button>
                    <el-radio-button label="right">居右</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <template v-if="col.type === 'Date' || col.type ==='Datetime'">
                  <el-form-item label="格式化" label-width="100px">
                    <el-input v-model="val.fmt"></el-input>
                  </el-form-item>
                </template>
                 <template v-if="col.type === 'Double' || col.type ==='Int'">
                <el-form-item label="格式化" label-width="100px">
                    <el-select
                      v-model="val.fmt"
                      placeholder="请选择"
                      >
                      <el-option
                        v-for="item in opt.fmts"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      >
                    </el-option>
                    </el-select>
                </el-form-item>
                 </template>
             </el-form>
             <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveProp()">确 定</el-button>
              <el-button @click="propshow = false">取 消</el-button>
            </div>
          </el-dialog>
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
      propshow:false,
      val:{
        dispName:"",
        palign:"left",
        fmt:""
      },
      col:{
        tname:null,
        name:null
      },
      opt:{
        fmts:utils.fmtJson
      }
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
      this.$forceUpdate();
    },
    gridView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].gridView();
    },
    setGridCol(col){
      $.contextMenu( 'destroy');
      let ts = this;
      var comp = this.comp;
      var items = {
            "sort":{name:"排序", items:{asc:{name:"升序",icon:"fa-sort-amount-asc"},
                desc:{name:"降序", icon:"fa-sort-amount-desc"},
                def:{name:"默认", icon:""}}},
            "move":{name:"移动", icon:"fa-arrows-alt", items:{left:{name:"左移", icon:"fa-arrow-left"}, right:{name:"右移", icon:"fa-arrow-right"}}},
            "prop": {name: "属性"},
            "clear": {name: "删除", icon:"fa-times"}
        };
        $.contextMenu({
          selector: '#gridData span.dimcol button', 
          trigger: 'left',
          delay: 500,
          autoHide:true,
          callback: function(opt) {
            if(opt == "asc" || opt == "desc" || opt == 'def'){
              if(opt == "def"){
                opt = "";
              }
              ts.gridColsort(opt, comp, col);
            }else if(opt == "prop"){
              ts.setGridColProp(comp, col);
            }else if(opt == "clear"){
              ts.delGridCol(comp, col.id);
            }else if(opt == "left" || opt == "right"){
              ts.tableColmove(opt, comp, col.id);
            }
          },
          items: items
      });
    },
    setGridColProp(comp, col){
      this.propshow = true;
      this.col = col;
      this.val.dispName = col.dispName;
      this.val.fmt = col.fmt;
      this.val.palign = col.align;
    },
    saveProp(){
      let col = this.col;
      col.dispName = this.val.dispName;
			col.fmt = this.val.fmt;
      col.align = this.val.palign;
      this.propshow = false;
      this.setUpdate();
      this.gridView();
    },
    tableColmove(tp, comp, id){
      var dims = comp.cols;
      if(dims.length <= 1){
        utils.msginfo('无效移动。');
        return;
      }
      for(var i=0; i<dims.length; i++){
        if(dims[i].id == id){
          if(tp == 'left'){
            if(i <= 0){
              utils.msginfo('无效移动。');
              return;
            }else{
              var tp = dims[i - 1];
              dims[i - 1] = dims[i];
              dims[i] = tp;
              this.setUpdate();
               this.gridView();
              return;
            }
          }else
          if(tp == 'right'){
            if( i >= dims.length - 1){
              utils.msginfo('无效移动。');
              return;
            }else{
              var tp = dims[i + 1];
              dims[i + 1] = dims[i];
              dims[i] = tp;
              this.setUpdate();
              this.gridView();
              return;
            }
          }
          break;
        }
      }
    },
    delGridCol(comp, id){
      if(comp.cols.length == 1){
        utils.msginfo("表格至少需要含有一个字段。");
        return;
      }
      //从json移除
      var idx = -1;
      for(let i=0; i<comp.cols.length; i++){
        var p = comp.cols[i];
        if(p.id == id){
          idx = i;
          break;
        }
      }
      comp.cols.splice(idx, 1);
      this.setUpdate();
      this.gridView();
    },
    gridColsort(tp, comp, col){
      //清楚其他字段的排序
      for(let i=0; i<comp.cols.length; i++){
        delete comp.cols[i].sort;
      }
      if(tp != ""){
        col.sort = tp;
      }
      this.setUpdate();
      this.gridView();
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
