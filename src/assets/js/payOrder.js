/*
 * 获取下单参数
 */
import $ from './zepto';
import wxApi from './wxApi';
var getOrderParam = (vm) => {
	var param = {};
	var proListSource = vm.listProduct;
	var proList = [];
	var browser = vm.$browser;
	var openId = vm.$info.openId;
	var cusId = vm.$info.cusId;
	var actId = browser.getURLParameter("actComboId");
	var address = vm.defaultAddress;
	for(var i=0;i<proListSource.length;i++){
		proList.push({
			code: proListSource[i].productId,
	        name: proListSource[i].name,
	        num: proListSource[i].quantity,
	        price: proListSource[i].price,
	        specialPrice: actId?proListSource[i].price:0,
		});
	}
	param.addressId = address.id;
	if(vm.coupon1 && vm.coupon1.rule && vm.coupon1.giftRule){//优惠券校验参数和金额分摊参数
		var coupon = vm.coupon1;
		if(coupon.couponsId){
			param.couponId = coupon.couponsId;
		}
		param.activityParams = [{
			activityId:coupon.activityId,
			openId,
			cusId,
			orderContext:{
				proList:proList
			},
		}];
		if(coupon.giftRule){
			param.activityParams[0].orderResultContext = {
				giftMoney: coupon.giftRule.giftMoney,
			    giftPoint: coupon.giftRule.giftPoint,
			    giftProductInfo: coupon.giftRule.giftProductInfo
			};
		}
		param.expand = coupon.expand;
		param.productIds = [];
		var tplIds = [];
		var list1 = coupon.rule.productInfo;
		var list2 = coupon.rule.proGroupInfo;
		if(list1 && list1.length > 0){
			for(var i=0;i<list1.length;i++){
				tplIds.push(list1[i].code);
			}
		}
		if(list2 && list2.length > 0){
			for(var i=0;i<list2.length;i++){
				for(var j=0;j<list2[i].product.length;j++){
					tplIds.push(list2[i].product[j].code);
				}
			}
		}
		if(tplIds.length>0){
			for(var i=0;i<tplIds.length;i++){
				proListSource.forEach(function(elem){
					if(tplIds[i] == elem.productId){
						param.productIds.push(elem.productId);
					}
				});
			}
		}
	}
	if(vm.coupon2 && vm.coupon2.giftRule){//满赠券校验参数
		var coupon = vm.coupon2;
		if(coupon.couponsId){
			param.couponId = coupon.couponsId;
		}
		var activeItem = {
			activityId:coupon.activityId,
			openId,
			cusId,
			orderContext:{
				proList:proList
			},
		};
		if(coupon.giftRule){
			activeItem.orderResultContext = {
				giftMoney: coupon.giftRule.giftMoney,
			    giftPoint: coupon.giftRule.giftPoint,
			    giftProductInfo: coupon.giftRule.giftProductInfo
			};
		}
		if(param.activityParams){
			param.activityParams.push(activeItem);
		}else{
			param.activityParams = [activeItem];
		}
	}
	if(actId){//组合产品下单
		param.comboActivityId = actId;
		var activeItem = {
			activityId:actId,
			openId:openId,
			cusId,
			orderContext:{
				proList:proList
			},
			orderResultContext:{
				giftMoney: 0,
			    giftPoint: 0,
//								    giftProductInfo: null
			}
		};
		if(param.activityParams){
			param.activityParams.push(activeItem);
		}else{
			param.activityParams = [activeItem];
		}
	}
	var staffId = browser.getCookie('staffId');
	if(staffId){
		param.staffId = staffId;
	}
	var curShopCode = browser.getCookie('curShopCode');
	if(curShopCode){
		param.curShopCode = curShopCode;
	}
	var curShopCode = browser.getCookie('curShopCode');
	if(curShopCode){
		param.curShopCode = curShopCode;
	}
	param.customerId = cusId;
	param.customerOpenId = openId;
	param.referrerOpenId = browser.getURLParameter("refer_openId");
	var msg = vm.leaveMessage;
	param.buyerMemo = msg;
	
	var items = vm.listProduct;
	param.orderDetails = [];
	var productIds = [];
	var typeFlag = false;
	for (var i = 0; i < items.length; i++) {
		param.orderDetails.push({
			productId:items[i].productId,
			quantity:items[i].quantity
		});
		productIds.push(items[i].productId);
		if(items[i].productId == 58){
			param.orderSpActivityId = 2;
		}
		if(items[i].productTemplateId == 3){
			typeFlag = true;
		}
	}
	var secId = browser.getURLParameter("seckillId");
	if(secId){//秒杀单
		param.orderType = 5;
		param.buyNowId = secId;
		param.orderActivityId = secId;
	}
	if(typeFlag && (param.staffId || param.referrerOpenId)){//蜂暴行动订单
		param.orderType = 4;
	}
	var isPre = browser.getURLParameter("yfk");
	if(isPre){//预付款订单
		param.orderType = 6;
		param.orderActivityId = isPre;
	}

	if(actId){//套餐搭配
		param.orderType = 7;
		param.orderActivityId = actId;
	}
	var groupPurchaseId = browser.getURLParameter("groupPurchaseId");
	if(groupPurchaseId){//团购单
		param.orderType = 8;
		param.groupPurchaseId = groupPurchaseId;
		param.grouppurchaseCode = browser.getURLParameter("grouppurchaseCode");
		param.orderActivityId = groupPurchaseId;
	}
	var fqfh = browser.getURLParameter("fqfh");
	if(fqfh){//分期发货
		param.orderType = 9;
		param.orderActivityId = fqfh;
	}
	var isDaiGou = browser.getCookie("purchaseFlag");
	if(isDaiGou === 'yes'){//代购单
		param.isPurchaseOrder = 1;
		param.purchasePhone = vm.cusPhone;
	}else{
		param.isPurchaseOrder = 0;
	}
	var pId = browser.getURLParameter("productId");
	param.orderOrigin = pId?1:0;//是否直接从产品下单
	param.isWebOrder = vm.$info.wxBrowser?"0":1;//0-微信页单，1-网页单
	param.virtualMoney = Math.round(vm.virtualNum*100)/100;;
	if((param.productIds instanceof Array) && param.productIds.length === 0){
		param.productIds = productIds;
	}
	return {param,productIds};
}

export default function(vm) {
	var {param,productIds} = getOrderParam(vm);
	var isPre = vm.$browser.getURLParameter("yfk");
	vm.$loading.show();
	vm.isLocked = true;
	$.ajax({
		type:"post",
		url:"/wechat-shop-back/order",
		data:JSON.stringify(param),
		contentType:"application/json",
		success:function(data){
//			vm.$loading.hide();
			vm.isLocked = false;
			MtaH5 && MtaH5.clickStat('save_order',{'res':'success'});
			if(data.status == 0){
				setTimeout("saveShoppingCartTrack('payed')",0);
				var pId = vm.$browser.getURLParameter("productId");
				
				vm.$shopCart.removeProducts(productIds,pId);
				localStorage.removeItem('preData');
				var orderId = data.data.id;
				var orderCode = data.data.orderCode;
				if(vm.$info.wxBrowser){
					var billId = 'ec' + orderCode;
					if(isPre){
						billId = 'yf' + orderCode;
					}
					wxApi.payWx({
						billId,
						preSuccess:(data) => {
							var payState = data.payState;
							if(payState === 1){
								vm.$toast('此订单已付款');
							}else if(payState === 2){
								vm.$toast('此订单不存在');
							}else if(payState === 5){
								vm.$toast('拼团已结束，不能再付款了！');
							}
						},
						preError:() => {
							vm.$toast('网络或服务器异常，下单失败！');
						},
						paySuccess:() => {
							vm.$loading.show();
							setTimeout(() => {
								window.location.href = "orderList.html?_campaign=dingdanxiangqing#detailView!"+orderId;
							},2000);
						},
						payError:() => {
							window.location.href = "orderList.html?_campaign=dingdanxiangqing#detailView!"+orderId;
						},
						payCancel:() => {
							window.location.href = "orderList.html?_campaign=dingdanxiangqing#detailView!"+orderId;
						}
					});
				}else{
					var billId = 'wm' + orderCode;
					if(isPre){
						billId = 'wy' + orderCode;
					}
					wxApi.payH5(billId,vm);
				}
			}else{
				vm.$loading.hide();
				vm.$toast(data.msg);
			}
		},
		error:function(){
			MtaH5 && MtaH5.clickStat('save_order',{'res':'error'});
			vm.$toast("网络或服务器异常");
			vm.$loading.hide();
			vm.isLocked = false;
		}
	});
}

