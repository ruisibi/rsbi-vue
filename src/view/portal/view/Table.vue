<script>
import {baseUrl, ajax} from '@/common/biConfig'
import $ from 'jquery'
import * as utils from '@/view/portal/Utils'
import { Loading } from 'element-ui'

export default {
  components:{    
  },
  data(){
    return {
      data:null
    }
  },
  props:{
      comp:{
        type:Object,
        required:true,
        default:{}
      }
  },
  render(h){
    let ts = this;
    let comp = this.comp;
    if(this.data){
      let trs = [];
			$(this.data.header).each((a, b)=>{
				let ths = [];
				$(b).each((c, d)=>{
          ths.push(h('th', {class:"grid3-td", attrs:{colspan:d.colSpan, rowspan:d.rowSpan,align:"center"}}, [h('div', {class:"dg-cell"}, d.desc)]));
				});
				trs.push(h('tr', ths));
      });
      
      let table1 = h('table', {class:"lockgrid"}, [h('thead', trs)]);


			let tbodytrs = [];
			$(this.data.datas).each((a, b)=>{
				let tds = [];
				$(b).each((c, d)=>{
          tds.push(h('td', {attrs:{class:"lockgrid-td",colspan:d.colSpan, rowspan:d.rowSpan, align:d.isRow==true?"left":"right"}}, [h('div', {class:"dg-cell"}, d.value)]));
				});
				tbodytrs.push(h('tr', tds));
      });
      let table2 = h('table', {class:"lockgrid"}, [h('thead', tbodytrs)]);

      let cld = [h('div', {class:"lock-dg-header"}, [table1]), h('div', {class:"lock-dg-body"}, [table2])];
      return h('div', {class:"lock-dg"}, cld);

    }else{
      return h('div', {attrs:{align:"center", class:"tipinfo"}, domProps:{innerHTML:"(点击<i class=\"fa fa-wrench\"></i>按钮配置"+utils.getCompTypeDesc(comp.type)+")"}});
    }
  },
  mounted(){
    this.tableView();
  },
  computed: {
  },
  methods: {
    tableView(){
      let ts = this;
      let comp = this.comp;
      if(comp.kpiJson && comp.kpiJson.length > 0){
          let json = JSON.parse(JSON.stringify(comp));
          let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+comp.id+" div.ccctx")});
          ajax({
            url:"portal/TableView.action",
            type:"POST",
            data:JSON.stringify(json),
            postJSON:true,
            success:(resp)=>{
              ts.data = resp.rows;
              loadingInstance.close();
            }
          }, this);
      }
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>

</style>
