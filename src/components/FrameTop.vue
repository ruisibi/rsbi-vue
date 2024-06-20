<template>
  <div class="frameTop">
   <nav class="navbar navbar-static-top">
    <div class="navbar-head" style="width:220px;">
      <img src="../assets/image/log2.png">
    </div>
    <div class="navbar-head myhead">
      <button class="btn btn-default btn-xs uinfo-btn" type="button" :class="swatchcls" @click="swatch" :title="$t('message.main.switchMenu')" style="margin-top:15px;"><i class="fa fa-bars"></i></button>
    </div>
    <ul class="navbar-right-my">
      <li>
        <a>
          <el-dropdown @command="handleCommand" menu-align='start'>
            <span class="avator" @mouseover="mover" @mouseout="mout">
              <i class="fa fa-user"></i> demo <span :class="userbtnstyle" class="glyphicon"></span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="grxx">{{$t('message.main.user.info')}}</el-dropdown-item>
              <el-dropdown-item command="xgmm">{{$t('message.main.user.psd')}}</el-dropdown-item>
              <el-dropdown-item command="wtfk">{{$t('message.main.user.question')}}</el-dropdown-item>
              <el-dropdown-item command="sysc">{{$t('message.main.user.book')}}</el-dropdown-item>
              <el-dropdown-item command="signout">{{$t('message.main.user.out')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </a>
      </li>
    </ul>
	</nav>
  <userInfo ref="uinfo"></userInfo>
  <password ref="psd"></password>
  </div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import $ from 'jquery'
import userInfo from '@/components/UserInfo'
import password from '@/components/Password'

export default {
  name: 'FrameTOp',
  data () {
    return {userbtnstyle:'glyphicon-menu-up',swatchcls:''}
  },
  components: {
		userInfo,password
	},
  methods:{
    mover:function(){
      this.userbtnstyle = "glyphicon-menu-down";
    },
    mout:function(){
      this.userbtnstyle = "glyphicon-menu-up";
    },
    swatch:function(){
      if(this.swatchcls === ''){
        this.swatchcls = 'swatchBtn';
        this.$parent.isShowMenu = false;
        window.setTimeout(()=>{
          $(".page-wrapper").css({"margin": "0", "width":"100%"})
          $(window).trigger("resize");
        }, 200);
      }else{
        this.swatchcls = '';
        this.$parent.isShowMenu = true;
        window.setTimeout(()=>{
          $(".page-wrapper").css({"margin": "0 0 0 220px", "width":"calc(100% - 220px)"});
           $(window).trigger("resize");
        }, 200);
      }
    },
    handleCommand:function(cmd){
        let ts = this;
        if(cmd === 'signout'){
          $.ajax({
            url:baseUrl + "frame/Logout.action",
            data:{},
            dataType:'json',
            xhrFields: {withCredentials: true},
            crossDomain: true,
            success:function(){
                ts.$notify.success({
                  title: ts.$t('message.main.user.outSuccess'),
                  offset: 50
                });
               ts.$router.push('/'); 
            }
          });
        }else if(cmd === 'grxx'){
          this.$refs['uinfo'].show = true;
        }else if(cmd === 'xgmm'){
          this.$refs['psd'].show = true;
        }else if(cmd === 'wtfk'){
          window.open("http://www.ruisitech.com/suggest.html");
        }else if(cmd === 'sysc'){
          window.open("http://book.ruisitech.com");
        }
    }
  }
}
</script>

<style scoped lang="less">
  @import '../style/mixin';
  .frameTop {
    height: 50px;
    background-color: #034d8f;
  }
  .navbar-head {
    float: left;
  }
  .navbar-right-my {
    float:right;
    a {
      display: inline-block;
      height: 50px;
    }
    .avator {
       display:inline-block;
       padding: 13px;
       font-size: 16px;
       color: white;
       &:hover {
          background-color: white;
          color: black;
       }
    }
  }
  @media (max-width: 512px) {
    .myhead {
      display: none;
    }
  }
  .swatchBtn {
    transform:rotate(90deg);
    -ms-transform:rotate(90deg); 	/* IE 9 */
    -moz-transform:rotate(90deg); 	/* Firefox */
    -webkit-transform:rotate(90deg); /* Safari å’Œ Chrome */
    -o-transform:rotate(90deg); 	/* Opera */
  }
  li {
    list-style-type: none;
  }
  ul {
    margin-bottom:0px;
  }
</style>
