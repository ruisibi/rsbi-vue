<template>
  	<div class="fillcontain">
		<h3>404 页面不存在</h3>
		<button class="btn btn-sm btn-primary" @click="goback()">返回首页</button>

  	</div>
</template>

<script>
	import {baseUrl} from '@/common/biConfig'

	export default {
	    data(){
			return {
				
			}
		},
		mounted(){
		},
		computed: {
		},
		methods: {
			goback(){
				this.$router.push("/Welcome");
			}
		},
		watch: {

		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
</style>
