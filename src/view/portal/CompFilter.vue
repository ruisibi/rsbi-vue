<!-- 组件筛选，和查询条件关联 -->
<template>
  	<el-dialog title="组件筛选" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		  <div class="el-dialog-div">
		 <div align="left" style="margin:10px;">
			<button type="button" class="btn btn-primary" @click="addFilter()">
				<i class="glyphicon glyphicon-plus" aria-hidden="true"></i>新增筛选条件
			</button>
		 </div>
		<el-table :data="comp&&comp.params?comp.params:[]" border style="width: 100%" header-row-class-name="tableHeadbg">
			<el-table-column align="center" prop="col" label="筛选字段"></el-table-column>
			<el-table-column align="center" prop="type" label="判断条件"></el-table-column>
			<el-table-column align="center" prop="val" :formatter="fmtvalue" label="筛选值"></el-table-column>
			<el-table-column align="center" prop="valuetype" label="值类型"></el-table-column>
			<el-table-column align="center" prop="id" label="操作">
				<template slot-scope="scope">
						<a class="btn btn-primary btn-xs" @click="modifyFilter(scope.row.id)"> 修改 </a>
						<a class="btn btn-danger btn-xs" @click="delFilter(scope.row.id)"> 删除 </a>
				</template>
			</el-table-column>
		</el-table>
		  </div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="filtersSave()">关 闭</el-button>
		</div>

		<el-dialog :title="title" width="40%" :visible.sync="addShow" append-to-body>
			<el-form :model="filter" ref="filterForm" :rules="rules">
				<el-form-item label="筛选字段" label-width="100px" prop="col">
					<el-select v-model="filter.col" placeholder="请选择" style="width:100%">
						<el-option
						v-for="item in opts.cols"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>				    
				</el-form-item>
				<el-form-item label="判断条件" label-width="100px" prop="type">
					<el-select v-model="filter.type" placeholder="请选择">
						<el-option
						v-for="item in opts.types"
						:key="item"
						:label="item"
						:value="item">
						</el-option>
					</el-select>				    
				</el-form-item>
				<el-form-item label="筛选值" label-width="100px" prop="value">
					<template v-if="filter.usetype === 'gdz'">
						<el-input v-model="filter.value"  style="width:195px;" ></el-input>
					</template>
					<template v-if="filter.usetype === 'param'">
						<el-select v-model="filter.linkparam" placeholder="请选择">
							<el-option
							v-for="item in opts.params"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>	
					</template>
					<el-radio-group v-model="filter.usetype" size="small">
						<el-radio-button label="gdz">固定值</el-radio-button>
						<el-radio-button label="param">链接到参数</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<template v-if="filter.type =='between'">
					<el-form-item label="筛选值2" label-width="100px" prop="value">
						<template v-if="filter.usetype === 'gdz'">
							<el-input v-model="filter.value2"  style="width:195px;" ></el-input>
						</template>
						<template v-if="filter.usetype === 'param'">
							<el-select v-model="filter.linkparam2" placeholder="请选择">
								<el-option
								v-for="item in opts.params"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>	
						</template>
						<el-radio-group v-model="filter.usetype" size="small">
							<el-radio-button label="gdz">固定值</el-radio-button>
							<el-radio-button label="param">链接到参数</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</template>
				<el-form-item label="值类型" label-width="100px" prop="vtype">
					<el-radio-group v-model="filter.valuetype" size="small">
						<el-radio-button label="string">字符类型</el-radio-button>
						<el-radio-button label="number">数字类型</el-radio-button>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="filterSave()">确 定</el-button>
				<el-button @click="addShow = false">取 消</el-button>
			</div>
		</el-dialog>
  </el-dialog>
</template>

<script>
	import {ajax, newGuid} from '@/common/biConfig'
	import $ from 'jquery'
	import * as utils from './Utils'

	export default {
	    data(){
			return {
				show:false,
				addShow:false,
				title:"创建筛选条件",
				comp:null,
				tableData:[],
				isupdate:false,
				paramId:null,
				filter:{
					col:null,
					type:null,
					value:null,
					value2:null,
					vtype:null,
					valuetype:null,
					usetype:null,
					linkparam:null,
					linkparam:null
				},
				opts:{
					cols:[],
					types:["=",">",">=","<", "<=", "!=", "between", "in", "like"],
					params:[]
				},
				rules:{
					col:[
						{ required: true, message: '必填', trigger: 'blur' }
					],
					type:[
						{ required: true, message: '必填', trigger: 'blur' }
					]
				}
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
			init(comp){
				if(!(comp.dsetId || comp.cubeId)){
					utils.msginfo("组件还未定义数据，不能定义筛选。");
					return;
				}
				this.comp = comp;
				this.show = true;
				this.getCols();
				if(this.pageInfo.params){
					this.opts.params = this.pageInfo.params.map(m=>{
						return {value:m.id, label:m.name}
					});
				}
			},
			filtersSave(){
				let comp = this.comp;
				this.show = false;
				let c = this.$parent.$refs['mv_' + comp.id];
				if(comp.type == 'table'){
					c.tableView();
				}else if(comp.type == 'chart'){
					c.chartView();
				}else if(comp.type === 'grid'){
					c.gridView();
				}else if(comp.type === 'box'){
					c.boxView();
				}
			},
			fmtvalue(row, column, cellValue, index){
				if(row.usetype === 'param'){
					return "链接到参数";
				}else{
					return row.val +  (row.val2? '/' + row.val2: '');
				}
			},
			addFilter(){
				this.addShow = true;
				this.isupdate = false;
				this.filter.valuetype = "string";
				this.filter.usetype = "gdz";
				this.filter.col = null;
				this.filter.type = null;
				this.filter.value = null;
				this.filter.value2 = null;
				this.filter.vtype = null;
				this.filter.linkparam = null;
				this.filter.linkparam2 = null;
			},
			modifyFilter(id){
				this.isupdate = true;
				this.paramId = id;
				this.addShow = true;
				let t = this.comp.params.filter(m=>m.id===id)[0];
				this.filter.col = t.col;
				this.filter.type = t.type;
				this.filter.value = t.val;
				this.filter.value2 = t.val2;
				this.filter.valuetype = t.valuetype;
				this.filter.vtype = t.vtype;
				this.filter.linkparam = t.linkparam;
				this.filter.linkparam2 = t.linkparam2;
				this.filter.usetype = t.usetype;
			},
			delFilter(id){
				if(confirm("是否确认删除？")){
					$(this.comp.params).each((a, b)=>{
						if(b.id === id){
							this.comp.params.splice(a, 1);
							return false;
						}
					});
				}
			},
			filterSave(){
				let ts = this;
				let comp = this.comp;
				this.$refs['filterForm'].validate((valid) => {
					if (valid) {
						if(!comp.params){
							comp.params = [];
						}
						if(ts.isupdate == true){
							let t = comp.params.filter(m=>m.id===ts.paramId)[0];
							var retCol = ts.opts.cols.filter(m=>m.tname+"."+m.name === t.tname+"."+t.col)[0];
							t.col = retCol.name;
							t.expression = retCol.expression;
							t.tname = retCol.tname;
							t.vtype = retCol.type;
							t.type = ts.filter.type;
							t.val = ts.filter.value;
							t.val2 = ts.filter.value2;
							t.valuetype = ts.filter.valuetype;
							t.linkparam = ts.filter.linkparam;
							t.linkparam2 = ts.filter.linkparam2;
							t.usetype = ts.filter.usetype;
						}else{
							var o = {id:newGuid(), type:ts.filter.type, val:ts.filter.value, val2:ts.filter.value2, valuetype:ts.filter.valuetype, linkparam:ts.filter.linkparam, linkparam2:ts.filter.linkparam2,usetype:ts.filter.usetype};
							//获取表达式,tname
							var retCol = ts.opts.cols.filter(m=>m.tname+"."+m.name === ts.filter.col)[0];
							o.col = retCol.name;
							o.expression = retCol.expression;
							o.tname = retCol.tname;
							o.vtype = retCol.type;
							comp.params.push(o);
						}
						this.addShow = false;
					}
				});
				
			},
			getCols(){
				let comp = this.comp;
				let ts = this;
				ajax({
					type:"POST",
					url:"model/getDatasetCfg.action",
					data: {dsetId:comp.dsetId},
					success: function(resp){
						let dset = resp.rows;
						ts.opts.cols = [];
						$(dset.cols).each((a, b)=>{
							ts.opts.cols.push(
							 {value:b.tname+'.'+b.name, label:b.tname+"."+b.name, expression:b.expression,tname:b.tname, name:b.name, type:b.type}
							);
						});
					}
				});
			}

		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>

</style>
