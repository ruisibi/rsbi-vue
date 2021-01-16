<!-- 布局器 -->
<script>
import { baseUrl } from "@/common/biConfig";
import PortalText from "./PortalText.vue"
import $ from "jquery";
import * as utils from './Utils'

export default {
  components: {
    PortalText
  },
  props: {
    pageInfo: {
      type: Object,
      required: true,
    },
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

    var json = this.pageInfo.body;
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
        h('PortalText',{ref:"portalTextForm"},'')
      ]
    );
  },
  data() {
    return {
      curTmpInfo:{}  //临时对象
    };
  },
  mounted() {
    this.bindTdEvent();
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
        h('button', {class:"btn btn-outline btn-success btn-xs", attrs:{title:"设置组件"}, on:{click:()=>{alert(3)}}}, [h('i', {class:"fa fa-wrench"})]),
        h('span',' '),
        h('button', {class:"btn btn-outline btn-danger btn-xs", attrs:{title:"删除组件"}, on:{click:()=>{this.deleteComp(comp, layoutId)}}}, [h('i', {class:"fa fa-times"})])
      ];
      let title = h('div', {class:"ibox-title"}, [h('div', {class:"ctit"}, [h('h5', comp.name)]), h('div', {class:"ibox-tools"}, tools)]);
      let ctx = h('div', {class:"cctx ibox-content", style:{padding:"3px"}}, [h('div', {class:"ccctx"}, comp.desc)]);
      return h('div', {attrs:{class:"ibox", id:"c_" + comp.id}}, [title, ctx]);
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
      this.setUpdate();
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
          $(".indicator").hide();
          var source = ui.draggable[0];
          if($(source).hasClass("ibox")){
            //组件间的拖拽
            if(!curTmpInfo.mouseOnDiv){
              $(this).append(source);
            }else{
              if(curTmpInfo.tp == "before"){
                $("#"+curTmpInfo.id).before(source);
              }else{
                $("#"+curTmpInfo.id).after(source);
              }
            }
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
              ts.$refs['portalTextForm'].insertText("insert", layoutId, '', curTmpInfo.id, curTmpInfo.tp);
            }else if(tp == "table"){
              var comp = {"id":newGuid(), "name":"交叉表", "type":"table"};
              var str = addComp(comp, layoutId, true);
              if(!curTmpInfo.id){
                $("#layout_"+layoutId).append(str);
              }else{
                if(curTmpInfo.tp == "before"){
                  $("#"+curTmpInfo.id).before(str);
                }else{
                  $("#"+curTmpInfo.id).after(str);
                }
              }
              //注册拖放事件
              bindCompEvent(comp);
              bindResizeEvent(comp.id, 'table');
            }else if(tp == "chart"){
              setcharttype(true, layoutId, curTmpInfo.id, curTmpInfo.tp)					
            }else if(tp == "grid"){
              var comp = {"id":newGuid(), "name":"表格", "type":"grid"};
              var str = addComp(comp, layoutId, true);
              if(!curTmpInfo.id){
                $("#layout_"+layoutId).append(str);
              }else{
                if(curTmpInfo.tp == "before"){
                  $("#"+curTmpInfo.id).before(str);
                }else{
                  $("#"+curTmpInfo.id).after(str);
                }
              }
              //注册拖放事件
              bindCompEvent(comp);
              bindResizeEvent(comp.id, 'grid');
            }else if(tp == "box"){
              var comp = {"id":newGuid(), "name":"数据块", "type":"box"};
              var str = addComp(comp, layoutId, true);
              if(!curTmpInfo.id){
                $("#layout_"+layoutId).append(str);
              }else{
                if(curTmpInfo.tp == "before"){
                  $("#"+curTmpInfo.id).before(str);
                }else{
                  $("#"+curTmpInfo.id).after(str);
                }
              }
              //注册拖放事件
              bindCompEvent(comp);
              //resize事件
              bindResizeEvent(comp.id, 'box');
            }
            
          }
          ts.setUpdate();
        }

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
          //resetWindows('min');
          //$(this).hide();
        },
        stop:function(e){
          $(".indicator").hide();
          //resetWindows('max');
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
          var source = ui.draggable[0];
          curTmpInfo.mouseOnDiv = false;
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
        },
        drop:function(e, ui){
          //alert(ui); 
        }
      });
    }
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
</style>
