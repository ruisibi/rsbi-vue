<template>
  <el-dialog :title="$t('message.model.dset.joinInfo.title')" :visible.sync="showDailog">
    <el-form :model="join" :rules="rules" ref="joinForm">
      <el-form-item :label="$t('message.model.dset.joinInfo.master')" label-width="100px" >
        {{ master }}
      </el-form-item>

      <el-form-item :label="$t('message.model.dset.joinInfo.col')" label-width="100px" >
        {{ masterCol }}
      </el-form-item>

      <el-form-item :label="$t('message.model.dset.joinInfo.slave')" label-width="100px" prop="ref">
        <el-select v-model="join.ref" :placeholder="$t('message.base.select')" @change="changejoin">
          <el-option
            v-for="item in selectTables"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('message.model.dset.joinInfo.col')" label-width="100px" prop="refKey">
        <el-select v-model="join.refKey" :placeholder="$t('message.base.select')">
          <el-option
            v-for="item in refKeyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.model.dset.joinInfo.joinType')" label-width="100px" prop="jtype">
        <el-select v-model="join.jtype" :placeholder="$t('message.base.select')">
          <el-option
            v-for="item in joinTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="savejoin()">{{$t('message.base.ok')}}</el-button>
      <el-button @click="showDailog = false">{{$t('message.base.cancel')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import $ from "jquery";

export default {
  name: "dsetTableJoin",
  data() {
    return {
      showDailog: false,
      join: {
        ref: null,
        refKey: null,
        jtype: null,
      },
      rules: {
        ref: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        refKey: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        jtype: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
      },
      joinTypes: [
        { id: "left", name: this.$t('message.model.dset.joinInfo.left') },
        { id: "right", name: this.$t('message.model.dset.joinInfo.right') },
        { id: "inner", name: this.$t('message.model.dset.joinInfo.inner') },
      ],
      refKeyList:[],
      dsetIds:[],
      selectTables:null,
      master:null,
      masterCol:null,
      dsetId:null
    };
  },
  components: {},
  mounted() {},
  computed: {},
  methods: {
    save() {},
    create(isupdate) {
      //获取已选择表
      this.selectTables = [];
      const dsetForm = this.$parent.$refs['dsetAddForm'];
      this.master = dsetForm.dset.master;
      this.dsetId = dsetForm.dset.dsid;
      let ds = dsetForm.selectTables;
      //剔除主表
      let ts = this;
      ds.forEach((element, idx) => {
        if(element.id !==dsetForm.dset.master ){
          ts.selectTables.push(element);
        }
      });
      //重置表单
      if(this.$refs["joinForm"]){
       this.$refs["joinForm"].resetFields();
      }
      //获取已选字段
      var ref = $("#masterTableTree").jstree(true);
      var node = ref.get_selected(true);
      if (node.length == 0) {
        this.$notify.error(this.$t('message.model.dset.err6'));
        return;
      }
      node = node[0];
      this.masterCol = node.id;
      this.showDailog = true;
      if(node.li_attr.ref){ //回写值
        this.join.ref = node.li_attr.ref;
        this.join.refKey = node.li_attr.refKey;
        this.join.jtype = node.li_attr.jtype;
      }else{
        this.join.ref = null;
        this.join.refKey = null;
        this.join.jtype = null;
      }
    },
    savejoin(){
      var ref = $("#masterTableTree").jstree(true);
      var node = ref.get_selected(true);
      let ts = this;
      node = node[0];
      this.$refs['joinForm'].validate(valid => {
          if(valid){
            node.li_attr.ref = ts.join.ref;
            node.li_attr.refKey = ts.join.refKey;
            node.li_attr.jtype = ts.join.jtype;
            ref.set_icon(node, "glyphicon glyphicon-link");
            ref.set_text(node, node.text+"->"+ts.join.ref+"."+ts.join.refKey);
            this.showDailog = false;
          }
        }
      )
     
    },
    changejoin(){
      let tname = this.join.ref;
      let ts = this;
      ajax({
        type: "post",
        url: "model/listTableColumns.action",
        dataType: "json",
        data: { tname, dsid: ts.dsetId },
        success: function (dt) {
          dt = dt.rows;
          ts.refKeyList = [];
          $(dt).each((a, b)=>{
            ts.refKeyList.push({id:b.name,name:b.name});
          });
          
        },
      }, this);     
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
