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
    if(comp.cols && comp.cols.length > 0){
      let ths = [];
      comp.cols.forEach(element => {
        ths.push(h('th', {class:"grid3-td"}, [h('div', {class:"dg-cell"}, element.name)]));
      });
      let table = h('table', {class:"lockgrid"}, [h('thead', [h("tr", ths)])]);
      return table;
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
      
    }
  },
  watch: {
    
  }
}
</script>

<style lang="less" scoped>

</style>
