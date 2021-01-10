<template>
  	<div class="wrapper-content-nomargin">
      <PortalIndex v-if="showIndex" @customizationAction="customizationAction"></PortalIndex>
      <PortalIndexCustomiz v-if="!showIndex"></PortalIndexCustomiz>
  	</div>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import PortalIndex from "./PortalIndex.vue"
import PortalIndexCustomiz from "./PortalIndexCustomiz.vue"

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

<style lang="less">
  @import "../../style/common";
</style>
