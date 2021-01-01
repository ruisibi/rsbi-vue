<!-- 表格对话框都放这里面 -->
<template>
  	<el-dialog title="切换图形类型" :visible.sync="show" :close-on-click-modal="false" custom-class="nopadding">
		
			<div class="chartselect row">
			<div class="selleft col-sm-3">
			<ul>
			<li cid="1" class="select">曲线图</li>
			<li cid="2" >柱状图</li>
			<li cid="3" >饼图</li>
			<li cid="10">条形图</li>
			<li cid="9">面积图</li>
			<li cid="4">仪表盘</li>
			<li cid="5">雷达图</li>
			<li cid="6">散点图</li>
			<li cid="7">气泡图</li>
			<li cid="8">地图</li>
			</ul>
			</div>
			<div class="selright col-sm-9">
			<div class="one" id="schart1" align="center" style="display: block;" tp="line">
			<img src="../../assets/chart/c1.gif">
			</div>
			<div class="one" id="schart2" align="center" tp="column" style="display: none;">
			<img src="../../assets/chart/c2.gif">
			</div>
			<div class="one" id="schart3" align="center" tp="pie" style="display: none;">
			<img src="../../assets/chart/c3.gif">
			</div>
			<div class="one" id="schart10" align="center" tp="bar" style="display: none;">
			<img src="../../assets/chart/bar.gif">
			</div>
			<div class="one" id="schart9" align="center" tp="area" style="display: none;">
			<img src="../../assets/chart/area.gif">
			</div>
			<div class="one" id="schart4" align="center" tp="gauge" style="display: none;">
			<img src="../../assets/chart/c4.gif">
			</div>
			<div class="one" id="schart5" align="center" tp="radar" style="display: none;">
			<img src="../../assets/chart/c5.gif">
			</div>
			<div class="one" id="schart6" align="center" tp="scatter" style="display: none;">
			<img src="../../assets/chart/c6.gif">
			</div>
			<div class="one" id="schart7" align="center" tp="bubble" style="display: none;">
			<img src="../../assets/chart/c7.gif">
			</div>
			<div class="one" id="schart8" align="center" tp="map" style="display: none;">
			<img src="../../assets/chart/c8.gif"><p></p>
			地图区域：<select id="maparea" class="inputform2">
			<option value="china">全国</option>

			<option value="110000">北京</option>

			<option value="120000">天津</option>

			<option value="130000">河北</option>

			<option value="130100">--石家庄市</option>

			<option value="130200">--唐山市</option>

			<option value="130300">--秦皇岛市</option>

			<option value="130400">--邯郸市</option>

			<option value="130500">--邢台市</option>

			<option value="130600">--保定市</option>

			<option value="130700">--张家口市</option>

			<option value="130800">--承德市</option>

			<option value="130900">--沧州市</option>

			<option value="131000">--廊坊市</option>

			<option value="131100">--衡水市</option>

			<option value="140000">山西</option>

			<option value="140100">--太原市</option>

			<option value="140200">--大同市</option>

			<option value="140300">--阳泉市</option>

			<option value="140400">--长治市</option>

			<option value="140500">--晋城市</option>

			<option value="140600">--朔州市</option>

			<option value="140700">--晋中市</option>

			<option value="140800">--运城市</option>

			<option value="140900">--忻州市</option>

			<option value="141000">--临汾市</option>

			<option value="141100">--吕梁市</option>

			<option value="150000">内蒙古</option>

			<option value="150100">--呼和浩特市</option>

			<option value="150200">--包头市</option>

			<option value="150300">--乌海市</option>

			<option value="150400">--赤峰市</option>

			<option value="150500">--通辽市</option>

			<option value="150600">--鄂尔多斯市</option>

			<option value="150700">--呼伦贝尔市</option>

			<option value="150800">--巴彦淖尔市</option>

			<option value="150900">--乌兰察布市</option>

			<option value="152200">--兴安盟</option>

			<option value="152500">--锡林郭勒盟</option>

			<option value="152900">--阿拉善盟</option>

			<option value="210000">辽宁</option>

			<option value="210100">--沈阳市</option>

			<option value="210200">--大连市</option>

			<option value="210300">--鞍山市</option>

			<option value="210400">--抚顺市</option>

			<option value="210500">--本溪市</option>

			<option value="210600">--丹东市</option>

			<option value="210700">--锦州市</option>

			<option value="210800">--营口市</option>

			<option value="210900">--阜新市</option>

			<option value="211000">--辽阳市</option>

			<option value="211100">--盘锦市</option>

			<option value="211200">--铁岭市</option>

			<option value="211300">--朝阳市</option>

			<option value="211400">--葫芦岛市</option>

			<option value="220000">吉林</option>

			<option value="220100">--长春市</option>

			<option value="220200">--吉林市</option>

			<option value="220300">--四平市</option>

			<option value="220400">--辽源市</option>

			<option value="220500">--通化市</option>

			<option value="220600">--白山市</option>

			<option value="220700">--松原市</option>

			<option value="220800">--白城市</option>

			<option value="222400">--延边朝鲜族自治州</option>

			<option value="230000">黑龙江</option>

			<option value="230100">--哈尔滨市</option>

			<option value="230200">--齐齐哈尔市</option>

			<option value="230300">--鸡西市</option>

			<option value="230400">--鹤岗市</option>

			<option value="230500">--双鸭山市</option>

			<option value="230600">--大庆市</option>

			<option value="230700">--伊春市</option>

			<option value="230800">--佳木斯市</option>

			<option value="230900">--七台河市</option>

			<option value="231000">--牡丹江市</option>

			<option value="231100">--黑河市</option>

			<option value="231200">--绥化市</option>

			<option value="232700">--大兴安岭地区</option>

			<option value="310000">上海</option>

			<option value="320000">江苏</option>

			<option value="320100">--南京市</option>

			<option value="320200">--无锡市</option>

			<option value="320300">--徐州市</option>

			<option value="320400">--常州市</option>

			<option value="320500">--苏州市</option>

			<option value="320600">--南通市</option>

			<option value="320700">--连云港市</option>

			<option value="320800">--淮安市</option>

			<option value="320900">--盐城市</option>

			<option value="321000">--扬州市</option>

			<option value="321100">--镇江市</option>

			<option value="321200">--泰州市</option>

			<option value="321300">--宿迁市</option>

			<option value="330000">浙江</option>

			<option value="330100">--杭州市</option>

			<option value="330200">--宁波市</option>

			<option value="330300">--温州市</option>

			<option value="330400">--嘉兴市</option>

			<option value="330500">--湖州市</option>

			<option value="330600">--绍兴市</option>

			<option value="330700">--金华市</option>

			<option value="330800">--衢州市</option>

			<option value="330900">--舟山市</option>

			<option value="331000">--台州市</option>

			<option value="331100">--丽水市</option>

			<option value="340000">安徽</option>

			<option value="340100">--合肥市</option>

			<option value="340200">--芜湖市</option>

			<option value="340300">--蚌埠市</option>

			<option value="340400">--淮南市</option>

			<option value="340500">--马鞍山市</option>

			<option value="340600">--淮北市</option>

			<option value="340700">--铜陵市</option>

			<option value="340800">--安庆市</option>

			<option value="341000">--黄山市</option>

			<option value="341100">--滁州市</option>

			<option value="341200">--阜阳市</option>

			<option value="341300">--宿州市</option>

			<option value="341500">--六安市</option>

			<option value="341600">--亳州市</option>

			<option value="341700">--池州市</option>

			<option value="341800">--宣城市</option>

			<option value="350000">福建</option>

			<option value="350100">--福州市</option>

			<option value="350200">--厦门市</option>

			<option value="350300">--莆田市</option>

			<option value="350400">--三明市</option>

			<option value="350500">--泉州市</option>

			<option value="350600">--漳州市</option>

			<option value="350700">--南平市</option>

			<option value="350800">--龙岩市</option>

			<option value="350900">--宁德市</option>

			<option value="360000">江西</option>

			<option value="360100">--南昌市</option>

			<option value="360200">--景德镇市</option>

			<option value="360300">--萍乡市</option>

			<option value="360400">--九江市</option>

			<option value="360500">--新余市</option>

			<option value="360600">--鹰潭市</option>

			<option value="360700">--赣州市</option>

			<option value="360800">--吉安市</option>

			<option value="360900">--宜春市</option>

			<option value="361000">--抚州市</option>

			<option value="361100">--上饶市</option>

			<option value="370000">山东</option>

			<option value="370100">--济南市</option>

			<option value="370200">--青岛市</option>

			<option value="370300">--淄博市</option>

			<option value="370400">--枣庄市</option>

			<option value="370500">--东营市</option>

			<option value="370600">--烟台市</option>

			<option value="370700">--潍坊市</option>

			<option value="370800">--济宁市</option>

			<option value="370900">--泰安市</option>

			<option value="371000">--威海市</option>

			<option value="371100">--日照市</option>

			<option value="371300">--临沂市</option>

			<option value="371400">--德州市</option>

			<option value="371500">--聊城市</option>

			<option value="371600">--滨州市</option>

			<option value="371700">--菏泽市</option>

			<option value="410000">河南</option>

			<option value="410100">--郑州市</option>

			<option value="410200">--开封市</option>

			<option value="410300">--洛阳市</option>

			<option value="410400">--平顶山市</option>

			<option value="410500">--安阳市</option>

			<option value="410600">--鹤壁市</option>

			<option value="410700">--新乡市</option>

			<option value="410800">--焦作市</option>

			<option value="410900">--濮阳市</option>

			<option value="411000">--许昌市</option>

			<option value="411100">--漯河市</option>

			<option value="411200">--三门峡市</option>

			<option value="411300">--南阳市</option>

			<option value="411400">--商丘市</option>

			<option value="411500">--信阳市</option>

			<option value="411600">--周口市</option>

			<option value="411700">--驻马店市</option>

			<option value="420000">湖北</option>

			<option value="420100">--武汉市</option>

			<option value="420200">--黄石市</option>

			<option value="420300">--十堰市</option>

			<option value="420500">--宜昌市</option>

			<option value="420600">--襄阳市</option>

			<option value="420700">--鄂州市</option>

			<option value="420800">--荆门市</option>

			<option value="420900">--孝感市</option>

			<option value="421000">--荆州市</option>

			<option value="421100">--黄冈市</option>

			<option value="421200">--咸宁市</option>

			<option value="421300">--随州市</option>

			<option value="422800">--恩施土家族苗族自治州</option>

			<option value="430000">湖南</option>

			<option value="430100">--长沙市</option>

			<option value="430200">--株洲市</option>

			<option value="430300">--湘潭市</option>

			<option value="430400">--衡阳市</option>

			<option value="430500">--邵阳市</option>

			<option value="430600">--岳阳市</option>

			<option value="430700">--常德市</option>

			<option value="430800">--张家界市</option>

			<option value="430900">--益阳市</option>

			<option value="431000">--郴州市</option>

			<option value="431100">--永州市</option>

			<option value="431200">--怀化市</option>

			<option value="431300">--娄底市</option>

			<option value="433100">--湘西土家族苗族自治州</option>

			<option value="440000">广东</option>

			<option value="440100">--广州市</option>

			<option value="440200">--韶关市</option>

			<option value="440300">--深圳市</option>

			<option value="440400">--珠海市</option>

			<option value="440500">--汕头市</option>

			<option value="440600">--佛山市</option>

			<option value="440700">--江门市</option>

			<option value="440800">--湛江市</option>

			<option value="440900">--茂名市</option>

			<option value="441200">--肇庆市</option>

			<option value="441300">--惠州市</option>

			<option value="441400">--梅州市</option>

			<option value="441500">--汕尾市</option>

			<option value="441600">--河源市</option>

			<option value="441700">--阳江市</option>

			<option value="441800">--清远市</option>

			<option value="445100">--潮州市</option>

			<option value="445200">--揭阳市</option>

			<option value="445300">--云浮市</option>

			<option value="450000">广西</option>

			<option value="450100">--南宁市</option>

			<option value="450200">--柳州市</option>

			<option value="450300">--桂林市</option>

			<option value="450400">--梧州市</option>

			<option value="450500">--北海市</option>

			<option value="450600">--防城港市</option>

			<option value="450700">--钦州市</option>

			<option value="450800">--贵港市</option>

			<option value="450900">--玉林市</option>

			<option value="451000">--百色市</option>

			<option value="451100">--贺州市</option>

			<option value="451200">--河池市</option>

			<option value="451300">--来宾市</option>

			<option value="451400">--崇左市</option>

			<option value="460000">海南</option>

			<option value="460100">--海口市</option>

			<option value="460200">--三亚市</option>

			<option value="500000">重庆市</option>

			<option value="510000">四川</option>

			<option value="510100">--成都市</option>

			<option value="510300">--自贡市</option>

			<option value="510400">--攀枝花市</option>

			<option value="510500">--泸州市</option>

			<option value="510600">--德阳市</option>

			<option value="510700">--绵阳市</option>

			<option value="510800">--广元市</option>

			<option value="510900">--遂宁市</option>

			<option value="511000">--内江市</option>

			<option value="511100">--乐山市</option>

			<option value="511300">--南充市</option>

			<option value="511400">--眉山市</option>

			<option value="511500">--宜宾市</option>

			<option value="511600">--广安市</option>

			<option value="511700">--达州市</option>

			<option value="511800">--雅安市</option>

			<option value="511900">--巴中市</option>

			<option value="512000">--资阳市</option>

			<option value="513200">--阿坝藏族羌族自治州</option>

			<option value="513300">--甘孜藏族自治州</option>

			<option value="513400">--凉山彝族自治州</option>

			<option value="520000">贵州</option>

			<option value="520100">--贵阳市</option>

			<option value="520200">--六盘水市</option>

			<option value="520300">--遵义市</option>

			<option value="520400">--安顺市</option>

			<option value="520500">--毕节市</option>

			<option value="520600">--铜仁市</option>

			<option value="522300">--黔西南布依族苗族自治州</option>

			<option value="522600">--黔东南苗族侗族自治州</option>

			<option value="522700">--黔南布依族苗族自治州</option>

			<option value="530000">云南</option>

			<option value="530100">--昆明市</option>

			<option value="530300">--曲靖市</option>

			<option value="530400">--玉溪市</option>

			<option value="530500">--保山市</option>

			<option value="530600">--昭通市</option>

			<option value="530700">--丽江市</option>

			<option value="530800">--普洱市</option>

			<option value="530900">--临沧市</option>

			<option value="532300">--楚雄彝族自治州</option>

			<option value="532500">--红河哈尼族彝族自治州</option>

			<option value="532600">--文山壮族苗族自治州</option>

			<option value="532800">--西双版纳傣族自治州</option>

			<option value="532900">--大理白族自治州</option>

			<option value="533100">--德宏傣族景颇族自治州</option>

			<option value="533300">--怒江傈僳族自治州</option>

			<option value="533400">--迪庆藏族自治州</option>

			<option value="540000">西藏</option>

			<option value="540100">--拉萨市</option>

			<option value="540200">--日喀则市</option>

			<option value="540300">--昌都市</option>

			<option value="540400">--林芝市</option>

			<option value="540500">--山南市</option>

			<option value="540600">--那曲市</option>

			<option value="542500">--阿里地区</option>

			<option value="610000">陕西</option>

			<option value="610100">--西安市</option>

			<option value="610200">--铜川市</option>

			<option value="610300">--宝鸡市</option>

			<option value="610400">--咸阳市</option>

			<option value="610500">--渭南市</option>

			<option value="610600">--延安市</option>

			<option value="610700">--汉中市</option>

			<option value="610800">--榆林市</option>

			<option value="610900">--安康市</option>

			<option value="611000">--商洛市</option>

			<option value="620000">甘肃</option>

			<option value="620100">--兰州市</option>

			<option value="620300">--金昌市</option>

			<option value="620400">--白银市</option>

			<option value="620500">--天水市</option>

			<option value="620600">--武威市</option>

			<option value="620700">--张掖市</option>

			<option value="620800">--平凉市</option>

			<option value="620900">--酒泉市</option>

			<option value="621000">--庆阳市</option>

			<option value="621100">--定西市</option>

			<option value="621200">--陇南市</option>

			<option value="622900">--临夏回族自治州</option>

			<option value="623000">--甘南藏族自治州</option>

			<option value="630000">青海</option>

			<option value="630100">--西宁市</option>

			<option value="630200">--海东市</option>

			<option value="632200">--海北藏族自治州</option>

			<option value="632300">--黄南藏族自治州</option>

			<option value="632500">--海南藏族自治州</option>

			<option value="632600">--果洛藏族自治州</option>

			<option value="632700">--玉树藏族自治州</option>

			<option value="632800">--海西蒙古族藏族自治州</option>

			<option value="640000">宁夏</option>

			<option value="640100">--银川市</option>

			<option value="640200">--石嘴山市</option>

			<option value="640300">--吴忠市</option>

			<option value="640400">--固原市</option>

			<option value="640500">--中卫市</option>

			<option value="650000">新疆</option>

			<option value="650100">--乌鲁木齐市</option>

			<option value="650200">--克拉玛依市</option>

			<option value="650400">--吐鲁番市</option>

			<option value="650500">--哈密市</option>

			<option value="652300">--昌吉回族自治州</option>

			<option value="652700">--博尔塔拉蒙古自治州</option>

			<option value="652800">--巴音郭楞蒙古自治州</option>

			<option value="652900">--阿克苏地区</option>

			<option value="653000">--克孜勒苏柯尔克孜自治州</option>

			<option value="653100">--喀什地区</option>

			<option value="653200">--和田地区</option>

			<option value="654000">--伊犁哈萨克自治州</option>

			<option value="654200">--塔城地区</option>

			<option value="654300">--阿勒泰地区</option>

			</select>
			</div>
			</div>
			</div>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save()">确 定</el-button>
			<el-button @click="show = false">取 消</el-button>
		</div>
  </el-dialog>
</template>

<script>
	import {ajax} from '@/common/biConfig'
	import $ from 'jquery'

	export default {
	    data(){
			return {
				show:false
			}
		},
		mounted(){
			
		},
		computed: {
		},
		methods: {	
			
			save(){
				this.show = false;
				this.$parent.chartView();
				this.$parent.setUpdate();
			},
			
			open(chart){
				window.setTimeout(()=>this.chartcss(chart), 200);
				this.show = true;
			},
			chartcss(chart){
				let ts = this;
				$(".chartselect .selleft ul li").unbind("click").bind("click", function(){
					var cid = $(this).attr("cid");
					$(".chartselect .selleft ul li").removeClass("select");
					$(this).addClass("select");
					$(".chartselect .selright .one").css("display", "none");
					$("#schart" + cid).css("display", "block");
					
					//默认选图表
					//$(".chartselect .selright .one").css("border", "none");
					//$("#schart" + cid).css("border","1px solid #FF0000");
					let tp = $("#schart" + cid).attr("tp");
					chart.chartJson.type = tp;
				});
				//默认选中
				let tp = chart.chartJson.type;
				var cid = $(".chartselect .selleft li.select").attr("cid");
				$(".chartselect .selright .one").css("display", "none");
				$("#schart" + cid).css("display", "block");
				
			}
		},
		watch: {
		}
	}
</script>

<style lang="less" scoped>
.chartselect .selright .one{
	margin:10px;
	padding:10px;
	display:none;
	cursor:pointer;
	text-align:left;
}
.chartselect .selleft ul {
	margin:0px;
	padding:0px;
}
.chartselect .selleft ul li {
	margin:0px;
	padding:6px;
	background-color:#EEE;
	border-bottom:solid 1px #CCCCCC;
	cursor:pointer;
}
.chartselect .selleft ul li.select {
	background-color:#FFF;
}
</style>
