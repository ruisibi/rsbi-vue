<template>
    <div class="tableDatasty" id="tableData" style="margin:10px;">
      <template v-if="hasData()">
        <div class="tipinfo">拖拽立方体维度或度量到此处作为交叉表的字段</div>
      </template>
      <template v-if="!hasData()">
        <b>交叉表字段：</b>
        <template v-for="item in comp.rows">
          <span class="dimcol" :key="'p' + item.id">
            <span class="text">{{ item.dimdesc }}</span>
            <div class="ibox-tools">
              <button class="btn btn-outline btn-success btn-xs" type="button" @click="showmenu(item,'row')"><i class="fa fa-wrench"></i>
              </button>
            </div>
          </span>
        </template>
        <template v-for="item in comp.cols">
          <b :key="item.id">列字段：</b>
          <span class="dimcol" :key="'c' + item.id">
            <span class="text">{{ item.dimdesc }}</span>
            <div class="ibox-tools">
              <button class="btn btn-outline btn-success btn-xs" type="button" @click="showmenu(item,'col')"><i class="fa fa-wrench"></i>
              </button>
            </div>
          </span>
        </template>
        <template v-for="item in comp.kpiJson">
          <span class="col" :key="item.kpi_id">
            <span class="text">{{ item.kpi_name }}</span>
            <div class="ibox-tools">
              <button class="btn btn-outline btn-success btn-xs" type="button" @click="showmenu(item, 'kpi')"><i class="fa fa-wrench"></i>
              </button>
            </div>
          </span>
        </template>
      </template>
      <tableDailog ref="tableDailog"></tableDailog>
    </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'
import * as tableUtils from '@/view/bireport/tableUtils'
import * as tools from '@/view/bireport/bireportUtils'
import tableDailog from '@/view/portal/PortalTableDailog'


export default {
  components:{
    tableDailog
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
      this.$forceUpdate();
    },
    hasData(){
      let comp = this.comp;
      let r = (!comp.cols || comp.cols.length ==0) && (!comp.rows || comp.rows.length ===0) && (!comp.kpiJson || comp.kpiJson.length === 0);
      return r;
    },
    tableView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].tableView();
    },
    showmenu(node, pos){
      $.contextMenu( 'destroy');
      let ts = this;
      var comp = this.comp;
      var items = null;
      if(pos === 'row' || pos === 'col'){
        items = {
              "desc":{name:"升序", icon:""},
              "asc":{name:"降序", icon:""},
              "move":{name:"移动", icon:"fa-arrows-alt", items:{left:{name:"左移", icon:"fa-arrow-left"}, right:{name:"右移", icon:"fa-arrow-right"}, moveTo:{name:"移至"+(pos=='row'?'列':"行")+"字段", icon:""}}},
              "aggre": {name: "聚合"},
              "top": {name: "取Top"},
              "clear": {name: "删除", icon:"fa-times"}
          };
        }
        if(pos === 'kpi'){
          items = {
              "prop":{name:"属性", icon:""},
              "sort":{name:"排序", icon:"", items:{
                "desc":{name:"升序", icon:""},
                "asc":{name:"降序", icon:""},
                "def":{name:"默认", icon:""}
              }},
              "move":{name:"移动", icon:"fa-arrows-alt", items:{left:{name:"左移", icon:"fa-arrow-left"}, right:{name:"右移", icon:"fa-arrow-right"}}},
              "clear": {name: "删除", icon:"fa-times"}
          };
        }
        $.contextMenu({
          selector: '#tableData .ibox-tools button.btn', 
          trigger: 'left',
          delay: 500,
          autoHide:true,
          callback: function(opt) {
            if(opt == "asc" || opt == "desc" || opt == 'def'){
              if(opt == "def"){
                opt = "";
              }
              if(pos === 'col' || pos === 'row'){
                ts.dimsort(pos, node, opt);
              }else{
                ts.kpisort(node, opt);
              }
            }else if(opt == "prop"){
              ts.$refs['tableDailog'].kpiProperty(node, comp);
            }else if(opt == "clear"){
              ts.delJsonKpiOrDim(pos, node);
            }else if(opt == "left" || opt == "right"){
              ts.dimkpimove(pos, opt, node);
            }else if(opt == 'moveTo'){
              ts.dimexchange(pos, opt, node);
            }else if(opt === 'top'){
              ts.$refs['tableDailog'].dimTop(node, comp);
            }else if(opt === 'aggre'){
               ts.$refs['tableDailog'].dimAggre(node, comp);
            }
          },
          items: items
      });
    },
    //从交叉表JSON中删除KPI
    delJsonKpiOrDim(pos, node){
      let comp = this.comp;
      if(pos == 'kpi'){
        var kpis = comp.kpiJson;
        var idx = -1;
        for(var i=0; i<kpis.length; i++){
          if(kpis[i].kpi_id == node.kpi_id){
            idx = i;
            break;
          }
        }
        kpis.splice(idx, 1);
      }
      if(pos == 'col' || pos === 'row'){
        var dims = null;
        if(pos == 'col'){
          dims = comp.cols;
        }else{
          dims = comp.rows;
        }
        var idx = -1;
        for(var i=0; i<dims.length; i++){
          if(dims[i].id == node.id){
            idx = i
            break;
          }
        }
        dims.splice(idx, 1);
      }
      this.setUpdate();
      this.tableView();
    },
    dimkpimove(pos, tp, node){
      var comp = this.comp;
      var dims = null;
      if(pos == 'col'){
        dims = comp.cols;
      }else if(pos =="row"){
        dims = comp.rows;
      }else if(pos == "kpi"){
        dims = comp.kpiJson;
      }
      if(dims.length <= 1){
        utils.msginfo('无效移动。');
        return;
      }
      let id = pos === 'kpi'?node.kpi_id:node.id;
      for(var i=0; i<dims.length; i++){
        if((pos=="kpi"?dims[i].kpi_id:dims[i].id) == id){
          if(tp == 'left'){
            if(i <= 0){
              utils.msginfo('无效移动。');
              return;
            }else{
              var tp = dims[i - 1];
              dims[i - 1] = dims[i];
              dims[i] = tp;
             
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
             
            }
          }
          break;
        }
      }
      this.setUpdate();
      this.tableView();
    },
    dimexchange(pos, opt, node){
      let dimid = node.id;
      let comp = this.comp;
      if(pos == 'col'){
        //先移除维度
        var idx = 0;
        var tmp = null;
        var dims = comp.cols;
        for(var i=0; i<dims.length; i++){
          if(dims[i].id == dimid){
            idx = i;
            tmp = dims[i];
            break;
          }
        }
        comp.cols.splice(idx, 1);
        //再添加维度
        comp.rows.push(tmp);
      }
      if(pos == 'row'){
        //先移除维度
        var idx = 0;
        var tmp = null;
        var dims = comp.rows;
        for(var i=0; i<dims.length; i++){
          if(dims[i].id == dimid){
            idx = i;
            tmp = dims[i];
            break;
          }
        }
        comp.rows.splice(idx, 1);
        //再添加维度
        comp.cols.push(tmp);
      }
      this.setUpdate();
      this.tableView();
    },
    dimsort(pos, node, tp){
      let comp = this.comp;
      var dims = null;
      if(pos == 'col'){
        dims = comp.cols;
      }else{
        dims = comp.rows;
      }
      for(var i=0; i<dims.length; i++){
        if(dims[i].id == node.id){
          dims[i].dimord = tp;
          break;
        }
      }
      //进行维度排序时，清除度量的排序信息
      for(let i=0; comp.kpiJson && i<comp.kpiJson.length; i++){
        delete comp.kpiJson[i].sort;
      }
      this.setUpdate();
      this.tableView();
    },
    kpisort(node, tp){
      let comp = this.comp;
      for(let i=0; i<comp.kpiJson.length; i++){
        if(comp.kpiJson[i].kpi_id == node.kpi_id){
          comp.kpiJson[i].sort = tp;
        }else{
          delete comp.kpiJson[i].sort;
        }
      }
      this.setUpdate();
      this.tableView();
    },
    bindDropEvent(){
      let ts = this;
      $("#tableData").droppable({
        accept:"#datasettree .jstree-node",
        tolerance:"pointer",
        over:function(e, ui){
          //对维度拖拽设置图标
          $(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
          $("#tableData").css("border", "1px solid #ff0000");

        },
        out:function(e, ui){
            $(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
           $("#tableData").css("border", "1px dotted #666");
        },
        drop:function(e, ui){
          var json = ts.comp;
          
          //清除边框颜色
          $("#tableData").css("border", "1px dotted #666");

          //获取TREE
          var ref = $("#datasettree").jstree(true);
          var node = ref.get_node(ui.draggable[0]);
          
          //判断拖入的维度及度量是否和以前维度及度量在同一个表。
          if(json.cubeId != undefined){
            if(json.cubeId != node.li_attr.cubeId){
              utils.msginfo("您拖入的"+ (node.li_attr.col_type == 2 ? "度量" : "维度") +"与组件已有的内容不在同一个数据表中，拖放失败。");
              return;
            }
          }else{
            json.cubeId = node.li_attr.cubeId;
            json.dsetId = node.li_attr.dsetId;
            json.dsid = node.li_attr.dsid;			
          }
          
          if(!json.kpiJson){
            json.kpiJson = [];
          };
          if(!json.cols){
            json.cols = [];
          }
          if(!json.rows){
            json.rows = [];
          }
          //写度量
          if(node.li_attr.col_type == 2){
            //如果度量存在就忽略
            if(!tools.kpiExist(node.li_attr.col_id, json.kpiJson)){
              json.kpiJson.push({"kpi_id":node.li_attr.col_id, "kpi_name" : node.text, "col_name":node.li_attr.col_name, "aggre":node.li_attr.aggre, "fmt":node.li_attr.fmt, "alias":node.li_attr.alias,"tname":node.li_attr.tname,"unit":node.li_attr.unit,"rate":node.li_attr.rate});
            }else{
              utils.msginfo("度量已经存在。");
              return;
            }
            
            ts.setUpdate();
            ts.tableView();
          }
          //写维度
          if(node.li_attr.col_type == 1){
            //写row维度
            //if($(this).attr("id") == "d_rowDims"){
              if(!tools.dimExist(node.li_attr.col_id, json.rows) && !tools.dimExist(node.li_attr.col_id, json.cols)){
                json.rows.push({"id":node.li_attr.col_id, "dimdesc" : node.text, "type":node.li_attr.dim_type, "colname":node.li_attr.col_name,"tname":node.li_attr.tname,"iscas":node.li_attr.iscas, "tableName":node.li_attr.tableName, "tableColKey":node.li_attr.tableColKey,"tableColName":node.li_attr.tableColName, "dimord":node.li_attr.dimord, "dim_name":node.li_attr.dim_name,"grouptype":node.li_attr.grouptype,"valType":node.li_attr.valType,"ordcol":node.li_attr.ordcol,"alias":node.li_attr.alias,"calc":node.li_attr.calc});
              }else{
                utils.msginfo("维度已经存在。");
                return;
              }
             
              ts.setUpdate();
              ts.tableView();
            //}
          }
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
  .boxcol {
    border: 1px solid #DF7809;
    display: inline-block;
    margin: 5px;
    padding: 5px;
    text-align: center;
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
