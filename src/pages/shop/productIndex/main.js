import '@/assets/css/normalize.css'
require('@/assets/js/flexible.js')
import Vue from 'vue'
import App from './App'

import Lazyload from 'vue-lazyload';
import shopCart from '@/assets/js/shopCartServer.js'
import { initPageBase } from '@/assets/js/initPageBase'
import { configWxApi } from '@/assets/js/wxApi'

Vue.use(Lazyload,{
  preLoad: 1.3,
  error: 'http://7xv1io.com1.z0.glb.clouddn.com/alt.jpg?imageView2/1/w/300/h/150',
  loading: 'http://7xv1io.com1.z0.glb.clouddn.com/alt.jpg?imageView2/1/w/300/h/150',
});
var {browser,info} = initPageBase(Vue,true);
Vue.prototype.$shopCart = shopCart(info);

Vue.config.productionTip = false
/* eslint-disable no-new */
if(info.wxBrowser){
	configWxApi();
	browser.refreshCusId(info.openId);
	wx.ready(() => {
		var domain = window.location.hostname;
    var url = "http://" + domain + "/shop-web/shop/productIndex.html?refer_openId="+info.openId+"&_campaign=share_shouye";
    var title = "五谷磨房会员商城";
    var desc = "五谷磨房原料基地应季尖货，限量抢购哦！";
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
init();

function init(){//营养顾问提成数据
	var staffId = browser.getURLParameter("staffID");
	if(staffId){
		browser.setCookie("staffId",staffId,1);
	}
	var curShopCode = browser.getURLParameter('curShopCode');
	if(curShopCode){
		browser.setCookie('curShopCode',curShopCode,1);
	}
	var purchaseFlag = browser.getURLParameter('purchaseFlag');
	if(purchaseFlag){
		browser.setCookie('purchaseFlag',purchaseFlag,1);
	}
	new Vue({
	  el: '#app',
	  template: '<App/>',
	  components: { App }
	})
}