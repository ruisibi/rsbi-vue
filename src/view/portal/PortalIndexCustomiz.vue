<template>
  <div class="Detail">
    <div data-options="region:'north',border:false" style="height:32px; overflow:hidden;">
    <div class="panel-header" style="padding:3px;">
        <div class="panel layout-panel layout-panel-north" style="width: 1170px; left: 0px; top: 0px;">
          <div class="panel-header panel-header-noborder" style="padding: 3px; width: 1170px;">
            <a href="javascript:backpage();" id="mb1" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" plain="true" iconcls="icon-back" group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">返回</span><span class="l-btn-icon icon-back">&nbsp;</span></span></a>
            <a href="javascript:savepage();" id="mb2" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" plain="true" iconcls="icon-save" group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">保存</span><span class="l-btn-icon icon-save">&nbsp;</span></span></a>
            <a href="javascript:setlayout();" id="mb3" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" plain="true" iconcls="icon-layout" title="" group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">布局</span><span class="l-btn-icon icon-layout">&nbsp;</span></span></a>
            <a href="javascript:;" menu="#selectinfo" id="mb4" class="easyui-menubutton l-btn l-btn-small l-btn-plain m-btn m-btn-small" plain="true" iconcls="icon-dataset" group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">数据</span><span class="l-btn-icon icon-dataset">&nbsp;</span><span class="m-btn-downarrow"></span><span class="m-btn-line"></span></span></a>
            <a href="javascript:exportPage()" id="mb6" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" plain="true" iconcls="icon-export" group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">导出</span><span class="l-btn-icon icon-export">&nbsp;</span></span></a>
            <a href="javascript:printpage()" id="mb10" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" plain="true" iconcls="icon-print" group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">打印</span><span class="l-btn-icon icon-print">&nbsp;</span></span></a>
            <a href="javascript:pushpage()" id="mb10" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" plain="true" iconcls="icon-push" group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">发布</span><span class="l-btn-icon icon-push">&nbsp;</span></span></a>
            <a href="javascript:helper()" id="mb10" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" plain="true" iconcls="icon-help" group="">
            <span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">帮助</span><span class="l-btn-icon icon-help">&nbsp;</span></span></a>
          </div>
          <div data-options="region:'north',border:false" style="overflow: hidden; width: 1170px; height: 0px;" title="" class="panel-body panel-body-noborder layout-body"></div>
        </div>


    </div>

  </div>

  <div data-options="region:'west',split:true,title:'对象面板'"  style="width:190px;">
  <div id="comp_tab" data-options="fit:true,border:false" class="easyui-tabs" style="height:auto; width:auto;">
    <div title="组件">
      <ul id="param_tree" data-options="onContextMenu:function(e){e.preventDefault();}">
        <li>
        <span>参数</span>
        <ul>
          <li data-options="attributes:{tp:'text'},iconCls:'icon-param'"><span>输入框</span></li>
          <li data-options="attributes:{tp:'radio'},iconCls:'icon-param'"><span>单选框</span></li>
          <li data-options="attributes:{tp:'checkbox'},iconCls:'icon-param'"><span>多选框</span></li>
          <li data-options="attributes:{tp:'dateselect'},iconCls:'icon-param'"><span>日历框</span></li>
          <li data-options="attributes:{tp:'monthselect'},iconCls:'icon-param'"><span>月份框</span></li>
          <li data-options="attributes:{tp:'yearselect'},iconCls:'icon-param'"><span>年份框</span></li>
        </ul>
        </li>
        </ul>
      <ul id="comp_tree" data-options="onContextMenu:function(e){e.preventDefault();}">
        <li data-options="attributes:{tp:'text'}, iconCls:'icon-text'"><span>文本</span></li>
        <li data-options="attributes:{tp:'box'}, iconCls:'icon-box'"><span>数据块</span></li>
        <li data-options="attributes:{tp:'chart'},iconCls:'icon-chart'"><span>图表</span></li>
        <li data-options="attributes:{tp:'grid'},iconCls:'icon-table'"><span>表格</span></li>
        <li data-options="attributes:{tp:'table'},iconCls:'icon-cross'"><span>交叉表</span></li>
      </ul>

      </div>
    <div title="立方体" style="">
          <ul id="datasettree" class="easyui-tree">
          </ul>
      </div>
      <div title="数据表" style="">
          <ul id="tabletree" class="easyui-tree">
          </ul>
      </div>
  </div>
  </div>

  <div data-options="region:'center',border:true" title="操作区">
    <div class="easyui-layout" data-options="fit:true">
      <div data-options="region:'north',split:false" id="optparam" style="height:44px">
        <span class="charttip" style="font-size:14px; text-align:center;">报表参数区域<br/>把参数拖放此处作为报表查询条件</span>
      </div>
      <div data-options="region:'center'" id="optarea"  style="padding:5px;background-color:#dddddd;" align="center">

      </div>
    </div>
  </div>

  <div id="pdailog"></div>
  <div class="indicator">==></div>
  <div id="autolayoutmenu" class="easyui-menu">
      <div onclick="lyt_insertRow()" id="lyt_insertrow">插入行</div>
      <div onclick="lyt_insertCol()" id="lyt_insertcol">插入列</div>
      <div onclick="lyt_deleteRow()" id="lyt_deleterow">删除行</div>
      <div onclick="lyt_deleteCol()" id="lyt_deletecol">删除列</div>
      <div onclick="lyt_mergeCell()" id="lyt_mergeCell">合并</div>
      <div onclick="lyt_unmergeCell()" id="lyt_unmergeCell">取消合并</div>
  </div>
  <div id="dimoptmenu" class="easyui-menu">
    <div onclick="dimsort('asc')">升序</div>
      <div onclick="dimsort('desc')">降序</div>
      <div>
      <span>移动</span>
      <div style="width:120px;">
        <div iconCls="icon-back" onclick="dimkpimove('left')">左移</div>
          <div iconCls="icon-right" onclick="dimkpimove('right')">右移</div>
          <div id="m_moveto" onclick="dimexchange()">移至</div>
      </div>
      </div>
      <div iconCls="icon-sum" onclick="aggreDim()" id="m_aggre">聚合...</div>
      <div onclick="getDimTop('table')">取Top...</div>
      <div onclick="delJsonKpiOrDim('dim')" iconCls="icon-remove">删除</div>
  </div>
  <div id="kpioptmenu" class="easyui-menu">
    <div onclick="kpiproperty()">属性...</div>
      <div>
      <span>排序</span>
      <div style="width:120px;">
        <div id="k_kpi_ord1" onclick="kpisort('asc')">升序</div>
          <div id="k_kpi_ord2"  onclick="kpisort('desc')">降序</div>
          <div id="k_kpi_ord3" iconCls="icon-ok" onclick="kpisort('')">默认</div>
      </div>
      </div>
      <div>
      <span>移动</span>
      <div style="width:120px;">
        <div iconCls="icon-back" onclick="dimkpimove('left')">左移</div>
          <div iconCls="icon-right" onclick="dimkpimove('right')">右移</div>
      </div>
      </div>
      <div iconCls="icon-remove" onclick="delJsonKpiOrDim('kpi')">删除</div>
  </div>
  <div id="chartoptmenu" class="easyui-menu">
    <div onclick="chartsort('asc')">升序</div>
      <div onclick="chartsort('desc')">降序</div>
      <div onclick="setChartKpi()" id="m_set">属性...</div>
      <div onclick="delChartKpiOrDim()" iconCls="icon-remove">清除</div>
  </div>
  <div id="table_menu" class="easyui-menu">
    <div iconCls="icon-dataset" onclick="editComp()">数据</div>
      <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
      <div onclick="compevent()">事件...</div>
      <div onclick="setComp()">属性...</div>
  </div>
  <div id="box_menu" class="easyui-menu">
    <div iconCls="icon-dataset" onclick="editComp()">数据</div>
      <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
      <div onclick="setComp()">属性...</div>
  </div>
  <div id="grid_menu" class="easyui-menu">
    <div iconCls="icon-dataset" onclick="editComp()">数据</div>
      <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
      <div onclick="setComp()">属性...</div>
  </div>
  <div id="text_menu" class="easyui-menu">
    <div onclick="editComp()">编辑</div>
      <div onclick="setComp()">属性...</div>
  </div>
  <div id="chart_menu" class="easyui-menu">
    <div onclick="setcharttype(false)">图表类型...</div>
    <div iconCls="icon-dataset" onclick="editComp()">数据</div>
      <div iconCls="icon-filter" onclick="setcompfilter()">筛选...</div>
      <div onclick="compevent()">事件...</div>
      <div onclick="setComp()">属性...</div>
  </div>
  <div id="param_menu" class="easyui-menu">
    <div iconCls="icon-edit" onclick="newparam('update')">编辑</div>
    <div iconCls="icon-back" onclick="moveparam('left')">左移</div>
      <div iconCls="icon-right" onclick="moveparam('right')">右移</div>
  </div>
  <div id="selectinfo" style="width:150px;">
      <div onclick="selectdataset()" >选择立方体...</div>
      <div onclick="selecttable()" >选择数据表...</div>
  </div>
  <div id="gridoptmenu" class="easyui-menu">
      <div>
      <span>排序</span>
      <div style="width:120px;">
        <div id="col_ord1" onclick="gridColsort('asc')">升序</div>
          <div id="col_ord2"  onclick="gridColsort('desc')">降序</div>
          <div id="col_ord3" iconCls="icon-ok" onclick="gridColsort('')">默认</div>
      </div>
      </div>
      <div>
      <span>移动</span>
      <div style="width:120px;">
        <div iconCls="icon-back" onclick="tableColmove('left')">左移</div>
          <div iconCls="icon-right" onclick="tableColmove('right')">右移</div>
      </div>
      </div>
      <div onclick="setGridColProp()" id="m_set">属性...</div>
      <div onclick="delGridCol()" iconCls="icon-remove">删除</div>
  </div>
  </div>
</template>
<script>
export default {
  name: "Detail",
  components: {},
  props: {

  },
  data() {
    return {

    }
  },
  methods: {
    initPage(){
      window.pageInfo = {"layout":1, "body":{tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]}};
      window.curTmpInfo = {
        comps: [],
        is3g: ""
      }
      //初始化数据
      reloadDatasetTree(pageInfo);
      //初始化已选表
      initTableTree();
      //初始化布局
      initlayout();
      //初始化组件拖拽
      regCompTree();
      //初始化参数及拖拽
      initParams();
    }
  },
  watch: {

  },
  filters: {

  },
  mounted() {
    this.initPage()
  },
}
</script>
<style lang="less" scoped>

</style>
