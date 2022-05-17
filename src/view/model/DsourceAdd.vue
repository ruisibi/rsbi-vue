<template>
  <el-dialog :title="dialogTitle" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
    <el-tabs v-model="active" type="card">
      <el-tab-pane label="JDBC" name="jdbc">
        <el-form :model="dsource" :rules="rules" ref="dsourceForm">
          <el-form-item label="数据源名称" label-width="100px" prop="dsname">
            <el-input v-model="dsource.dsname"></el-input>
          </el-form-item>
          <el-form-item label="数据源类型" label-width="100px" prop="linkType">
            <el-select
              v-model="dsource.linkType"
              placeholder="请选择"
              @change="chglinkType"
            >
              <el-option
                v-for="item in opts.linkTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连接字符串" label-width="100px" prop="linkUrl">
            <el-input
              type="textarea"
              :rows="3"
              v-model="dsource.linkUrl"
            ></el-input>
          </el-form-item>
          <el-form-item label="连接用户名" label-width="100px" prop="linkName">
            <el-input v-model="dsource.linkName"></el-input>
          </el-form-item>
          <el-form-item label="连接密码" label-width="100px" prop="linkPwd">
            <el-input type="password" v-model="dsource.linkPwd"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="JNDI" name="jndi">
        <el-form :model="jndisource" :rules="jndiRules" ref="jndiForm">
          <el-form-item label="JNDI名称" label-width="100px" prop="jndiName">
            <el-input v-model="jndisource.jndiName"></el-input>
          </el-form-item>
          <el-form-item label="数据源类型" label-width="100px" prop="linkType">
            <el-select v-model="jndisource.linkType" placeholder="请选择">
              <el-option
                v-for="item in opts.linkTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="testDsource()">测试连接</el-button>
      <el-button type="primary" @click="saveDsource()">确 定</el-button>
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { baseUrl, ajax } from "@/common/biConfig";
import $ from "jquery";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      dialogTitle: "",
      show: false,
      ischeckds:false,
      dsource: {
        dsname:null,
        linkType:null,
        linkUrl:null,
        linkName:null,
        linkPwd:null
      },
      jndisource: {
        jndiName:null,
        linkType:null
      },
      rules: {
        dsname: [{ required: true, message: "必填", trigger: "blur" }],
        linkType: [{ required: true, message: "必填", trigger: "blur" }],
        linkUrl: [{ required: true, message: "必填", trigger: "blur" }],
        linkName: [{ required: true, message: "必填", trigger: "blur" }],
       // linkPwd: [{ required: true, message: "必填", trigger: "blur" }],
      },
      jndiRules: {
        jndiName: [{ required: true, message: "必填", trigger: "blur" }],
        linkType: [{ required: true, message: "必填", trigger: "blur" }],
      },
      active: "jdbc",
      opts: {
        linkTypes: [
          { label: "Mysql", value: "mysql" },
          { label: "Oracle", value: "oracle" },
          { label: "SQL Server", value: "sqlser" },
          { label: "DB2", value: "db2" },
          { label: "PostgreSQL", value: "postgresql" },
          { label: "Hive", value: "hive" },
          { label: "Kylin", value: "kylin" },
          { label: "ClickHouse", value: "clickhouse" },
        ],
      },
    };
  },
  props: ["isupdate"],
  components: {},
  mounted() {
    if (this.isupdate) {
      this.dialogTitle = "修改数据源";
    } else {
      this.dialogTitle = "创建数据源";
    }
  },
  computed: {},
  methods: {
    saveDsource: function () {
      let ts = this;
      if (this.active === "jdbc") {
        this.dsource.use = "jdbc";
      } else {
        this.jndisource.use = "jndi";
      }
      this.$refs[this.active === "jdbc" ? "dsourceForm" : "jndiForm"].validate(
        (valid) => {
          if (valid && this.ischeckds === true) {
            ajax(
              {
                type: "POST",
                url: this.isupdate
                  ? "model/updateDataSource.action"
                  : "model/saveDataSource.action",
                data: this.active === "jdbc" ? ts.dsource : ts.jndisource,
                success: (resp) => {
                  ts.$notify.success({
                    title: ts.isupdate ? "数据源修改成功" : "数据源创建成功",
                    offset: 50,
                  });
                  //关闭窗口
                  ts.show = false;
                  //刷新数据
                  this.$parent.loadData();
                },
              },
              ts
            );
          }else if(this.ischeckds === false){
            this.$notify.warning("请先点击测试连接，连接成功后再点击确定按钮");
          }
        }
      );
    },
    chglinkType: function (val) {
      let s = "";
      if (val == "mysql") {
        s =
          "jdbc:mysql://ip/database?useUnicode=true&characterEncoding=UTF8&serverTimezone=GMT%2B8";
      } else if (val == "oracle") {
        s = "jdbc:oracle:thin:@ip:1521/sid";
      } else if (val == "sqlser") {
        s = "jdbc:jtds:sqlserver://ip:1433/database";
      } else if (val == "db2") {
        s = "jdbc:db2://ip:50000/database";
      } else if (val == "postgresql") {
        s = "jdbc:postgresql://ip:5432/database";
      } else if (val == "hive") {
        s = "jdbc:hive2://ip:10000/default";
      } else if (val == "kylin") {
        s = "jdbc:kylin://ip:7070/kylin_project_name";
      }else if(val === 'clickhouse'){
        s = "jdbc:clickhouse://ip:port/default";
      }
      this.dsource.linkUrl = s;
    },
    addDsource(update, dsId) {
      this.ischeckds = false;
      if (update) {
        if (!dsId || dsId === "") {
          this.$notify.error("未勾选数据");
          return;
        }
        this.show = true;
        //回写数据
        ajax(
          {
            type: "GET",
            url: "model/getDataSource.action",
            data: { dsid: dsId },
            success: (resp) => {
              let o = resp.rows;
              if (o.use === "jdbc") {
                this.dsource = o;
              } else {
                this.jndisource = o;
              }
              this.active = o.use;
            },
          },
          this
        );
      } else {
        this.show = true;
        if (this.$refs["dsourceForm"]) {
          this.$refs["dsourceForm"].resetFields();
        }
        if (this.$refs["jndiForm"]) {
          this.$refs["jndiForm"].resetFields();
        }
      }
    },
    testDsource() {
      this.$refs[this.active === "jdbc" ? "dsourceForm" : "jndiForm"].validate(
        (valid) => {
          if (valid) {
            let load = Loading.service({ fullscreen: true });
            ajax(
              {
                type: "POST",
                url:
                  this.active === "jdbc"
                    ? "model/testDataSource.action"
                    : "model/testJndi.action",
                data: this.active === "jdbc" ? this.dsource : this.jndisource,
                success: (resp) => {
                  this.$notify.success({
                    title: "测试成功",
                    offset: 50,
                  });
                  this.ischeckds = true;
                },
              },
              this,
              load
            );
          }
        }
      );
    },
  },
};
</script>

<style lang="css">

</style>
