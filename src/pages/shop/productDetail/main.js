import '@/assets/css/normalize.css'
import './style.css'
require('@/assets/js/flexible.js')
import Vue from 'vue'
import App from './App'

import Lazyload from 'vue-lazyload';
import filter from '@/assets/js/filter'
import shopCart from '@/assets/js/shopCartServer.js'
import { initPageBase } from '@/assets/js/initPageBase'
import { configWxApi } from '@/assets/js/wxApi'

Vue.use(Lazyload, {
	preLoad: 1.3,
	error: 'http://7xv1io.com1.z0.glb.clouddn.com/alt.jpg?imageView2/1/w/300/h/150',
	loading: 'http://7xv1io.com1.z0.glb.clouddn.com/alt.jpg?imageView2/1/w/300/h/150',
});
var { browser,info,toast } = initPageBase(Vue,true);
Vue.prototype.$shopCart = shopCart(info);
browser.appendCartTrack(info);


Vue.config.productionTip = false
Vue.config.devtools = true;
/* eslint-disable no-new */
var defaultUrl = "http://7xv1io.com1.z0.glb.clouddn.com/alt.jpg";
var product = {
	init() {
		var pId = browser.getURLParameter('pId');
		var form = browser.getURLParameter('form');
		if(form === "groupProduct"){
			pId = localStorage.getItem("formGroupProductId");
		}
		if(!pId || pId == "null" || isNaN(pId)){
			toast("请带上产品id访问本页面");
			return;
		}
		this._initParam();
		this.initGlobal();
		this.initView(pId);
	},
	initGlobal(){
		Vue.prototype.imgFormat = (url,format) => {
			if(url && url.indexOf("http") > -1) {
				return url + "?" + format;
			} else {
				return defaultUrl + "?" + format;
			}
		};
		Vue.prototype.$dateFormat = filter.dateFormat;
		Vue.filter("dateFormat",filter.dateFormat);
	},
	_initParam:function(){
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
			browser.setCookie('purchaseFlag',purchaseFlag,0.2);
		}
	},
	initView(pId){
		new Vue({
			el: '#app',
			data:{
				tplId:pId
			},
			template: '<App :tplId="tplId"/>',
			components: {
				App
			}
		})
	}
}
if(info.wxBrowser){
	configWxApi();
	wx.ready(() => {
		product.init()
	});
	browser.refreshCusId(info.openId);
}else{
	product.init()
}
