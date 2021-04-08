<template>
    <el-dialog title="自定义布局" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
      <div class="el-dialog-div">
        <div class="table-toolbar">
          <button class="btn btn-default btn-rounded btn-outline btn-xs" type="button" @click="lyt_insertRow()">插入行</button>
          <button class="btn btn-default btn-rounded btn-outline btn-xs" type="button" @click="lyt_insertCol()">插入列</button>
          <button class="btn btn-default btn-rounded btn-outline btn-xs" type="button" @click="lyt_deleteRow()">删除行</button>
          <button class="btn btn-default btn-rounded btn-outline btn-xs" type="button" @click="lyt_deleteCol()">删除列</button>
          <button class="btn btn-default btn-rounded btn-outline btn-xs" type="button" @click="lyt_mergeCell()">合并</button>
          <button class="btn btn-default btn-rounded btn-outline btn-xs" type="button" @click="lyt_unmergeCell()">取消合并</button>
        </div>
        <div style="height:calc(100% - 30px)">
          <table id="autoLayoutTable" border="0" cellspacing="0" cellpadding="0" class="r_layout">
            <template v-for="(trs, index) in layoutJson" >
              <tr :key="index" >
                <template v-for="td in trs">
                 <td class="laytd" :node="td.id" :key="td.id" :height="td.height+'%'" :width="td.width+'%'" :colspan="td.colspan" :rowspan="td.rowspan"></td>
                </template>
              </tr>
            </template>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">确 定</el-button>
        <el-button @click="show = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {baseUrl} from '@/common/biConfig'
import * as layout from './Utils'
import $ from 'jquery'

export default {
  components:{
    
  },
  props:{
      pageInfo:{
        type:Object,
        required:true
     }
  },
  data(){
    return {
        show:false,
        layoutJson: null,
        curtabtd:null
    }
  },
  mounted(){

  },
  computed: {
     
  },
  methods: {
     showDailog(){
        this.show = true;
        let json = this.pageInfo.body;
        let lay = [];
        for(let i=1; true; i++){
          var tr = json["tr"+i];
          if(!tr || tr == null){
            break;
          }
          let tds = [];
          for(var j=0; j<tr.length; j++){
            var td = tr[j];
            tds.push({colspan:td.colspan, rowspan:td.rowspan, width:td.width, height:td.height, id:td.id});
          }
          lay.push(tds);
        }
        this.layoutJson = lay;
        this.$nextTick(()=>this.bindSelectEvent());
     },
     bindSelectEvent(){
       let thiz = this;
        const selFunc = function(ts){
          $("#autoLayoutTable td").removeClass("tdselect");
          $(ts).addClass("tdselect");
        }
        const areaSelFunc = function(start, end){
          $("#autoLayoutTable td").removeClass("tdselect");
          var p1 = $(start).attr("pos").split(",");
          var p2 = $(end).attr("pos").split(",");
          //反向选择的时候，交换位置
          if(p1[0] > p2[0] || p1[1] > p2[1]){
            let tmp = p1;
            p1 = p2;
            p2 = tmp;
          }
          
          for(let i=p1[0]; i<=p2[0]; i++){
            for(let j = p1[1]; j<=p2[1]; j++){
              $("#autoLayoutTable td[pos='"+(i+","+j)+"']").addClass("tdselect");
            }
          }
        }
        var issel = false;
        var start = null;
        $("#autoLayoutTable").on("click", 'td.laytd', function(){
          if(!issel){
            selFunc(this);
          }
        }).on("mousedown", "td.laytd", function(e){
          issel = true;
          start = this;
        }).on("mouseup","td.laytd", function(e){
          issel = false;
        }).on("mousemove","td.laytd", function(e){
          //console.log("issel = " + issel);
          if(issel){
            areaSelFunc(start, this);
          }
        }).on("contextmenu","td.laytd", function(e){
          issel = false;
          thiz.curtabtd = this;
          //选中单元格
          if($("#autoLayoutTable td.tdselect").length <= 1){
            selFunc(this);
          }
        });
        this.updateHeightWidth();
        selFunc($("#autoLayoutTable td.laytd:first"));
     },
     save(){
        let comps = layout.findAllComps(this.pageInfo);
        var ljson = {};
        var rows = document.getElementById("autoLayoutTable").rows;
        var pidx = 0;
        for(var i=0;i<rows.length;i++){
          var cells = rows[i].cells;
          var tds = [];
          ljson["tr"+(i+1)] = tds;
          for(var j=0;j<cells.length;j++){
            var cell = $(cells[j]);
            var obj = {};
            obj.colspan = cell.attr("colspan")?cell.attr("colspan"):"1";
            obj.rowspan = (cell.attr("rowspan")?cell.attr("rowspan"):"1");
            obj.height = Number(cell.attr("height").replace("%", ''));
            obj.width = Number(cell.attr("width").replace("%", ''));
            obj.id = pidx;
            pidx=pidx+1;
            tds.push(obj);
          }
        }
        this.pageInfo.body = ljson;
        this.pageInfo.layout = 6;
        ljson.tr1[0].children = comps;
        this.show = false;
        this.$parent.isbindTdEvent = true;
        this.$parent.isupdate = true;
        this.$parent.showAutoLayout = false;
        this.$parent.$forceUpdate();
     },
     updateHeightWidth(noSetPos){
        //获取第一行
        var cells = document.getElementById("autoLayoutTable").rows[0].cells;
        var cols = 0;  //获取宽度
        for(let i=0; i<cells.length; i++){
          cols = cols + Number(($(cells[i]).attr("colspan")?$(cells[i]).attr("colspan"):1));
        }
        var effectRow = {}; // 在rowspan 的单元格中需要影响后面行的宽度，定义 行数+逗号+列+after/before后的影响行数MAP对象. 比如 {"1,1after":2}, after/befroe表示插入的前还是后
        var rows = document.getElementById("autoLayoutTable").rows;
        var rowLength = rows.length; //行数
        for(let j=0; j<rowLength; j++){
          cells = rows[j].cells;
          var wposIndex = 0; // 行pos位置
          for(let i=0; i<cells.length; i++){
            var colspan = $(cells[i]).attr("colspan")?Number($(cells[i]).attr("colspan")):1;
            var rowspan = $(cells[i]).attr("rowspan")?Number($(cells[i]).attr("rowspan")):1;
            var wd = ((100/cols) * colspan);
            var hd = ((100/rowLength) * rowspan);
            $(cells[i]).attr({"width" : Math.round(wd) + "%", "height":Math.round(hd)+"%"});  //定义单元格宽度，高度
            
            if(noSetPos && noSetPos==true){
              continue;
            }
            if(rowspan > 1){  //会影响后面行的pos
              for(let k=1; k<rowspan; k++){
                //判断启用before 还是 after, before 表示影响的行前面没有单元格（td）
                var st = "before";
                //i == 0)  //第0列肯定是before
                for(let m=0;m<i;m++){
                  var rs = ($(cells[m]).attr("rowspan")?Number($(cells[m]).attr("rowspan")):1) - 1;
                  if(rs < k){   //如果当前单元格的跨度  <  影响的行, 说明影响的行的单元格前面存在单元格，
                    st = "after";   
                    break;
                  }
                }
                
                effectRow[(j+k)+","+(st=="before"?wposIndex:wposIndex-1)+st] = colspan;  //占位影响的行, 需要考虑before/after
              }
            }
            //如果是第一行，先判断是否需要追加 占位位置，  需考虑连续追加
            for(let l=wposIndex-1; i==0&&l<cols; l++){
              if(effectRow[j+","+(wposIndex)+"before"]){
                wposIndex = wposIndex + effectRow[j+","+(wposIndex)+"before"];
              }else{
                break;
              }
            }
            $(cells[i]).attr({"pos":j+","+wposIndex});
            wposIndex = wposIndex + 1;
            if(colspan > 1){  //会影响本行后面的pos
              wposIndex = wposIndex + (colspan - 1);
            }
            //wposIndex追加 占位 位置, 需考虑连续追加
            for(let l=wposIndex-1; l<cols; l++){  //考虑连续追加，两个竖向合并单元格
              if(effectRow[j+","+(l) + "after"]){
                wposIndex = wposIndex + effectRow[j+","+(l) + "after"];
              }else{
                break;
              }
            }
          }
        }
      },
      lyt_mergeCell(){
        var p1 = null;
        var p2 = null;
        var size = $("#autoLayoutTable td.tdselect").length;
        if(size <= 1){
          return;
        }
        var endTd = null;
        $("#autoLayoutTable td.tdselect").each(function(index, element) {
          if(index == 0){
            p1 = $(this).attr("pos").split(",");
          }
          if(index == size - 1){
            p2 = $(this).attr("pos").split(",");
            endTd = $(this);
          }
              if(index > 0){
            $(this).remove();
          }
          });
        //结束单元格的colspan,  rowspan 影响宽度,高度
        var colspan = endTd.attr("colspan")?Number(endTd.attr("colspan")):1;
        var rowspan = endTd.attr("rowspan")?Number(endTd.attr("rowspan")):1;
        $("#autoLayoutTable td.tdselect").attr("rowspan", Math.abs(p1[0] - p2[0] + (rowspan - 1)) + 1).attr("colspan", Math.abs(p1[1] - p2[1] +(colspan - 1) ) + 1);
        this.updateHeightWidth(true);
      },
      lyt_unmergeCell(){
        var o = $("#autoLayoutTable td.tdselect");
        if(o.length == 0){
          this.$notify.error({
            title: '请先选择单元格。',
            offset: 50
          });
          return;
        }
        this.curtabtd = o[0];
        var td = $(this.curtabtd);
        var colspan = td.attr("colspan") ? Number(td.attr("colspan")) : 1;
        var rowspan = td.attr("rowspan") ? Number(td.attr("rowspan")) : 1;
        td.attr("colspan", 1);
        td.attr("rowspan", 1);
        for(let i=1; i<=rowspan; i++){
          var str = "";
          for(let j=1; j<(i == 1 ? colspan : colspan + 1); j++){
            str = str + "<td class=\"laytd\"></td>";
          }
          if(i == 1){
            td.after(str);  //第一行，直接追加
          }else{
            var zuobiao = td.attr("pos").split(",");
            var node = $("#autoLayoutTable td[pos='"+((Number(zuobiao[0])+i-1) +","+ (Number(zuobiao[1]) - 1))+"']") //求当前td的下一个的前一个
            if(node.length == 0){  //如果查找的TD不存在
              //开始查询后一个
              node = $("#autoLayoutTable td[pos='"+((Number(zuobiao[0])+i-1) +","+ (Number(zuobiao[1]) + colspan))+"']") //求当前td的下一个的后一个
              if(node.length > 0){
                node.before(str);
              }else{
                //还是未找到，直接追加
                var tr = td.parent();  //查找当前TR
                for(let k=1; k<=i-1; k++){
                  tr = tr.next();
                }
                tr.append(str);
              }
            }else{
              node.after(str);  
            }
            
          }
        }
        this.updateHeightWidth();
        this.curtabtd = null;
      },
      lyt_insertRow(){
        var o = $("#autoLayoutTable td.tdselect");
        if(o.length == 0){
          this.$notify.error({ title: '请先选择单元格。',offset: 50 });
          return;
        }
        this.curtabtd = o[0];
        var td = this.curtabtd;
        //定义判断新增加的单元格是否属于一个合并单元格的内容。
        var tdInCells = function(rowIndex, colIndex){
          var returnTd = null;
          $("#autoLayoutTable td").each(function(index, element) {
                  var pos = $(element).attr("pos").split(",");
            var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
            var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
            if(rowspan > 1){
              if(rowIndex > Number(pos[0]) && rowIndex <= Number(pos[0])+ rowspan && 
                colIndex >= Number(pos[1]) && colIndex < Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
                returnTd = $(element);
              }
            }
              });
          return returnTd;
        };
        
        var colCount = 0;
        var cells = document.getElementById("autoLayoutTable").rows[0].cells;
        for(let i=0; i<cells.length; i++){
          var colspan = $(cells[i]).attr("colspan") ? Number($(cells[i]).attr("colspan")) : 1;
          colCount = colCount + colspan;
        }
        var pos = $(td).attr("pos").split(",");
        var row = Number(pos[0]) + 1;
        var rowspan = $(td).attr("rowspan")?Number($(td).attr("rowspan")):1;
        row = row + rowspan - 1; //如果rowspan>1 计算新的行(row)
        var str = "<tr>";
        for(let i=0; i<colCount; i++){
          var curTd = $("#autoLayoutTable td[pos='"+row+","+i+"']");
          if(curTd.length == 0){   //如果需要添加的td不存在，并且属于一个合并单元格的内容，为当前合并单元格增加1个rowspan
            var retTd = tdInCells(row, i);
            if(retTd != null){
              var r = Number(retTd.attr("rowspan")) + 1;
              retTd.attr("rowspan", r);
              //如果retTd的colspan > 1, 为i 追加 rowspan - 1, 不然rowspan 会被加多次
              var c = Number(retTd.attr("colspan"));
              if(c > 1){
                i = i + c - 1;
              }
              continue;
            }
          }
          str = str + "<td class=\"laytd\">";
          str = str + "</td>";
        }
        str = str + "</tr>";
        var obj = $(td).parent();   //rowspan 影响插入的位置
        for(let i=1; i<rowspan; i++){
          obj = obj.next();
        }
        obj.after(str);
        this.updateHeightWidth();
        this.curtabtd = null;
      },
      lyt_insertCol(){
         var o = $("#autoLayoutTable td.tdselect");
        if(o.length == 0){
          this.$notify.error({ title: '请先选择单元格。',offset: 50 });
          return;
        }
          var td = o[0];
          //定义判断新增加的单元格是否属于一个合并单元格的内容。
          var tdInCells = function(rowIndex, colIndex){
            var returnTd = null;
            $("#autoLayoutTable td").each(function(index, element) {
                    var pos = $(element).attr("pos").split(",");
              var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
              var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
              if(colspan > 1){
                if(rowIndex >= Number(pos[0]) && rowIndex < Number(pos[0])+ rowspan && 
                  colIndex > Number(pos[1]) && colIndex <= Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
                  returnTd = $(element);
                }
              }
                });
            return returnTd;
          };
          
          var rows = document.getElementById("autoLayoutTable").rows;
          //获取当前TD的index
          var pos = $(td).attr("pos").split(",");
          var idx = Number(pos[1]);
          var colspan = $(td).attr("colspan") ? Number($(td).attr("colspan")) : 1;
          if(colspan > 1){
            idx = idx + colspan - 1; //当前td的colspan影响插入列的位置
          }
          var insertArray = [];
          for(let i=0; i<rows.length; i++){
            var ctd = null;
            var curTd = $("#autoLayoutTable td[pos='"+i+","+(idx)+"']");
            if(curTd.length == 0){   //如果当前td不存在，并且属于一个合并单元格的内容，为当前合并单元格增加1个colspan
              var retTd = tdInCells(i, idx);
              if(retTd != null){
                var r = Number(retTd.attr("colspan")) + 1;
                retTd.attr("colspan", r);
                var c = Number(retTd.attr("rowspan"));
                if(c > 1){
                  i = i + c - 1;
                }
                continue;
              }
            }else{
              //如果当前td存在，并且colspan > 1, 为当前td 添加一个colspan
              var r = curTd.attr("colspan") ? Number(curTd.attr("colspan")) : 1;
              var c = Number(curTd.attr("rowspan"));   //rowspan 影响数据行
              if(c > 1){
                i = i + c - 1;
              }
              if(r > 1){
                curTd.attr("colspan", r + 1);
                continue;
              }
              ctd = curTd;
            }
            var rspan = ctd.attr("rowspan") ? Number(ctd.attr("rowspan")) : 1;
            var cspan = ctd.attr("colspan") ? Number(ctd.attr("colspan")) : 1; 
            //当前插入的TD跨行和列，需要设置新的 colspan, rowspan
            var str = "<td class=\"laytd\" rowspan=\""+rspan+"\" colspan=\""+cspan+"\"></td>";
            //ctd.after(str);
            insertArray.push({"obj":ctd, "str" : str});
          }
          for(let i=0; i<insertArray.length; i++){
            insertArray[i].obj.after(insertArray[i].str);
          }
          this.updateHeightWidth();
        },
        lyt_deleteCol(){
         var o = $("#autoLayoutTable td.tdselect");
          if(o.length == 0){
            this.$notify.error({ title: '请先选择单元格。',offset: 50 });
            return;
          }
          var td = $(o[0]);
          var rows = document.getElementById("autoLayoutTable").rows;
          //定义判断需要删除的单元格是否属于一个合并单元格的内容。
          var tdInCells = function(rowIndex, colIndex){
            var returnTd = null;
            $("#autoLayoutTable td").each(function(index, element) {
                    var pos = $(element).attr("pos").split(",");
              var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
              var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
              if(colspan > 1){
                if(rowIndex >= Number(pos[0]) && rowIndex < Number(pos[0])+ rowspan && 
                  colIndex > Number(pos[1]) && colIndex <= Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
                  returnTd = $(element);
                }
              }
                });
            return returnTd;
          };
          //获取当前TD的index
          var pidx = Number(td.attr("pos").split(",")[1]);
          var removes = [];
          //对于colspan > 1 的单元格删除，需要删除多列
          var tdcspan = td.attr("colspan") ? Number(td.attr("colspan")) : 1;
          for(let k=0; k<tdcspan; k++){
            var idx = pidx + k;
            for(let i=0; i<rows.length; i++){
              var curTd = $("#autoLayoutTable td[pos='"+i+","+(idx)+"']");
              if(curTd.attr("pos") == td.attr("pos")){  //需要移除的td刚好是当前选择的TD，不用判断直接移除
                removes.push(curTd);
                var c = Number(curTd.attr("rowspan"));  //rowspan影响列
                if(c > 1){
                  i = i + c - 1;
                }
                continue;
              }
              if(curTd.length == 0){   //如果当前td不存在，并且属于一个合并单元格的内容，为当前合并单元格减少1个colspan
                var retTd = tdInCells(i, idx);
                if(retTd != null){
                  var r = Number(retTd.attr("colspan")) - 1;
                  retTd.attr("colspan", r);
                  var c = Number(retTd.attr("rowspan"));
                  if(c > 1){
                    i = i + c - 1;
                  }
                  continue;
                }
              }else{
                //如果当前td存在，并且colspan > 1, 为当前td 减少一个colspan
                var r = curTd.attr("colspan") ? Number(curTd.attr("colspan")) : 1;

                //有rowspan > 1, 影响多行
                var c = curTd.attr("rowspan") ? Number(curTd.attr("rowspan")) : 1;
                if(c > 1){
                  i = i + c - 1;
                }
                if(r > 1){
                  curTd.attr("colspan", r - 1);
                  continue;
                }
              }
              
              removes.push(curTd);;
            }
          }
          for(let i=0; i<removes.length; i++){
            $(removes[i]).remove();
          }
          this.updateHeightWidth();
        },
        lyt_deleteRow(){
          var o = $("#autoLayoutTable td.tdselect");
          if(o.length == 0){
            this.$notify.error({ title: '请先选择单元格。',offset: 50 });
            return;
          }
          var td = $(o[0]);
          var colCount = 0;
          var cells = document.getElementById("autoLayoutTable").rows[0].cells;
          for(let i=0; i<cells.length; i++){
            var colspan = $(cells[i]).attr("colspan") ? Number($(cells[i]).attr("colspan")) : 1;
            colCount = colCount + colspan;
          }
          //定义判断需要删除的单元格是否属于一个合并单元格的内容。
          var tdInCells = function(rowIndex, colIndex){
            var returnTd = null;
            $("#autoLayoutTable td").each(function(index, element) {
                    var pos = $(element).attr("pos").split(",");
              var rowspan = $(element).attr("rowspan") ? Number($(element).attr("rowspan")) : 1;
              var colspan = $(element).attr("colspan") ? Number($(element).attr("colspan")) : 1;
              if(rowspan > 1){
                if(rowIndex > Number(pos[0]) && rowIndex <= Number(pos[0] + rowspan) && 
                  colIndex >= Number(pos[1]) && colIndex < Number(pos[1]) + colspan ){  //当前需要新添加的td 属于表格的一个单元格
                  returnTd = $(element);
                }
              }
                });
            return returnTd;
          };
          var deltrs = [];
          var pos = $(td).attr("pos").split(",");
          var nrow = Number(pos[0]);
          var delrowspan = td.attr("rowspan") ? Number(td.attr("rowspan")) : 1;  //rowspan 影响删除的行数
          for(let n=0; n<delrowspan; n++){
            for(let i=0; i<colCount; i++){
              var row = nrow + n;
              var curTd = $("#autoLayoutTable td[pos='"+row+","+i+"']");
              if(curTd.length == 0){
                //需要删除的单元格不存在，并且属于一个合并单元格中，需要把合并单元格的rowspan - 1
                var retTd = tdInCells(row, i);
                if(retTd != null){
                  var r = Number(retTd.attr("rowspan")) - 1;
                  retTd.attr("rowspan", r);
                  //如果retTd的colspan > 1, 为i 追加 rowspan - 1, 不然rowspan 会被加多次
                  var c = Number(retTd.attr("colspan"));
                  if(c > 1){
                    i = i + c - 1;
                  }
                }
              }else{
                //需要删除的单元格存在，并且占用多行(row), 减少rowspan,  并且把td放入下一行
                if(Number(curTd.attr("rowspan")) > 1){
                  curTd.attr("rowspan", Number(curTd.attr("rowspan")) - 1);
                  var isdeal = false;
                  var l = i -1;
                  while(l>=0){   //向前查找是否有对象
                    var target = $("#T"+compId+" td[pos='"+(row+1)+","+(l)+"']");
                    if(target.length > 0){
                      target.after(curTd);
                      isdeal = true;
                      break;
                    }
                    l = l - 1;
                  }
                  if(isdeal == false){
                    l = i + 1;
                    while(l < colCount){ //向后查找是否有对象
                      var target = $("autoLayoutTable td[pos='"+(row+1)+","+(l)+"']");
                      if(target.length > 0){
                        target.before(curTd);
                        isdeal = true;
                        break;
                      }
                      l = l + 1;
                    }
                  }
                }
                var c = Number(curTd.attr("colspan"));  //如果colspan > 1, 夸多列处理
                if(c > 1){
                  i = i + c - 1;
                }
                
              }
            }
            deltrs.push($("#autoLayoutTable tr").get(row));
          }
          for(let i=0; i<deltrs.length; i++){
            $(deltrs[i]).remove();
          }	
          this.updateHeightWidth();
        }
  }
}
</script>

<style lang="less">
.table-toolbar {
	padding-bottom: 3px;
}
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
#autoLayoutTable td.tdselect{
	background-color:#FFFF99;
}
</style>
