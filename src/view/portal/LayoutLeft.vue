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
                    <div class="panel-body" style="padding:0px;overflow:auto;">
                        <div id="paramtree">a</div>
                        <div id="comptree"></div>
                    </div>
                </div>
                <div id="data-tab-2" class="tab-pane" :class="isActive('data-tab-2')">
                    <div class="panel-body" style="padding:0px;overflow:auto;">
                        <div id="datasettree"></div>
                    </div>
                </div>
                <div id="data-tab-3" class="tab-pane" :class="isActive('data-tab-3')">
                    <div class="panel-body" style="padding:0px;overflow:auto;">
                        <div id="tabletree"></div>
                    </div>
                </div>
            </div>
  	    </div>
</template>

<script>
import {baseUrl, ajax} from '@/common/biConfig'
import $ from 'jquery'
import "jstree";
import "jstree/dist/themes/default/style.min.css";
import * as utils from './Utils'

export default {
  components:{

  },
  props:{
      pageInfo:{
        type:Object,
        required:true,
        default:{}
     }
  },
  data(){
    return {
        tabActive:"data-tab-1"
    }
  },
  mounted(){
    this.initcubes();
    this.initdset();
    this.regCompAndParamTree();
  },
  computed: {
     
  },
  methods: {
    switchTabs(val){
        this.tabActive = val;
    },
    isActive(p){
        return this.tabActive === p ? "active" : ""
    },
    regCompAndParamTree(){
        let ts = this;
        var dt = [{id:'params', text:'参数', icon:"fa fa-binoculars",state:{opened:true}, children:[
            {id:"input", text:"输入框",li_attr:{tp:"param",ptp:"text"},icon:"fa fa-tag comp_color"},
            {id:"radio", text:"单选框",li_attr:{tp:"param", ptp:"radio"},icon:"fa fa-tag comp_color"},
            {id:"checkbox", text:"多选框",li_attr:{tp:"param",ptp:"checkbox"},icon:"fa fa-tag comp_color"},
            {id:"dateselect", text:"日历框",li_attr:{tp:"param", ptp:"dateselect"},icon:"fa fa-tag comp_color"},
            {id:"monthselect", text:"月份框",li_attr:{tp:"param", ptp:"monthselect"},icon:"fa fa-tag comp_color"},
            {id:"yearselect", text:"年份框",li_attr:{tp:"param", ptp:"yearselect"},icon:"fa fa-tag comp_color"}
        ]}
        ];
        var compDt = [{id:"text", text:"文本",li_attr:{tp:"comp"},icon:"fa fa-file-text-o"},
            {id:"box", text:"数据块",li_attr:{tp:"comp"},icon:"fa fa-inbox"},
            {id:"chart", text:"图表",li_attr:{tp:"comp"},icon:"fa fa-line-chart"},
            {id:"grid", text:"表格",li_attr:{tp:"comp"},icon:"fa fa-table"},
            {id:"table", text:"交叉表",li_attr:{tp:"comp"},icon:"fa fa-list-alt"}];
        
        var dragfunc = function(treeDiv){
            $("#"+treeDiv+" .jstree-node").draggable({
                cursor: "point",
                appendTo: "body",
                revert: 'invalid',
                revertDuration: 250,
                cursorAt: { top: 0, left: 'comptree' == treeDiv ? -10 :-35 },
                helper:function(e){
                    var id = $(this).find("a.jstree-anchor:first").text();
                    return "<div class=\"vakata-dnd\"><span class=\"miconcancel glyphicon glyphicon-remove\"></span>"+id+"</div>";
                },
                start:function(e){
                    var ref = $('#'+treeDiv).jstree(true),node = ref.get_node(this);
                    if(node.id == 'params'){
                        return false;
                    }
                    if(node.li_attr.tp == 'comp'){
                        utils.resetWindows('min');
                    }
                    return true;
                },
                stop:function(e){
                    var ref = $('#'+treeDiv).jstree(true),node = ref.get_node(this);
                    if(node.li_attr.tp == 'comp'){
                        utils.resetWindows('max');
                    }
                    $(".indicator").hide();
                }
            });
        }
        $('#paramtree').jstree({
            core:{
                data:dt
            },
            "plugins" : [
                "wholerow"
            ]
        }).bind("ready.jstree",function(a, b){
            dragfunc('paramtree');
        }).bind("after_open.jstree", function(){
            dragfunc('paramtree');
        });
        
        $('#comptree').jstree({
            core:{
                data:compDt
            },
            "plugins" : [
                "wholerow"
            ]
        }).bind("ready.jstree",function(a, b){
            dragfunc('comptree');
        })
        
        //参数接收
        $("#optparam").droppable({
            accept:"#paramtree .jstree-node",
            tolerance:"pointer",
            over:function(e, ui){
                var ref = $("#paramtree").jstree(true);
                var node = ref.get_node(ui.draggable[0]);
                var tp = node.li_attr.tp;
                if(tp == "param"){
                    $("#optparam").css("border", "1px solid #ff0000");
                    $(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
                }
            },
            out:function(e, ui){
                $("#optparam").css("border", "1px solid #d3d3d3");
                $(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
                
            },
            drop:function(e, ui){
                var ref = $("#paramtree").jstree(true);
                var node = ref.get_node(ui.draggable[0]);
                var tp = node.li_attr.tp;
                if(tp == "param"){
                    $("#optparam").css("border", "1px solid #d3d3d3");
                    var node = ref.get_node(ui.draggable[0]);
                    ts.$parent.$refs['prarmAddForm'].newparam(node.li_attr.ptp);
                }
            }
            

        });
    },
    initdset(table){
        let ref = $("#tabletree").jstree(true);
        if(ref){
            ref.destroy();
        }
        if (!table) {
            $('#tabletree').jstree({
                core: {
                    data: {
                        id: 'nodata',
                        text: '您还未选择数据集',
                        icon: 'fa fa-warning icon_kpi'
                    }
                },
                "plugins": ["wholerow"]
            });
            return;
        } else {
            const dragfunc = () => {
                $("#tabletree .jstree-node").draggable({
                    cursor: "point",
                    appendTo: "body",
                    revert: 'invalid',
                    revertDuration: 250,
                    cursorAt: { top: 0, left: -35 },
                    helper:function(e){
                        var id = $(this).find("a.jstree-anchor:first").text();
                        return "<div class=\"vakata-dnd\"><span class=\"miconcancel glyphicon glyphicon-remove\"></span>"+id+"</div>";
                    },
                    start:function(e){
                        var ref = $('#tabletree').jstree(true),node = ref.get_node(this);
                        var attr = node.li_attr;
                        delete attr.id;
                        if($.isEmptyObject(attr)){
                            return false;
                        }
                        return true;
                    }
                });
            }
            var dt = {id:table.dsetId, text:table.dsetName+"("+table.priTable+")", state:{opened:true},icon:'fa fa-table', children:[]};;
            ajax({
                url:"model/getDatasetCfg.action",
                type:"GET",
                data:{dsetId:table.dsetId},
                success:(resp)=>{
                    let ret  = resp.rows.cols;
                    for(let i=0; i<ret.length; i++){
                        dt.children.push({id:ret[i].name, text:ret[i].name, icon:'icon_kpi glyphicon glyphicon-menu-hamburger',li_attr:{id:ret[i].name,name:ret[i].name,dsetId:table.dsetId,dsid:table.dsid, tname:ret[i].tname,type:ret[i].type, expression: ret[i].expression}});
                    }
                    //添加动态字段
                    let dyna = resp.dynamic;
                    for(let i=0; dyna&&dyna!=null&&i<dyna.length; i++){
                        var r = dyna[i];
                        dt.children.push({id:r.name, text:r.name, icon:'icon_kpi glyphicon glyphicon-menu-hamburger',li_attr:{id:r.name,name:r.name,dsetId:table.dsetId,dsid:table.dsid, tname:r.tname,type:r.type, expression: r.expression}});
                    }
                    $('#tabletree').jstree({
                        core: {
                            data: [dt],
                            check_callback: false
                        },
                        "plugins": ["wholerow"]
                    }).bind("ready.jstree", function (a, b) {
                        dragfunc();
                    }).bind("after_open.jstree", function () {
                        dragfunc();
                    });
                }
            }, this);
        }
    },
    initcubes(cubeId){
        let ref = $("#datasettree").jstree(true);
        if(ref){
            ref.destroy();
        }
        const ts = this;
        if (!cubeId) {
            $('#datasettree').jstree({
                core: {
                    data: {
                        id: 'nodata',
                        text: '您还未选择立方体',
                        icon: 'fa fa-warning icon_kpi'
                    }
                },
                "plugins": ["wholerow"]
            });
            return;
        } else {
            const dragfunc = () => {
                $("#datasettree .jstree-node").draggable({
                    cursor: "point",
                    appendTo: "body",
                    revert: 'invalid',
                    revertDuration: 250,
                    cursorAt: { top: 0, left: -35 },
                    helper:function(e){
                        var id = $(this).find("a.jstree-anchor:first").text();
                        return "<div class=\"vakata-dnd\"><span class=\"miconcancel glyphicon glyphicon-remove\"></span>"+id+"</div>";
                    },
                    start:function(e){
                        var ref = $('#datasettree').jstree(true),node = ref.get_node(this);
                        var attr = node.li_attr;
                        delete attr.id;
                        if($.isEmptyObject(attr)){
                            return false;
                        }
                        return true;
                    }
                });
            }
            $('#datasettree').jstree({
                core: {
                    data: function (obj, callback) {
                        ajax({
                            url:"model/treeCube.action",
                            data:{cubeId:cubeId},
                            success:(resp)=>{
                                callback.call(this, resp.rows);
                            }
                        }, ts);
                    },
                    check_callback: false
                },
                "plugins": ["wholerow"]
            }).bind("ready.jstree", function (a, b) {
                dragfunc();
            }).bind("after_open.jstree", function () {
                dragfunc();
            });
        }
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
        height: 100%;
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
<style lang="less">
    .comp_color {
        color:#23b7e5;
    }
</style>
