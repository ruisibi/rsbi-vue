<template>
  <el-form :model="dset" :rules="rules" ref="dsetForm">
    <el-form-item label="名称" label-width="100px" prop="name">
      <el-input v-model="dset.name"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import $ from "jquery";

export default {
  data() {
    return {
      operDailogTitle: "创建数据集",
      dset: {
        name: null,
      },
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
      },
    };
  },
  components: {},
  mounted() {},
  computed: {},
  methods: {
    saveDset(isupdate) {
      let ret = true;
      this.$refs['dsetForm'].validate((valid) => {
        if (valid) {
          
        }else{
          ret= false;
        }
      });
      return ret;
    },
    addDset(isupdate) {
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>
