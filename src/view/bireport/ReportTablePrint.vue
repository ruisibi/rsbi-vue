<!-- 表格打印渲染类 -->
<script>
import { ajax } from "@/common/biConfig";
import $ from "jquery";
import { Loading } from "element-ui";

export default {
  name:"reportTablePrint",
  data() {
	  return {
		  datas:null	//数据
		} 
  },
  components:{
	
  },
  render(h){
	  if(this.datas == null){
		  return h;
	  }else{
		    let trs = [];
			$(this.datas.header).each((a, b)=>{
				let ths = [];
				$(b).each((c, d)=>{
					ths.push(h('th', {attrs:{colspan:d.colSpan, rowspan:d.rowSpan,align:"center"}}, d.desc));
				});
				trs.push(h('tr', ths));
			});
			let tbodytrs = [];
			$(this.datas.datas).each((a, b)=>{
				let tds = [];
				$(b).each((c, d)=>{
					tds.push(h('td', {attrs:{class:"grid3-td",align:(d.isRow==true?"left":"right"),colspan:d.colSpan, rowspan:d.rowSpan,valign:"top"}}, d.value));
				});
				tbodytrs.push(h('tr', tds));
			});
			return h('table',{class:"grid3"}, [h('thead', trs), tbodytrs]);
	  }
  },
  mounted() {
	  
  },
  computed: {},
  methods: {
	   tableView(pageInfo, cb){
			let load = Loading.service({ fullscreen: true });
			ajax({
				url:"bireport/print.action",
				data:{pageInfo:JSON.stringify(pageInfo)},
				type:"POST",
				success:(resp)=>{
					this.datas = resp.rows.comp;
					if(cb){
						cb();
					}
				}
			},this, load);
	   }
  },
  watch: {},
};
</script>

<style lang="less" scoped>
TABLE.grid3 {
	width: 100%;
	border-collapse:collapse;
	table-layout:fixed;
}
TABLE.grid3 TH {
	text-align: center;
    border: 1px solid #CACACA;
	font-size: 13px;
    height:26px;
    background-color: #EEEEEE;
	font-weight:normal;
	word-wrap: break-word;
}
TABLE.grid3 TD.grid3-td {
	border: 1px solid #CACACA;
    padding: 3px 2px 3px 2px;
    font-size: 12px;
    height:20px;
	word-wrap: break-word;
}
</style>
