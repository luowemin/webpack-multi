require('@/assets/js/flexible.js')
import Vue from 'vue'
import App from './App'
import { initPageBase } from '@/assets/js/initPageBase'
import $ from '@/assets/js/zepto'
var { browser,loading,toast } = initPageBase(Vue)

Vue.config.productionTip = false
/* eslint-disable no-new */

function initPage(){
	
}
var combo = {
	init(){
		var pIds = browser.getURLParameter("pIds");
		if(pIds){
			this._getData(pIds);
		}else{
			var str = localStorage.getItem('combo_products');
			var list = JSON.parse(str);
			this._completeData(list);
		}
	},
	_getData(pIds){
		var me = this;
		$.get('/promotion/online/package?proId='+pIds,function(data){
			if(data.msgCode === 0){
				var arr = data.resultInfo;
				if(arr && arr.length === 0){
					loading.hide();
					return;//没有组合产品不显示
				}
				var combos = [];
				arr.forEach(function(item){
					var comboItem = {
						actId:item.activityId,
						combos:item.rule.productInfo.slice(0,3)
					};
					combos.push(comboItem);
				});
				me._completeData(combos);
			}else{
				toast.show(data.msg);
			}
		});
	},
	_completeData:function(list){//完善数据
			var me = this;
			var pIds = [];
			var combos = list.map(function(combo){
				// TODO 最大值最小值，初始化产品 数量
				combo.combos.map(function(item){
					var num = item.num;
					pIds.push({
						productId:item.code
					});
					if(num.indexOf('+')>-1){
						item.min = item.quantity = num.replace('+','');
						item.max = 100;
					}else if(num.indexOf('-')>-1){
						var arr = num.split('-');
						item.min = item.quantity = arr[0];
						item.max = Math.min(arr[1],100);
					}else{
						item.min = num;
						item.max = num;
						item.quantity = num;
					}
					return item;
				});
				return combo;
			});
			$.ajax({
   				type:"post",
   				url:"/wechat-shop-back/product/info/list",
   				data:JSON.stringify(pIds),
   				contentType:"application/json",
   				success:function(data){
   					if(data.status == 0){
   						var proList = data.data;
   						combos.forEach(function(combo){
   							combo.combos.map(function(item){
   								var code = item.code;
   								for(var i=0;i<proList.length;i++){
   									var pro = proList[i].product;
   									if(code == pro.id){
   										var tpl = proList[i].productTemplate
   										var groupImages = tpl.groupedImages;
											var icon = groupImages.icon && groupImages.icon[0] && groupImages.icon[0].imageUrl;
   										item.proImage = icon?icon:'http://7xv1io.com1.z0.glb.clouddn.com/product/image/img_default_product.png';
   										item.wareHouseCode = tpl.warehouseCode;
   										item.templateId = tpl.id;
   										item.skuName = pro.skuName;
   										item.max = Math.min(item.max,pro.stock);
   										item.stock = pro.stock;
   										break;
   									}
   								}
   								return item;
   							});
   						});
   						me._initView(combos);
   					}else{
   						toast.show("系统维护中");
   					}
   					loading.hide();
   				},
   				error:function(){
   					loading.hide();
   					toast.show("网络或服务器异常");
   				}
   			});
		},
		_initView(list){
			new Vue({
			  el: '#app',
			  data(){
			  	return {
			  		list
			  	}
			  },
			  template: '<App :list="list"/>',
			  components: { App }
			})
		}
};
combo.init();