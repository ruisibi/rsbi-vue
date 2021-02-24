<template>
    <el-form :model="dset" :rules="rules" ref="dsetForm">
      <el-tabs v-model="active" type="card">
        <el-tab-pane label="基本信息" name="base">
          <el-form-item label="数据集名称" label-width="100px" prop="name">
            <el-input v-model="dset.name"></el-input>
          </el-form-item>
          <el-form-item label="数据源" label-width="100px" prop="dsid">
            <el-select
              v-model="dset.dsid"
              placeholder="请选择"
              @change="selectds"
            >
              <el-option
                v-for="item in dsourceList"
                :key="item.dsid"
                :label="item.dsname"
                :value="item.dsid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择表" label-width="100px">
            <div class="row">
              <div class="col-sm-4" style="padding-left: 0">
                <div class="ibox">
                  <div class="ibox-title" style="line-height: normal">
                    待选表
                  </div>
                  <div class="ibox-content" style="padding: 0px">
                    <el-input
                      v-model="dset.searchkey"
                      @keyup.enter.native="searhTable()"
                      placeholder="搜索表"
                    ></el-input>
                    <div
                      id="allTablesTree"
                      style="height: 300px; overflow: auto"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-2" style="text-align: center">
                <button
                  type="button"
                  @click="left2right"
                  style="margin-top: 120px"
                  class="btn btn-success btn-circle"
                >
                  <i class="fa fa-chevron-right"></i></button
                ><br /><br /><button
                  type="button"
                  @click="right2left"
                  class="btn btn-success btn-circle"
                >
                  <i class="fa fa-chevron-left"></i>
                </button>
              </div>
              <div class="col-sm-4" style="padding-left: 0">
                <div class="ibox">
                  <div class="ibox-title" style="line-height: normal">
                    已选表
                  </div>
                  <div class="ibox-content" style="padding: 0px">
                    <div
                      id="selTablesTree"
                      style="height: 340px; overflow: auto"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="表关联" name="join">
          <el-form-item label="主表" label-width="100px" prop="master">
            <el-select
              v-model="dset.master"
              placeholder="请选择"
              @change="changemaster"
            >
              <el-option
                v-for="item in selectTables"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表字段" label-width="100px">
            <div class="row">
              <div class="col-sm-9" style="padding-left: 0">
                <div
                  id="masterTableTree"
                  style="
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    height: 320px;
                    overflow: auto;
                  "
                ></div>
              </div>
              <div class="col-sm-2">
                <input
                  type="button"
                  value="关联"
                  class="btn btn-primary btn-xs"
                  @click="joinTable()"
                />
                <br />
                <input
                  type="button"
                  value="取消"
                  class="btn btn-primary btn-xs"
                  @click="unjoinTable()"
                />
              </div>
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="表字段" name="cols">
          <el-table
            :data="cols"
            border
            height="380"
            style="width: 100%"
            header-row-class-name="tableHeadbg"
          >
            <el-table-column
              align="center"
              prop="name"
              label="字段名"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="dispName"
              label="显示名"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="类型"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="tname"
              label="来源表"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="idx"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                  <a class="btn btn-primary btn-xs" @click="modifyCol(scope.row.name, scope.row.tname)"> 编辑 </a>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="动态字段" name="dyna">
          <div style="padding-bottom:10px;">
          <button class="btn btn-info btn-xs" type="button" @click="crtdyna(false)">创建</button>
          </div>
          <el-table
            :data="dynamic"
            border
            height="380"
            style="width: 100%"
            header-row-class-name="tableHeadbg"
          >
            <el-table-column
              align="center"
              prop="name"
              label="字段名"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="expression"
              label="表达式"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="类型"
            ></el-table-column>
            
            <el-table-column
              align="center"
              prop="idx"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                  <a class="btn btn-primary btn-xs" @click="crtdyna(true, scope.row.name)"> 编辑 </a>
                  <a class="btn btn-danger btn-xs" @click="deleteDyna(scope.row.name)"> 删除 </a>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据预览" name="dview">
          <dsetView ref="dsetViewForm"></dsetView>
        </el-tab-pane>
      </el-tabs>
    </el-form>
</template>

<script>
import { baseUrl, ajax, newGuid } from "@/common/biConfig";
import dsetTableJoin from "@/view/model/DsetTableJoin";
import dsetView from "@/view/model/DsetView";
import { Loading } from "element-ui";
import $ from "jquery";

export default {
  data() {
    return {
      operDailogTitle: "创建数据集",
      dset: {
        name: null,
        dsid: null,
        master: null,
        dsetId: null, //数据集自己的ID
        searchkey: "",
      },
      dsourceList: [],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        dsid: [{ required: true, message: "必填", trigger: "blur" }],
        master: [{ required: true, message: "必填", trigger: "blur" }],
      },
      selectTables: [],
      active: "base",
      isupdate: false,
      cols: [],
      joininfo:[],
      dynamic:[]  //动态字段
    };
  },
  components: {
    dsetTableJoin,dsetView
  },
  mounted() {
    
  },
  computed: {},
  methods: {
    selectds() {
      let dsid = this.dset.dsid;
      ajax(
        {
          type: "POST",
          url: "model/listTables.action",
          data: { dsid: dsid, tname: this.dset.searchkey },
          success: (resp) => {
            this.initLeftTree(false, resp.rows);
          },
        },
        this
      );
      //清除已选表
      this.selectTables = [];
      const ref = $("#selTablesTree").jstree(true);
      $(ref.get_node("#").children).each((a, b) => {
        ref.delete_node(b);
      });
      const refMaster = $("#masterTableTree").jstree(true);
      if (refMaster) {
        $(refMaster.get_node("#").children).each((a, b) => {
          refMaster.delete_node(b);
        });
      }
    },
    saveDset(isupdate) {
      this.isupdate = isupdate;
      let ret = true;
      let ts = this;
      this.$refs["dsetForm"].validate((valid) => {
        if(!ts.dset.master){
          ts.$notify.error("未选择主表");
          ts.active = "join";
          ret = false;
          return;
        }
        if (valid) {
          if (ts.selectTables.length === 0) {
            ts.$notify.error("请选择表");
            ret = false;
            return;
          }
          const json = {
            master: ts.dset.master,
            name: ts.dset.name,
            dsid: ts.dset.dsid,
            joininfo: [],
            dynamic: ts.dynamic
          };
          if (!isupdate) {
            json.dsetId = newGuid();
          } else {
            json.dsetId = ts.dset.dsetId;
          }
          let joins = [ts.dset.master];
          const refMaster = $("#masterTableTree").jstree(true);
          refMaster.get_node("#").children.forEach((element) => {
            let node = refMaster.get_node(element);
            if (node.li_attr.ref) {
              console.log(node.li_attr);
              json.joininfo.push({
                col: node.id,
                ref: node.li_attr.ref,
                refKey: node.li_attr.refKey,
                jtype: node.li_attr.jtype,
              });
              joins.push(node.li_attr.ref);
            }
          });

          //判断是否有选的表未关联
          ts.selectTables.forEach((v, idx) => {
            if (joins.indexOf(v.id) < 0) {
              ts.$notify.error("表 " + v.id + " 未和主表关联。");
              ret = false;
            }
          });
          if (ret === false) {
            return ret;
          }
          let load = Loading.service({ fullscreen: true });

          const exec = () => {
            ajax(
              {
                type: "POST",
                url: isupdate
                  ? "model/updateDset.action"
                  : "model/saveDset.action",
                dataType: "json",
                data: {
                  cfg: JSON.stringify(json),
                  priTable: json.master,
                  name: json.name,
                  dsid: json.dsid,
                  dsetId: json.dsetId
                },
                success: function (resp) {
                  ts.$parent.$parent.$refs["dsetGrid"].loadData();
                },
              },
              ts,
              load
            );
          };
          if(isupdate){
            json.cols = this.cols;
            exec();
          }else{
            ajax(
              {
                type: "post",
                url: "model/queryDatasetMeta.action",
                dataType: "json",
                data: { dsid: ts.dset.dsid, cfg: JSON.stringify(json) },
                success: function (dt) {
                  json.cols = dt.rows;
                  exec();
                },
              },
              ts
            );
          }
        } else {
          ret = false;
        }
      });
      return ret;
    },
    async addDset(isupdate, dsetId) {
      //重置表单
      if (this.$refs["dsetForm"]) {
        this.$refs["dsetForm"].resetFields();
      }
      this.loadDsource();
      let ds = null;
      let ts = this;
      if (isupdate) {
        await new Promise((resolve) => {
          ajax({
            type: "POST",
            url: "model/getDatasetCfg.action",
            dataType: "json",
            data: { dsetId: dsetId },
            success: function (resp) {
              resolve(resp.rows);
            },
          });
        }).then((json) => {
          ds = json;
        });
        this.dset.dsetId = ds.dsetId;
        this.dset.dsid = ds.dsid;
        this.dset.master = ds.master;
        this.dset.name = ds.name;
        //设置已选表
        this.selectTables = [{ id: ds.master, name: ds.master }];
        ds.joininfo.forEach((v) => {
          ts.selectTables.push({ id: v.ref, name: v.ref });
        });
        //预览数据
        this.$refs['dsetViewForm'].loadData(ds.dsetId, ds.dsid);
      } else {
        this.selectTables = [];
      }
      this.dset.searchkey = "";
      this.isupdate = isupdate;
      if (isupdate) {
        $("#tab-cols").show();
        $("#tab-dyna").show();
        $("#tab-dview").show();
      } else {
        //新增状态隐藏 表字段/动态字段
        $("#tab-cols").hide();
        $("#tab-dyna").hide();
        $("#tab-dview").hide();
      }
      if (isupdate) {
        this.cols = ds.cols;
        this.joininfo = ds.joininfo;
        this.dynamic = ds.dynamic?ds.dynamic:[];
      }
      this.active = "base";
      if (isupdate) {
        ajax(
          {
            type: "POST",
            url: "model/listTables.action",
            data: { dsid: this.dset.dsid },
            success: (resp) => {
              ts.initLeftTree(isupdate, resp.rows);
            },
          },
          this
        );
      } else {
        this.initLeftTree(isupdate, []);
      }
      this.initRightTree(isupdate);

      if (!isupdate) {
        //清除主表字段
        const refMaster = $("#masterTableTree").jstree(true);
        if (refMaster) {
          $(refMaster.get_node("#").children).each((a, b) => {
            refMaster.delete_node(b);
          });
        }
      } else {
        //回写主表
        this.loadMasterCols(isupdate, ds);
      }
    },
    loadDsource() {
      ajax(
        {
          type: "GET",
          url: "model/listDataSource.action",
          data: {},
          success: (resp) => {
            this.dsourceList = resp.rows;
          },
        },
        this
      );
    },
    initLeftTree(isupdate, dts) {
      let ref = $("#allTablesTree").jstree(true);
      if (ref) {
        ref.destroy();
      }
      let ts = this;
      $("#allTablesTree")
        .jstree({
          core: {
            check_callback: true,
            data: dts,
          },
          plugins: ["wholerow", "search"],
        })
        .bind("ready.jstree", function () {
          if (isupdate) {
            //隐藏已经选择的表
            var ref = $("#allTablesTree").jstree(true);
            for (let o of ts.selectTables) {
              ref.hide_node(o.id);
            }
          }
        });
    },
    initRightTree(isupdate) {
      let dt = [];
      if (isupdate) {
        for (let o of this.selectTables) {
          dt.push({
            id: o.id,
            text: o.name,
            icon: "fa fa-table",
          });
        }
      }
      const ref = $("#selTablesTree").jstree(true);
      if (ref) {
        ref.destroy();
      }
      $("#selTablesTree").jstree({
        core: {
          check_callback: true,
          data: dt,
        },
        plugins: ["wholerow"],
      });
    },
    left2right() {
      var ref = $("#allTablesTree").jstree(true);
      var selRef = $("#selTablesTree").jstree(true);
      var node = ref.get_selected();

      if (node.length == 0 || ref.is_hidden(node[0])) {
        this.$notify.error("请选择表");
        return;
      }

      var node = ref.get_node(node[0]);
      selRef.create_node("#", {
        id: node.id,
        text: node.text,
        icon: "fa fa-table",
      });
      ref.hide_node(node.id);

      //添加到已选表
      this.selectTables.push({ id: node.id, name: node.text });
    },
    right2left() {
      var ref = $("#allTablesTree").jstree(true);
      var selRef = $("#selTablesTree").jstree(true);
      var node = selRef.get_selected();

      if (node.length == 0) {
        this.$notify.error("您还未选择需要移除的表。");
        return;
      }

      node = selRef.get_node(node[0]);

      if (this.isupdate && node.id == this.dset.master) {
        msginfo("不能移除主表。");
        return;
      }

      var cld = ref.get_node("#").children;

      for (let i = 0; i < cld.length; i++) {
        if (cld[i] == node.id) {
          ref.show_node(node.id);
          break;
        }
      }

      selRef.delete_node(node.id);
      let tz = this;
      //从已选表中删除表
      $(this.selectTables).each((a, b) => {
        if (b.id === node.id) {
          tz.selectTables.splice(a, 1);
          return false;
        }
      });
    },
    changemaster() {
      this.loadMasterCols(false);
    },
    loadMasterCols(isupdate, ds) {
      let ts = this;
      ajax(
        {
          type: "post",
          url: "model/listTableColumns.action",
          dataType: "json",
          data: { tname: ts.dset.master, dsid: ts.dset.dsid },
          success: function (dt) {
            dt = dt.rows;
            let d = [];
            for (let k = 0; k < dt.length; k++) {
              var obj = {
                id: dt[k].name,
                text: dt[k].name,
                icon: "glyphicon glyphicon-menu-hamburger",
              };
              d.push(obj);
            }
            //判断是否有关联字段
            const exist = (v) => {
              let ret = null;
              if(!ds.joininfo){
                return ret;
              }
              for (let c of ds.joininfo) {
                if (c.col === v) {
                  ret = c;
                  break;
                }
              }
              return ret;
            };
            if(isupdate){
              for (let o of d) {
                let r = exist(o.id);
                if (r) {
                  o.text = o.text + "->" + r.ref + "." + r.refKey;
                  o.icon = "glyphicon glyphicon-link";
                  o.li_attr = { ref: r.ref, refKey: r.refKey, jtype: r.jtype };
                }
              }
            }

            let mtree = $("#masterTableTree").jstree(true);
            if (mtree) {
              mtree.destroy();
            }
            $("#masterTableTree").jstree({
              core: {
                check_callback: true,
                data: d,
              },
              plugins: ["wholerow"],
            });
          },
        },
        this
      );
    },
    joinTable() {
      this.$parent.$parent.$refs["tableJoinForm"].create(false);
    },
    unjoinTable() {
      const ref = $("#masterTableTree").jstree(true);
      let node = ref.get_selected(true);
      if (node.length === 0) {
        this.$notify.error("请选择字段再点关联");
        return;
      }
      let ts = this;
      node = node[0];
      ref.set_text(node, node.id);
      ref.set_icon(node, "glyphicon glyphicon-menu-hamburger");
      delete node.li_attr.ref;
      delete node.li_attr.refKey;
      delete node.li_attr.jtype;
    },
    searhTable() {
      if (!this.dset.dsid || this.dset.dsid === "") {
        return;
      }
      ajax(
        {
          type: "POST",
          url: "model/listTables.action",
          data: { dsid: this.dset.dsid, tname: this.dset.searchkey },
          success: (resp) => {
            this.initLeftTree(false, resp.rows);
          },
        },
        this
      );
    },
    modifyCol(col, tname){
      this.$parent.$parent.$refs['colModifyForm'].modify(col, tname, this.cols, this.joininfo, this.dset.master);
    },
    crtdyna(isupdate, col){
      this.$parent.$parent.$refs['dynaColForm'].createDyna(isupdate, col, this.cols, this.dynamic, this.dset.master);
    },
    deleteDyna(col){
      if(confirm("是否确认?")){
        this.dynamic.forEach((e,i)=>{
          if(e.name === col){
            this.dynamic.splice(i, 1);
            return false;
          }
        });
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
.btn-circle {
  width: 30px;
  height: 30px;
  padding: 6px 0;
  border-radius: 15px;
  text-align: center;
  font-size: 12px;
  line-height: 1.428571429;
}
</style>
