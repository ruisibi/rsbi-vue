<template>
  <el-dialog title="修改密码" :visible.sync="show">
    <el-form :model="userpsd" :rules="rules" ref="userPsdForm">
      <el-form-item label="原密码" label-width="100px" prop="password1">
        <el-input type="password" v-model="userpsd.password1"  :show-password="true" ></el-input>
      </el-form-item>
      <el-form-item label="新密码" label-width="100px" prop="password2">
        <el-input type="password" v-model="userpsd.password2"  :show-password="true" ></el-input>
      </el-form-item>
      <el-form-item label="重复密码" label-width="100px" prop="password3">
        <el-input type="password" v-model="userpsd.password3"  :show-password="true" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="savepsd()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ajax } from "@/common/biConfig";
import $ from "jquery";

export default {
  name: "password",
  data() {
    return {
      show: false,
      userpsd:{
        password1:null,
        password2:null,
        password3:null
      },
      rules:{
        password1:[
						{ required: true, message: '必填', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码长度6到18位', trigger: 'blur' }
					],
					password2:[
						{ required: true, message: '必填', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码长度6到18位', trigger: 'blur' }
          ],
          password3:[
						{ required: true, message: '必填', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码长度6到18位', trigger: 'blur' }
					]
      }
    };
  },
  mounted: function () {

  },
  methods: {
      savepsd:function(){
				let ts = this;
				this.$refs['userPsdForm'].validate((valid) => {
					if (valid) {
						if(ts.userpsd.password2 != ts.userpsd.password3){
							ts.$notify.error({
										title: '两次密码不一致',
										offset: 50
									});
							return false;
						}
						ajax({
							type:"POST",
							data: ts.userpsd,
							postJSON:false,
							url:"frame/chgPsd.action",
							success:function(resp){
								ts.$notify.success({
										title: '密码修改成功',
										offset: 50
									});
								ts.show = false;
							}
						}, ts);
					} else {
						return false;
					}
				});
			}
  }
};
</script>

<style scoped lang="less">
@import "../style/mixin";
</style>
