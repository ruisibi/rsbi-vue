<template>
      <div class="tabpanel_tab_content">
            <div class="tabpanel_header">
              <ul class="tabpanel_mover">
                <li id="t_home" class=""><div class="title"><i class="fa fa-home"></i> 首页</div></li>
                <li id="t_93" class="active" u="../detail/Report.action"><div class="title">数据查询</div><div class="closer fa fa-close"></div></li>
            </ul>
            </div>
            <div class="tabpanel_header_ref">
                 <a class="btn btn-link btn-xs" onclick="gotab('right')" title="右移选项卡">
                        <i class="glyphicon glyphicon-chevron-left"></i>
                    </a>
                    <a class="btn btn-link btn-xs" id="taboptbtn">
                        <i class="fa fa-exchange"></i>
                    </a>
                    <a class="btn btn-link btn-xs" onclick="gotab('left')" title="左移选项卡">
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

    };
  },
  mounted:function(){
    
  },
  methods: {

  },
};
</script>

<style lang="css">
.tabpanel_tab_content {
    height: 29px;
    background-color: #f9f9f9;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.12);
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
