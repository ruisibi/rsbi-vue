<template>
  <el-dialog :title="dialogTitle" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
    <el-tabs v-model="active" type="card">
      <el-tab-pane label="JDBC" name="jdbc">
        <el-form :model="dsource" :rules="rules" ref="dsourceForm">
          <el-form-item :label="$t('message.model.dsource.name')" label-width="100px" prop="dsname">
            <el-input v-model="dsource.dsname"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.model.dsource.linkType')" label-width="100px" prop="linkType">
            <el-select
              v-model="dsource.linkType"
              :placeholder="$t('message.base.select')"
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
          <el-form-item :label="$t('message.model.dsource.linkUrl')" label-width="100px" prop="linkUrl">
            <el-input
              type="textarea"
              :rows="3"
              v-model="dsource.linkUrl"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.model.dsource.linkName')" label-width="100px" prop="linkName">
            <el-input v-model="dsource.linkName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.model.dsource.psd')" label-width="100px" prop="linkPwd">
            <el-input type="password" v-model="dsource.linkPwd"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="JNDI" name="jndi">
        <el-form :model="jndisource" :rules="jndiRules" ref="jndiForm">
          <el-form-item :label="$t('message.model.dsource.jndiName')" label-width="100px" prop="jndiName">
            <el-input v-model="jndisource.jndiName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.model.dsource.linkType')" label-width="100px" prop="linkType">
            <el-select v-model="jndisource.linkType" :placeholder="$t('message.base.select')">
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
      <el-button type="warning" @click="testDsource()">{{$t('message.model.dsource.test')}}</el-button>
      <el-button type="primary" @click="saveDsource()">{{$t('message.base.ok')}}</el-button>
      <el-button @click="show = false">{{$t('message.base.cancel')}}</el-button>
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
        dsname: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        linkType: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        linkUrl: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        linkName: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
       // linkPwd: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
      },
      jndiRules: {
        jndiName: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
        linkType: [{ required: true, message: this.$t('message.base.required'), trigger: "blur" }],
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
      this.dialogTitle = this.$t('message.model.dsource.update');
    } else {
      this.dialogTitle = this.$t('message.model.dsource.crt');
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
                    title: ts.isupdate ? this.$t('message.model.dsource.suc3') : this.$t('message.model.dsource.suc4'),
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
            this.$notify.warning(this.$t('message.model.dsource.err2'));
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
          this.$notify.error(this.$t("message.base.err1"));
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
                    title: this.$t('message.model.dsource.suc2'),
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
