<template>
  <el-dialog :title="$t('message.main.info.uinfo')" :visible.sync="show">
    <dl class="dl-horizontal">
      <dt>{{$t('message.main.info.loginName')}}：</dt>
      <dd>{{user.staffId}}</dd>
      <dt>{{$t('message.main.info.userName')}}：</dt>
      <dd>{{user.loginName}}</dd>
      <dt>{{$t('message.main.info.company')}}：</dt>
      <dd>{{$t('message.main.info.compName')}}</dd>
      <dt>{{$t('message.main.info.state')}}：</dt>
      <dd>{{ user.state==1? $t('message.main.info.enable') : $t('message.main.info.disable') }}</dd>
      <dt>{{$t('message.main.info.cnt')}}：</dt>
      <dd>{{user.logCnt}} {{$t('message.main.info.times')}}</dd>
      <dt>{{$t('message.main.info.lastLogDate')}}：</dt>
      <dd>{{user.loginTime}}</dd>
    </dl>
      <div slot="footer" class="dialog-footer">
				<el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
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
