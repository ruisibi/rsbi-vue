<template>
  <el-dialog :title="tit" :visible.sync="show">
    <el-form :model="express" ref="expressForm" :rules="rule">
         <el-form-item :label="$t('message.model.exp.alias')" label-width="150px" prop="alias">
          <el-input v-model="express.alias"></el-input>
         </el-form-item>
         <el-form-item :label="$t('message.model.exp.kpiname')" label-width="150px" prop="kpiname">
          <el-input v-model="express.kpiname"></el-input>
         </el-form-item>
         <el-form-item :label="$t('message.model.exp.expression')" label-width="150px" prop="expression">
          <label slot="label">{{ $t('message.model.exp.expression') }} <a @click="helpbdsinfo" href="javascript:;"><i class="fa fa-question-circle"></i></a>：</label>
          <el-input id="mybds" type="textarea" v-model="express.expression"></el-input>
         </el-form-item>
         <div style="line-height:25px;">
          <template v-for="c in cols">
              <button @click="selectCol(c.col)" style="margin-right:5px;" type="button" :key="c.col" :name="c.col" class="btn btn-primary btn-xs">{{ c.col }}</button>
          </template>
          </div>
          <el-form-item :label="$t('message.model.exp.kpiaggre')" label-width="150px" prop="kpiaggre">
            <el-select
              v-model="express.kpiaggre"
              :placeholder="$t('message.base.select')"
            >
              <el-option
                v-for="item in opt.js"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.exp.kpiunit')" label-width="150px" prop="kpiunit">
            <el-input v-model="express.kpiunit"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.model.exp.kpifmt')" label-width="150px" prop="kpifmt">
            <el-select
              v-model="express.kpifmt"
              :placeholder="$t('message.base.select')"
            >
              <el-option
                v-for="item in opt.fmt"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('message.model.exp.kpinote')" label-width="150px" prop="kpinote">
            <el-input type="textarea" v-model="express.kpinote"></el-input>
          </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">{{ $t('message.base.ok')}}</el-button>
      <el-button @click="show = false">{{ $t('message.base.cancel')}}</el-button>
    </div>
    <el-dialog custom-class="nopadding" width="50%" :title="$t('message.model.exp.note1')" :visible.sync="innerVisible" append-to-body>
			<div style="line-height:30px; padding:15px;"> <p v-html="$t('message.model.exp.note2')"></p><p></p></div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="innerVisible = false">{{ $t('message.base.cancel')}}</el-button>
			</div>
		</el-dialog>
  </el-dialog>
</template>

<script>
import { baseUrl, ajax, newGuid,insertText2focus } from "@/common/biConfig";
import $ from "jquery"

export default {
   name: 'expressKpi',
  data() {
    return {
      show:false,
      tit:"",
      innerVisible:false,
     express: {
       alias:"",
       kpiname:"",
       expression:"",
       kpiaggre:"",
       kpiunit:"",
       kpifmt:"",
       kpinote:""
     },
      cols:[],
      rule:{
        alias: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        kpiname: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        expression: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        kpiaggre: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
      },
      dset:null,
      opt:{
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
      },
      isupdate:false
    }
  },
  components: {
		
	},
  mounted() {
    
  },
  computed: {},
  methods: {
    helpbdsinfo(){
      this.innerVisible = true;
    },
    save(){
      let ts = this;
      this.$refs['expressForm'].validate(v=>{
       if(v){
					if(ts.ischinese(ts.express.alias)){
            ts.$notify.error(ts.$t('message.model.exp.err1'));
						return;
					}
          let ref = $("#cuberighttree").jstree(true);
          let kpi = ref.get_selected(true)[0];
					if(ts.isupdate){
						kpi.li_attr.aggre = ts.express.kpiaggre;
						kpi.li_attr.fmt = ts.express.kpifmt;
						kpi.li_attr.unit = ts.express.kpiunit;
						kpi.li_attr.dispName = ts.express.kpiname;
						kpi.li_attr.kpinote =  ts.express.kpinote;
						kpi.li_attr.col = ts.express.expression;
						kpi.li_attr.alias = ts.express.alias;
            kpi.li_attr.isupdate = "y";  //表示计算指标已经更改过了。
            ref.rename_node(kpi, kpi.li_attr.aggre+"("+ts.express.kpiname+")");
					}else{
						var cid = ts.$parent.$refs['cubeForm'].findCubeMaxId();
            var o = {id:cid.id, text:ts.express.kpiaggre+"("+ts.express.kpiname+")",
            li_attr:{tp:"kpi",calc:true,drag:true,aggre:ts.express.kpiaggre,col:ts.express.expression, 
            alias:ts.express.alias, dispName:ts.express.kpiname,tname:"",fmt:ts.express.kpifmt,
            unit:ts.express.kpiunit,kpinote:ts.express.kpinote,calcKpi:1},icon:"fa fa-circle icon_kpi"};
            ref.create_node("cubedl", o);
          }
          ts.show = false;
       }
      });
    },
    create(isupdate, dset){
      if(isupdate){
        this.tit = this.$t("message.model.exp.modify");
      }else{
        this.tit = this.$t("message.model.exp.add");
      }
      this.show = true;
      if(this.$refs['expressForm']){
        this.$refs['expressForm'].resetFields();
      }
      this.dset = dset;
      //初始化 cols
      let ref = $("#cubelefttree").jstree(true);
      if(ref){
        let r = ref.get_node("#").children;
        let cols = [];
        $(r).each((a, b)=>{
          $(ref.get_node(b).children).each((a, b)=>{
            let t = ref.get_node(b);
            cols.push({col:t.li_attr.col});
          });
        });
        this.cols = cols;
      }
      if(!isupdate){
        this.express.alias = "k_" + Math.round(Math.random() * 100000);
      }else{
        //回写值
        let rightRef = $("#cuberighttree").jstree(true);
        let node = rightRef.get_selected(true)[0];
        this.express.alias = node.li_attr.alias;
        this.express.expression = node.li_attr.col;
        this.express.kpiname = node.li_attr.dispName;
        this.express.kpiaggre = node.li_attr.aggre;
        this.express.kpiunit = node.li_attr.unit;
        this.express.kpifmt = node.li_attr.fmt;
        this.express.kpinote = node.li_attr.kpinote;
      }
      this.isupdate = isupdate;
    },
    selectCol(v){
     insertText2focus(document.getElementById("mybds"), v);
   },
   ischinese(a){
      if (/[\u4E00-\u9FA5]/i.test(a)) {
        return true;  
      }else{   
         return false 
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
