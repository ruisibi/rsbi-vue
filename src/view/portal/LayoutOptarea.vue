<!-- 布局器 -->
<script>
import { baseUrl } from "@/common/biConfig";
import $ from "jquery";

export default {
  components: {},
  props: {
    pageInfo: {
      type: Object,
      required: true,
    },
  },
  render(h) {
    var json = this.pageInfo.body;
    var trs = [];
    for (var i = 1; true; i++) {
      var tr = json["tr" + i];
      if (!tr || tr == null) {
        break;
      }
      var tds = [];
      for (var j = 0; j < tr.length; j++) {
        var td = tr[j];
        tds.push(
          h("td", {
            attrs: {
              class: "laytd",
              height: td.height + "%",
              width: td.width + "%",
              colspan: td.colspan,
              rowspan: td.rowspan,
            },
          }, "xxx")
        );
        /**
        if(td.children){
          for(var k=0; k<td.children.length; k++){
            var comp = findTCompById(td.children[k]);
            var str = compStr(comp, false);
            ret = ret + str;
            cps.push(comp);
          }
        }
         */
      }
      trs.push(h('tr', {}, tds));
    }
    let table = h('table', {attrs:{border:"0", cellspacing:"0", cellpadding:"0", class:"r_layout", id:"layout_table"}}, [h('tbody', trs)]);
    return h("div", {attrs:{id:"optarea", class:"layout-center-body", align:"center"}}, [table]);
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
  beforeMount() {},
  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
table.r_layout {
	border-collapse:collapse;
	table-layout:fixed;
	width:100%;
  height:100%;
  td.laytd {
    border: 1px solid #D3D3D3;
    text-align: left;
    vertical-align: top;
	  background-color:#f0f3f4;
	  min-height:100px;
	  padding:5px;
  }
}
.layout-center-body {
	height: calc(100% - 44px);
	overflow: auto;
}
</style>
