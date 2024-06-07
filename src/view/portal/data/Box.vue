<template>
    <div id="boxDataPanel" style="margin:3px;">
        <div class="tsbd">
          <div class="ts_h">
            <div class="h_tit">{{$t('message.report.box.dataName')}}</div>
            <div class="h_ctx">
              <span v-if="!comp.kpiJson" class="charttip">{{$t('message.report.box.dataNote')}}</span>
              <span v-if="comp.kpiJson"><span>{{comp.kpiJson.kpi_name}}</span></span>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'

export default {
  components:{
    
  },
  props:{
      comp:{
        type:Object,
        required:true
      }
  },
  data(){
    return {
      
    }
  },
  mounted(){
     this.bindBoxEvent();
  },
  computed: {
  },
  methods: {
    boxView(){
      this.$parent.$parent.$refs['optarea'].$refs['mv_'+this.comp.id].boxView();
    },
    setUpdate(){
      this.$parent.$parent.isupdate = true;
    },
    bindBoxEvent(){
      let ts = this;
      $("#boxDataPanel .h_ctx").droppable({
        accept:"#datasettree .jstree-node",
		    tolerance:"pointer",
        over:function(e, ui){
			    var ref = $("#datasettree").jstree(true);
			    var node = ref.get_node(ui.draggable[0]);
          var tp = node.li_attr.col_type;
          //只能拖拽度量
          if(tp != 2){
            return;
          }
          
          //对维度拖拽设置图标
          $(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
			    $(this).css("border", "1px solid #ff0000");
        },
        out:function(e, ui){
          $(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
			    $(this).css("border", "1px solid #dcdfe6");
        },
       drop:function(e, ui){
          let json = ts.comp;        
          //清除边框颜色
          $(this).css("border", "1px solid #dcdfe6");
          
          //获取TREE
          var ref = $("#datasettree").jstree(true);
		    	var node = ref.get_node(ui.draggable[0]);
          var tp = node.li_attr.col_type;
          //只能拖拽度量
          if(tp == 2){
          }else{
            utils.msginfo(this.$t('message.report.box.err1'));
            return;
          }
          
          json.dsetId = node.li_attr.dsetId;
          json.dsid = node.li_attr.dsid;
          json.kpiJson = {"kpi_id":node.li_attr.col_id, "kpi_name" : node.text, "col_name":node.li_attr.col_name, "aggre":node.li_attr.aggre, "fmt":node.li_attr.fmt, "alias":node.li_attr.alias,"tname":node.li_attr.tname,"unit":node.li_attr.unit,"rate":node.li_attr.rate};
          //设置title
          json.name = node.text;
          ts.boxView();
          ts.$forceUpdate();
          ts.setUpdate();
        }
      });
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>
  .tsbd .ts_h{
    font-size:13px;
    margin:5px 20px 5px 5px;
    width:205px;
    float:left;
  }
  .h_tit {
		float: left;
		border:1px solid #dcdfe6;
		height:32px;
		color: #909399;
		font-size: 14px;
		padding:5px 0px 3px 5px;
		border-radius:5px;
		background-color: #f5f7fa;
		 width:90px;
		 border-right: 0;
		 border-top-right-radius: 0;
		 border-bottom-right-radius: 0;
	}
  .tsbd .h_ctx{
    border:1px solid #dcdfe6;
      height:32px;
      overflow:hidden;
      border-radius:5px;
	  padding:5px;
	  font-size: 14px;
	  border-top-left-radius: 0;
		border-bottom-left-radius: 0;
  }
  span.charttip {
    color:#999999;
    padding:3px;
    display:block;
  }
   span.charttip {
    color:#999999;
    display:block;
    padding: 1px;
  }
</style>
