<template>
  	<div class="fillcontain">
		<frame-top></frame-top>
		<transition name="el-fade-in">
			<div class="navbar-static-side" v-show="isShowMenu">
				<el-menu style="min-height: 100%;" router>
					<template v-for="(item) in menus">
						<el-submenu v-if="item.children&&item.children.length>0" :key="item.menuId" :index=" 'p' + item.menuId">
							<template slot="title">
								<i :class="item.avatar"></i>
								<span>{{item.menuName}}</span>
							</template>
							<template v-for="(sub) in item.children">
								<el-menu-item :index="sub.menuUrl" :key="sub.menuId">{{sub.menuName}}</el-menu-item>
							</template>
						</el-submenu>
						<el-menu-item v-else :key="item.menuId" :index="item.menuUrl"><i :class="item.avatar"></i>{{item.menuName}}</el-menu-item>						
					</template>
				</el-menu>
			</div>
		</transition>
		<div class="page-wrapper">
			<navMenu></navMenu>
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>
  	</div>
</template>

<script>
	import frameTop from '../components/FrameTop'
	import {baseUrl, ajax} from '@/common/biConfig'
	import navMenu from '@/components/NavMenu'
	import $ from 'jquery'
	import "jstree";
	import "jstree/dist/themes/default/style.min.css";

	export default {
	    data(){
			return {
				isShowMenu:true,
				menus:[]
			}
		},
		components: {
			frameTop,navMenu
    	},
		mounted(){
			let ts = this;
			ajax({
				type:"GET",
				data:{},
				url:"frame/Menus.action",
				success:function(resp){
					ts.menus = resp.rows;
				}
			}, ts);
		},
		computed: {
		},
		methods: {				
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
	.navbar-static-side {
		position: fixed;
		width: 220px;
		height: 100%;
	}
	.page-wrapper {
		position: inherit;
		margin: 0 0 0 220px;
		height: calc(100% - 55px);
		overflow: auto;
		width: calc(100% - 220px);
	}
	@media (max-width: 512px) {
		.navbar-static-side {
			display: none;
		}
		.page-wrapper {
			margin: 0px;
		}
	}
	.el-menu-item {
		color: #0064b2;
		i {
			color: #0064b2;
			margin-right: 3px;
		}
	}
	.el-submenu__title {
		color: #0064b2;
		i {
			color: #0064b2;
			margin-right: 3px;
		}
		span {
			color: #0064b2;
		}
	}
</style>
