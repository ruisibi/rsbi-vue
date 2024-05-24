<template>
  	<div class="wrapper-content">
		  <div class="ibox">
			  <div class="ibox-content">
		
			 <p v-html="$t('message.main.sysIntro')"></p>

		
		
		<h2>{{$t('message.main.module')}}</h2>

		<p v-html="$t('message.main.moduleIntro')"/>

<p>{{$t('message.main.start')}}： <a href='https://blog.csdn.net/zhuifengsn/article/details/138605460'>https://blog.csdn.net/zhuifengsn/article/details/138605460</a></p>
<p class="text-warning">{{$t('message.main.qq')}}：648548832</p> 

<p class="text-warning"> {{$t('message.main.more')}} <button class="btn btn-success btn-sm" onclick="window.open('https://www.ruisitech.com/product.html')">{{ $t('message.main.buyUltimate') }}</button></p>

			  </div>
		  </div>
  	</div>
</template>

<script>
	import {baseUrl} from '@/common/biConfig'
	import $ from 'jquery'

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
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
</style>
