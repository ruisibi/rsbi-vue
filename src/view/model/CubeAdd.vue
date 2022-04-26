<template>
  <el-form :model="cube" :rules="rules" ref="cubeForm">
      <el-tabs v-model="active" type="card">
        <el-tab-pane label="基本信息" name="base">
          <el-form-item label="立方体名称" label-width="100px" prop="name">
            <el-input v-model="cube.name"></el-input>
          </el-form-item>
          <el-form-item label="立方体说明" label-width="100px" prop="desc">
            <el-input type="textarea" v-model="cube.desc"></el-input>
          </el-form-item>
          <el-form-item label="对应数据集" label-width="100px" prop="dsetId">
            <el-select
              v-model="cube.dsetId"
              placeholder="请选择"
              @change="selectdSet"
            >
              <el-option
                v-for="item in dsetList"
                :key="item.dsetId"
                :label="item.dsetName"
                :value="item.dsetId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="立方体信息" name="cubeInfo">
            <div class="row">
              <div class="col-sm-4" >
                <div class="ibox">
                  <div class="ibox-title" style="line-height: normal">
                    待选字段
                  </div>
                  <div class="ibox-content" style="padding: 0px">
                    <div
                      id="cubelefttree"
                      style="height: 300px; overflow: auto"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-2" style="text-align: center">
                <button
                  type="button"
                  @click="ds2cube"
                  style="margin-top: 120px"
                  class="btn btn-success btn-circle"
                >
                  <i class="fa fa-chevron-right"></i></button
                ><br /><br /><button
                  type="button"
                  @click="cube2ds"
                  class="btn btn-success btn-circle"
                >
                  <i class="fa fa-chevron-left"></i>
                </button>
              </div>
              <div class="col-sm-4" style="padding-left: 0">
                <div class="ibox">
                  <div class="ibox-title" style="line-height: normal">
                    维度和度量
                  </div>
                  <div class="ibox-content" style="padding: 0px">
                    <div
                      id="cuberighttree"
                      style="height: 300px; overflow: auto"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-2" style="text-align: center">
                <button
                  type="button"
                  @click="addgroup()"
                  class="btn btn-default btn-xs"
                >
                  <i class="fa fa-plus"></i> 维度分组</button
                ><br />
                <button type="button" class="btn btn-default btn-xs" @click="editCalcKpi();">
                  <i class="fa fa-plus-square"></i> 计算度量</button>
                <br />
                  <button type="button" @click="editcubecol();" class="btn btn-default btn-xs">
                    <i class="fa fa-edit"></i> 编辑</button>
<br />
                    <button type="button" @click="cube2ds();" class="btn btn-default btn-xs">
                      <i class="fa fa-remove"></i> 删除</button>
              </div>
            </div>
        </el-tab-pane>
      </el-tabs>
  </el-form>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import operationDailog from '@/components/OperationDailog'
import { Loading } from "element-ui";
import $ from "jquery"

export default {
   name: 'cubeAdd',
  data() {
    return {
      cube:{
        cubeId:null,
        name:null,
        desc:null,
        dsetId:null,
        dsetName:null
      },
      rules:{
        name: [{ required: true, message: "必填", trigger: "blur" }],
        dsetId: [{ required: true, message: "必填", trigger: "blur" }],
      },
      active:"base",
      delObj:[],
      dsetList:null,
      dset:null  //当前选择的数据集信息
    }
  },
  components: {
		
	},
  mounted() {
    
  },
  computed: {},
  methods: {
    loadDset(){
      ajax({
        type:"GET",
        url:"model/listDataset.action",
        data:{},
        success:(resp)=>{
          this.dsetList = resp.rows.map(r=>{
            return {dsetId:r.dsetId, dsetName:r.name};
          });
        }
      });
    },
    addCube(isupdate, cubeId){
      if(this.$refs['cubeForm']){
        this.$refs['cubeForm'].resetFields();
     }
     this.loadDset();
      if(isupdate){
        ajax({
          type:"GET",
          url:"model/getCube.action",
          data:{cubeId:cubeId},
          success:resp=>{
            let o = resp.rows;
            this.cube.cubeId = o.cubeId;
            this.cube.name = o.cubeName;
            this.cube.desc = o.desc;
            this.cube.dsetId = o.dsetId;
            this.cube.dsetName = o.dsetName;
            //更新leftTree
            this.selectdSet(o);
            //更新rightTree
            this.initRightTree(o);
          }
        });
      }else{
        this.initRightTree();
        //清空 leftTree
        this.initLeftTree([]);
      }
    },
    saveCube(isupdate){
      let ret = false;
      let ts = this;
      this.$refs['cubeForm'].validate(v=>{
        if(v){
          var rightRef = $("#cuberighttree").jstree(true);
          const exec = function(node, allnodes){
            let nodes = node.children;
            if(!nodes){
              return;
            }
            $(nodes).each(function(a, b){
              let tnode = rightRef.get_node(b);
              allnodes.push(tnode);
              exec(tnode, allnodes);
            });
          }	

          var dims = []
          exec(rightRef.get_node('cubewd'), dims);
          var cubeDim = [];
          if(dims.length == 0){
            ts.$notify.error("未选择维度");
            return false;
          }
          var curGroup = null;
          for(let i=0; i<dims.length; i++){
            var d = dims[i];
            if(d.li_attr.tp == "group"){
              curGroup = d;
            }else{
              var obj = {name:d.li_attr.dispName, type:d.li_attr.dimtype,col:d.li_attr.col, tname:d.li_attr.tname, alias:d.li_attr.alias, vtype: d.li_attr.vtype, colTable:d.li_attr.colTable,colkey:d.li_attr.colkey,coltext:d.li_attr.coltext,dimord:d.li_attr.dimord, dateformat:d.li_attr.dateformat,calc:(d.li_attr.calc&&d.li_attr.calc==true?1:0),targetId:d.li_attr.targetId,isupdate:d.li_attr.isupdate};
              var p = rightRef.get_node(rightRef.get_node(d.id).parent);
              if(p.li_attr && p.li_attr.tp == "group"){
                obj.groupName = p.text;
                obj.groupId = p.id;
              }else{
                obj.groupName = "";
                obj.groupId = "";
              }
              cubeDim.push(obj);
            }
          }
         var cubeKpi = [];
          var kpis = [];
          exec(rightRef.get_node('cubedl'), kpis);
          if(kpis.length == 0){
             ts.$notify.error("还未配置度量。");
            return false;
          }
          for(let i=0; i<kpis.length; i++){
            var t = kpis[i];
            cubeKpi.push({name:t.li_attr.dispName,col:t.li_attr.col,tname:t.li_attr.tname,alias:t.li_attr.alias,fmt:t.li_attr.fmt,unit:t.li_attr.unit,aggre:t.li_attr.aggre,kpinote:t.li_attr.kpinote,calc:(t.li_attr.calc&&t.li_attr.calc==true?1:0),calcKpi:t.li_attr.calcKpi,targetId:t.li_attr.targetId,isupdate:t.li_attr.isupdate});
          }
          let cube = ts.cube;
          let pageJson = {cubeName:cube.name, dbName:"", desc:cube.desc, dsId:"", dsetId:cube.dsetId, dsetName:cube.dsetName};
          pageJson.dims = cubeDim;
          pageJson.kpis = cubeKpi;
          if(isupdate){
            pageJson.delObj = this.delObj;
            pageJson.cubeId = this.cube.cubeId;
          }
          var json = JSON.stringify(pageJson);
          let load = Loading.service({ fullscreen: true });
          ajax({
              type:"POST",
              url:isupdate?"model/updateCube.action":"model/saveCube.action",
              postJSON:true,
              dataType:"JSON",
              data:json,
              success:function(resp){
                ts.$notify.success("立方体配置成功。");
                ts.$parent.$parent.$refs["cubeInfo"].loadData();
              }
            }, ts, load);
          ret = true;
        }
      });
      return ret;
    },
    selectdSet(cube){
      ajax({
        type:"GET",
        url:"model/getDatasetCfg.action",
        data:{dsetId:this.cube.dsetId},
        success:(resp)=>{
          resp = resp.rows;
          this.dset = resp; //放入data对象
          //获取表
          var tbs = [];
          const tabExist = (tname) => {
            let ret = false;
            for(let k=0; k<tbs.length; k++){
              if(tbs[k] === tname){
                ret = true;
                break;
              }
            }
            return ret;
          }
          let c = resp;
          for(let i=0; i<c.cols.length; i++){
            let r = c.cols[i];
            if(!tabExist(r.tname)){
              tbs.push(r.tname);
            }
          }
          const findcols = (tname) => {
            var ret = [];
            for(let j=0; j<c.cols.length; j++){
              if(c.cols[j].tname == tname){
                ret.push(c.cols[j]);
              }
            }
            return ret;
          }
          //获取表
          var dt = [];
          for(let i=0; i<tbs.length; i++){
            var ccld = [];
            var nd = {id:tbs[i], li_attr:{istable:true},text:tbs[i],icon:'fa fa-table', state:{opened:true}, children:ccld};
            dt.push(nd);
            var cols = findcols(tbs[i]);
            for(let l=0; l<cols.length; l++){
              var r = cols[l];
              var node = {id:r.name,text:r.name,icon:'glyphicon glyphicon-menu-hamburger',li_attr:{tp:'node', vtype:r.type, col:r.name, tname:r.tname, expression:r.expression}}
              ccld.push(node);
            }
          }
          //动态字段
          if(c.dynamic && c.dynamic != null && c.dynamic.length > 0){
            var dynas = {id:'dynaroot', li_attr:{istable:true} , text:"动态字段", icon:'fa fa-table', state:{opened:true}, children:[]};
            dt.push(dynas);
            for(let i=0; i<c.dynamic.length; i++){
              var r = c.dynamic[i];
              var node = {id:r.name,text:r.name,icon:'glyphicon glyphicon-menu-hamburger',li_attr:{tp:'node', vtype:r.type, col:r.name, tname:r.tname, expression:r.expression}}
              dynas.children.push(node);
            }
          }
          this.initLeftTree(dt);
        }
      });
    },
    //初始化表字段Tree
    initLeftTree(dts){
      let ref = $("#cubelefttree").jstree(true);
      if (ref) {
        ref.destroy();
      }
      let ts = this;
      $("#cubelefttree").jstree({
          core: {
            check_callback: true,
            data: dts,
          },
          checkbox:{
            three_state:false,
          },
          plugins: ["wholerow", "checkbox"],
        }).bind("ready.jstree", function () {
          
        });
    },
    initRightTree(cube){
      //加载立方体字段
      var targdt = [{id:'cbroot', text:'数据立方体', icon:'fa fa-cubes', state:{opened:true}, children:[]}];
      targdt[0].children.push({id:"cubewd", text:"维度",icon:'fa fa-gears', state:{opened:true}, children:[]});
      targdt[0].children.push({id:"cubedl", text:"度量",icon:'glyphicon glyphicon-signal', state:{opened:true}, children:[]});
      if(cube && cube.dims && cube.kpis){ //给立方体添加维度及指标
        var dims = targdt[0].children[0].children;
        var groupexist = function(grouptype){
          var ls = dims;
          var ret = null;
          for(k=0; k<ls.length; k++){
            if(ls[k].id == grouptype){
              ret = ls[k];
              break;
            }
          }
          return ret;
        }
        for(let i=0; i<cube.dims.length; i++){
          var d = cube.dims[i];
          var obj = {id:d.id, text:d.text, 
            li_attr:{tp:"dim",drag:true,col:d.col_name,tname:d.tname,dispName:d.text,vtype:d.valType,alias:d.alias, dimtype:d.dim_type,
            colTable:(d.tableName==null?"":d.tableName),
            colkey:(d.tableColKey==null?"":d.tableColKey), 
            coltext:(d.tableColName==null?"":d.tableColName), 
            dimord:(d.dimord==null?"":d.dimord), 
            dateformat:(d.dateformat==null?"":d.dateformat), 
            calc:d.iscalc==1?true:false, targetId:d.col_id
            },
            icon:"glyphicon glyphicon-stop icon_dim"
          };
          
          if(d.grouptype != "" && d.grouptype != null){
            var group = groupexist(d.grouptype);
            if(group == null){
              obj = {id:d.grouptype,text:d.groupname, icon:"fa fa-tasks", state:{opened:true}, children:[obj],li_attr:{tp:'group',dispName:d.groupname,drag:true,targetId:d.grouptype}};
              targdt[0].children[0].children.push(obj);
            }else{
              group.children.push(obj); 
            }
          }else{
            targdt[0].children[0].children.push(obj);
          }
        }
        var kpis = targdt[0].children[1].children;
        for(let i=0; i<cube.kpis.length; i++){
          var k = cube.kpis[i];
          //对于计算指标，colname 存的是计算公式，而对于非计算指标，需要取alias来代替colname, 在保存的时候会自动拼接
          var col = k.alias;
          if(k.calcKpi == 1){  //新增度量那创建的计算指标
            col = k.colname;
          }else if(k.calc == 1){  //数据集创建的动态字段
            col = k.colname.substring(k.colname.indexOf('(')+1, k.colname.indexOf(')'));
          }
          var obj = {id:k.colId, text:k.aggre+'('+k.text+")",state:{opened:true},
            li_attr:{tp:"kpi",drag:true,aggre:k.aggre,col:col,tname:k.tname, 
            unit:(k.unit==null?"":k.unit), fmt:(k.fmt==null?"":k.fmt), 
            dispName:k.text, alias:k.alias,
            kpinote:(k.kpi_desc_key==null?"":k.kpi_desc_key),
            calc:(k.calc==0?false:true),calcKpi:k.calcKpi,targetId:k.colid},
            icon:(k.calcKpi==0?"glyphicon glyphicon-stop icon_kpi":"fa fa-circle icon_kpi")
          };
          kpis.push(obj);
          
        }
      }
      var rightRef = $("#cuberighttree").jstree(true);
      if(rightRef){
        rightRef.destroy();
      }
      let ts = this;
      $("#cuberighttree").jstree({
        core:{
            check_callback:function(operation, source, node_parent, node_position, more){
              if(operation == 'move_node'){  //控制 dnd
                var point = node_position == 0 ? "append":"";
                if(!more.ref){
                  return true;
                }
                var node = more.ref;
                if(!node.li_attr || !node.li_attr.drag || node.li_attr.drag ==false ){
                  return false;
                }
                var s = source.li_attr.tp, c = node.li_attr.tp;
                //指标和分类不能放到维度区域
                if((s == 'kpigroup' || s=="kpi") && (c == 'dim' || c == 'group')){
                  return false;
                }
                //维度和分组不能拖到指标区域
                if((s == 'dim' || s == 'group') && ( c == "kpigroup" || c == "kpi")){
                  return false;
                }
                //分组不能拖放到维度下
                if(((s == "group" && c == "dim") || (s == "kpigroup" && c == "kpi")) && point == "append"){
                  return false;
                }
                //指标不能放到指标下，维度不能放到维度下,分类不能拖放到分类下
                if((s=="kpi" && c == "kpi" && point == "append") || (s == "dim" && c == "dim" && point == "append") || (s=="group" && c=="group" && point=="append") || (s=="kpigroup" && c=="kpigroup" && point=="append" )){
                  return false;
                }
                source.li_attr.isupdate = 'y'
                return true;
              }else{
                return true;
              }
            },
            dblclick_toggle:false,
            data:targdt
          },
          dnd:{
            is_draggable:function(node){
              node = node[0];
              if(node.li_attr && node.li_attr.drag){
              return true;
            }else{
              return false;
            }
            },
            large_drop_target:'selected',
            large_drag_target:'selected'
          },	
          "plugins" : [
              "wholerow","dnd"
            ]
      }).bind("ready.jstree", function(){
       if(cube){  //隐藏用户选择的列
					const findcol =(cid)=>{
						var ret = null;
						for(let j=0;j<cube.dims.length;j++){
							if(cube.dims[j].alias == cid){
								ret = cube.dims[j];
								break;
							}
						}
						if(ret == null){
							for(let j=0;j<cube.kpis.length;j++){
								if(cube.kpis[j].alias == cid){
									ret = cube.kpis[j];
									break;
								}
							}
						}
						return ret;
					};
					window.setTimeout(function(){
             var nodes = [];
             var rref = $("#cubelefttree").jstree(true);
             let cld = rref.get_node("#").children;
             cld.forEach(e => {
               let l = rref.get_node(e).children;
               nodes = nodes.concat(l);
             });
							for(let i=0; i<nodes.length; i++){
								var id = nodes[i];
								if(findcol(id) != null){
                  rref.hide_node(nodes[i]);
								}
							}
					}, 200);
       }
      }).bind("dblclick.jstree", function(e, data){
        ts.editcubecol();
      });
    },
    ds2cube(){
        let ts = this;
        var leftRef = $("#cubelefttree").jstree(true);
        var lefts = leftRef.get_selected(true);
        if(lefts.length == 0){
          ts.$notify.error("您还未从左边选择字段。");
          return;
        }
        const exef = (left)=>{
          if(!left.li_attr){
            ts.$notify.error("请选择字段。");
            return false;
          }
          if(leftRef.is_hidden(left)){
            return true;
          }
          var rightRef = $("#cuberighttree").jstree(true);
          var right = rightRef.get_selected(true);
          if(right.length == 0){
            ts.$notify.error("您还未选择右边度量或维度。");
            return false;
          }
          right = right[0];
          var parent = right.parent;
          if(!parent){
            ts.$notify.error("您还未选择右边度量或维度。");
            return false;
          }
          parent = rightRef.get_node(parent);
          var isCalc = true; //是否是公式？
          if(!left.li_attr.expression||left.li_attr.expression==null||left.li_attr.expression==""){
            isCalc = false;
          }	
          if(right.id == 'cubedl' || parent.id == 'cubedl' || (parent.li_attr && parent.li_attr.tp == "kpigroup")){
            //生成ID
            var cid = ts.findCubeMaxId();
            //calc 表示是否是动态字段，
            //calcKpi 表示是否是计算指标
            var o = {id:cid.id, text:'sum('+left.text+")",li_attr:{tp:"kpi",drag:true,aggre:"sum",col:(!isCalc?left.li_attr.col:left.li_attr.expression), tname:left.li_attr.tname,dispName:left.text,alias:left.id,calc:isCalc,calcKpi:0},icon:"glyphicon glyphicon-stop icon_kpi"};
            if(right.id == 'cubedl' || (parent.id=="cubedl" && right.li_attr.tp == "kpigroup")){
              rightRef.create_node(right.id, o);
              rightRef.open_node(right.id);
            }else{
              //获取位置
              var cnodes = rightRef.get_node(right.parent);
              var idx = -1;
              for(j=0; j<cnodes.children.length; j++){
                if(cnodes.children[j] == right.id){
                  idx = j;
                  break;
                }
              }
              rightRef.create_node(right.parent, o, idx + 1);
            }
            leftRef.hide_node(left.id);
          }else if(right.id == 'cubewd' || parent.id == 'cubewd' || (parent.li_attr && parent.li_attr.tp == 'group')){
            var cid = ts.findCubeMaxId();
            var o = {id:cid.id, text:left.text, li_attr:{tp:"dim",drag:true,col:!isCalc?left.li_attr.col:left.li_attr.expression,tname:left.li_attr.tname,dispName:left.text,tname:left.li_attr.tname,vtype:left.li_attr.vtype,alias:left.li_attr.col,calc:isCalc},icon:"glyphicon glyphicon-stop icon_dim", targetId:""};  //通过targetId 来指引对应数据库的的字段 ID, 用在修改上
            if(right.id == 'cubewd' || (parent.id == 'cubewd' && right.li_attr.tp == 'group')){
              rightRef.create_node(right.id, o);
              rightRef.open_node(right.id);
            }else{
              //获取位置
              var cnodes = rightRef.get_node(right.parent);
              var idx = -1;
              for(var j=0; j<cnodes.children.length; j++){
                if(cnodes.children[j] == right.id){
                  idx = j;
                  break;
                }
              }
              rightRef.create_node(right.parent, o, idx + 1);
            }
            leftRef.hide_node(left.id);
          }
          return true;
        }
        let isexe = false;
        $(lefts).each((a, b)=>{
          if(b.li_attr && b.li_attr.istable == true){
            return;
          }
          isexe = true;
          return exef(b);
        });
        if(isexe == false){
          this.$notify.error("您还未选择右边度量或维度。");
        }
    },
    cube2ds(){
      var rightRef = $("#cuberighttree").jstree(true);
      var leftRef = $("#cubelefttree").jstree(true);
      var right = rightRef.get_selected(true);
      let ts = this;
      if(right.length == 0 || !(right[0].li_attr) || !right[0].li_attr.tp){
        ts.$notify.error("您还未选择需要删除的度量或维度。");
        return;
      }
      right = right[0];
      if(right.li_attr.tp == 'group'){
        if(right.children && right.children.length > 0){
          ts.$notify.error("您要删除的分组含有维度，不能删除。");
          return;
        }
      }
      if(right.li_attr.tp == 'kpigroup'){
        if(right.children && right.children.length > 0){
          ts.$notify.error("您要删除的分类下含有度量，不能删除。");
          return;
        }
      }
      if(right.li_attr.tp != 'group'){ //分组删除不用关联左边树
        var id = right.li_attr.alias;   //通过 refId 引用s数据集的字段ID
        //let nd = leftRef.get_node(id);
        leftRef.show_node(id);
      }
      if(this.delObj){
        this.delObj.push({'type':right.li_attr.tp, id: right.li_attr.targetId}); //在修改立方体时用来删除的内容
      }
      rightRef.delete_node(right);
    },
    findCubeMaxId(){
      var ret = 0;
      var maxAliasId = 0;
      var ref = $("#cuberighttree").jstree(true);
      var node = ref.get_node('#');
      var exec = function(node){
        var nodes = node.children;
        if(!nodes){
          return;
        }
        $(nodes).each(function(a, b){
          var tnode = ref.get_node(b);
          if(tnode.id > ret){
            ret = Number(tnode.id);
          }
          if(tnode.li_attr && tnode.li_attr.alias) {
            var alias = Number(tnode.li_attr.alias.replace(/[d|k]/g, ''));
            if(!isNaN(alias) && alias > maxAliasId) {
              maxAliasId = alias;
            }
          }
          exec(tnode);
        });
      }
      exec(node);
      return {id:ret + 1, aliasId:maxAliasId + 1};
    },
    addgroup(){
      this.$parent.$parent.$refs['groupForm'].create(false);
    },
    editCalcKpi(){
      this.$parent.$parent.$refs['expressionForm'].create(false, this.dset);
    },
    editcubecol(){
      let ref = $("#cuberighttree").jstree(true);
      if(!ref){
        return;
      }
      let node = ref.get_selected(true);
      if(node.length === 0){
        this.$notify.error("未勾选维度或度量。");
      }
      node = node[0];
      //计算指标特殊处理
      if(node.li_attr.tp == 'kpi' && node.li_attr.calcKpi == 1){
        this.$parent.$parent.$refs['expressionForm'].create(true, this.dset);
        return;
      }
      if(node.li_attr.tp === 'group'){
        this.$parent.$parent.$refs['groupForm'].create(true, node);
        return;
      }
      this.$parent.$parent.$refs['dimKpiForm'].modify(node, this.dset);
    }
  }
};
</script>

<style lang="css">
.icon_kpi {
	color:#e07900;
}
.icon_dim {
	color:#006ae1;
}
</style>
