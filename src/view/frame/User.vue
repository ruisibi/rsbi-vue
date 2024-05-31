<template>
  	<div class="wrapper-content">
		  <div class="ibox">
			  <div class="ibox-title">
				  {{$t('message.manage.user.name')}}
			  </div>
			  <div class="ibox-content">
				<div class="btn-group optbtncls" role="group">
					<button type="button" class="btn btn-outline btn-default" :title="$t('message.base.add')" @click="addUser(false)">
						<i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
					</button>
					<button type="button" class="btn btn-outline btn-default" :title="$t('message.base.modify')" @click="addUser(true)">
						<i class="glyphicon glyphicon-edit" aria-hidden="true"></i>
					</button>
					<button type="button" class="btn btn-outline btn-default" :title="$t('message.base.delete')" @click="delUser()">
						<i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
					</button>
				</div>
				 <el-table :data="tableData" @row-click="selectme" border style="width: 100%" header-row-class-name="tableHeadbg">
					<!--
					<el-table-column type="selection" width="45"></el-table-column>
					-->
					<el-table-column label="" width="45">
						<template slot-scope="scope">
							<el-radio v-model="checked" name="myselect" :label="scope.row.userId">&nbsp;</el-radio>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="userId" :label="$t('message.manage.user.id')"></el-table-column>
					<el-table-column align="center" prop="staffId" :label="$t('message.manage.user.staff')"></el-table-column>
					<el-table-column align="center" prop="loginName" :label="$t('message.manage.user.userName')"></el-table-column>
					<el-table-column align="center" prop="state" :formatter="fmtstate" :label="$t('message.manage.user.state')"></el-table-column>
					<el-table-column align="center" prop="logCnt" :label="$t('message.manage.user.logTimes')"></el-table-column>
					<el-table-column align="center" prop="loginTime" :label="$t('message.manage.user.logDate')"></el-table-column>
					<el-table-column align="center" prop="userId" :label="$t('message.base.oper')" width="180">
						<template slot-scope="scope">
								<a class="btn btn-primary btn-xs" @click="addUserRole(scope.row.userId)"> {{$t('message.manage.user.userRole')}} </a>
								<a class="btn btn-primary btn-xs" @click="userMenu(scope.row.userId)"> {{$t('message.manage.user.userMenu')}} </a>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					Locale="en"
					background
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[10, 20, 50, 100]"
					:current-page="page"
					:page-size="rows"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
				</el-pagination>
			  </div>
		  </div>
		  	<el-dialog :title="dialogTitle" :visible.sync="addUserDailog">
			  	<el-form :model="user" :rules="rules" ref="userForm" size="small">
					  <template v-if="isupdate">
						  <el-form-item :label="$t('message.manage.user.id')" label-width="150px" prop="userId">
							<el-input readOnly="true" v-model="user.userId"></el-input>
						</el-form-item>
					  </template>
				    <el-form-item :label="$t('message.manage.user.staff')" label-width="150px" prop="staffId">
				     	<el-input :readonly="isupdate" v-model="user.staffId"  :placeholder="$t('message.manage.user.staffNote')"></el-input>
				    </el-form-item>
					<template v-if="!isupdate">
					<el-form-item :label="$t('message.manage.user.password')" label-width="150px" prop="password">
				     	<el-input type="password" v-model="user.password"  :show-password="true" ></el-input>
				    </el-form-item>
					<el-form-item :label="$t('message.manage.user.password2')" label-width="150px" prop="password2">
				     	<el-input type="password" v-model="user.password2" :show-password="true"  ></el-input>
				    </el-form-item>
					</template>
					<el-form-item :label="$t('message.manage.user.userName')" label-width="150px" prop="loginName">
				     	<el-input v-model="user.loginName"  ></el-input>
				    </el-form-item>
					
				    <el-form-item :label="$t('message.manage.user.sex')" label-width="150px" prop="gender">
						<el-select v-model="user.gender" :placeholder="$t('message.base.select')">
							<el-option
							v-for="item in opts.sexs"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>				    
					</el-form-item>
					<el-form-item :label="$t('message.manage.user.state')" label-width="150px" prop="state">
				     	<el-select v-model="user.state" :placeholder="$t('message.base.select')">
							<el-option
							v-for="item in opts.status"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
				    </el-form-item>
					<el-form-item :label="$t('message.manage.user.mobilePhone')" label-width="150px">
				     	<el-input v-model="user.mobilePhone"  ></el-input>
				    </el-form-item>
					<el-form-item :label="$t('message.manage.user.officeTel')" label-width="150px">
				     	<el-input v-model="user.officeTel"  ></el-input>
				    </el-form-item>
					<el-form-item :label="$t('message.manage.user.email')" label-width="150px">
				     	<el-input v-model="user.email"  ></el-input>
				    </el-form-item>
			  	</el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="saveUser()">{{$t('message.base.ok')}}</el-button>
				<el-button @click="addUserDailog = false">{{$t('message.base.cancel')}}</el-button>
			  </div>
			</el-dialog>

			<el-dialog :title="$t('message.manage.user.userRole')" :visible.sync="userRoleDailog">
				  <el-checkbox-group v-model="checkList">
					<el-checkbox v-for="r in roles" :label="r.roleId" :key="r.roleId">{{r.roleName}}</el-checkbox>
				  </el-checkbox-group>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="saveUserRole()">{{$t('message.base.ok')}}</el-button>
				<el-button @click="userRoleDailog = false">{{$t('message.base.cancel')}}</el-button>
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
				tableData: [],
				addUserDailog:false,
				dialogTitle:"",
				checked:null,
				isupdate: false,
				total:0,
				page:1,
				rows:10,
				user:{
					userId:null,
					staffId:null,
					password:'',
					password2:'',
					loginName:'',
					gender:null,
					state:null,
					mobilePhone:'',
					officeTel:'',
					email:''
				},
				rules:{
					staffId:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' }
					],
					password:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' },
						{ min: 6, max: 18, message: this.$t('message.main.psd.length'), trigger: 'blur' }
					],
					password2:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' },
						{ min: 6, max: 18, message: this.$t('message.main.psd.length'), trigger: 'blur' }
					],
					loginName:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' }
					],
					gender:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' }
					],
					state:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' }
					]
				},
				opts:{
					sexs:[{
						label:this.$t("message.manage.user.man"),
						value:this.$t("message.manage.user.man")
					},{
						label:this.$t("message.manage.user.woman"),
						value:this.$t("message.manage.user.woman")
					}],
					status:[{
						label:this.$t("message.main.info.enable"),
						value:1
					},{
						label:this.$t("message.main.info.disable"),
						value:0
					}]
				},
				userRoleDailog:false,
				roles:[],
				checkList:[]
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
					data:{page:ts.page, rows:ts.rows},
					url:"frame/user/list.action", 
					success:function(resp){
						ts.tableData = resp.rows;
						ts.total = resp.total;
					}
				}, ts);
			},
			handleSizeChange(v){
				this.rows = v;
				this.loadDatas();
			},
			handleCurrentChange(v){
				this.page = v;
				this.loadDatas();
			},
			fmtstate:function(row, column, cellValue, index){
				return cellValue === 1 ? this.$t("message.main.info.enable"):this.$t("message.main.info.disable");
			},
			addUser : function(isupdate){
				let ts = this;
				if(isupdate){
					if(!ts.checked){
						ts.$notify.error({
										title: this.$t("message.base.err1"),
										offset: 50
									});
						return false;
					}
					this.addUserDailog = true;	
					this.dialogTitle =  this.$t("message.manage.user.modifyUser");
					//回写值
					ajax({
						url:"frame/user/get.action",
						data:{userId:ts.checked},
						dataType:"json",
						success:function(dt){
							dt = dt.rows;
							ts.user.userId = dt.userId;
							ts.user.staffId = dt.staffId;
							ts.user.loginName = dt.loginName;
							ts.user.gender = dt.gender;
							ts.user.state = dt.state;
							ts.user.mobilePhone = dt.mobilePhone;
							ts.user.officeTel = dt.officeTel;
							ts.user.email = dt.email;
						}
					}, ts);
				}else{
					this.addUserDailog = true;	
					this.dialogTitle =  this.$t("message.manage.user.newUser");
					//清空值
					for(let v in this.user){
						this.user[v] = null;
					}
					if(this.$refs['userForm']){
						this.$refs['userForm'].clearValidate();
					}
				}
				this.isupdate = isupdate;
			},
			selectme:function(a, b){
				this.checked = a.userId;
			},
			saveUser:function(){
				let ts = this;
				this.$refs['userForm'].validate((valid) => {
					if (valid) {
						if(ts.user.password != ts.user.password2){
							ts.$notify.error({
										title: this.$t('message.main.psd.error2'),
										offset: 50
									});
							return false;
						}
						ajax({
							type:"POST",
							data: ts.user,
							postJSON:false,
							url:ts.isupdate?"frame/user/update.action":"frame/user/save.action",
							success:function(resp){
								ts.$notify.success({
										title: ts.isupdate?ts.$t("message.manage.user.suc1"):ts.$t("message.manage.user.suc2"),
										offset: 50
									});
								ts.addUserDailog = false;
								ts.loadDatas();
							}
						}, ts);
					} else {
						//console.log('error submit!!');
						return false;
					}
				});
			},
			delUser:function(){
				let ts = this;
				if(!this.checked){
					ts.$notify.error({
						title: this.$t("message.base.err1"),
						offset: 50
					});
					return;
				}
				if(confirm(this.$t('message.base.confirm'))){
					ajax({
						type:"GET",
						data: {userId: ts.checked},
						postJSON:false,
						url:"frame/user/delete.action",
						success:function(resp){
							ts.$notify.success({
									title:  ts.$t("message.manage.user.suc4"),
									offset: 50
								});
							ts.loadDatas();
						}
					}, this);
				}
			},
			userMenu:function(userId) {
				this.$router.push({name:"userMenu", params: {userId}});
			},
			addUserRole:function(userId) {
				this.userRoleDailog = true;
				let ts = this;
				ajax({
					type:"GET",
					data:{userId:userId},
					postJSON:false,
					url:"frame/role/userRolelist.action",
					success:function(resp){
						ts.roles = resp.rows;
						ts.checkList = resp.rows.filter(r=>r.userId).map(r=>{
							return r.roleId
						});
					}
				}, ts);
				this.curUserId = userId;
			},
			saveUserRole:function(){
				let ts = this;
				ajax({
					type:"POST",
					url:"frame/role/userRoleSave.action",
					dataType:"JSON",
					postJSON:true,
					data:JSON.stringify({roleId:ts.checkList,userId:ts.curUserId}),
					success:function(resp){
						 ts.$notify.success({
							title: ts.$t("message.manage.user.suc3"),
							offset: 50
						});
						ts.userRoleDailog = false;
					}
				}, ts);
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
	@import '../../style/mixin';
	@import '../../style/common';
</style>
