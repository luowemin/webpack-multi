import '@/assets/css/normalize.css'
require('@/assets/js/flexible.js')
//import './style.css'
import Vue from 'vue'
import App from './App'

import { initPageBase } from '@/assets/js/initPageBase'
import { configWxApi } from '@/assets/js/wxApi'
import Login from '@/components/Login';

var L = Vue.extend(Login);
var login = new L({
	el: document.createElement('div'),
	propsData:{
		onCloseBack:true
	}
});
document.body.appendChild(login.$el);

var {browser,info,toast,loading} = initPageBase(Vue,true);

if(info.wxBrowser){
	configWxApi();
	wx.ready(() => {
		wx.hideOptionMenu();
	});
}
if(!info.cusId){
	loading.hide();
	if(info.wxBrowser){
		login.showBind();
	}else{
		login.showLogin();
	}
}else{
	new Vue({
		el: '#app',
		template: '<App/>',
		components: {
			App
		}
	})
}
