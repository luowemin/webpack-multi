<template>
	<div id="app">
		<div class="banner-container">
			<div v-if="product.stock <= 0" class="banner-box"></div>
			<Slider :autoplay="5000">
				<SliderItem v-for="(image,index) in product.groupedImages.banner" :key="index">
					<img @click="preImg(image.imageUrl,product.groupedImages.banner)" class="sliderImage" :src="image.imageUrl" lazy alt=""/>
				</SliderItem>
			</Slider>
			<GroupStyle v-if="actType===8" :lastTime="groupLastTime" :listMember="groupMembers"/>
		</div>
		<TimerTick v-show="actType===1 || actType===2 || actType===3 || actType===4" 
			ref="timerTick" 
			@tickDone="tickDone" 
			:activity="activityTick" />
		<div class="box-info" style="padding: 10px 15px;">
		    <div class="product_name">
		    	{{product.productTemplateName}}
		    	<span class="integralStatus" v-if='product.integralStatus > 0'>送{{product.integralStatus>1?product.integralStatus+'倍':''}}积分</span>
		    </div>
		    <div v-show="actType===5 || actType===6 || actType===7" class="">
		    	<div>
		    		<span style="color: #BBBBBB;">预付款</span>
		    		<span style="color: #EB7B56;font-size: 22px;">￥{{product.prePrice}}</span>
		    		<span style="color: #585858;">总价￥{{product.price}}</span>
		    	</div>
		    	<div style="color: #BBBBBB;font-size: 14px;">尾款支付时间：{{preEndLabel}}</div>
		    </div>
		    <div v-show="actType===0">
			    <div class="sale_price">
			    	{{product.id===158?"会员价":""}}￥{{product.price}}
			    </div>
			    <div v-if="product.virtualPrice" class="or_price">售价：￥{{product.virtualPrice}}</div>
		    </div>
		    <div v-if="actType === 8" class="sale_price">￥{{product.groupPrice}}</div>
		    <ScrollText :text="scrollText"/>
		</div>
		<Groups v-if="actType===8" :listGroup="groupList" :groupNum="groupNum"/>
		<div v-if='tickets.length>0' @click="showTickets" class="internal_status box-info">
			<span>优惠</span>&nbsp;{{tickets[0].name}}
		</div>
		<div class="box-info">
		    <div style="position: relative;z-index: 1;">
		    	<div class="abs_line"></div>
		    	<div class="product_stock">
		    		<span v-if="product.transportFee==0">免运费</span><span>销量: {{product.sold}}</span><span>库存: {{product.stock<=9999?product.stock:"9999+"}}</span>
		    	</div>
		    </div>
		    <div v-if="product.productTags && product.productTags.length>0" class="feature clearfix">
		        <span v-for="productTag in product.productTags">{{productTag.tagName}}</span>
		    </div>
		    <div class="receiveTime">{{product.productDesc}}</div>
		</div>
		<div v-if='isDist' class="limit_price box-info">
	     	<span class="limit_name">{{distName}}</span>
	     	<span class="less_price">减￥{{distPrice}}</span>
	     	<span>{{distTime}}</span>
	    </div>
	    <div v-if="combo.actId" class="combo_container box-info" @click="moreCombo">
	    	<div class="combo_title">套餐搭配</div>
	    	<div class="combo_content">
	    		<div v-for="(item,i) in filterCombo(combo.combos)">
	    			<span v-if="i>0">+</span>
	    			<div class="combo_item">
	    				<div class="combo_img">
	    					<img :src="item.proImage?item.proImage:'http://7xv1io.com1.z0.glb.clouddn.com/product/image/img_default_product.png'"/>
	    				</div>
	    				<div class="combo_price">￥{{item.specialPrice}}</div>
	    			</div>
	    		</div>
	    	</div>
	    </div>
		<div class="comment-container box-info">
	    	<div class="comment-title">商品评价({{commentCount}})</div>
	        <CommentItem v-if="commentCount>0" :item="commentItem"/>
	        <div class="more-comments">
	        	<span @click="showComments">查看全部评价</span>
	        </div>
	    </div>
	    <div ref="navTab" class="nav-tab" :class="{'float-top':floatTab}">
	    	<div @click="navPage=1" class="nav-item" :class="{active:navPage===1}">
	    		<span>详情</span>
	    	</div>
	    	<div @click="navPage=2" class="nav-item" :class="{active:navPage===2}">
	    		<span>参数</span>
	    	</div>
	    </div>
	    <div v-show="floatTab" style="height: 43px;"></div>
	    <div class="nav-content">
	    	<div v-show="navPage===1" class="product-detail">
	    		<img class="pageImg" v-for="image in product.groupedImages.detail" v-lazy="imgFormat(image.imageUrl,'imageslim')" alt=""/>
	    		<Recommend :tplIds="[tplId]"/>
	    	</div>
	    	<div v-show="navPage===2" class="product-attr">
	    		<div v-for="productProp in product.productProperties" class="attr-line">
	    			<span class="attr-name">{{productProp.propName}}:</span>
	    			<span class="attr-value">{{productProp.propValue}}</span>
	    		</div>
	    	</div>
	    </div>
	    <div v-if="actType ===0 || actType ===4" class="bottom-cart">
			<div @click="goService" class="my-icon my-service">
				<span>首页</span>
			</div>
			<div @click="goCart" class="my-icon my-cart">
				<span v-show="cartTotal>0" class="my-cart-num">{{cartTotal>99?'99+':cartTotal}}</span>
				<span>购物车</span>
			</div>
			<div v-if="product.stock<=0" @click="notifySKU()" class="buy-now disabled" style="width: 60%;">到货提醒</div>
			<template v-else>
				<div v-if="product.isAddShoppingCart === 1" @click="addCart" class="add-cart">加入购物车</div>
				<div @click="buyNow" class="buy-now" 
					:class="{disabled:product.stock<=0}" 
					:style="{width:(product.isAddShoppingCart === 1)?'30%':'60%'}">立即购买
				</div>
			</template>
		</div>
		<div v-if="actType ===1 || actType ===2 || actType ===3" class="bottom-cart">
			<div @click="goService" class="my-icon my-service">
				<span>首页</span>
			</div>
			<div @click="buyNow" class="buy-now" style="width: 80%;" :class="{disabled:product.stock<=0 || actType===3}">
				{{product.stock<=0?'已抢完':secBtn}}
				<span v-show="actType ==1" style="font-size: 14px;">(预约人数：{{bespeakCount}})</span>
			</div>
		</div>
		<div v-if="actType ===5 || actType ===6 || actType ===7" class="bottom-cart">
			<div @click="goService" class="my-icon my-service">
				<span>首页</span>
			</div>
			<div class="yfk-label">{{preLabel}}</div>
			<div @click="buyNow" class="buy-now" :class="{disabled:product.stock<=0 || actType===5 || actType===7}">{{secBtn}}</div>
		</div>
		<div v-if="actType === 8" class="bottom-cart">
			<div @click="goService" class="my-icon my-service"><span>首页</span></div>
			<div @click="buyNow" class="group-btn single" :class="{disabled:product.stock<=0}">
				<div class="txt">￥{{product.price}}</div>
				<div class="sub-txt">单独买</div>
			</div>
			<div @click="buyNow(true)" class="buy-now group-btn" :class="{disabled:product.stock<=0}">
				<div class="txt">￥{{product.groupPrice}}</div>
				<div class="sub-txt">{{groupNum}}人团</div>
			</div>
		</div>
		<div v-if="showCode" class="quantity-bg">
			<div class="show_code">
				<img @click="showCode = false" class="close" src="http://7xv1io.com1.z0.glb.clouddn.com/product/image/close_fbxd.png"/>
				<div v-if="operationType === 2" class="group_code_bg">
					<img width="100%" src="http://img.wgmf.com/group/box_concern_group.png"/>
					<img class="code" :src="groupQRCode"/><!--http://img.wgmf.com/product/image/box_concern_group.png-->
				</div>
				<img v-else src="http://7xv1io.com1.z0.glb.clouddn.com/product/image/box_concern_notice.png"/>
			</div>
		</div>
		<ChooseSku :show="showSku" 
			:product="product" 
			:actType="actType" 
			:operationType="operationType"
			:groupObj="groupObj"
			@addCartNum="addCartNum"
			@closeSku="showSku = false"/>
	    <Tickets ref="tickets" :tickets="tickets"/>
		<Comment ref="comments" :tplId="tplId" />
		<Contact :product="product" />
		<Login ref="login"/><!-- @checkSuccess="checkSuccess"-->
		<div v-if="showTicket" class="coupon-bg" :style='ticketStyle' @click="showTicket=false">
			<img :src="ticketImg" />
		</div>
	</div>
</template>

<script>
	import Comment from './Comment'
	import CommentItem from './CommentItem'
	import TimerTick from './TimerTick'
	import Tickets from './Tickets'
	import ScrollText from './ScrollText'
	import Contact from '@/components/Contact'
	import ChooseSku from '@/components/ChooseSku'
	import Recommend from '@/components/Recommend'
	import Slider from '@/components/Slider'
	import SliderItem from '@/components/SliderItem'
	import $ from '@/assets/js/zepto'
	import coupon from '@/assets/js/coupon'
	import Login from '@/components/Login'
	import GroupStyle from './GroupStyle'
	import Groups from './Groups'
	import MessageBox from '@/assets/js/messageBox';
	var combos = [];
	
	export default {
		name: 'app',
		components: {
			Comment,
			CommentItem,
			Contact,
			Slider,
			SliderItem,
			Tickets,
			TimerTick,
			Recommend,
			ChooseSku,
			ScrollText,
			GroupStyle,
			Groups,
			Login
		},
		props:{
			tplId:{
				type:String,
				required:true
			},
		},
		data(){
			var cartTotal = this.$shopCart.getCartCount()
			return {
				product:{groupedImages:[]},
				commentItem:{},
				commentCount:0,
				actType:0,//0正常销售，1秒杀未开始，2秒杀进行中，3秒杀结束，4限时折扣，5预付款未开始，6预付款未进行中，7预付款已结束,8团购
				activityTick:{},
				floatTab:false,
				preEndLabel:'',
				tickets:[],
				combo:{},
				isDist:false,
				distPrice:0,
				distTime:'',
				distName:'',
				scrollText:'',
				navPage:1,
				cartTotal,
				bespeakCount:0,
				secBtn:'',
				groupNum:0,
				operationType:0,//0-加入购物车，1-立即购买，2-拼团购买
				showSku:false,
				showCode:false,
				ticketImg:'',
				showTicket:false,
				groupObj:{},//拼团id，ChooseSku组件参数
				groupGZWX:false,
				groupList:[],//参加拼团的数据列表
				groupMembers:[],//参加拼团的手机号列表
				groupLastTime:0,//拼团剩余时间
				groupQRCode:''//拼团如果需要关注二维码，显示专属二维码
			}
		},
		created(){
			this.getProductData();
			this._getCommentCount();
		},
		methods:{
//			checkSuccess(data){
//				if(data.codeType === 1){//登陆成功
//					location.reload();
//				}else{//微信号绑定成功
//					this.$browser.requestOauth();
//				}
//			},
			showComments(){
				this.$refs.comments.show();
			},
			showTickets(){
				this.$refs.tickets.show();
			},
			filterCombo(list){
				if(list.length <=3 ){
					return list;
				}else{
					return list.slice(0,3)
				}
			},
			moreCombo(){
				var str = JSON.stringify(combos);
				localStorage.setItem('combo_products',str);
				location.assign('productCombo.html?_campaign=chanpinzuhe');
			},
			goCart(){
				window.location.href = "myCart.html";
			},
			goService(){
				window.location.href = "productIndex.html";
			},
			addCart(){
				var info = this.$info;
				if(!info.cusId){
					if(info.wxBrowser){
						this.$refs.login.showBind();
					}else{
						this.$refs.login.showLogin();
					}
					return;
				}
				this.operationType = 0;
				this.showSku = true;
			},
			addCartNum(num){
				this.cartTotal += num;
			},
			buyNow(isGroupBuy){
				var info = this.$info;
				if(!info.cusId){
					if(info.wxBrowser){
						this.$refs.login.showBind();
					}else{
						this.$refs.login.showLogin();
					}
					return;
				}
				if(isGroupBuy === true){
					this.operationType = 2;
				}else{
					this.operationType = 1;
				}
				
				if(this.actType === 3){//TODO秒杀结束不做任何处理
					return;
				}
				if(this.actType === 5){
					this.$toast("预付款未开始");
					return;
				}
				if(this.actType === 7){
					this.$toast("预付款已结束");
					return;
				}
				var product = this.product;
				if(product.stock<=0){
					this.$toast("库存不足");
					return;
				}
				MtaH5 && MtaH5.clickStat('goumai');
				var vm = this;
				if(!this.$info.wxBrowser){
					if(this.actType ===1){
						vm.$toast('网页版暂不支持秒杀预约，请到微信公众号“五谷磨房”预约！');
						return
					}
					if(this.groupGZWX && isGroupBuy === true){
						vm.$toast("网页版暂不支持此拼团活动，请复制或分享链接到微信上参与此活动！");
						return;
					}
					this.showSku = true;
					return;
				}
				var openId = this.$info.openId;
				if(this.actType ===1){//TODO预约抢购前判断关注公众号
					this.$refs.login.checkCare((hasCare) => {
						if(hasCare){
							postData();
						}else{//提示关注公众号
							vm.showCode = true;
						}
					});
					var postData = function(){
						var tplId = vm.tplId;
						var buyNowId = vm.product.buyNow.id;
						$.ajax({
							type:"post",
							url:"/wechat-shop-back/buyNow/reserve",
							data:{buyNowId,userId:openId,productTemplateId:tplId},
							success:function(data){
								if(data.status === 0){
									vm.$toast("预约成功");
									vm.bespeakCount += 1;
								}else{
									vm.$toast(data.msg);
								}
							},
							error:function(){
								vm.$toast("网络或服务器异常");
							}
						});
					}
					return;
				}
				if(isGroupBuy === true){
					if(this.groupGZWX){
						this.$refs.login.checkCare((hasCare) => {
							if(hasCare){
								vm.showSku = true;
							}else{//提示关注公众号
								localStorage.setItem("formGroupProductId",vm.tplId);//设置标示位
								vm.showCode = true;
							}
						});
//						$.get('/wechat-propagate-back/user/subscribe?openId='+openId,function(data){
//			    			if(data.status !== 0){
//								//提示关注公众号
//								vm.showCode = true;
//							}else{
//								vm.showSku = true;
//							}
//			    		});
						return;
					}
				}
				this.showSku = true;
			},
			notifySKU:function(){//产品模板的到货提醒
				if(!this.$info.wxBrowser){
					this.$toast('网页版暂不支持预约到货提醒，请到微信公众号“五谷磨房”预约！');
					return;
				}
				var vm = this;
				this.$refs.login.checkCare((hasCare) => {
					if(hasCare){
						postData();
					}else{//提示关注公众号
						vm.showCode = true;
					}
				});
				var openId = this.$info.openId;
				var postData = function(){
					var tplId = vm.tplId;
					$.ajax({
						type:"post",
						url:"/wechat-shop-back/product/reserve",
						data:{openId:openId,productId:tplId},
						success:function(data){
							if(data.status == 0){
								vm.$toast("到货提醒预约成功");
							}else{
								vm.$toast(data.msg);
							}
						},
						error:function(){
							vm.$toast("网络或服务器异常");
						}
					});
				}
			},
			getPriceRange(arr){
				if(arr.length > 0){
					var max = Math.max.apply(Math,arr);
					var min = Math.min.apply(Math,arr);
					if(min === max){
						return min;
					}else{
    					return min+"~"+max;
					}
				}else{
					return "";
				}
			},
			scrollTab(){
				var nav = this.$refs.navTab;
				if(nav){
					var tabY = nav.offsetTop
					var vm = this;
					window.addEventListener('scroll',(e) => {
						var topY = $(window).scrollTop();
						vm.floatTab = topY > tabY;
					});
				}
			},
			getProductData(){
				var pId = this.tplId;
				var vm = this;
				$.ajax({
					url:"/wechat-shop-back/product/info/template/"+pId,
					success:(data) => {
						vm.$loading.hide();
						if(data.status === 0){
							var tpl = data.data;
							document.title = '五谷磨房'+tpl.productTemplateName;
							if(vm.$info.wxBrowser){
								vm.shareInfo(tpl);
							}
	    					var arr = [];
	    					tpl.products.forEach(function(item){//禁用的sku不显示
	    						if(item.enable === 0){
	    							arr.push(item);
	    						}
	    					});
	    					tpl.products = arr;
	    					vm.initActivity(tpl);
	    					var arrPrice = [];
	    					var prices = [];
	    					var pIds = [];
	    					tpl.sold = 0;
	    					tpl.stock = 0;
	    					arr.forEach(function(item){
	    						tpl.sold += item.sold || 0;
	    						if(item.stock > 0){
		    						tpl.stock += item.stock;
	    						}
	    						if(item.virtualPrice){
		    						arrPrice.push(item.virtualPrice);
	    						}
	    						prices.push(item.price);
	    						pIds.push(item.id);
	    					});
	    					vm._getComboData(pIds);
	    					
	    					
	    					tpl.virtualPrice = vm.getPriceRange(arrPrice);
	    					vm.activityTick.virtualPrice = tpl.virtualPrice;
	    					tpl.price = vm.getPriceRange(prices);
	    					vm.product = tpl;
	    					
	    					
							vm._getIntergral();
							setTimeout(() => {
								vm.scrollTab()
							},600);
						}else{
							MessageBox.alert({
								msg:data.msg,
								confirmText:'查看更多商品',
								todo(){
									location.assign('productIndex.html');
								}
							});
							wx.hideOptionMenu();
						}
					},
					error:(e) => {
						vm.$loading.hide();
						vm.$toast('网络或服务器异常');
					}
				})
			},
			initActivity(tpl){//活动初始化操作入口
				var vm = this;
				var distSchedule = tpl.productDiscountSchedule;
				var buyNow = tpl.buyNow;
				var presell = tpl.presell;
				
				if(distSchedule){//限时折扣
					vm.discountSchedule(distSchedule);
				}else if(buyNow){//秒杀
	    			vm.seckill(buyNow);
	    		}else if(presell){//预售
	    			vm.preSale(presell);
	    		}else if(tpl.groupPurchase && tpl.groupPurchase.length>0){//拼团
	    			var list = tpl.groupPurchase;
	    			for (var i=0;i<list.length;i++) {
	    				if(list[i].enable === 0){
	    					vm.groupBuy(list[i]);
	    					break;
	    				}
	    			}
	    		}else{
	    			vm.actType = 0;
	    			vm._checkCoupon();
	    		}
	    		if(tpl.divideDelivery){//分期发货可以享受优惠券
					vm.divideDelivery(tpl);
				}
//	    		console.log(vm.$dateFormat(Date.now(),'MM月dd日hh点mm分'))
	    		
			},
			getServerTime(call){//获取服务器时间
				$.ajax({
					type:"get",
					url:"/wechat-shop-back/preSell/info/getTime",
					dataType:'json',
					success:function(data){
						if(data.status === 0){
							call && call(data.data);
						}
					},
					error:function(){}
				});
			},
			discountSchedule:function(distSchedule){//限时折扣
	    		var self = this;
	    		var vm = this;
	    		vm.getServerTime((curTime) => {
	    			var curDate = Math.round(curTime/1000);
					var endTime = Math.round(distSchedule.endTime/1000);
					if(curDate < endTime){
						initDist(curDate,endTime);
					}
	    		});
				function initDist(curTime,endTime){
		    		var startTime = Math.round(distSchedule.startTime/1000);
		    		var maxPrice = 0;
		    		var p = [];
		    		var vp = [];
		    		distSchedule.productDiscountScheduleSkus.forEach(function(distSku){
		    			var lessPrice = distSku.originalPrice - distSku.discountPrice;
		    			p.push(distSku.discountPrice);
		    			vp.push(distSku.originalPrice);
		    			if(maxPrice < lessPrice){
		    				maxPrice = lessPrice;
		    			}
		    		});
					if(curTime < startTime){
						vm.isDist = true;
						vm.distTime = vm.$dateFormat(distSchedule.startTime,'MM月dd日hh点mm分开始') //mon+"月"+d+"日"+h+"点"+m+"分开始";
						vm.distName = distSchedule.name;
						//显示折扣价差距最大的
						vm.distPrice = Math.round(maxPrice*100)/100;
					}else if(curTime < endTime){
						//TODO 启动计时器
						vm.actType = 4;
						vm.activityTick.title = '距离结束仅剩';
						
						vm.activityTick.virtualPrice = vm.getPriceRange(vp);
						vm.activityTick.price = vm.getPriceRange(p);
						vm.secName = distSchedule.name;
						var storeTime = endTime - curTime;
						vm.$refs.timerTick.startTick(storeTime);
					}
				}
	    	},
	    	tickDone(){//计时器走完后的通知
	    		if(this.actType === 1){
	    			var buyNow = this.product.buyNow;
	    			if(buyNow){
	    				this.seckill(buyNow);
	    			}
	    		}else{
	    			location.reload();
	    		}
	    	},
	    	seckill:function(buyNow){//秒杀
	    		var vm = this;
				vm.bespeakCount = buyNow.bespeakCount || 0;
				vm.getServerTime((curTime) => {
	    			var curDate = Math.round(curTime/1000);
	    			initSeckill(curDate);
	    		});
	    		function initSeckill(curDate){
					var st = Math.round(buyNow.startTime/1000);
					var et = Math.round(buyNow.endTime/1000);
	    			
    				if(curDate < et && buyNow.buyNowSkus){
    					var lastNum = buyNow.upperLimit;
    					var canBuySec = true;
						if(lastNum > 500){
							canBuySec = Math.random() < 500/lastNum;
						}
    					vm.secName = buyNow.name;
    					vm.secNum = buyNow.quantity;
    					if(vm.product.products){
    						vm.product.products.forEach(function(item){
    							item.purchaseLimitQuantity = vm.secNum;
    						});
    					}
    					// TODO 设置sku秒杀价，启动计时器
    					var prices = []
    					buyNow.buyNowSkus.forEach(function(item){
    						vm.product.products.forEach(function(pro){
								if(item.productId == pro.id){
									pro.secPrice = item.buyNowPrice;
									pro.stock = lastNum;
								}
							});
    						prices.push(item.buyNowPrice);
    					});
    					vm.product.stock = lastNum;
    					var killPrice = vm.getPriceRange(prices);
    					vm.product.killPrice = killPrice;
    					vm.activityTick.price = killPrice;
    					var storeTime = 0;
    					if(curDate < st){
							vm.actType = 1;
							storeTime = st - curDate;
							vm.activityTick.title = '距离开始仅剩';
							vm.$refs.timerTick.startTick(storeTime);
    					}else if(curDate < et){
							vm.actType = 2;
							storeTime = et - curDate;
							vm.secBtn = '立刻抢购';
							vm.activityTick.title = '距离结束仅剩';
							vm.$refs.timerTick.startTick(storeTime);
    					}else{
    						location.reload(true);
    					}
    					
    				}
	    		}
	    	},
	    	preSale:function(preInfo){//预售
	    		var vm = this;
	    		vm.getServerTime((curTime) => {
	    			initPre(curTime);
	    		});
//	    		var me = this;
	    		function initPre(curDate){
	    			var preMoneys = preInfo.presellLines;
					if(preMoneys){
						var pm = [];
						var pdm = [];
						preMoneys.forEach(function(item){
							pm.push(item.presellMoney);
							pdm.push(item.presellProductMoney)
							vm.product.products.forEach(function(pro){
								if(item.productId == pro.id){
									pro.prePrice = item.presellMoney;
									pro.price = item.presellProductMoney;
								}
							});
						});
						vm.product.prePrice = vm.getPriceRange(pm);
						vm.product.price = vm.getPriceRange(pdm);
					}
					
					var getDateString = function(m,type){
						var d = new Date(m);
						if(type === 'f'){
							return d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate();
						}else{
							return (d.getMonth()+1)+'.'+d.getDate();
						}
					}
					vm.preStartLabel = getDateString(preInfo.frontMoneyStartTime,'f')+'~'+getDateString(preInfo.frontMoneyEndTime,'f');
					vm.preEndLabel = getDateString(preInfo.balancePaymentStartTime,'f')+'~'+getDateString(preInfo.balancePaymentEndTime,'f');
					if(curDate < preInfo.frontMoneyStartTime){
						vm.actType = 5;
						vm.preLabel = '定金开始时间:'+getDateString(preInfo.frontMoneyStartTime);
						vm.secBtn = "未开始";
					}else if(curDate < preInfo.frontMoneyEndTime){
						vm.actType = 6;
						vm.preLabel = '定金结束时间:'+getDateString(preInfo.frontMoneyEndTime);
						vm.secBtn = "预付定金";
					}else{
						vm.actType = 7;
						vm.preLabel = '定金结束时间:'+getDateString(preInfo.frontMoneyEndTime);
						vm.secBtn = "已结束";
					}
	    		}
	    	},
	    	groupBuy:function(groupData){//团购活动
	    		var vm = this;
	    		vm.groupObj.id = groupData.id;
	    		vm.groupGZWX = groupData.wxgzStatus === 1;
	    		var st = groupData.startTime;
	    		var et = groupData.endTime;
	    		
	    		vm.getServerTime((curTime) => {
	    			if(curTime >= st && curTime <= et){
	    				vm.groupLastTime = (et - curTime);
	    				initGroup();
	    			}
	    		});
	    		
	    		function initGroup(){
	    			vm.actType = 8;
	    			vm.groupNum = groupData.peopleLimit;
	    			vm.groupQRCode = groupData.qrCodeProduct;
	    			var limit = groupData.purchaseLimit;
	    			var p = groupData.groupPurchaseLines;
	//  			if(vm.product.products){
	//					vm.product.products.forEach(function(item){
	//						item.purchaseLimitQuantity = vm.secNum;
	//					});
	//				}
	    			if(p){
	    				var arr = [];
	    				p.forEach(function(item){
	    					arr.push(item.purchasePrice);
	    					vm.product.products.forEach(function(pro){
								if(item.productId == pro.id){
									pro.groupPrice = item.purchasePrice;//团员价
									pro.groupPrimaryPrice = item.primaryPurchasePrice;//团长价
									pro.groupLimit = limit;
								}
							});
	    				});
	    				vm.product.groupPrice = vm.getPriceRange(arr);
	    			}
	    			
	    			$.get("/wechat-shop-back/groupPurchase/productTemplate/"+groupData.id,function(data){
	    				if(data.status == 0){
	    					var g = data.data;
	    					vm.groupList = g.groupPurchasePrimaryList;
	    					vm.groupMembers = g.groupPurchasePhoneList;
	    				}
	    			});
	    		}
	    	},
	    	divideDelivery:function(tpl){//分期发货
	    		var divis = tpl.divideDelivery.divideDeliverySkus;
	    		var dId = tpl.divideDelivery.id;
	    		if(divis && divis.length > 0){
	    			divis.forEach(function(item){
	    				tpl.products.forEach(function(pro){
	    					if(item.productId === pro.id){
	    						pro.price = item.deliveryPrice;
	    						pro.fqfh = dId;
	    					}
	    				});
	    			});
	    		}
	    	},
			_getCommentCount:function(){//评论汇总数据
	    		var self = this;
	    		var pId = self.tplId;
	    		$.ajax({
	    			type:"get",
	    			url:"/wechat-shop-back/evaluation/listCount",
	    			data:{productTemplateId:pId},
	    			success:function(data){
	    				if(data.status ==0){
	    					self.commentItem = data.data.orderProductEvaluation;
	    					self.commentCount = data.data.count;
	    				}else{
	    					self.commentItem = {};
	    					self.commentCount = 0;
	    				}
	    			},
	    			error:function(){
	    				self.view.commentItem = {};
						self.view.commentCount = 0;
	    			}
	    		});
	    	},
	    	_getComboData:function(pIds){//组合产品推荐
	    		var vm = this;
	    		$.get('/promotion/online/package?proId='+pIds.join(','),function(data){
	    			if(data.msgCode === 0){
	    				var arr = data.resultInfo;
	    				if(arr && arr.length === 0) return;//没有组合产品不显示
	    				arr.forEach(function(item){
	    					var comboItem = {
	    						actId:item.activityId,
	    						combos:item.rule.productInfo
	    					};
	    					combos.push(comboItem);
	    				});
	    				vm.combo = combos[0];
	    			}
	    		});
	    	},
	    	_getIntergral:function(){//获取送积分倍数
	    		var vm = this;
	    		$.ajax({
	    			type:"get",
	    			url:"/wechat-shop-back/integral/integral/grade",
	    			dataType:'json',
	    			success:function(data){
	    				if(data.status ==0){
	    					var productGroupId = vm.product.productGroupId;
	    					var presell = vm.product.presell;
	    					if(productGroupId !== 36 && !presell){
	    						vm.product.integralStatus = data.data>0?data.data:1;
	    					}
	    				}
	    			}
	    		});
	    	},
	    	_checkCoupon(){//检测优惠券适用情况(微信页面用openid，网页判断cusid进行处理)
				var url;
				var info = this.$info;
    			if(info.wxBrowser){
    				url = "/promotion/online/vipActivity?openId="+info.openId;
    			}else if(info.cusId){
    				url = "/promotion/online/vipActivity?cusId="+info.cusId;
    			}else{
    				return;
    			}
	    		var pId = this.tplId;
	    		var vm = this;
	    		var isShareByApp = this.$browser.getURLParameter('_campaign');
	    		var pf = [228,276,8,164].indexOf(pId) > 0;// 指定产品发券
	    		var checkCoupon = function(){
	    			$.ajax({
	    				type:"get",
	    				dataType:'json',
	    				url:url,
	    				success:function(data){
			   				if(data.msgCode ==0){
			   					var list = data.resultInfo
			   					if(list && list.length>0){
			   						var ticket = coupon.getProductTicket(list,pId);
			   						if(ticket){
			   							vm.ticketImg = ticket.picUrl
			   							vm.showTicket = true
			   							vm.ticketStyle = {display:'flex'};
//			   							$(".coupon-bg img").attr("src",ticket.picUrl);
//										$(".coupon-bg").css("display","flex");
			   						}
			   						var n = vm.product;
			   						var products = n.products;
			   						var arr = [];
			   						products.forEach(function(sku){
										var item = {
											price:sku.price,
											skuName:sku.skuName,
											name:n.productTemplateName,
											stock:sku.stock,
											transportFee:sku.transportFee,
											productId:sku.id,
											productTemplateId:sku.productTemplateId,
											warehouseCode:n.warehouseCode,
											quantity:1,
											integralStatus:n.integralStatus
										};
										arr.push(item);
									});
									vm.tickets = coupon.getNoRepeatTickets(list,arr);
//									me._showTickets(param,'product');
//			   						me._showTickets(list,'tickets');
			   					}
			   				}
	    				},
	    				error:function(){
	    					
	    				}
	    			});
	    		};
	    		if(!info.wxBrowser && isShareByApp==='guanjia' && pf){// 从生意管家分享的指定产品需要先发券
	    			var param = {
						gameId:10,
						openId:info.openId,
						remark:74,
						remark2:"provideCoupon"
					};
	    			$("#loading").show();
					$.ajax({
						type:"post",
						url:"/wechat-game-back/game/classify/10",
						data:param,
						success:function(data){
							checkCoupon();
						},
						error:function(){
							$("#loading").hide();
						}
					});
	    		}else{
	    			checkCoupon();
	    		}
	    	},
			preImg:function(cur,urls){
				if(!this.$info.wxBrowser){
					return;
				}
				var imgs = [];
				var len = urls.length;
				for(var i=0;i<len ;i++){
					imgs.push(urls[i].imgUrl || urls[i].imageUrl);
				}
				wx.previewImage({
					current:cur,
					urls:imgs
				});
			},
			shareInfo(product){
		    	var info = this.$info;
		    	var browser = this.$browser;
		    	var domain = window.location.hostname;
		    	var param = "?pId="+product.id+"&_campaign=share-"+product.id+"&refer_openId="+info.openId;
		    	var staffId = browser.getURLParameter("staffID");
				if(staffId){
					param += "&staffID="+staffId;
				}
				var curShopCode = browser.getURLParameter('curShopCode');
				if(curShopCode){
					param += "&curShopCode="+curShopCode;
				}
			    var url = "http://" + domain + "/shop-web/shop/productDetail.html"+param;
			    var share = product.productWeshare;
			    var title = share && share.title;
			    var desc = share && share.content;
			    var imgUrl = product.groupedImages.icon && product.groupedImages.icon[0].imageUrl;
			    imgUrl = imgUrl || "http://7xv1io.com1.z0.glb.clouddn.com/product/image/shareLogo.jpg";
			    // TODO 调用微信分享接口改链接
			    // 设置"发送给朋友"参数
			    wx.onMenuShareAppMessage({
			        // 朋友标题
			        title: title,
			        // 分享描述
			        desc: desc,
			        // 链接
			        link: url,
			        // 朋友图标
			        imgUrl: imgUrl,
			        success:function(){
			        	MtaH5 && MtaH5.clickStat('share',{tag:'app'});
			        }
			    });
			
			    // 设置"发送给朋友圈"参数
			    wx.onMenuShareTimeline({
			        // 朋友圈标题
			        title: title + desc,
			        // 链接
			        link: url,
			        // 朋友圈图标
			        imgUrl: imgUrl,
			        success:function(){
			        	MtaH5 && MtaH5.clickStat('share',{tag:'time_line'});
			        }
			    });
		    }
		},
	}
</script>