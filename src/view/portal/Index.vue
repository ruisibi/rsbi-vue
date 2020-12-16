<template>
  	<div class="wrapper-content">
      <PortalIndex v-if="showIndex" @customizationAction="customizationAction"></PortalIndex>
      <PortalIndexCustomiz v-if="!showIndex"></PortalIndexCustomiz>
  	</div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import PortalIndex from "./PortalIndex.vue"
import PortalIndexCustomiz from "./PortalIndexCustomiz.vue"
import Vue from "vue";

export default {
  components:{PortalIndex,PortalIndexCustomiz},
  data(){
    return {
      showIndex:true,
    }
  },
  mounted(){

  },
  computed: {
  },
  methods: {
    customizationAction(){
      this.showIndex = false;
    }
  },
  watch: {
  },
  beforeMount(){
   
  },
  beforeDestroy(){
    
  },
}
</script>

<style lang="less" scoped>
	@import "../../style/mixin";
</style>
