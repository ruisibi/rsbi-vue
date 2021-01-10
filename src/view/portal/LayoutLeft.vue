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
    initdset(){
        let ref = $("#tabletree").jstree(true);
        if(ref){
            ref.destroy();
        }
        if (!this.pageInfo.table) {
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
            let table = this.pageInfo.table;
            var dt = {id:table.dsetId, text:table.dsetName+"("+table.priTable+")", state:{opened:true},icon:'fa fa-table', children:[]};;
            ajax({
                url:"model/getDatasetCfg.action",
                type:"GET",
                data:{dsetId:table.dsetId},
                success:(resp)=>{
                    let ret  = resp.rows.cols;
                    for(let i=0; i<ret.length; i++){
                        dt.children.push({id:ret[i].name, text:ret[i].name, icon:'glyphicon glyphicon-menu-hamburger',li_attr:{id:ret[i].name,name:ret[i].name,dsetId:table.dsetId,dsid:table.dsid, tname:ret[i].tname,type:ret[i].type, expression: ret[i].expression}});
                    }
                    //添加动态字段
                    let dyna = resp.dynamic;
                    for(let i=0; dyna&&dyna!=null&&i<dyna.length; i++){
                        var r = dyna[i];
                        dt.children.push({id:r.name, text:r.name, icon:'glyphicon glyphicon-menu-hamburger',li_attr:{id:r.name,name:r.name,dsetId:table.dsetId,dsid:table.dsid, tname:r.tname,type:r.type, expression: r.expression}});
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
    initcubes(){
        let ref = $("#datasettree").jstree(true);
        if(ref){
            ref.destroy();
        }
        if (!this.pageInfo.selectDs) {
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
                    data: {
                        url: 'model/treeCube.action?cubeId=' + this.pageInfo.selectDs + '&t=' + Math.random()
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
        height: calc(100% - 35px);
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
    .icon_kpi {
    color: #e07900;
    }
</style>
