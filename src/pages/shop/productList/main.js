import Vue from 'vue'
import App from './App'

import '@/assets/css/normalize.css'
import './style.css'
require('@/assets/js/flexible.js')

import { initPageBase } from '@/assets/js/initPageBase'
import filter from '@/assets/js/filter'
import shopCart from '@/assets/js/shopCartServer.js'
import $ from '@/assets/js/zepto.js'
import { configWxApi } from '@/assets/js/wxApi'
import Lazyload from 'vue-lazyload';

Vue.use(Lazyload,{
  preLoad: 1.3,
  error: 'http://7xv1io.com1.z0.glb.clouddn.com/product/image/img_default_product.png',
  loading: 'http://7xv1io.com1.z0.glb.clouddn.com/product/image/img_default_product.png',
});

var {toast,loading,info,browser} = initPageBase(Vue,true);
browser.appendCartTrack(info);
Vue.prototype.$shopCart = shopCart(info);

Vue.config.productionTip = false

/* eslint-disable no-new */
var _getData = function(){
	$.ajax({
		type:"get",
		url:"/wechat-shop-back/product/list/template/1",
		success:function(data){
			if(data.status == 0){
				var list = data.data.productTemplate;
				var arr = [];
				list = list.filter(function(item){
					return item.productGroupId !== 36
				});
				for(var i=0;i<list.length;i++){
					arr.push(list[i].productGroupId);
					var arrPrice = [];
					var stock = 0;
					var sold = 0;
					var arrp = [];
					list[i].products.forEach(function(item){
						if(item.enable === 0){
							arrp.push(item);
						}
					});
					
					arrp.forEach(function(elem){
						arrPrice.push(elem.price);
						if(elem.stock>0){
							stock += elem.stock;
						}
						if(elem.sold>0){
							sold += elem.sold;
						}
					});
					list[i].products = arrp;
					list[i].stock = stock;
					list[i].sold = sold;
					
					var min = Math.min.apply(Math,arrPrice);
					var max = Math.max.apply(Math,arrPrice);
					list[i].minPrice = min;
					if(min === max){
						list[i].price = min;
					}else{
						list[i].price = min+"~"+max;
					}
				}
				var typeArr = data.data.productGroup.filter(function(item){
					if(arr.indexOf(item.id) != -1){
						return true;
					}else{
						return false;
					}
				});
				typeArr.splice(0,0,{id:-1,groupName:"全部产品"});
				new Vue({
					el: '#app',
					data(){
						return {
							typeArr,
							list
						}
					},
					template: '<App :productList="list" :productType="typeArr"/>',
					components: { App }
				})
			}else{
				toast.show(data.msg);
			}
			loading.hide();
		},
		error:function(){
			loading.hide();
			toast.show("网络或服务器异常");
		}
	});
}
if(info.wxBrowser){
	configWxApi();
	browser.refreshCusId(info.openId);
	wx.ready(function(){
		var domain = window.location.hostname;
	    var url = "http://" + domain + "/shop-web/shop/productList.html?refer_openId="+info.openId+"&_campaign=share_fenleiye";
	    var title = "五谷磨房商品分类";
	    var desc = "查看五谷磨房全部商品";
	    var imgUrl = "http://7xv1io.com1.z0.glb.clouddn.com/product/image/shareLogo.jpg";
	    wx.onMenuShareAppMessage({
	        // 朋友标题
	        title: title,
	        // 分享描述
	        desc: desc,
	        // 链接
	        link: url,
	        // 朋友图标
	        imgUrl: imgUrl,
	    });
	
	    // 设置"发送给朋友圈"参数
	    wx.onMenuShareTimeline({
	        // 朋友圈标题
	        title: title + desc,
	        // 链接
	        link: url,
	        // 朋友圈图标
	        imgUrl: imgUrl,
	    });
	});
}
_getData();

  
