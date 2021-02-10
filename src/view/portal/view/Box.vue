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
    let ts = this;
    let comp = this.comp;
    if(this.data){
      let size = this.data.fontsize;
      let color = this.data.fontcolor;
      if(size){
        size += "px";
      }else{
        size = "32px";
      }
      let style = {"font-size":size, "text-align":"center"};
      if(color){
        style.color = color;
      }
      if(comp.height){
        style['line-height'] = comp.height + "px";
      }
      return h('div', {class:"boxcls", style:style}, this.data.value);
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
      this.boxView();
    }
  },
  computed: {
  },
  methods: {
    boxView(){
      let ts = this;
      let comp = this.comp;
      if(comp.kpiJson){
          let json = JSON.parse(JSON.stringify(comp));
          json.portalParams = ts.portalParams;
          let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+comp.id+" div.ccctx")});
          ajax({
            url:"portal/BoxView.action",
            type:"POST",
            data:JSON.stringify(json),
            postJSON:true,
            success:(resp)=>{
              ts.data = resp.rows;
              loadingInstance.close();
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
