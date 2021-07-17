<template>
	<div class="ibox" style="margin-bottom:20px;">
		<div class="ibox-content" id="p_param" style="padding:5px;">
			<div class="ptabhelpr" v-if="!pageInfo.params || pageInfo.params.length == 0 ">拖拽维度到此处作为筛选条件</div>
			<b v-if="pageInfo.params && pageInfo.params.length > 0">参数：</b>
			<template v-for="(p) in pageInfo.params">
				<span :key="p.id" class="pppp">
					<span title="筛选" @click="paramFilter(p, p.type, p.name)" class="text">{{p.name}}({{ paramsDisp(p) }})</span>
					<button class="btn btn-default btn-xs" title="删除" @click.stop="deleteParam(p.id)"><i class="fa fa-remove"></i></button>
				</span>
			</template>
		</div>
	</div>
</template>

<script>
	import {ajax} from '@/common/biConfig'
	import $ from 'jquery'
	import {findParamById} from '@/view/bireport/bireportUtils'

	export default {
	    data(){
			return {

			}
		},
		props:{
			pageInfo:{
				type:Object,
				required:true
			}
		},
		mounted(){
			this.paramDrop();
		},
		computed: {
			//ccc: {
			//	get:function(){
					//return "abc";
			//	}
				//var s = p.valStrs&&p.valStrs.length>0?p.valStrs.join(","):"无";
				//return 'abc';
			// }
		},
		methods: {	
			paramsDisp(p){
				if(p.type === 'day' || p.type === 'month'){
					if(p.st && p.end){
						return p.st + "至" + p.end
					}else{
						return "无";
					}
				}else{
					if(p.valStrs&&p.valStrs.length>0){
						return p.valStrs.join(",");
					}else{
						return "无";
					}
				}
			},
			/**
			 * 参数接受拖拽事件
			 */
			paramDrop(){
				const ts = this;
				$("#p_param").droppable({
					accept:"#datasettree .jstree-node",
					tolerance:"pointer",
					over:function(e,ui){
						var ref = $("#datasettree").jstree(true);
						var node = ref.get_node(ui.draggable[0]);
						var tp = node.li_attr.col_type;
						//对维度拖拽设置图标
						if(tp == 1 ){
							$(ui.helper[0]).find("span").removeClass("glyphicon-remove").addClass("glyphicon-ok");
							$(this).css("border", "1px solid #ff0000");
						}
					},
					out:function(e,ui){
						$(ui.helper[0]).find("span").removeClass("glyphicon-ok").addClass("glyphicon-remove");
						$(this).css("border", "1px solid #d3d3d3");
					},
					drop:function(e,ui){
						const pageInfo = ts.pageInfo;
						$(this).css("border", "1px solid #d3d3d3");
						var ref = $("#datasettree").jstree(true);
						var node = ref.get_node(ui.draggable[0]);
						var tp = node.li_attr.col_type;
						if(tp == 1){
							if(!pageInfo.params){
								pageInfo.params = [];
							}
							//判断是否存在
							if(findParamById(node.li_attr.col_id, ts.pageInfo.params) != null){
								ts.$notify.error({title: '您已经添加了该参数！',offset: 50});
								return;
							}
							var id = node.li_attr.col_id;
							var p = {"id":id, "name":node.text, "type":node.li_attr.dim_type, "colname":node.li_attr.col_name,"alias":node.li_attr.alias, "tname":node.li_attr.tname,"cubeId":node.li_attr.cubeId,"valType":node.li_attr.valType,"tableName":node.li_attr.tableName, "tableColKey":node.li_attr.tableColKey,"tableColName":node.li_attr.tableColName,"calc":node.li_attr.calc, "dimord":node.li_attr.dimord, "grouptype":node.li_attr.grouptype,"dateformat":(node.li_attr.dateformat==null?"":node.li_attr.dateformat),dsid:node.li_attr.dsid};
							pageInfo.params.push(p);
							var obj = $(this);
							
							//弹出筛选窗口
							ts.paramFilter(p, p.type, p.name);
						}
					}
				});
			},
			/**
			 * 弹出筛选窗口
			 */
			paramFilter(p, type, name){
				this.$parent.$refs['paramFilterForm'].create(p);
			},
			deleteParam(id){
				$(this.pageInfo.params).each((a,b)=>{
					if(b.id==id){
						this.pageInfo.params.splice(a, 1);
						return false;
					}
				});
				if(this.pageInfo.params.length === 0){
					$("#p_param").html("<div class=\"ptabhelpr\">拖拽维度到此处作为页面参数</div>");
				}
				this.$parent.$refs['tableForm'].tableView();
				this.$parent.$refs['chartForm'].chartView();
			}
		},
		watch: {
		}
	}
</script>

<style lang="css">
	#p_param .ptabhelpr{
		padding:5px;
		color: #999999;
		font-size: 14px;
	}
	#p_param span.pppp {
		background-color: #FFFFCC;
		border: 1px solid #CACACA;
		display: inline-block;
		padding: 3px;
		text-align: center;
		margin-right:3px;
		border-radius: 3px;
	}
	#p_param span.text {
		cursor:pointer;
	}
	#p_param span.pppp span.text {
		display:-moz-inline-box;  
		white-space:nowrap;
		overflow:hidden;
	}
</style>
