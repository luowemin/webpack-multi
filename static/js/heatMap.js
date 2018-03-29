;(function(){
	function Map() {
		this.keys = new Array();
		this.values= new Array();
		//添加键值对
		this.set = function (key, value) {
			if (this.values[key] == null) {//如键不存在则值为【键】数组添加键名
				this.keys.push(value);
			}
			this.values[key] = value;//给键赋值
		};
		//获取键对应的值
		this.get = function (key) {
			return this.values[key];
		};
		//去除键值，(去除键数据中的键名及对应的值)
		this.remove = function (key) {
			this.keys.remove(key);
			this.values[key] = null;
		};
		//判断键值元素是否为空
		this.isEmpty = function () {
			return this.keys.length == 0;
		};
		//获取键值元素大小
		this.size = function () {
			return this.keys.length;
		};
	}
		
		 
//		var pMap = {
//			'76':'5aaa03200d2d0'
//		}
//		调用函数：
//		
		var t=new Map();
		t.set('76','5aaa03200d2d0');
		t.set('144','5aaa02f9a5741'); 
		t.set('24','5aaa02e6e39c3'); 
		t.set('26','5aaa02d48ebae'); 
		t.set('22','5aaa029f113e1'); 
		t.set('28','5aaa029293d2b'); 
		t.set('66','5aaa0283174b4'); 
		t.set('192','5aaa026f4b044'); 
		t.set('54','5aaa025c01c71'); 
		t.set('36','5aaa024a55d16'); 
		t.set('68','5aaa023aefb79'); 
		t.set('354','5aaa02280bd7d'); 
		t.set('64','5aaa0204d23b4'); 
		t.set('166','5aaa01f02acbf'); 
		t.set('244','5aaa01de3e796'); 
		t.set('406','5aaa01cb294b2'); 
		t.set('431','5aaa01ba2e4f0'); 
		t.set('432','5aaa01a43f213'); 
		t.set('34','5aaa018da46ee'); 
		t.set('53','5aaa00bb0a3fd'); 
		t.set('40','5aaa0165f3838'); 
		t.set('38','5aaa0082ce580'); 
		t.set('42','5aaa006859f49'); 
		t.set('50','5aaa0053c0279'); 
		t.set('48','5aaa004288213'); 
		t.set('44','5aaa0022a836b'); 
		t.set('46','5aaa0011d7165'); 
		t.set('112','5aa9ffffeecdc'); 
		t.set('32','5aa9ffedc0ac2'); 
		t.set('56','5aa9ffd5d85bd'); 
		t.set('530','5aa9ffc7ce6cc'); 
		t.set('392','5aa9ffba60b44'); 
		t.set('322','5aa9ff9fa5239'); 
		t.set('370','5aa9ff8dbe94d'); 
		t.set('320','5aa9ff6eeb8b7'); 
		t.set('164','5aa9ff606f27f'); 
		t.set('146','5aa9ff33e0b9c'); 
		t.set('454','5aa88b5bd88f5'); 
		//添加
		function GetQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
			var r = window.location.search.substr(1).match(reg); 
			if (r!=null) return (r[2]); return null;
		}
		var sname = GetQueryString("pId");
		if(sname!=null){ 
			var pId = decodeURIComponent(sname);
		}
		var hid=t.get(pId); //取得键值对相应的值
		if (hid) {
			(function(hid){
				var _mtac = {};
				var mta = document.createElement("script");
				mta.src = "//pingjs.qq.com/h5/hotclick.js?v2.0";
				mta.setAttribute("name", "mtah5hotclick");
				mta.setAttribute("sid", "500151725");
				mta.setAttribute("cid", hid);
				var s = document.getElementsByTagName("script")[0];
				s.parentNode.insertBefore(mta, s);
			})()			
		}
})(window)
