<template>
  <el-dialog :title="$t('message.model.nodeModify.title')" :visible.sync="show">
    <el-form :model="node" ref="nodeForm" :rules="rule">
        <template v-if="type === 'dim'">
          <el-form-item :label="$t('message.model.nodeModify.colDim')" label-width="150px">
            {{ node.col }}
          </el-form-item>
        </template>
        <template v-if="type === 'kpi'">
          <el-form-item :label="$t('message.model.nodeModify.colKpi')" label-width="150px">
            {{ node.col }}
          </el-form-item>
        </template>
        <el-form-item :label="$t('message.model.nodeModify.alias')" label-width="150px">
            {{ node.alias }}
          </el-form-item>
         <el-form-item :label="$t('message.model.nodeModify.dimname')" label-width="150px" prop="dimname">
          <el-input v-model="node.dimname"></el-input>
         </el-form-item>
         <template v-if="type === 'dim'">
          <el-form-item :label="$t('message.model.nodeModify.dimtype')" label-width="150px" prop="dimtype">
            <el-select v-model="node.dimtype" clearable="clearable" style="width:100%" :placeholder="$t('message.base.select')">
              <el-option
                v-for="item in opts.dimtype"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.nodeModify.dateformat')" label-width="150px" prop="dateformat">
            <el-select v-model="node.dateformat" clearable="clearable" style="width:100%"  :placeholder="$t('message.base.select')">
              <el-option
                v-for="item in opts.dateformat"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.nodeModify.colTable')" label-width="150px" prop="dateformat">
            <el-select v-model="node.colTable" clearable="clearable" style="width:100%" @change="chgtable"  :placeholder="$t('message.base.select')">
              <el-option
                v-for="item in opts.colTable"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.nodeModify.colkey')" label-width="150px" prop="colkey">
            <el-select v-model="node.colkey"  style="width:100%"  :placeholder="$t('message.base.select')">
              <el-option
                v-for="item in opts.colkey"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.nodeModify.coltext')" label-width="150px" prop="coltext">
            <el-select v-model="node.coltext"  style="width:100%"  :placeholder="$t('message.base.select')">
              <el-option
                v-for="item in opts.coltext"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.nodeModify.dimord')" label-width="150px">
            <el-select v-model="node.dimord" clearable="clearable" style="width:100%" :placeholder="$t('message.base.select')">
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
           <el-form-item :label="$t('message.model.nodeModify.kpiaggre')" label-width="150px" prop="kpiaggre">
            <el-select v-model="node.kpiaggre" :placeholder="$t('message.base.select')" >
              <el-option
                v-for="item in opts.js"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.nodeModify.kpiunit')" label-width="150px" prop="kpiunit">
            <el-input v-model="node.kpiunit"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.model.nodeModify.kpifmt')" label-width="150px" prop="kpifmt">
            <el-select
              v-model="node.kpifmt"
              :placeholder="$t('message.base.select')"
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
          <el-form-item :label="$t('message.model.nodeModify.kpinote')" label-width="150px" prop="kpinote">
            <el-input type="textarea" v-model="node.kpinote"></el-input>
          </el-form-item>
         </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
      <el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
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
          {value:"frd",text:this.$t('message.model.dimTypes.frd')},
          {value:"year",text:this.$t('message.model.dimTypes.year')},
          {value:"quarter",text:this.$t('message.model.dimTypes.quarter')},
          {value:"month",text:this.$t('message.model.dimTypes.month')},
          {value:"day",text:this.$t('message.model.dimTypes.day')},
          {value:"prov",text:this.$t('message.model.dimTypes.prov')},
          {value:"city",text:this.$t('message.model.dimTypes.city')},
          {value:"town",text:this.$t('message.model.dimTypes.town')}
        ],
        dateformat:[
          'yyyymmdd', 'yyyy-mm-dd', 'yyyy年mm月dd日', 'yyyymm', 'yyyy-mm', 'yyyy年mm月', 'yyyy', 'yyyy年'
        ],
        colTable:[],
        dimord:[{
          value:"asc", text:this.$t('message.model.nodeModify.asc')
        },{
          value:"desc", text:this.$t('message.model.nodeModify.desc')
        }],
        coltext:[],
        colkey:[],
        js:["sum","avg","count","count(distinct)", "max", "min"],
        fmt:[{
          value:"#,##0", text:this.$t('message.model.fmt.int')
        },{
          value:"#,##0.00", text:this.$t('message.model.fmt.double')
        },{
          value:"#,##0.0000", text:this.$t('message.model.fmt.double2')
        },{
          value:"0.00%", text: this.$t('message.model.fmt.percentage')
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
						  this.$notify.error(ts.$t('message.model.nodeModify.err1'));
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
