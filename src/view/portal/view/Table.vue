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
      data:null,
      islink:false //是否做了事件联动
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
        let curRowValue = null;
				$(b).each((c, d)=>{
          tds.push(h('td', {attrs:{class:"lockgrid-td",colspan:d.colSpan, rowspan:d.rowSpan, align:d.isRow==true?"left":"right"}}, [h('div', {class:"dg-cell"}, d.value)]));
          if(d.isRow === true){
            curRowValue = d.value;
          }
        });
        if(this.editor == false && comp.link && comp.link.target.length > 0){  //在浏览模式下有联动事件
          tbodytrs.push(h('tr',{style:{cursor:"pointer"},on:{click:()=>{
              ts.tableEvent(curRowValue);
            }}}, tds));
        }else{
	        tbodytrs.push(h('tr', tds));
        }
      });
      let table2 = h('table', {class:"lockgrid"}, [h('thead', tbodytrs)]);

      let bodysyl = {"overflow":"auto"};
      if(comp.height){
        let height = comp.height;
        height = height - this.data.colLevel * 28;  //组件高度减去 head 的高度
        bodysyl.height = height + "px";
      }else{
        bodysyl.height = "220px";
      }
      let cld = [h('div', {class:"lock-dg-header"}, [table1]), h('div', {class:"lock-dg-body", style:bodysyl}, [table2])];
      let ret = h('div', {class:"lock-dg", attrs:{id:comp.id}}, cld);
      if(ts.islink == true){  //添加返回按钮
        return h('div', [h('span', {class:"eventback"}, [h('span', {class:"label label-success", on:{click:()=>{
          this.linkBack();
        }}, domProps:{innerHTML:"<i class=\"fa fa-arrow-left\"></i>返回"}})]), ret]);
      }else{
        return h('div', [ret]);
      }

    }else{
      if(this.editor === true){
        return h('div', {attrs:{align:"center", class:"tipinfo"}, domProps:{innerHTML:"(点击<i class=\"fa fa-wrench\"></i>按钮配置"+utils.getCompTypeDesc(comp.type)+")"}});
      }else{
        return h('div','数据加载中...');
      }
    }
  },
  mounted(){
    if(this.editor === true){
      this.tableView();
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
    tableEvent(val){
      let comp = this.comp;
      this.islink = true;
      utils.compFireEvent(comp.link, this, comp.link.paramName, val);
    },
    linkBack(){
      this.islink = false;
      utils.compBackEvent(this.comp.link, this);
    },
    tableView(){
      let ts = this;
      let comp = this.comp;
      if(comp.kpiJson && comp.kpiJson.length > 0){
          let json = JSON.parse(JSON.stringify(comp));
          json.portalParams = ts.portalParams;
          let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+comp.id+" div.ccctx")});
          ajax({
            url:"portal/TableView.action",
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
.eventback {
	position:absolute;
	width:50px;
	right:5px;
  cursor:pointer;
  display:block;
	z-index:9999;
}
</style>
