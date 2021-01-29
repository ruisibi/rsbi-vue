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
    let comp = this.comp;
    let data = this.data;
    if(data){
      let ths = [];
      data.header.forEach(element => {
        ths.push(h('th', {class:"grid3-td"}, [h('div', {class:"dg-cell"}, element.desc)]));
      });
      let table1 = h('table', {class:"lockgrid"}, [h('thead', [h("tr", ths)])]);


      

      let trs = [];
      data.datas.forEach((e, idx) => {
        let tds = []
        $(data.header).each((c, d)=>{
          let hd = d;
          let nd = e[d.name];
          tds.push(h('td', {class:"lockgrid-td",attrs:{align:hd.align?hd.align:"center"}}, [h('div', {class:"dg-cell"}, nd.value)]));
        });
        trs.push(h('tr', tds));
      });
      let table2 = h('table', {class:"lockgrid"}, [h('thead', trs)]);

        //分页信息
        let allpage = 0;
        if (data.total % data.pageSize === 0) {
          allpage = data.total / data.pageSize;
        } else {
          allpage = Math.floor(data.total / data.pageSize) + 1;
        }
      let first = data.curPage <= 0;
      let end = data.curPage >= allpage - 1;
      let pg = [
        h('button', {class:"btn btn-link btn-xs",attrs:{disabled:first},on:{click:()=>{
          if(!first){
            this.comp.curPage = 0;
            this.gridView();
          }
        }},domProps:{innerHTML:"<i class='fa fa-angle-double-left'></i>"}}),
        h('button', {class:"btn btn-link btn-xs", on:{click:()=>{
          if(!first){
            this.comp.curPage = data.curPage - 1;
            this.gridView();
          }
        }},attrs:{disabled:first},domProps:{innerHTML:"<i class='fa fa-angle-left'></i>"}}),
        h('button', {class:"btn btn-link btn-xs",attrs:{disabled:end},on:{click:()=>{
          if(!end){
            this.comp.curPage = data.curPage + 1;
            this.gridView();
          }
        }},domProps:{innerHTML:"<i class='fa fa-angle-right'></i>"}}),
        h('button', {class:"btn btn-link btn-xs",attrs:{disabled:end}, on:{click:()=>{
          if(!end){
            this.comp.curPage = allpage - 1;
            this.gridView();
          }
        }},domProps:{innerHTML:"<i class='fa fa-angle-double-right'></i>"}})
      ];

      let pageinfo = h('div', {class:"pagesizeinfo"}, [h('div', {class:"pagesizeLeft"}, pg), h('div', {class:"pagesizeRight"}, '第'+(data.curPage + 1)+'页，共'+data.total+'条记录')]);
      let cld = [h('div', {class:"lock-dg-header"}, [table1]), h('div', {class:"lock-dg-body"}, [table2])];
      if(!(this.comp.isnotfy === true)){
        cld.push(pageinfo);
      }
      return h('div', {class:"lock-dg"}, cld);
      
    }
    return h('div', {attrs:{align:"center", class:"tipinfo"}, domProps:{innerHTML:"(点击<i class=\"fa fa-wrench\"></i>按钮配置"+utils.getCompTypeDesc(comp.type)+")"}});
  },
  mounted(){
    this.gridView();
  },
  computed: {
  },
  methods: {
    gridView(){
      let ts = this;
      let comp = this.comp;
      if(comp.cols && comp.cols.length > 0){
          let json = JSON.parse(JSON.stringify(comp));
          let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+comp.id+" div.ccctx")});
          ajax({
            url:"portal/GridView.action",
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
