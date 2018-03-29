<template>
	<div id="app">
		<div class="pro_types">
			<div class="pro_types_scroller">
				<span v-for="item in productType" :class="{active:curType==item.id}" @click="setType(item.id)">{{item.groupName}}</span>
			</div>
			<div class="pro_types_more" :class="{active:showMore}" @click="showMore=!showMore">更多</div>
		</div>
		<div class="sort_types">
			<span :class="{active_up:(sortType===1&&sortUp),active_down:(sortType===1&&!sortUp)}" @click="setSort(1)">销量</span>
			<span :class="{active_up:(sortType===2&&sortUp),active_down:(sortType===2&&!sortUp)}" @click="setSort(2)">价格</span>
			<span :class="{active_up:(sortType===3&&sortUp),active_down:(sortType===3&&!sortUp)}" @click="setSort(3)">评价</span>
		</div>
		<div v-show="showMore" transition="slide" class="layer" @click="showMore=false;">
			<div class="container">
				<div v-for="item in productType" class="type_name" :class="{active:curType==item.id}" @click="setType(item.id)">{{item.groupName}}</div>
			</div>
		</div>
		<div class="pro_container">
			<div v-for="item in byType(productList)" class="pro_item">
				<div class="pro_item_bg">
					<div @click="goDetail(item.id)">
						<div class="img">
							<div v-if="isNotSale(item.products)" class="box-layer"></div>
							<img v-lazy="getIcon(item.groupedImages)" alt="">
						</div>
						<div class="pro_name">{{item.productTemplateName | formatText}}</div>
					</div>
					<div class="pro_price" :class="{hasCart:item.isAddShoppingCart === 1}" @click="addCart(item)">
						<!---->
						￥{{item.price}}
						<div class="pro_slod">销量：{{item.sold}}</div>
					</div>
				</div>
			</div>
		</div>
		<ChooseSku :show="showSku" 
			:product="product" 
			:operationType="0"
			@addCartNum="addCartNum"
			@closeSku="showSku = false"/>
		<Footer :activeIndex="1" :cartTotal="cartTotal"/>
		<Contact />
		<Login ref="login" @checkSuccess="checkSuccess"/>
	</div>
</template>

<script>
	import ChooseSku from '@/components/ChooseSku';
	import Footer from '@/components/Footer';
	import Contact from '@/components/Contact';
	import Login from '@/components/Login';
	import $ from '@/assets/js/zepto';
	export default {
		name: 'app',
		props:{
			productList:{
				type:Array
			},
			productType:Array
		},
		components: {
			Footer,
			Contact,
			Login,
			ChooseSku
		},
		data() {
			var cartTotal = this.$shopCart.getCartCount();
			return {
				curType: -1,
				showMore: false,
				showQuantity: false,
				product: {},
				curSKU: {},
				cartTotal,
				quantity: 1,
				skuPrice: '',
				sortType: 0, //0-默认权重排序,1-按销量排序,2-按最小价格,3-按评论数量
				sortUp: true,
				showSku:false,
			}
		},
		created() {
		},
		filters: {
			currency: function(val) {
				if(val) {
					return "￥" + val.toFixed(1);
				} else {
					return '-';
				}
			},
			formatText: function(val) {
				if(val.length <= 15) {
					return val;
				} else {
					return val.substr(0, 15) + "...";
				}
			}
		},
		computed: {
			canMinus: function() {
				var num = this.quantity;
				if(num <= 1) {
					return false;
				} else {
					return true;
				}
			},
			canAddq: function() {
				var groupId = this.product.productGroupId;
				var stock = this.curSKU.stock;
				var limit = this.curSKU.purchaseLimitQuantity || 100;
				stock = Math.min(stock, limit);

				var sId = this.curSKU.id;
				var cartNum = shopCartServer.getProductNum(sId);
				var num = this.quantity;
				if((cartNum + num) >= stock) {
					return false;
				} else {
					return true;
				}
			}
		},
		watch: {
			product: function(n, o) {
				var list = n.products;
				if(list.length === 1 && list[0].stock > 0) {
					this.curSKU = list[0];
				} else {
					this.curSKU = {};
				}
			}
		},
		methods: {
			checkSuccess(data){
				if(data.codeType === 1){//登陆成功
					var cusId = data.resultInfo && data.resultInfo.customerId
					this.$browser.setCookie('customerId',cusId);
					location.reload();
				}else{//微信号绑定成功
					this.$browser.requestOauth();
				}
			},
			addCartNum(num){
				console.log(num)
				this.cartTotal += num;
			},
			closeQ: function() {
				this.showQuantity = false
				this.quantity = 1;
			},
//			goPage: function(link) {
//				if(link.indexOf("productDetail.html") > -1) {
//					var ref = this.$browser.getURLParameter("refer_openId");
//					if(ref) link += "&refer_openId=" + ref;
//					var webStatParam = location.search.substr(1);
//					if(webStatParam) {
//						link += "&" + webStatParam;
//					}
//				}
//				location.assign(link);
//			},
			goDetail: function(id) {
				var link = 'productDetail.html?pId=' + id;
				var webStatParam = location.search.substr(1);
				if(webStatParam) {
					link += "&" + webStatParam;
				}
				location.assign(link);
			},
			getIcon: function(images) {
				if(images && images.sort) {
					return images.sort[0].imageUrl;
				} else {
					return ''; //images.icon[0].imageUrl;
				}
			},
			isNotSale: function(products) {
				if(products) {
					var stock = 0;
					products.forEach(function(item) {
						if(item.stock > 0 && item.enable === 0) {
							stock += item.stock;
						}
					});
					return stock <= 0;
				} else {
					return true;
				}
			},
			setType: function(id) {
				this.curType = id;
				this.showMore = false;
				this.sortType = 0;
				this.sortUp = true;
			},
			addCart: function(item) {
				if(item.isAddShoppingCart === 1) {
					var info = this.$info;
					if(info.cusId){
						this.product = item;
						this.showSku = true;
					}else{
						if(info.wxBrowser){
							this.$refs.login.showBind();
						}else{
							this.$refs.login.showLogin();
						}
					}
					
				}
			},
//			canAddCart: function(item) {
//				if(item.id === 320) {
//					return false;
//				}
//				if(item.productGroupId === 36 || item.productGroupId === 30) {
//					return false;
//				}
//				return true;
//			},
//			setSKU: function(sku) {
//				if(sku.stock <= 0) {
//					me.$toast("库存不足");
//					return;
//				}
//				this.quantity = 1;
//				this.curSKU = sku;
//			},
			setSort: function(type) {
				if(this.sortType === type) {
					this.sortUp = !this.sortUp;
				} else {
					this.sortType = type;
					this.sortUp = type === 2?true:false;
				}
			},
//			addNum: function() {
//				if(!this.curSKU.id) {
//					me.$toast("请选择产品规格");
//					return;
//				}
//				if(!this.canAddq) {
//					return;
//				}
//				this.quantity++;
//			},
//			minusNum: function() {
//				if(!this.curSKU.id) {
//					me.$toast("请选择产品规格");
//					return;
//				}
//				if(!this.canMinus) {
//					return;
//				}
//				this.quantity--;
//			},
//			quantityOk: function() {
//				if(!this.curSKU.id) {
//					me.$toast("请选择产品规格");
//					return;
//				}
//				this.showQuantity = false;
//				if(this.quantity === 0) {
//					return;
//				}
//				var product = this.product;
//				var sku = this.curSKU;
//				var param = {};
//				param.icon = product.groupedImages.icon && product.groupedImages.icon[0].imageUrl;
//				param.price = sku.price;
//				param.skuName = sku.skuName;
//				param.name = product.productTemplateName;
//				param.stock = sku.stock;
//				param.transportFee = sku.transportFee;
//				param.productId = sku.id;
//				param.productTemplateId = sku.productTemplateId;
//				param.warehouseCode = product.warehouseCode;
//				param.quantity = this.quantity;
//				var flag = shopCartServer.addCart(param);
//				if(flag) {
//					this.cartTotal = this.cartTotal + this.quantity;
//				}
//				this.quantity = 1;
//			},
			byType: function(list) {
				var type = this.curType;
				var arr = list.filter(function(item) {
					return type == -1 || type == item.productGroupId;
				});
 				var attrs = ['displayPriority', 'sold', 'minPrice', 'commentCount'];
 				var a = attrs[this.sortType];
				var up = this.sortUp;
				for(var i = 0; i < arr.length - 1; i++) {
					for(var j = i + 1; j < arr.length; j++) {
						if(arr[i][a] < arr[j][a]) {
							var temp = arr[i];
							arr[i] = arr[j];
							arr[j] = temp;
						}
					}
				}
				if(up && this.sortType !== 0) {
					arr.reverse();
				}
				return arr;
			},
		}
	}
</script>
