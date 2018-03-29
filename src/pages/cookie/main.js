import '@/assets/css/normalize.css'
import $ from '@/assets/js/zepto'
import cookieUtil from '@/assets/js/browserUtil'
require('@/assets/js/flexible.js')

$(".wrap").on("click","button",function(){
	var type = $(this).data("type").split("-");
	var name = type[0];
	var oper = type[1];
	if(name == "key"){
		var key = $("#key").val();
		var value = $("#value").val();
		if(!key){
			alert("请输入key");
			return;
		}
		if(oper == "set"){
			cookieUtil.setCookie(key, value);
			var val = cookieUtil.getCookie(key);
			var html = "设置"+key+"成功"+"<br>当前"+key+"="+val;
			$("#keyInfo").html(html);
		}else if(oper == "del"){
			cookieUtil.removeCookie(key);
			$("#keyInfo").text("清除"+key+"成功");
		}else{
			var cookie = cookieUtil.getCookie(key);
			if(cookie){
				$("#keyInfo").text(key+"="+cookie);
			}else{
				$("#keyInfo").text("cookie中没有"+key);
			}
		}
		return;
	}
	var val = $("#"+name).val();
	if(oper == "set"){
		cookieUtil.setCookie(name, val);
		var val = cookieUtil.getCookie(name);
		var html = "设置"+name+"成功"+"<br>当前"+name+"="+val;
		$("#"+name+"-label").html(html);
	}else if(oper == "del"){
		cookieUtil.removeCookie(name);
		$("#"+name+"-label").text("清除"+name+"成功");
		$('#'+name).val('');
	}else if(oper == "get"){
		var cookie = cookieUtil.getCookie(name);
		if(cookie){
			$("#"+name+"-label").text(cookie);
		}else{
			$("#"+name+"-label").text("cookie中没有"+name);
		}
	}
});
var docEl = document.documentElement;
var clientWidth = docEl.getBoundingClientRect();
console.log(clientWidth)
