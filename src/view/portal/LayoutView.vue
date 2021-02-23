<!-- 报表查看页面渲染布局器 -->
<script>
import { baseUrl, newGuid } from "@/common/biConfig";
import PortalText from "./PortalText.vue"
import ChartDailog from './ChartDailog.vue'
import CompFilter from './CompFilter.vue'
import $ from "jquery";
import * as utils from './Utils'
import BoxView from "./view/Box.vue"
import ChartView from "./view/Chart.vue"
import GridView from "./view/Grid.vue"
import TableView from "./view/Table.vue"

export default {
  components: {
    PortalText,
    BoxView,
    ChartView,
    GridView,
    TableView,
    ChartDailog,
    CompFilter
  },
  props: {
    pageInfo: {
      type: Object,
      required: true,
      default:{}
    },
    selfAdaption:{  //布局自适应
      type:Boolean,
      default:false
    }
  },
  render(h) {
    var json = this.pageInfo.body || {};
    var trs = [];
    let width = $(window).width();
    if(this.selfAdaption == true && width <= 450){
      let comps = utils.findAllComps(this.pageInfo);
      let tds = [];
      for(let comp of comps){
        tds.push(this.renderComp(comp, h, "1"));
      }
      trs.push(h('tr', tds));
    }else{
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
    }
    let table = h('table', {attrs:{border:"0", cellspacing:"0", cellpadding:"0", class:"r_layout", id:"layout_table"}}, [h('tbody', trs)]);
    return h("div", {attrs:{id:"optarea", class:"layout-center-body", align:"center"}}, 
      [
        table
      ]
    );
  },
  data() {
    return {
      curTmpInfo:{}  //临时对象
    };
  },
  mounted() {
    $(window).resize(()=>{
       this.resizeChart();
       /**
       if(this.selfAdaption == true){
         this.$forceUpdate();
       }
       **/
      }
    );
  },
  beforeDestroy(){
    $(window).unbind("resize");
  },
  computed: {},
  methods: {
    renderComp(comp, h, layoutId){
      let hasLink = false;
      if(comp.type === 'chart' && comp.chartJson.link && comp.chartJson.link.target){
        hasLink = true;
      }else if(comp.type === 'table' && comp.link && comp.link.target){
        hasLink = true;
      }
      let title = h('div', {class:"ibox-title"}, [h('div', {class:"ctit"}, [h('h5', {domProps:{innerHTML:comp.name+(hasLink?" <i class='glyphicon glyphicon-link'></i>":"")}})])]);
      let compctx = [];
      if(comp.type === 'box'){
        compctx.push(h('box-view',{ref:'mv_'+comp.id, attrs:{comp:comp, editor:false}}));
      }else if(comp.type ==='chart'){
        compctx.push(h('chart-view',{ref:'mv_'+comp.id, attrs:{comp:comp, editor:false}}));
      }else if(comp.type === 'grid'){
        compctx.push(h('grid-view',{ref:'mv_'+comp.id, attrs:{comp:comp, editor:false}}));
      }else if(comp.type === 'table'){
        compctx.push(h('table-view',{ref:'mv_'+comp.id, attrs:{comp:comp, editor:false}}));
      }
      let style = {padding:"1px", width:"100%"};
      let bgcolor = comp.bgcolor;
      if(bgcolor){
        style['background-color'] = bgcolor;
      }
      if(comp.height){
        style['height'] =  comp.height + "px";
      }
      if(comp.showtitle === false){
        style['border'] = 'none';
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
      let ctx = h('div', {class:"cctx ibox-content", style:style}, [h('div', bodys, comp.type=='text'?"":compctx)]);
      return h('div', {attrs:{class:"ibox", id:"c_" + comp.id}}, comp.showtitle===false?[ctx]:[title, ctx]);
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
    setCompData(datas){
      var json = this.pageInfo.body || {};
      for (var i = 1; true; i++) {
        var tr = json["tr" + i];
        if (!tr || tr == null) {
          break;
        }
        for (var j = 0; j < tr.length; j++) {
          var td = tr[j];
          if(td.children){
            for(var k=0; k<td.children.length; k++){
              var comp = td.children[k];
              if(comp.type === 'text'){
                continue;
              }
              let o = this.$refs['mv_'+comp.id];
              o.data = datas[comp.id];
              if(comp.type === 'chart'){
                this.$nextTick(()=>o.showChart());
              }else if(comp.type === 'table' || comp.type === 'grid'){
                this.$nextTick(()=>o.bindScrollEvent());
              }
            }
          }
        }
      }
    }
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
  td.laytd {
    border: 0;
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
}
.ibox-title h5 {
    display: inline-block;
    font-size: 14px;
    margin: 0 0 7px;
    padding: 0;
    text-overflow: ellipsis;
    float: left;
}
#optarea .ibox {
    margin-bottom: 10px !important;
}
.cctx {
  overflow: hidden;
}
</style>
