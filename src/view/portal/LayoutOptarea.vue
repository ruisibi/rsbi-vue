<!-- 布局器 -->
<script>
import { baseUrl, newGuid } from "@/common/biConfig";
import PortalText from "./PortalText.vue"
import ChartDailog from './ChartDailog.vue'
import ChartSeriesColor from './ChartSeriesColor.vue'
import CompFilter from './CompFilter.vue'
import CompEvent from './CompEventDailog.vue'
import $ from "jquery";
import * as utils from './Utils'
import BoxView from "./view/Box.vue"
import ChartView from "./view/Chart.vue"
import GridView from "./view/Grid.vue"
import TableView from "./view/Table.vue"
import * as echartsUtils from '@/common/echartsUtils'

export default {
  components: {
    PortalText,
    BoxView,
    ChartView,
    GridView,
    TableView,
    ChartDailog,
    CompFilter,
    ChartSeriesColor,
    CompEvent
  },
  props: {
    pageInfo: {
      type: Object,
      required: true,
      default:{}
    }
  },
  render(h) {
    //在render函数执行后绑定拖拽事件
    this.$nextTick(()=>{
      if(this.$parent.isbindTdEvent===true){
        //绑定布局器的事件
        this.bindTdEvent();
        //绑定组件的事件
        utils.findAllComps(this.pageInfo).forEach(e=>this.bindCompEvent(e));
        this.$parent.isbindTdEvent = false;
      }
    });

    var json = this.pageInfo.body || {};
    var trs = [];
    for (var i = 1; true; i++) {
      var tr = json["tr" + i];
      if (!tr || tr == null) {
        break;
      }
      var tds = [];
      for (var j = 0; j < tr.length; j++) {
        var td = tr[j];
        
        let cmps = [];
        if(td.children){
          for(var k=0; k<td.children.length; k++){
            var comp = td.children[k];
            cmps.push(this.renderComp(comp, h, td.id));
          }
        }

        tds.push(
          h("td", {
            attrs: {
              class: "laytd",
              id:"layout_" + td.id,
              height: td.height + "%",
              width: td.width + "%",
              colspan: td.colspan,
              rowspan: td.rowspan,
            },
          }, cmps)
        );
      }
      trs.push(h('tr', {}, tds));
    }
    let table = h('table', {attrs:{border:"0", cellspacing:"0", cellpadding:"0", class:"r_layout", id:"layout_table"}}, [h('tbody', trs)]);
    return h("div", {attrs:{id:"optarea", class:"layout-center-body", align:"center"}}, 
      [
        table, 
        h('div', {class:"indicator"}, '==>'),
        h('PortalText',{ref:"portalTextForm"},''),
        h('ChartDailog', {ref:"chartDailogForm"}),
        h('ChartSeriesColor', {ref:"ChartSeriesColorForm"}),
        h('CompEvent', {ref:"CompEventForm", props:{pageInfo:this.pageInfo}}),
        h('CompFilter', {ref:"compFilterForm", props:{pageInfo:this.pageInfo}})
      ]
    );
  },
  data() {
    return {
      curTmpInfo:{}  //临时对象
    };
  },
  mounted() {
      //放入window对象
    window.echartsUtils = echartsUtils;
    var echarts = require('echarts');
    window.echarts = echarts;

    this.bindTdEvent();
    $(window).resize(()=>this.resizeChart());
  },
  beforeDestroy(){
    $(window).unbind("resize");
  },
  computed: {},
  methods: {
    setUpdate(){
      this.$parent.isupdate = true;
    },
    addComp(layoutId, comp){
        var layout = utils.findLayoutById(layoutId, this.pageInfo);
        if(!layout.children){
          layout.children = [];
        }
        layout.children.push(comp);
        this.$nextTick(()=>this.bindCompEvent(comp));
    },
    renderComp(comp, h, layoutId){
      let tools = [
        h('button', {class:"btn btn-outline btn-success btn-xs", attrs:{title:"设置组件"}, on:{click:()=>{this.showCompMenu(comp, layoutId)}}}, [h('i', {class:"fa fa-wrench"})]),
        h('span',' '),
        h('button', {class:"btn btn-outline btn-danger btn-xs", attrs:{title:"删除组件"}, on:{click:()=>{this.deleteComp(comp, layoutId)}}}, [h('i', {class:"fa fa-times"})])
      ];
      let title = h('div', {class:"ibox-title"}, [h('div', {class:"ctit"}, [h('h5', comp.name)]), h('div', {class:"ibox-tools"}, tools)]);
      let compctx = [];
      if(comp.type === 'box'){
        compctx.push(h('box-view',{ref:'mv_'+comp.id, key:"k_"+comp.id, attrs:{comp:comp, portalParams:this.pageInfo.params, editor:true}}));
      }else if(comp.type ==='chart'){
        compctx.push(h('chart-view',{ref:'mv_'+comp.id, key:"k_"+comp.id, attrs:{comp:comp, portalParams:this.pageInfo.params,  editor:true}}));
      }else if(comp.type === 'grid'){
        compctx.push(h('grid-view',{ref:'mv_'+comp.id, key:"k_"+comp.id, attrs:{comp:comp, portalParams:this.pageInfo.params,  editor:true}}));
      }else if(comp.type === 'table'){
        compctx.push(h('table-view',{ref:'mv_'+comp.id, key:"k_"+comp.id, attrs:{comp:comp, portalParams:this.pageInfo.params,  editor:true}}));
      }
      let style = {padding:"1px", width:"100%"};
      let bgcolor = comp.bgcolor;
      if(bgcolor){
        style['background-color'] = bgcolor;
      }
      if(comp.height){
        style['height'] =  comp.height + "px";
      }
      let bodys = {class:"ccctx", style:{}};
      if(comp.type ==='text'){
        bodys.domProps = {innerHTML:comp.desc.replace(/\n/g,"<br>")};
        //处理 text 的 style
        if(comp.style){
          let s = comp.style;
          let s2 = bodys.style;
          if(s.talign){
            s2['text-align'] = s.talign;
          }
          if(s.tfontsize){
            s2['font-size'] = s.tfontsize + "px";
          }
          if(s.tfontcolor){
            s2['color'] = s.tfontcolor;
          }
          if(s.tfontweight){
            s2['font-weight'] = "bold";
          }
          if(s.titalic){
            s2['font-style'] = 'italic';
          }
          if(s.tunderscore){
            s2['text-decoration'] = 'underline';
          }
        }
      }
      //let winSizeGrip = h('div', {class:"win-size-grip"});
      let ctx = h('div', {class:"cctx ibox-content", style:style}, [h('div', bodys, comp.type=='text'?"":compctx)]);
      return h('div', {attrs:{class:"ibox", id:"c_" + comp.id}}, [title, ctx]);
    },
    showCompMenu(comp, layoutId){
      let ts = this;
        //移除菜单
        $.contextMenu( 'destroy');
        var items = null;
        var divId = "";
        if(comp.type == "chart"){
          divId = "chart_menu";
          items = {
                    "tblx": {name: "图表类型",callback:function(){
                      ts.$refs['chartDailogForm'].changeType(comp);
                    }},
                    "data": {name: "数据", icon:"fa-database", callback:function(){
                      ts.editComp(comp, layoutId);
                    }},
                    "filter": {name: "筛选",icon:"fa-filter", callback:function(){
                      ts.$refs['compFilterForm'].init(comp);
                    }},
                    "event": {name: "事件",icon:"fa-bolt", callback:function(){
                      ts.compevent(comp);
                    }},
                    "prop": {name: "属性", callback:function(){
                      ts.setComp(comp, layoutId);
                    }}
                };
        }else if(comp.type == "table"){
          divId = "table_menu";
          items = {
                    "data": {name: "数据", icon:"fa-database", callback:function(){
                      ts.editComp(comp, layoutId);
                    }},
                    "filter": {name: "筛选",icon:"fa-filter", callback:function(){
                      ts.$refs['compFilterForm'].init(comp);
                    }},
                    "event": {name: "事件",icon:"fa-bolt", callback:function(){
                      ts.compevent(comp);
                    }},
                    "prop": {name: "属性", callback:function(){
                      ts.setComp(comp, layoutId);
                    }}
                };
        }else if(comp.type == "text"){
          divId = "text_menu";
          items = {
                    "data": {name: "编辑", icon:"fa-edit", callback:function(){
                      ts.editComp(comp, layoutId);
                    }},
                    "prop": {name: "属性", callback:function(){
                      ts.setComp(comp, layoutId);
                    }}
                };
        }else if(comp.type == "grid"){
          divId = "grid_menu";
          items = {
                  "data": {name: "数据", icon:"fa-database", callback:function(){
                      ts.editComp(comp, layoutId);
                    }},"filter": {name: "筛选", icon:"fa-filter", callback:function(){
                      ts.$refs['compFilterForm'].init(comp);
                    }},"prop": {name: "属性", callback:function(){
                      ts.setComp(comp, layoutId);
                    }}
                };
        }else if(comp.type == "box" || comp.type == "mbox"){
          divId = "box_menu";
          items = {
                    "data": {name: "数据", icon:"fa-database", callback:function(){
                      ts.editComp(comp, layoutId);
                    }},"filter": {name: "筛选", icon:"fa-filter", callback:function(){
                      ts.$refs['compFilterForm'].init(comp);
                    }},"prop": {name: "属性", callback:function(){
                      ts.setComp(comp, layoutId);
                    }}
                };
        }
        
        $.contextMenu({
              selector: 'div.ibox div.ibox-title button.btn-success', 
              className: "m_" + divId,
              trigger: 'left',
              delay: 500,
              zIndex:9999,
              autoHide:true,
              callback: function(key, opt) {
                
              },
              items: items
          });
    },
    editComp(comp, layoutId){
      if(comp.type ==='grid'){
        this.$parent.$refs['layoutleftForm'].tabActive = 'data-tab-3';
      }else{
        this.$parent.$refs['layoutleftForm'].tabActive = 'data-tab-2';
      }
      if(comp.type === 'text'){
        this.$refs['portalTextForm'].insertText("update", layoutId, comp);
      }else{
        this.$parent.showDataPanel(comp);
      }
    },
    setComp(comp, layoutId){
      this.$parent.showPropPanel(comp);
    },
    compevent(comp){
      this.$refs['CompEventForm'].openDailog(comp);
    },
    deleteComp(comp, layoutId){
      if(!confirm("是否确认删除组件？")){
        return;
      }
      //从布局器中删除，
      var td = utils.findLayoutById(layoutId, this.pageInfo);
      var compIdx = -1;
      for(var i=0; i<td.children.length; i++){
        if(td.children[i].id == comp.id){
          compIdx = i;
          break;
        }
      }
      td.children.splice(compIdx, 1);
      //隐藏数据窗口
      this.$parent.hidePanel();
      this.setUpdate();
      this.$forceUpdate();
    },
    //table 布局器拖拽事件
    bindTdEvent(){
      let ts = this;
      let curTmpInfo = ts.curTmpInfo;
      //注册每个TD的接收组件拖放事件
      $("#layout_table td.laytd").droppable({
		    accept:"div.ibox, #comptree .jstree-node",
        over:function(e, ui){
			    var source = ui.draggable[0];
          var obj = $(this);
          if(obj.children().length == 0){
            $(".indicator").css({
              display:'block',
              left:obj.offset().left,
              top:obj.offset().top - 3
            });
          }else{
            var last = obj.children().last();
            if(last.attr("id") ==  $(source).attr("id")){
              last = last.prev();
            }
            if(last.length == 0){
              $(".indicator").css({
                display:'block',
                left:obj.offset().left,
                top:obj.offset().top - 10
              });
            }else{
              curTmpInfo.id = last.attr("id");
              curTmpInfo.tp = "after";
              $(".indicator").css({
                display:'block',
                left:last.offset().left,
                top:last.offset().top + last.height()
              });	
            }
          }
          $(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
        },
        out:function(e, ui){
          $(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
          //$(".indicator").hide();
          delete curTmpInfo.id;
          delete curTmpInfo.tp;
        },
       drop:function(e, ui){
         //拖拽drop后的动作
         const execf = (layoutId, comp)=>{
           if(!curTmpInfo.mouseOnDiv){
                  var layout = utils.findLayoutById(layoutId, ts.pageInfo);
                  if(!layout.children){
                    layout.children = [];
                  }
                  layout.children.push(comp);
              }else{
                var layout = utils.findLayoutById(layoutId, ts.pageInfo);
                $(layout.children).each((c, d)=>{  //调整JSON
                  if("c_"+d.id === curTmpInfo.id){
                    if(curTmpInfo.tp == "before"){
                        layout.children.splice(c, 0, comp);
                      }else{
                        layout.children.splice(c + 1, 0, comp);
                      }
                    return false;
                  }
                });
              }
             ts.$nextTick(()=>ts.bindAllCompsEvent());
         }

          $(".indicator").hide();
          var source = ui.draggable[0];
          var layoutId = $(this).attr("id").split("_")[1];
          var compId = $(source).attr("id").replace("c_", "");
          if($(source).hasClass("ibox")){
            var comp = utils.findCompById(ts.pageInfo, compId, true);
            //组件间的拖拽
            execf(layoutId, comp);
            curTmpInfo.mouseOnDiv = false;  //清空 mouseOnDiv 
            /**
            window.setTimeout(function(){
              var id = $(source).attr("id").replace("c_", "");
              var comp = findCompById(id);
              if(comp.type == "chart"){  //拖拽后重新调整图形大小
                var chart = echarts.getInstanceByDom(document.getElementById('C'+comp.id));
                chart.resize($("#C"+comp.id).width(), $("#C"+comp.id).height());
              }
            }, 200);
             */
          }else{ 
            //获取TREE
				    var ref = $("#comptree").jstree(true);
				    var node = ref.get_node(ui.draggable[0]);
            //从组件树拖拽， 创建组件
            var layoutId = $(this).attr("id").split("_")[1];
            var tp = node.id;
            if(tp == "text"){
              ts.$refs['portalTextForm'].insertText("insert", layoutId);
            }else if(tp == "table"){
              var comp = {"id":newGuid(), "name":"交叉表", "type":"table"};
              execf(layoutId, comp);
            }else if(tp == "chart"){
              ts.$refs['chartDailogForm'].insertChart(layoutId, execf);
            }else if(tp == "grid"){
              var comp = {"id":newGuid(), "name":"表格", "type":"grid"};
              execf(layoutId, comp);
            }else if(tp == "box"){
              var comp = {"id":newGuid(), "name":"数据块", "type":"box"};
               execf(layoutId, comp);
            }
          }
          ts.setUpdate();
          ts.$forceUpdate();
        }

      });
    },
    /**
     * 调整图形大小,comp存在表示子调整当前组件，不存在表示调整所有组件
     */
    resizeChart(comp){
      let comps = utils.findAllComps(this.pageInfo);
      comps.forEach(m=>{
        if(m.type === 'chart'){
          let dom = document.getElementById("ct_"+m.id);
          if(dom){
            var chart = echarts.getInstanceByDom(dom);
            if(chart){
              let height = m.height?m.height:$(dom).height();
              chart.resize($(dom).width(), height);
            }
          }
        }
      });
    },
    bindAllCompsEvent(){
      utils.findAllComps(this.pageInfo).forEach(e=>{
        this.bindCompEvent(e)
      });
    },
    //绑定组件拖拽事件
    bindCompEvent(obj){
      let ts = this;
      let curTmpInfo = ts.curTmpInfo;
      //注册移动事件
      $("#c_" + obj.id).draggable({
        revertDuration: 200,
        handle:$("#c_" + obj.id + " div.ibox-title"),
        delay:300,
        cursorAt: { top: 0, left:  -10 },
        scroll: false,
        cursor: "point",
        appendTo: "body",
        revert: 'invalid',
        helper:function(e){
          var id = $(this).find("div.ibox-title").text();
          return "<div class=\"vakata-dnd\"><span class=\"miconcancel glyphicon glyphicon-remove\"></span>"+id+"</div>";
        },
        start:function(e){
         utils.resetWindows('min');
          //$(this).hide();
        },
        stop:function(e){
          $(".indicator").hide();
          utils.resetWindows('max');
          //$(this).show();
        }
      });
      $("#c_" + obj.id).droppable({
        accept:"div.ibox, #comptree .jstree-node",
        over:function(e, ui){
          curTmpInfo.mouseOnDiv = true;
          curTmpInfo.id = $(this).attr("id");
          curTmpInfo.tp = "before";
          $(".indicator").css({
            display:'block',
            left:$(this).offset().left,
            top:$(this).offset().top - 10
          });
        },
        out:function(e, ui){
          curTmpInfo.mouseOnDiv = false;
          /**
          var source = ui.draggable[0];
          var obj = $(this).parent();
          var last = obj.children().last();
          if(last.attr("id") ==  $(source).attr("id")){
            last = last.prev();
          }
          if(last.length == 0){
            $(".indicator").css({
              display:'block',
              left:obj.offset().left,
              top:obj.offset().top - 10
            });
          }else{
            curTmpInfo.id = last.attr("id");
            curTmpInfo.tp = "after";
            $(".indicator").css({
              display:'block',
              left:last.offset().left,
              top:last.offset().top + last.height()
            });
          }	
           */
        },
        drop:function(e, ui){
          //alert(ui); 
        }
      });
      //注册resize事件
      $("#c_" + obj.id+" .ibox-content").resizable({
        autoHide: true ,
        handles:"s",
        minHeight:50,
        grid: [ 10, 10 ],
        resize:( event, ui )=>{
          let id = $(ui.element).parent().attr("id");
          id = id.replace("c_", "");
          let comp = utils.findCompById(ts.pageInfo, id);
          comp.height = Math.round(ui.size.height);  //更新组件高度
        },
        stop:function(event, ui){
          ts.setUpdate();
        }
      });
    }
  },
  beforeDestroy(){
    delete window.echartsUtils;
    delete window.echarts;
  },
  watch:{
   
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
table.r_layout {
	border-collapse:collapse;
	table-layout:fixed;
	width:100%;
  height:100%;
  td.laytd {
    border: 1px solid #D3D3D3;
    text-align: left;
    vertical-align: top;
	  background-color:#f0f3f4;
	  min-height:100px;
	  padding:5px;
  }
}
.layout-center-body {
	height: calc(100% - 44px);
	overflow: auto;
}
.indicator{
	position:absolute;
	font-size:14px;
	width:50px;
	height:10px;
	display:none;
	color:red;
}
.ibox-title {
    height: 30px;
    border-color: #edf1f2;
    background-color: #f6f8f8;
    color: #333;
    font-weight: 700;
    padding: 8px 15px 3px 15px;
    border-bottom: 1px solid transparent;
    display: block;
    clear: both;
    cursor: move;
}
.ibox-title h5 {
    display: inline-block;
    font-size: 14px;
    margin: 0 0 7px;
    padding: 0;
    text-overflow: ellipsis;
    float: left;
}
.ibox-tools {
    display: inline-block;
    float: right;
    margin-top: 0;
    position: relative;
    padding: 0;
}
#optarea .ibox {
    margin-bottom: 10px !important;
}
.cctx {
  overflow: hidden;
}
.tipinfo {
	color:#999;
	padding:10px;
}
</style>
<style lang="less">
.ui-resizable-s {
  height:18px;
  background-image: url(../../assets/image/wingrip.png);
  background-position: right;
  background-repeat: no-repeat;
}
</style>
