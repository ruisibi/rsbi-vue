<template>
  <el-dialog :title="$t('message.main.psd.title')" :visible.sync="show">
    <el-form :model="userpsd" :rules="rules" ref="userPsdForm">
      <el-form-item :label="$t('message.main.psd.old')" label-width="140px" prop="password1">
        <el-input type="password" v-model="userpsd.password1"  :show-password="true" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('message.main.psd.new')" label-width="140px" prop="password2">
        <el-input type="password" v-model="userpsd.password2"  :show-password="true" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('message.main.psd.confirm')" label-width="140px" prop="password3">
        <el-input type="password" v-model="userpsd.password3"  :show-password="true" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="savepsd()">{{$t('message.base.ok')}}</el-button>
      <el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
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
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' },
						{ min: 6, max: 18, message: this.$t('message.main.psd.length'), trigger: 'blur' }
					],
					password2:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' },
						{ min: 6, max: 18, message: this.$t('message.main.psd.length'), trigger: 'blur' }
          ],
          password3:[
						{ required: true, message: this.$t('message.base.required'), trigger: 'blur' },
						{ min: 6, max: 18, message: this.$t('message.main.psd.length'), trigger: 'blur' }
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
										title: ts.$t('message.main.psd.error2'),
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
										title: ts.$t('message.main.psd.success'),
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
