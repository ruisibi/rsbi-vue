<!-- 布局器 -->
<script>
import { baseUrl } from "@/common/biConfig";
import $ from "jquery";

export default {
  components: {},
  props: {
    pageInfo: {
      type: Object,
      required: true,
    },
  },
  render(h) {
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
          }, "xxx")
        );
        /**
        if(td.children){
          for(var k=0; k<td.children.length; k++){
            var comp = findTCompById(td.children[k]);
            var str = compStr(comp, false);
            ret = ret + str;
            cps.push(comp);
          }
        }
         */
      }
      trs.push(h('tr', {}, tds));
    }
    let table = h('table', {attrs:{border:"0", cellspacing:"0", cellpadding:"0", class:"r_layout", id:"layout_table"}}, [h('tbody', trs)]);
    return h("div", {attrs:{id:"optarea", class:"layout-center-body", align:"center"}}, [table, h('div', {class:"indicator"}, '==>')]);
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
          $(".indicator").hide();
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
              insertText("insert", layoutId, '', curTmpInfo.id, curTmpInfo.tp);
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
              //滚动位置
              window.setTimeout(function(){
                $("#optarea").scrollTop($("#c_"+comp.id).offset().top);
              }, 500);
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
              //滚动位置
              window.setTimeout(function(){
                $("#optarea").scrollTop($("#c_"+comp.id).offset().top);
              }, 500);
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
    }
  },
  watch: {},
  beforeMount() {},
  beforeDestroy() {},
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
</style>
