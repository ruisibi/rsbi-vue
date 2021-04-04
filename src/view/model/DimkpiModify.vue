<template>
  <el-dialog title="编辑维度及度量" :visible.sync="show">
    <el-form :model="node" ref="nodeForm" :rules="rule">
        <template v-if="type === 'dim'">
          <el-form-item label="维度字段" label-width="100px">
            {{ node.col }}
          </el-form-item>
        </template>
        <template v-if="type === 'kpi'">
          <el-form-item label="度量字段" label-width="100px">
            {{ node.col }}
          </el-form-item>
        </template>
        <el-form-item label="别名" label-width="100px">
            {{ node.alias }}
          </el-form-item>
         <el-form-item label="显示名称" label-width="100px" prop="dimname">
          <el-input v-model="node.dimname"></el-input>
         </el-form-item>
         <template v-if="type === 'dim'">
          <el-form-item label="维度类型" label-width="100px" prop="dimtype">
            <el-select v-model="node.dimtype" clearable="clearable" style="width:100%" placeholder="请选择">
              <el-option
                v-for="item in opts.dimtype"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维度格式" label-width="100px" prop="dateformat">
            <el-select v-model="node.dateformat" clearable="clearable" style="width:100%"  placeholder="请选择">
              <el-option
                v-for="item in opts.dateformat"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维度对应表" label-width="100px" prop="dateformat">
            <el-select v-model="node.colTable" clearable="clearable" style="width:100%" @change="chgtable"  placeholder="请选择">
              <el-option
                v-for="item in opts.colTable"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维度Key字段" label-width="100px" prop="colkey">
            <el-select v-model="node.colkey"  style="width:100%"  placeholder="请选择">
              <el-option
                v-for="item in opts.colkey"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维度Text字段" label-width="100px" prop="coltext">
            <el-select v-model="node.coltext"  style="width:100%"  placeholder="请选择">
              <el-option
                v-for="item in opts.coltext"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序方式" label-width="100px">
            <el-select v-model="node.dimord" clearable="clearable" style="width:100%" placeholder="请选择">
              <el-option
                v-for="item in opts.dimord"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
         </template>
         <template v-if="type === 'kpi'">
           <el-form-item label="计算方式" label-width="100px" prop="kpiaggre">
            <el-select v-model="node.kpiaggre" placeholder="请选择" >
              <el-option
                v-for="item in opts.js"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="度量单位" label-width="100px" prop="kpiunit">
            <el-input v-model="node.kpiunit"></el-input>
          </el-form-item>
          <el-form-item label="格式化" label-width="100px" prop="kpifmt">
            <el-select
              v-model="node.kpifmt"
              placeholder="请选择"
            >
              <el-option
                v-for="item in opts.fmt"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="度量解释" label-width="100px" prop="kpinote">
            <el-input type="textarea" v-model="node.kpinote"></el-input>
          </el-form-item>
         </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ajax, newGuid } from "@/common/biConfig";
import $ from "jquery"

export default {
   name: 'dimkpiModify',
  data() {
    return {
      show:false,
      tit:"",
      clearable:true,
     node: {
        dimname:"",
        col:"",
        alias:"",
        dimtype:"",
        dateformat:"",
        colTable:"",
        colkey:"",
        coltext:"",
        dimord:"",
        kpiaggre:"",
        kpiunit:"",
        kpifmt:"",
        kpinote:""
     },
     dset:null,
      rule:{
        //dimname: [{ required: true, message: "必填", trigger: "blur" }],
        //dimtype: [{ required: true, message: "必填", trigger: "blur" }],
      },
      type:'',  //dim/kpi 2种
      opts:{
        dimtype:[
          {value:"frd",text:"未选择"},
          {value:"year",text:"年"},
          {value:"quarter",text:"季度"},
          {value:"month",text:"月份"},
          {value:"day",text:"日期"},
          {value:"prov",text:"省份"},
          {value:"city",text:"地市"},
          {value:"town",text:"区县"}
        ],
        dateformat:[
          'yyyymmdd', 'yyyy-mm-dd', 'yyyy年mm月dd日', 'yyyymm', 'yyyy-mm', 'yyyy年mm月', 'yyyy', 'yyyy年'
        ],
        colTable:[],
        dimord:[{
          value:"asc", text:"升序"
        },{
          value:"desc", text:"降序"
        }],
        coltext:[],
        colkey:[],
        js:["sum","avg","count","count(distinct)", "max", "min"],
        fmt:[{
          value:"#,###", text:"整数"
        },{
          value:"#,###.00", text:"小数(保留两位)"
        },{
          value:"#,###.0000", text:"小数(保留四位)"
        },{
          value:"0.00%", text: "百分比"
        }]
      }
    }
  },
  components: {
		
	},
  mounted() {
    
  },
  computed: {},
  methods: {
    save(){
      let ts = this;
      this.$refs['nodeForm'].validate(v=>{
       if(v){
          let ref = $("#cuberighttree").jstree(true);
          let node = ref.get_selected(true)[0];
					if(ts.type === 'dim'){
            var dtp = ts.node.dimtype;
						var dtfmt = ts.node.dateformat;
						if(dtp != "" && (dtp == "year" || dtp == "month" || dtp == "quarter" || dtp == "day") && dtfmt == "" ){
						  this.$notify.error("请选择时间维度类型。");
							return;
						}
						node.li_attr.dispName = ts.node.dimname;
						node.li_attr.dimtype = dtp;
						node.li_attr.colTable = ts.node.colTable;
						node.li_attr.colkey = ts.node.colkey;
						node.li_attr.coltext = ts.node.coltext;
						node.li_attr.dimord = ts.node.dimord;
						node.li_attr.dateformat = dtfmt;
            node.li_attr.isupdate = "y";  //表示维度已经更改过了。
            ref.rename_node(node, ts.node.dimname);
          }else if(ts.type === 'kpi'){
            node.li_attr.aggre = ts.node.kpiaggre;
            node.li_attr.unit = ts.node.kpiunit;
            node.li_attr.fmt= ts.node.kpifmt;
            node.li_attr.kpinote = ts.node.kpinote;
            node.li_attr.dispName = ts.node.dimname;
            node.li_attr.isupdate = "y";  //表示度量已经更改过了。
            ref.rename_node(node, ts.node.kpiaggre+"("+ts.node.dimname+")");
          }
          ts.show = false;
       }
      });
    },
    modify(selectNode, dset){
      this.show = true;
      //维度的属性
      this.type = selectNode.li_attr.tp;
      this.node.col = selectNode.li_attr.col;
      this.node.alias = selectNode.li_attr.alias;
      this.node.dimname = selectNode.li_attr.dispName;
      this.node.dimtype = selectNode.li_attr.dimtype;
      this.node.colTable = selectNode.li_attr.colTable;
      this.node.colkey = selectNode.li_attr.colkey;
      this.node.coltext = selectNode.li_attr.coltext;
      this.node.dimord = selectNode.li_attr.dimord;
      this.node.dateformat = selectNode.li_attr.dateformat;
      //指标的属性
      this.node.kpiaggre = selectNode.li_attr.aggre;
      this.node.kpiunit = selectNode.li_attr.unit;
      this.node.kpifmt = selectNode.li_attr.fmt;
      this.node.kpinote = selectNode.li_attr.kpinote;

      this.dset = dset;
      let ts = this;
      ts.opts.colTable = [];
      ts.opts.colkey = [];
      ts.opts.colkey = [];
      $(dset.cols).each((a, b)=>{
        if(!(ts.opts.colTable.indexOf(b.tname) >= 0)){
          ts.opts.colTable.push(b.tname);
        }
      });
    },
    chgtable(val){
      let ls = this.dset.cols.filter(c=>c.tname === val).map(m=>m.name);
      this.opts.coltext = this.opts.colkey = ls;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
