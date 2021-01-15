<template>
  	<div class="wrapper-content-nomargin">
      <PortalIndex v-show="showIndex" ref="indexForm"></PortalIndex>
      <PortalIndexCustomiz v-if="!showIndex" ref="customizForm"></PortalIndexCustomiz>
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

  }
}
</script>

<style lang="less">
  @import "../../style/common";
</style>
