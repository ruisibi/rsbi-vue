<template>
  	<div class="wrapper-content">
		  <div class="ibox">
			  <div class="ibox-title">
				  角色管理
			  </div>
			  <div class="ibox-content">
					<div class="btn-group optbtncls" role="group">
						<button type="button" class="btn btn-outline btn-default" title="新增" @click="addRole(false)">
							<i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
						</button>
						<button type="button" class="btn btn-outline btn-default" title="修改" @click="addRole(true)">
							<i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
						</button>
						<button type="button" class="btn btn-outline btn-default" title="删除" @click="delRole()">
							<i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
						</button>
					</div>
					<el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
						<!--
						<el-table-column type="selection" width="45"></el-table-column>
						-->
						<el-table-column label="" width="45">
							<template slot-scope="scope">
								<el-radio v-model="checked" name="myselect2" :label="scope.row.roleId">&nbsp;</el-radio>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="roleId" label="标识"></el-table-column>
						<el-table-column align="center" prop="roleName" label="角色名称"></el-table-column>
						<el-table-column align="center" prop="roleDesc" label="备注信息"></el-table-column>
						<el-table-column align="center" prop="createUser" label="创建人"></el-table-column>
						<el-table-column align="center" prop="createDate" label="创建时间"></el-table-column>
						<el-table-column align="center" prop="ord" label="排序"></el-table-column>
						<el-table-column align="center" prop="roleId" label="操作">
							<template slot-scope="scope">
								<a class="btn btn-primary btn-xs" @click="userRole(scope.row.roleId)"> 授权菜单 </a>
							</template>
						</el-table-column>
					</el-table>
			  </div>
			  
		  </div>

		  <el-dialog :title="dialogTitle" :visible.sync="addRoleDailog">
			  	<el-form :model="role" :rules="rules" ref="roleForm" size="small">
					 
				    <el-form-item label="角色名称" label-width="100px" prop="roleName">
				     	<el-input v-model="role.roleName" ></el-input>
				    </el-form-item>
					
					<el-form-item label="角色备注" label-width="100px" prop="roleDesc">
				     	<el-input v-model="role.roleDesc"  ></el-input>
				    </el-form-item>
					<el-form-item label="排序" label-width="100px">
						<el-input-number v-model="role.ord" :min="0" :max="100"></el-input-number>
					</el-form-item>
					
			  	</el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="saveRole(isupdate)">确 定</el-button>
				<el-button @click="addRoleDailog = false">取 消</el-button>
			  </div>
		</el-dialog>
  	</div>
</template>

<script>
	import {baseUrl, ajax} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				tableData:[],
				checked:null,
				addRoleDailog:false,
				dialogTitle:"",
				role:{
					roleId:null,
					roleName:"",
					roleDesc:"",
					ord:1
				},
				rules:{
					roleName:[
						{ required: true, message: '必填', trigger: 'blur' }
					]
				},
				isupdate: false   //是否修改数据
			}
		},
		mounted(){
			this.loadDatas();
		},
		computed: {
		},
		methods: {	
			loadDatas:function(){
				let ts = this;
				ajax({
					type:"GET",
					data:{},
					url:"frame/role/list.action", 
					success:function(resp){
						ts.tableData = resp.rows;
					}
				}, ts);
			},	
			selectme:function(a, b){
				this.checked = a.roleId;
			},
			addRole:function(isupdate){
				let ts = this;
				if(isupdate){
					this.dialogTitle = "修改角色";
					//回写值
					ajax({
						url:"frame/role/get.action",
						data:{roleId:ts.checked},
						dataType:"json",
						success:function(dt){
							dt = dt.rows;
							for(let v in ts.role){
								ts.role[v] = dt[v];
							}
						}
					}, ts);
				}else{
					this.dialogTitle = "新增角色";
					//清空值
					for(let v in this.role){
						this.role[v] = null;
					}
				}
				this.isupdate = isupdate;
				this.addRoleDailog = true;
			},
			saveRole:function(update){
				let ts = this;
				this.$refs['roleForm'].validate((valid) => {
					if (valid) {
						ajax({
							type:"POST",
							data: ts.role,
							postJSON:false,
							url:update?"frame/role/update.action":"frame/role/save.action",
							success:function(resp){
								ts.loadDatas();
								ts.addRoleDailog = false;
							}
						}, ts);
					}
				});
			},
			delRole:function(){
				let ts = this;
				if(!this.checked){
					ts.$notify.error({title: '请勾选数据',offset: 50});
					return;
				}
				if(confirm("是否确认删除？")){
					ajax({
						type:"GET",
						data: {roleId: ts.checked},
						postJSON:false,
						url:"frame/role/delete.action",
						success:function(resp){
							ts.$notify.success({title: '用户删除成功',offset: 50});
							ts.loadDatas();
						}
					}, this);
				}
			},
			userRole:function(roleId) {
				this.$router.push({name:"roleMenu", params: {roleId}});
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
	@import '../../style/mixin';
</style>
