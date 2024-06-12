<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog :title="$t('message.report.event.title')" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <div class="el-dialog-div" align="left">
			  <el-form label-width="150px">

				<el-tabs v-model="activeName" type="card">
					<el-tab-pane :label="$t('message.report.event.send')" name="send">
						<el-form-item :label="$t('message.report.event.linkComp')">
							<el-checkbox-group v-model="linkComps" size="small">
								<template v-for="item in comps">
									<p :key="item.id">	<el-checkbox :label="item.id" border>{{ item.name }}</el-checkbox> </p>
								</template>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="">
							<button type="button" class="btn btn-info btn-sm" @click="cleanPostEvent">{{$t('message.report.event.cleanPostEvent')}}</button>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane :label="$t('message.report.event.accept')" name="accept">
						<el-form-item :label="$t('message.report.event.acceptCol')">
							<el-select v-model="acceptCol" :placeholder="$t('message.base.select')" style="width:100%">
								<el-option
								v-for="item in cols"
								:key="item.alias"
								:label="item.dim_desc"
								:value="item.alias"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="">
							<button type="button" @click="cleanAcceptEvent" class="btn btn-info btn-sm">{{$t('message.report.event.cleanAcceptEvent')}}</button>
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
			  </el-form>
		  </div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save()">{{$t('message.base.ok')}}</el-button>
			<el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
		</div>
  </el-dialog>
</template>

<script>
	import {ajax, newGuid} from '@/common/biConfig'
	import * as utils from './Utils'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show:false,
				comp:null,
				activeName:null,
				linkComps:[],
				comps:[],
				acceptCol:null,
				cols:[]
			}
		},
		props: {
			pageInfo: {
				type: Object,
				required: true
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {
			loadCols(){
				ajax({
					type:"post",
					url:"../bireport/queryDims.action",
					data: {cubeId: this.comp.cubeId},
					success:(resp)=>{
						this.cols = resp.rows;
					}
				}, this);
			},
			openDailog(comp){
				if(!(comp.dsetId || comp.cubeId)){
					utils.msginfo(this.$t('message.report.event.err1'));
					return;
				}
				this.comp = comp;
				this.show = true;
				this.activeName = "send";
				let ccomps = [];
				let comps = utils.findAllComps(this.pageInfo);
				for(let i=0; comps && i<comps.length; i++){
					var o = comps[i];
					if(o.type == 'chart' || o.type == 'table'){
						if(o.id != comp.id){  //不添加它自己
							ccomps.push({id:o.id, name:o.name});
						}
					}
				}
				this.comps = ccomps || [];
				var clink;
				var linkaccept;
				if(comp.type == "chart" && comp.chartJson){
					clink = comp.chartJson.link;
					linkaccept = comp.chartJson.linkAccept;
				}else{
					clink = comp.link;
					linkaccept = comp.linkAccept;
				}
				if(clink){
					this.linkComps = clink.target.split(",");
				}else{
					this.linkComps = [];
				}
				if(linkaccept){
					this.acceptCol = linkaccept.alias;
				}else{
					this.acceptCol = null;
				}
				this.loadCols();
			},
			save(){
				this.show = false;
				let comp = this.comp;
				let ts = this;
				if(this.activeName === 'send'){
					var seles = this.linkComps;
					if(seles && seles.length > 0){
						var link = {};
						if(comp.type == "chart"){
							comp.chartJson.link = link;
						}else{
							comp.link = link;
						}
						var targets = "";
						var types = "";
						$(seles).each(function(a, b){
							var id = b;
							var linkComp = utils.findCompById(ts.pageInfo, id);
							targets = targets + id + ",";
							types = types + (linkComp.type=="table"?"cross":linkComp.type)+","
						});
						targets = targets.substring(0, targets.length - 1);
						types = types.substring(0, types.length - 1);
						link.target = targets; 
						link.type = types;
						link.paramName = "p"+Math.floor(Math.random()*100);
					}else{
						if(comp.type == "chart"){
							delete comp.chartJson.link;
						}else{
							delete comp.link;
						}
					}
				}else if(this.activeName === 'accept'){
					var col = this.acceptCol;
					var val = "";
					if(col === null && val == ''){
						if(comp.type ==='chart'){
							delete comp.chartJson.linkAccept;
						}else{
							delete comp.linkAccept
						}
						this.$parent.setUpdate();
						return;
					}
					var dim = null;
					let cols = this.cols;
					for(let c=0; cols && c<cols.length; c++){
						if(cols[c].alias == col){
							dim = cols[c];
						}
					}
					var o = {col:dim.col_name, alias:dim.alias, type:dim.dim_type, dftval: val, valType: dim.valType, tname:dim.tname,dimTname:dim.dim_tname,calc:dim.calc};
					if(comp.type == "chart"){
						comp.chartJson.linkAccept = o;
					}else{
						comp.linkAccept = o;
					}
				}
				this.$parent.setUpdate();
			},
			cleanPostEvent(){
				this.linkComps = [];
			},
			cleanAcceptEvent(){
				this.acceptCol = null;
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
