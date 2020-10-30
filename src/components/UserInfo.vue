<template>
  <el-dialog title="个人信息" :visible.sync="show">
    <dl class="dl-horizontal">
      <dt>登录名：</dt>
      <dd>{{user.staffId}}</dd>
      <dt>用户名：</dt>
      <dd>{{user.loginName}}</dd>
      <dt>所属企业：</dt>
      <dd>成都睿思商智科技有限公司</dd>
      <dt>账号状态：</dt>
      <dd>{{ user.state==1?"启用":"停用" }}</dd>
      <dt>登录次数：</dt>
      <dd>{{user.logCnt}}次</dd>
      <dt>上次登录时间：</dt>
      <dd>{{user.loginTime}}</dd>
    </dl>
      <div slot="footer" class="dialog-footer">
				<el-button @click="show = false">取 消</el-button>
			  </div>
  </el-dialog>
</template>

<script>
import { ajax } from "@/common/biConfig";
import $ from "jquery";

export default {
  name: "userInfo",
  data() {
    return {
      show:false,
      user:{}
    };
  },
  mounted:function(){
    let ts = this;
    ajax({
      type:"GET",
      data:{},
      url:"frame/user.action",
      success:function(resp){
        ts.user = resp.rows;
      }
    }, ts);
  },
  methods: {

  },
};
</script>

<style scoped lang="less">
@import "../style/mixin";
</style>
