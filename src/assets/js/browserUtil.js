import $ from '@/assets/js/zepto'
export default {
	intervalTime:7*24*60*60*1000,
	refreshTick:10*60*1000,
	getURLParameter:function(name,search){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var search = search || window.location.search.substr(1);
	    var r = search.match(reg);
	    if(r){
	    	return  decodeURI(r[2]);
	    }
	    return null;
	},
	getCookie:function(name){
		var value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
		return decodeURI(value ? value.pop() : '');
	},
	setCookie:function(name,value,days){
		var expires = "";
		if(days){
			var exdate = new Date();
			exdate.setTime(exdate.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = ";expires=" + exdate.toUTCString();
		}
		var domain = ";path=/";
		document.cookie = name+ "=" +encodeURI(value) + expires + domain;
		var domain1 = ";domain="+location.host+";path=/";
		document.cookie = name+ "=" +encodeURI(value) + expires + domain1;
	},
	removeCookie:function(name){
		this.setCookie(name, "", -1);
	},
	appendMtaH5:function(sid,cid){
		var _mtac = {};
		var mta = document.createElement("script");
		mta.src = "http://pingjs.qq.com/h5/stats.js?v2.0.4";
		mta.setAttribute("name", "MTAH5");
		mta.setAttribute("sid", sid || "500151725");
		mta.setAttribute("cid", cid || "500437616");
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(mta, s);
	},
	reportError:function(){//错误信息上报
		var img = new Image();
		window.addEventListener('error',function(e){
			console.log(e);
			var errorInfo = e.message+":<br>at "+e.filename+" "+e.lineno+" line";
			var domain = location.host;
			if(domain === "wx.wgmf.com"){
				img.src = "http://wx.wgmf.com/logServer/sendMessage/web?topicId=23&stactinfo="+errorInfo;
			}else{
				img.src = "http://test.wgmf.com/logServer/sendMessage/web?topicId=23&stactinfo="+errorInfo;
			}
		},false);//捕获阶段监听资源加载错误设为true
	},
	appendDebugger:function(){
		var df = this.getCookie('.debugger.');
		if(df === 'init'){
			var mta = document.createElement("script");
			mta.src = "http://7xv1io.com1.z0.glb.clouddn.com/js/lib/vconsole.min.js";
			document.body.appendChild(mta);
		}
	},
	appendCartTrack:function(info){
		var openId = info.openId;
		var cusId = info.cusId;
		if(!info.wxBrowser && !cusId){
			return;
		}
		var s = document.createElement('script');
		var host = location.hostname;
		if(host !== 'wx.wgmf.com'){
			host = 'test.wgmf.com';
		}
		s.src = 'http://'+host+'/wechat-shop-track/shoppingCartTrack/script?openId='+openId+'&cusId=web_'+cusId;
		document.body.appendChild(s);
	},
	requestOauth:function(redirect){
		// 没输入就取当前网页地址
		var redirectUrl = !redirect ? window.location.href : redirect;
		// TODO 协议修改成https
		var protocol = "http://";
		var domain = window.location.hostname;
		localStorage.setItem('lastOauth',Date.now());
		var url = protocol + domain + "/wechat-service/oauth2/build?redirect=" + encodeURIComponent(redirectUrl);
		window.location.href = url;
	},
	refreshCusId(openId){//每10分钟清理一遍cookie中cusid防止客户更换手机号后openid与cusid的对应不正确
		var browser = this;
		var lastRefreshTime = localStorage.getItem("lastRefreshTime");
		var tick = this.refreshTick;
		if(!lastRefreshTime || Date.now() - lastRefreshTime > tick ){
			$.get("/app/information/getCustomerInfo?openId="+openId,function(data){
				localStorage.setItem("lastRefreshTime",Date.now());
				if(data.msgCode == 0){
					var cusId = data.resultInfo && data.resultInfo.customerId;
					if(cusId){
						browser.setCookie("customerId",cusId);
					}else{
						browser.removeCookie("customerId");
					}
				}else{
					browser.removeCookie("customerId");
				}
			})
		}
	},
	initPage(init,forceOauth){//WeixinJSBridge
		var ua = window.navigator.userAgent.toLowerCase();
		var openId = this.getCookie('openId');
		var cusId = this.getCookie('customerId');
		var wxBrowser = true;
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {
	    	var lastOauth = localStorage.getItem('lastOauth') || 0;
	    	var curTime = Date.now();
	    	var oauthFlag = curTime - lastOauth > this.intervalTime;
	    	if(forceOauth && oauthFlag){//强制授权同步cusid信息
    			this.requestOauth();
	    	}else if(!openId && !cusId){//openId与cusId都没有时授权获取
    			this.requestOauth();
	    	}
	    }else{
	    	wxBrowser = false;
	    }
	    if(typeof init === 'function'){
	    	init({openId,cusId,wxBrowser});
	    }
	}
}