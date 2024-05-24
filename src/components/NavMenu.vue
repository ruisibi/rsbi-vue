<!--
 * Copyright 2021 本系统版权归成都睿思商智科技有限公司所有
 * 用户不能删除系统源码上的版权信息, 使用许可证地址:
 * https://www.ruisitech.com/licenses/index.html
 -->
<template>
      <div class="tabpanel_tab_content">
            <div class="tabpanel_header">
              <ul class="tabpanel_mover">
                  <template v-for="(item) in menus">
                      <li :id="item.id" :key="item.id" :class="item.active" @click="selectmenu(item.url)">
                          <div class="title"><i :class="item.icon"></i> {{item.text}}</div>
                          <div @click.stop="closemenu(item.url)" v-if="item.closeBtn === true" class="closer fa fa-close"></div>
                     </li>
                  </template>
                
            </ul>
            </div>
            <div class="tabpanel_header_ref">
                 <a class="btn btn-link btn-xs" @click="gotab('right')" title="右移选项卡">
                        <i class="glyphicon glyphicon-chevron-left"></i>
                    </a>
                    <el-dropdown @command="handleCommand" menu-align='start'>
                        <span class="avator">
                        <i class="fa fa-exchange"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                           
                        <el-dropdown-item command="flash">刷新当前页面</el-dropdown-item>
                         <!--
                        <el-dropdown-item command="fullScreem">全屏当前页面</el-dropdown-item>
                        -->
                        <el-dropdown-item command="closeother">关闭其他页面</el-dropdown-item>
                        <el-dropdown-item command="closeall">关闭全部页面</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <a class="btn btn-link btn-xs" @click="gotab('left')" title="左移选项卡">
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </a>
            </div>
  </div>
</template>

<script>
import { ajax } from "@/common/biConfig";
import $ from "jquery";

export default {
  name: "navMenu",
  data() {
    return {
        menus:[{
            id:"b_home",
            text:this.$t('message.main.indexName'),
            icon:"fa fa-home",
            url:"/Welcome",
            active:"active",
            closeBtn:false
        }]
    };
  },
  mounted:function(){
    var ms = localStorage.getItem("menus");
    if(ms){
        this.menus = JSON.parse(ms);
    }
  },
  methods: {
      gotab(pos){
          /**
        var o = $(".tabpanel_mover");
        var left = Number(o.css("marginLeft").replace("px", ""));
        if(pos =='left'){
            left = left - 110;
        }else{
            left = left + 110;
        }
        if(left > 0){
            left = 0;
        }
        var size = $(".tabpanel_mover li").length;
        if(Math.abs(left/110) < size){
            //o.css("marginLeft", left+"px");
            //o.scrollLeft(size);
        }

        //o.scrollLeft(300+"px");
        console.log(o.scrollLeft());
        **/
        var left = $(".tabpanel_header").scrollLeft();
        if(pos =='left'){
            left = left + 110;
        }else{
            left = left - 110;
        }
        $(".tabpanel_header").scrollLeft(left);
      },
      menuAdd(menu){
          for(let m of this.menus){
              m.active = "";
          }
          //如果菜单存在，让菜单选中
          let ls = this.menus.filter(function(m){
            return m.url === menu.menuUrl
          });
          if(ls.length >= 1){ //存在
            ls[0].active = "active";
          }else{ //不存在,添加
            this.menus.push({
                id:"b_"+menu.menuId,
                text:menu.menuName,
                icon:menu.avatar,
                url:menu.menuUrl,
                active:"active",
                closeBtn:true
            });
            //滚动条移如最右边
            this.$nextTick(()=>$(".tabpanel_header").scrollLeft(9999));
          }
          this.cacheMenus();
      },
      closemenu(url){
          let ts = this;
          $(this.menus).each((a, b)=>{
              if(b.url === url){
                  if(b.active === 'active'){  //删除的刚好是active
                    let provNode = ts.menus[a - 1]; //前一个节点
                    provNode.active = 'active';
                    
                    //点击X按钮后，需要移除缓存的 路由对象
                    if(b.url === '/etl/imp/DbImp' || b.url === '/etl/imp/CsvImp' || b.url === '/etl/imp/XlsImp'){
                        var p = ts.$parent.clearPage;
                        if(p.indexOf(b.url) < 0){
                            p.push(b.url);
                        }
                    }                   
                    ts.$router.push(provNode.url);
                  }
                  ts.menus.splice(a, 1);
                  return false;
              }
          });
          this.cacheMenus();
      },
      selectmenu(url){
          let ts = this;
          for(let m of this.menus){
              m.active = "";
          }
          $(this.menus).each((a, b)=>{
              if(b.url === url){
                  b.active = "active";
                  if(ts.$route.path === url){
                      return false;
                  }
                  ts.$router.push(url);
                  return false;
              }
          });
          this.cacheMenus();
      },
      /**
       * 更新菜单的url
       */
      chgMenuUrl(oldUrl, newUrl){
          let u = this.menus.filter(m=>m.url.indexOf(oldUrl)>=0)[0];
          if(u){
            u.url = newUrl;
          }
      },
       handleCommand(cmd){
           if(cmd === "closeother"){
               this.menus = this.menus.filter(m=>m.id==='b_home' || m.active === 'active');
               $(this.menus).each((a, b)=>{
                   if(b.active === 'active'){
                       this.$router.push(b.url);
                       return false;
                   }
               });
           }else if(cmd === "closeall"){
               this.menus.splice(1, this.menus.length);
               this.menus[0].active = "active";
               this.$router.push(this.menus[0].url);
           }else if(cmd === 'flash'){
               location.reload();
               /** 
               $(this.menus).each((a, b)=>{
                   if(b.active === 'active'){
                       //this.$router.go(0);
                       //this.$forceUpdate();
                       //刷新页面暂时能用。
                       return false;
                   }
               });
               */
           }
           this.cacheMenus();
       },
       cacheMenus(){
           localStorage.setItem("menus", JSON.stringify(this.menus));
       }
  },
};
</script>

<style lang="css">
.tabpanel_header {
    width: calc(100% - 80px);
    overflow: auto;
    display: inline-block;
}
.btn-link {
    color: inherit;
}
.tabpanel_header_ref {
	width: 80px; 
	float: right;
	margin-top:5px;
}
.tabpanel_tab_content {
    height: 29px;
    background-color: #f9f9f9;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.12);
    z-index: 100;
}
.tabpanel_mover {
	  margin: 0px;
    padding: 0px;
    position: relative;
}
.tabpanel_mover li {
	  width: 110px;
    line-height: 20px;
    padding: 5px 10px 5px 10px;
    background-color: #f4f6f8;
    display: inline-block;
    position: relative;
    list-style-type: none;
    cursor: pointer;
    border-right: 1px solid #ddd;
    overflow: hidden;
}
.tabpanel_mover li:hover {
	background-color: #e3e1e1;
}
.tabpanel_mover li .title {
    font-size: 13px;
    overflow: hidden;
    float: left;
    color: #4285f4;
    width:80px;
    text-overflow:ellipsis;
}
.J_mainContent {
    height: 100%;
    overflow: hidden;
}
.J_mainContent2 {
	height: calc(100% - 30px);
    overflow: hidden;
} 
.tabpanel_content .html_content {
	width: 100%;
    height: 100%;
}
.tabpanel_mover li .closer {
    position: absolute;
    right: 0px;
    top: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    background:none;
    font-size: 10px;
    display:none;
	color:#4285f4;
}
.tabpanel_mover li.active:hover > .closer {
	display:block;
	color:#ffffff;
}
.tabpanel_mover li:hover > .closer {
	display:block;
}
.tabpanel_mover li.active {
	background-color:#4285f4;
}
.tabpanel_mover li.active .title {
	color:#fff;
}
</style>
