<template>
  <div>
    ccc
  </div>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import operationDailog from '@/components/OperationDailog'
import $ from "jquery"

export default {
   name: 'cubeAdd',
  data() {
    return {
      base:{
        cubeId:null,
        cubeName:null,
        desc:null,
        dsetId:null,
        dsetName:null
      }
    }
  },
  components: {
		
	},
  mounted() {
  },
  computed: {},
  methods: {

  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
