export default function(info){
	var storeKey = info.openId;
	if(info.cusId){
		storeKey = 'web_'+info.cusId;
	}
	var shopCartServer = {
		storeKey,
		buyNowKey:"buyProductNow",
		cartList:[],
		setData:function(value,key){
			var myKey = this.storeKey;
			if(key){
				myKey += key;
			}
			localStorage.setItem(myKey,JSON.stringify(value));
		},
		getData:function(key){
			var myKey = this.storeKey;
			if(key){
				myKey += key;
			}
			var value = localStorage.getItem(myKey);
			if(value){
				return JSON.parse(value);
			}else{
				return [];
			}
		},
		setBuyNow:function(value,key){
			var myKey = this.buyNowKey;
			if(key){
				myKey += key;
			}
			localStorage.setItem(myKey,JSON.stringify(value));
		},
		getBuyNow:function(key){
			var myKey = this.buyNowKey;
			if(key){
				myKey += key;
			}
			var data = localStorage.getItem(myKey);
			if(data){
				return JSON.parse(data);
			}else{
				return [];
			}
		},
		addCart:function(item,key){
			if(!key){
				var openId = info.openId;
				var cusId = info.cusId;
				$.ajax({
					type:"post",
					url:"/wechat-propagate-back/gwjAct/joinScPriGwj",
					data:{openId,cusId},
					dataType:'json',
					success:function(data){
						if(data.status === 0){
							var img = 'http://7xv1io.com1.z0.glb.clouddn.com/product/pop_purchase_activity.png';
							var style = 'position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0,0,0,0.6);z-index:10001;display: flex;display: -webkit-flex;display: -ms-flexbox;align-items: center;justify-content:center;';
							var divc = '<div onclick="this.parentNode.removeChild(this)" style="'+style+'"><img style="margin: 10px auto;max-height: 400px;" src="'+img+'"/><div>';
							$('body').append(divc);
						}
					}
				});
			}
			var list = this.getData(key);
			if(list && list.length>0){
				var flag = true;
				for(var i=0;i<list.length;i++){
					if(list[i].productId == item.productId){
						var num = item.quantity || 1;
						list[i].quantity = list[i].quantity + num;
						flag = false;
						break;
					}
				}
				if(flag){
					item.quantity = item.quantity || 1;
					item.isCheck = false;
					list.push(item);
				}
				this.setData(list,key);
			}else{
				item.quantity = item.quantity || 1;
				item.isCheck = false;
				list = [item];
				this.setData(list,key);
			}
			return true;
//			var item = {
//				productId:"",
//				productName:"",
//				quantity:0,
//				icon:"",
//				price:0
//			};
		},
		delCart:function(index,key){
			var list = this.getData(key);
			list.splice(index,1);
			this.setData(list,key);
		},
		modifyCart:function(index,type,key){
			var list = this.getData(key);
			var item = list[index];
			if(!item){
				console.error("index:"+index+" is out of size");
				return;
			}
			if(type == 1){
				item.quantity++;
			}else if(type == -1){
				item.quantity--;
			}
			this.setData(list,key);
		},
		getCheckedCart:function(key){
			var list = this.getData(key);
			var result = [];
			for(var i=0;i<list.length;i++){
				if(list[i].isCheck){
					result.push(list[i]);
				}
			}
			return result;
		},
		getCartCount:function(key){
			var list = this.getData(key);
			var count = 0;
			for(var i=0;i<list.length;i++){
				count += list[i].quantity;
			}
			return count;
		},
		getProductNum:function(pId,key){
			var list = this.getData(key);
			var count = 0;
			for (var i = 0; i < list.length; i++) {
				if(list[i].productId == pId){
					count = list[i].quantity;
					break;
				}
			}
			return count;
		},
		getCartList:function(key){
			return this.getData(key);
		},
		removeProducts:function(ids,isBuyNow,key){
			if(ids && ids.length==0) return;
			if(isBuyNow){
				key = this.buyNowKey + key;
			}
			var list = this.getData(key);
			var newList = [];
			if(list.length === 0) return;
			for (var i = 0; i < list.length; i++) {
				if(ids.indexOf(list[i].productId) === -1){
					newList.push(list[i]);
				}
			}
			this.setData(newList,key);
		}
	};
	return shopCartServer;
}
