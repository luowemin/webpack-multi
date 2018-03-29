export default {
	filterList(list,products){
		var self = this;
		if(!list || list.length === 0) return;
		var ticketList1 = [];
		var ticketList2 = [];
		for (var i = 0; i < list.length; i++) {
			if(self.filter(list[i],products)){
				if(list[i].giftRule.giftProductInfo){
					ticketList2.push(list[i]);
				}else{
					ticketList1.push(list[i]);
				}
			}
		}
		var compare = function(a,b,gm){//gm(是否加权赠送金额排序)
			var pri1 = a && a.priority || 0;
			var pri2 = b && b.priority || 0;
			if(gm){
				pri1 = pri1 * 1000000 + (a.giftRule.giftMoney || 0) * 100000 + a.activityId;
				pri2 = pri2 * 1000000 + (b.giftRule.giftMoney || 0) * 100000 + b.activityId;
			}else{
				pri1 = pri1 * 1000000 + a.activityId;
				pri2 = pri2 * 1000000 + b.activityId;
			}
			if(pri1 === pri2){// TODO 按结束时间排序
				var at = a.validTime;
				var bt = b.validTime;
				at = at?new Date(at.replace(/-/g,'/')):new Date('1990/1/1');
				bt = bt?new Date(bt.replace(/-/g,'/')):new Date('1990/1/1');
				return at.getTime() > bt.getTime();
			}else{
				return pri1 < pri2;
			}
		}
		var len = ticketList1.length;
		if(len > 0){
			for(var i=0;i<len;i++){
				for(var j=i+1;j<len;j++){
					if(compare(ticketList1[i],ticketList1[j],true)){
						var temp = ticketList1[i];
						ticketList1[i] = ticketList1[j];
						ticketList1[j] = temp;
					}
				}
			}
		}
		var len = ticketList2.length;
		if(len > 0){
			for(var i=0;i<len;i++){
				for(var j=i+1;j<len;j++){
					if(compare(ticketList2[i],ticketList2[j])){
						var temp = ticketList2[i];
						ticketList2[i] = ticketList2[j];
						ticketList2[j] = temp;
					}
				}
			}
		}
		return {ticketList1,ticketList2};
	},
	getProductTicket(list,pId){
		var ticket = null;
		for (var i = 0; i < list.length; i++) {
			var rule = list[i].rule;
			var info = rule.productInfo;
			if(info){
				for (var k = 0,len = info.length; k < len; k++) {
					var code = info[k].templateId || info[k].code;
					if(code == pId && list[i].picUrl){
						ticket = list[i];
						break;
					}
				}
			}
			var group = rule.proGroupInfo;
			if(group){
				for (var k = 0,len = group.length; k < len; k++) {
					var products = group[k].product;
					for(var m=0;m<products.length;m++){
						var code = products[m].templateId || products[m].code;
						if(code == pId && list[i].picUrl){
							ticket = list[i];
//							$(".coupon-bg img").attr("src",list[i].picUrl);
//							$(".coupon-bg").css("display","flex");
							break;
						}
					}
				}
			}
		}
		return ticket;
	},
	filter:function(coupon,products,moneyFlag){
		var rule = coupon.rule;
		var flag1 = false;
		var flag2 = false;
		var flag3 = false;
		if(rule.productInfo){//产品列表
			var rulesCount = 0;
			var len = rule.productInfo.length;
			for (var j = 0; j < len; j++) {
				var isOk = false;
				for(var k=0;k<products.length;k++){
					if(rule.productInfo[j].code == products[k].productId){
//						if(moneyFlag){
//							flag1 = true;//不考虑数量
//						}else{
//						}
						var num = rule.productInfo[j].num;
						var quantity = products[k].quantity;
						if(num.indexOf('+')>-1){
							isOk = (quantity >= num.replace('+',''));
						}else if(num.indexOf(',')>-1){
							isOk = (num.split(',').indexOf(quantity) > -1);
						}else if(num.indexOf('-')>-1){
							isOk = (quantity >= num.split('-')[0] && quantity <= num.split('-')[1]);
						}else{
							isOk = (num == quantity);
						}
					}
				}
				if(isOk){
					rulesCount ++;
				}
			}
			flag1 = (len === rulesCount);
		}else{
			flag1 = true;
		}
		if(rule.proGroupInfo){//产品组
			for(var j=0;j<rule.proGroupInfo.length;j++){
				var num = rule.proGroupInfo[j].num;
				var quantity = 0;
				var proList = rule.proGroupInfo[j].product;
				for(var k=0;k<proList.length;k++){
					for(var m=0;m<products.length;m++){
						if(proList[k].code == products[m].productId){
							quantity += parseInt(products[m].quantity);
						}
					}
				}
				if(num.indexOf('+')>-1){
					flag2 = (quantity >= num.replace('+',''));
				}else if(num.indexOf(',')>-1){
					flag2 = (num.split(',').indexOf(quantity) > -1);
				}else if(num.indexOf('-')>-1){
					flag2 = (quantity >= num.split('-')[0] && quantity <= num.split('-')[1]);
				}else{
					flag2 = (num == quantity);
				}
//				if(quantity>0 && moneyFlag){
//					flag2 = true;
//				}else{
//				}
			}
		}else{
			flag2 = true;
		}
		var money = rule.money;
		var total = 0;
		var codeArr = [];
		for(var i=0;i<products.length;i++){
			total += products[i].quantity * products[i].price;
			codeArr.push(products[i].warehouseCode);
		}
		flag3 = moneyFlag || (total >= money);
		// TODO 对于满赠券：产品中有一个仓库编码和赠品相同才可使用这张满赠券
		var flag4 = true;
		var giftProduct = coupon && coupon.giftRule && coupon.giftRule.giftProductInfo && coupon.giftRule.giftProductInfo[0];
		if(giftProduct){
			flag4 = codeArr.indexOf(giftProduct.wareHouseCode) > -1;
		}
		return flag1 && flag2 && flag3 && flag4;
	},
	getNoRepeatTickets:function(tickets,products){//获取可用的优惠券
		if(!tickets || tickets.length === 0) return null;
		var self = this;
		var ticketList = [];
		var actArr = [];
		var tlen = tickets.length;
		var compareByTime = function(a,b){
			var at = a.validTime;
			var bt = b.validTime;
			at = at?new Date(at.replace(/-/g,'/')):new Date('1990/1/1');
			bt = bt?new Date(bt.replace(/-/g,'/')):new Date('1990/1/1');
			return at.getTime() > bt.getTime();
		};
		for(var i=0;i<tlen;i++){
			for(var j=i+1;j<tlen;j++){
				if(compareByTime(tickets[i],tickets[j])){
					var temp = tickets[i];
					tickets[i] = tickets[j];
					tickets[j] = temp;
				}
			}
		}
		for (var i = 0; i < tickets.length; i++) {
			if(actArr.indexOf(tickets[i].activityId) === -1){//TODO activeId相同的券只取一张（去重）
				actArr.push(tickets[i].activityId);
				if(self.filter(tickets[i],products,true)){
					ticketList.push(tickets[i]);
				}
			}
		}
		
		var len = ticketList.length;
		if(len > 0){//排序
			var compare = function(a,b){
				var pri1 = a && a.priority || 1;
				var pri2 = b && b.priority || 1;
				pri1 = pri1 * 1000000 + a.activityId;
				pri2 = pri2 * 1000000 + b.activityId;
				if(pri1 === pri2){// TODO 按结束时间排序
					var at = a.validTime;
					var bt = b.validTime;
					at = at?new Date(at.replace(/-/g,'/')):new Date('1990/1/1');
					bt = bt?new Date(bt.replace(/-/g,'/')):new Date('1990/1/1');
					return at.getTime() > bt.getTime();
				}else{
					return pri1 < pri2;
				}
			}
			for(var i=0;i<len;i++){
				for(var j=i+1;j<len;j++){
					if(compare(ticketList[i],ticketList[j])){
						var temp = ticketList[i];
						ticketList[i] = ticketList[j];
						ticketList[j] = temp;
					}
				}
			}
		}
		return ticketList;
	},
	getMinMaxTicket:function(tickets,products){
		var self = this;
		var ticketList = [];
		var arr = [];
		for (var i=0;i<tickets.length;i++) {
			if(arr.indexOf(tickets[i].activityId)){
				arr.push(tickets[i].activityId);
				if(self.filter(tickets[i],products,true)){
					ticketList.push(tickets[i]);
				}
			}
		}
		var len = ticketList.length;
		if(len===0){
			return null;
		}else{
			var compare = function(a,b){
				var p1 = (a && a.rule && a.rule.money) || 0;
				var p2 = (b && b.rule && b.rule.money) || 0;
				return p1 > p2;
			}
			for(var i=0;i<len;i++){//按照使用规则的价格由低到高排序
				for(var j=i+1;j<len;j++){
					if(compare(ticketList[i],ticketList[j])){
						var temp = ticketList[i];
						ticketList[i] = ticketList[j];
						ticketList[j] = temp;
					}
				}
			}
			var total = 0;
			for(var i=0;i<products.length;i++){
				total += products[i].quantity * products[i].price;
			}
			var result = {};
			if(total < ticketList[0].rule.money){
				result.max = ticketList[0];
			}else if(total >= ticketList[len-1].rule.money){
				result.min = ticketList[len-1];
			}else{
				for(var i=0;i<len-1;i++){
					if(ticketList[i].rule.money <= total && total < ticketList[i+1].rule.money){
						result.min = ticketList[i];
						result.max = ticketList[i+1];
					}
				}
			}
			return result;
		}
	}
};