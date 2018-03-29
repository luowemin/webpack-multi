require('@/assets/js/flexible.js')
import Vue from 'vue'
import App from './App'

import { initPageBase } from '@/assets/js/initPageBase'
import { configWxApi } from '@/assets/js/wxApi'

var {browser,info,toast,loading} = initPageBase(Vue,true);

if(info.wxBrowser){
	configWxApi();
	wx.ready(() => {
		wx.hideOptionMenu();
	});
}
function init(){
	var id = browser.getURLParameter("id");
	if(!id){
		toast('本页面不可用');
		loading.hide();
		return;
	}
	loading.show();
	$.ajax({
		type:"get",
		url:"/wechat-game-back/coupon/getTakeCouponSetting?tkcpSettingId="+id,
		success:function(data){
			loading.hide();
			var item = data.data;
			if(item){
				item.actImgUrl = item.actImgUrl || 'http://7xv1io.com1.z0.glb.clouddn.com/alt.jpg?imageView2/1/w/187/h/335';
				new Vue({
				  	el: '#app',
				  	data(){
				  		return {
				  			ticket:item
				  		}
				  	},
				  	components: { App }
				})
			}else{
				toast('优惠券无法领取');
			}
		},
		error:function(){
			loading.hide();
			toast('网络或服务器异常');
		}
	});
}
init();
