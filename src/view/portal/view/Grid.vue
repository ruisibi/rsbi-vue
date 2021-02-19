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
      },
      editor:{
        type:Boolean,
        required:true,
        default:true
      },
      portalParams:{
        type:Array,
        required:false
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
      if(data.datas){
        data.datas.forEach((e, idx) => {
          let tds = []
          $(data.header).each((c, d)=>{
            let hd = d;
            let nd = e[d.name];
            tds.push(h('td', {class:"lockgrid-td",attrs:{align:hd.align?hd.align:"center"}}, [h('div', {class:"dg-cell"}, nd.value)]));
          });
          trs.push(h('tr', tds));
        });
      }else{
        trs = [h('tr',{attrs:{colspan:data.header.length, align:"center"}}, '无数据')];
      }
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
            if(this.editor === true){
              this.gridView();
            }else{
              this.fy();
            }
          }
        }},domProps:{innerHTML:"<i class='fa fa-angle-double-left'></i>"}}),
        h('button', {class:"btn btn-link btn-xs", on:{click:()=>{
          if(!first){
            this.comp.curPage = data.curPage - 1;
             if(this.editor === true){
              this.gridView();
            }else{
              this.fy();
            }
          }
        }},attrs:{disabled:first},domProps:{innerHTML:"<i class='fa fa-angle-left'></i>"}}),
        h('button', {class:"btn btn-link btn-xs",attrs:{disabled:end},on:{click:()=>{
          if(!end){
            this.comp.curPage = data.curPage + 1;
             if(this.editor === true){
              this.gridView();
            }else{
              this.fy();
            }
          }
        }},domProps:{innerHTML:"<i class='fa fa-angle-right'></i>"}}),
        h('button', {class:"btn btn-link btn-xs",attrs:{disabled:end}, on:{click:()=>{
          if(!end){
            this.comp.curPage = allpage - 1;
             if(this.editor === true){
              this.gridView();
            }else{
              this.fy();
            }
          }
        }},domProps:{innerHTML:"<i class='fa fa-angle-double-right'></i>"}})
      ];

      let pageinfo = h('div', {class:"pagesizeinfo"}, [h('div', {class:"pagesizeLeft"}, pg), h('div', {class:"pagesizeRight"}, '第'+(data.curPage + 1)+'页，共'+data.total+'条记录')]);
      let bodysyl = {"overflow":"auto"};
      if(comp.height){
        let height = comp.height;
        height = height - 28;  //组件高度减去 head 的高度
        if(!(comp.isnotfy == true)){  //分页
          height = height - 30; //减去分页高度
        }
        bodysyl.height = height + "px";
      }else{
        bodysyl.height = "220px";
      }
      
      let cld = [h('div', {class:"lock-dg-header"}, [table1]), h('div', {class:"lock-dg-body", style:bodysyl}, [table2])];
      if(!(this.comp.isnotfy === true)){
        cld.push(pageinfo);
      }
      return h('div', {class:"lock-dg", attrs:{id:comp.id}}, cld);
      
    }
     if(this.editor === true){
        return h('div', {attrs:{align:"center", class:"tipinfo"}, domProps:{innerHTML:"(点击<i class=\"fa fa-wrench\"></i>按钮配置"+utils.getCompTypeDesc(comp.type)+")"}});
     }else{
        return h('div','数据加载中...');
     }
  },
  mounted(){
    if(this.editor === true){
      this.gridView();
    }
  },
  computed: {
  },
  methods: {
    bindScrollEvent(){
      let comp = this.comp;
      //注册table的scroll事件
      $("#"+comp.id+" .lock-dg-body").unbind("scroll").bind("scroll", function(){
        var left = $(this).scrollLeft();
        $("#"+comp.id+" .lock-dg-header").css("margin-left", "-"+left+"px");
      });
    },
    //查看模式，分页方法
    fy(){
      let dt = {};
      let reportId = this.$parent.pageInfo.id;
      dt['serviceid'] = "ext.sys.fenye.ajax";
      dt['t_from_id'] = "mv_" + reportId;
      dt['currPage'] = this.comp.curPage;
      dt['id'] = this.comp.id;
      dt['pageSize'] = this.comp.pageSize;

      let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+this.comp.id+" div.ccctx")});
      ajax({
        url:"control/extControl",
        data:dt,
        type:"POST",
        success:(resp)=>{
          console.log(resp.rows);
          //重新渲染表格
          this.data = resp.rows;
        }
      }, this, loadingInstance);
    },
    gridView(){
      let ts = this;
      let comp = this.comp;
      comp = JSON.parse(JSON.stringify(comp));
      comp.portalParams = ts.portalParams;
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
              ts.$nextTick(()=>ts.bindScrollEvent());
            }
          }, this, loadingInstance);
      }
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>

</style>
