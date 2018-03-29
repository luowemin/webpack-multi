import MessageBox from '@/assets/js/messageBox';

let getMsg = (data,flag) => {
	var msg = '';
	if(flag){//优惠券领取页面
		if(data.status === 0){
			msg= "恭喜你，领券成功，赶快去使用吧！";
		}else if(data.status === 10011){
			var q = location.search;
			if(q.indexOf('type=off')>-1){
				msg = "抱歉，您已领取过，不能再领了！";
			}else{
				msg = "抱歉，您已领取过，不能再领了！去逛逛商城吧，更多惊喜等着你哟！";
			}
		}else{
			msg = "抱歉，领取失败("+data.msg+")！去逛逛商城吧，更多惊喜等着你哟！";
		}
	}else{//首页领取
		if(data.status === 0){
			msg = '领取成功！';
		}else if(data.status === 10011){
			msg = '抱歉，每人限领'+userCopAmount+'张，您不能再领了！';
		}else{
			msg = data.msg;
		}
	}
	return msg;
}

let getTicket = (item,vm,type) => {
	var userCopAmount = item.userCopAmount;
	var staffId = vm.$browser.getURLParameter('staffID');
	var openId = vm.$info.openId;
	var cusId = vm.$info.cusId;
	var param = {
		tkcpSettingId:item.id,
		cusId,
		openId,
		remark:staffId
	};
	
	var postTicket = () => {
		vm.$loading.show();
		$.ajax({
			type:"post",
			url:"/wechat-game-back/coupon/takeCoupon",
			data:param,
			success:function(data){
				vm.$loading.hide();
				var flag = item.hasOwnProperty('tolink');
				var msg = getMsg(data,flag);
				MessageBox.alert({
					msg,
					todo(){
						if(flag){
							var tolink = item.tolink;
							tolink = tolink || "../shop/productIndex.html"
							var q = location.search;
							if(q.indexOf('type=off')>-1){
								location.assign("cardTicket.html");
							}else{
								location.assign(tolink);
							}
						}
					}
				});
			},
			error:function(){
				vm.$toast('网络或服务器异常');
				vm.$loading.hide();
			}
		});
	}
	if(item.needPoints>0){
		MessageBox.confirm({
			msg:'领一张券需扣您'+item.needPoints+'积分，您确定要领吗？',
			todo(){
				if(type === 'h5'){
					postTicket();
				}else{
					vm.$refs.login.checkBind((hasBind) => {
						if(hasBind){
							postTicket();
						}
					});
				}
			}
		});
	}else{
		postTicket();
	}
}

export default (item,vm) => {
	var info = vm.$info;	
	if(info.wxBrowser){
		if(info.cusId){
			getTicket(item,vm,'wx');
		}else{
			//提示用户绑定手机号
			vm.$refs.login.showBind();
		}
	}else{
		if(info.cusId){
			getTicket(item,vm,'h5');
		}else{
			//提示用户登陆
			vm.$refs.login.showLogin();
		}
	}
}