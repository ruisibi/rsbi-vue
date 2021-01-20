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
      return h('div', {class:"boxcls", style:style}, this.data.value);
    }else{
      return h('div', {attrs:{align:"center", class:"tipinfo"}, domProps:{innerHTML:"(点击<i class=\"fa fa-wrench\"></i>按钮配置"+utils.getCompTypeDesc(comp.type)+")"}});
    }
  },
  mounted(){
    this.boxView();
  },
  computed: {
  },
  methods: {
    boxView(){
      let ts = this;
      let comp = this.comp;
      if(comp.kpiJson){
          let json = JSON.parse(JSON.stringify(comp));
          let loadingInstance = Loading.service({fullscreen:false, target:document.querySelector('#c_'+comp.id+" div.ccctx")});
          ajax({
            url:"portal/BoxView.action",
            type:"POST",
            data:JSON.stringify(json),
            postJSON:true,
            success:(resp)=>{
              ts.data = resp.rows[0];
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
