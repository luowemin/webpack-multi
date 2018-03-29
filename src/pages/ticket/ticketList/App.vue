<template>
	<div class="bg">
		<div class="ticket-header" >
			<div class="type_item" :class="{active:type==1}" @click="type=1">未使用<span></span></div>
			<div class="type_item" :class="{active:type==2}" @click="type=2">已使用<span></span></div>
			<div class="type_item" :class="{active:type==3}" @click="type=3">已过期</div>
			<span class="active-line" :style="{left:avtiveLine()}"></span>
		</div>
		<div style="height: 80px;"></div>
		<div>
			<div v-if="filter(shopTickets).length == 0" class="noTicket" style="color:#999;">
				<img style="width:6rem" src="http://7xv1io.com1.z0.glb.clouddn.com/memberXb-icon_no_ticket.png"/>
				<br/>您没有优惠券哦
			</div>
			<div v-else>
				<div v-for="item in filter(shopTickets)" class="ticketBox xianShang" :class="classObj(item)">
					<header>
						<div class="left eps">{{item.name}}</div>
						<div class="right"><a @click="goShop(item)" class="use">{{useText(item.codeStatus)}}</a></div>
					</header>
					<div class="box">
						<div class="p1">{{item.content}}</div>
						<p class="p2">有效期:</p>
						<div>{{item.startTime}}至{{item.validTime || item.endTime}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bottom_btn" @click="showCode = true">使用兑换码兑换优惠券</div>
		<div v-show="showCode" class="mask_layer">
			<div class="active_ticket">
				<div class="title">优惠券兑换</div>
				<div class="input">
					<input type="text" class="input-style" placeholder="请输入兑换码" v-model="code" />
				</div>
				<div class="label">
					<div>1.成功兑换优惠券后，便可在有效期内使用优惠券</div>
					<div>2.一个兑换码只能兑换一次</div>
				</div>
				<div class="btn">
					<span style="border-right: 1px solid #DCDCDC;" @click="showCode=false">取消</span>
					<span @click="activeCode">确定</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import $ from '@/assets/js/zepto'
	import MessageBox from '@/assets/js/messageBox';
	export default {
		name:'app',
		data(){
			return {
				type:1,
				shopTickets:[],
				showCode:false,
				code:""
			}
		},
		created(){
			this.getTickets();
			var code = this.$browser.getURLParameter('code');
			if(code && code !== 'null'){
				this.code = code;
				this.showCode = true;
			}
		},
		methods:{
			getTickets(){
				var vm = this;
				var openid = this.$info.openId;
				var cusid = this.$info.cusId;
				$.ajax({
					type:"get",
					url:"/base-data-service/act/getSpecialAct",
					data:{channelType:1,openid,cusid},
					success:function(data){
						vm.$loading.hide();
						vm.shopTickets = data.reverse();
					},
					error:function(){
						vm.$loading.hide();
						vm.$toast("服务器维护中");
					}
				});
			},
			useText(type){
				if(type == 1){
					return "已过期";
				}else if(type == 2 || type == 4){
					return "已使用";
				}else if(type == 3){
					return "使用";
				}
			},
			classObj:function(item){
				var code = item.codeStatus;
				var isStart = true;
				var startTime = item.startTime;
				if(startTime){
					var st = new Date(startTime.replace(/-/g,'/')).getTime();
					if(st > Date.now()){
						isStart = false;
					}
				}
				return {pastDue:code !==3 || !isStart};
			},
			avtiveLine:function(){
				var type = this.type;
				if(type == 1){
					return "5%";
				}else if(type == 2){
					return "38.333%";
				}else{
					return "71.666%"
				}
			},
			filter:function(list){
				var type = this.type;
				return list.filter(function(item){
					if(type == 1){
						return item.codeStatus == 3;
					}if(type == 2){
						return item.codeStatus == 2 || item.codeStatus == 4;
					}if(type == 3){
						return item.codeStatus == 1;
					}
				});
			},
			goShop:function(item){
				if(item.codeStatus == 3){
					if(item.buyLink){
						location.assign(item.buyLink);
					}else{
						location.assign('../shop/productIndex.html');
					}
				}
			},
			activeCode:function(){
				// TODO 调用发券接口
				var vm = this;
				var code = this.code;
				if(!code){
					vm.$toast('请输入兑换码');
					return;
				}
				vm.$loading.show();
				var openId = vm.$info.openId;
				$.ajax({
					type:"get",
					url:"/wechat-shop-back/redeem/redeemCode",
					data:{redeemCode:code,openId:openId},
					success:function(data){
						vm.$loading.hide();
						if(data.status == 0){
							MessageBox.confirm({
								msg:'兑换成功',
								todo(){
									location.reload(true);
								}
							});
						}else{
							vm.$toast(data.msg);
						}
					},
					error:function(){
						vm.$loading.hide();
						vm.$toast('网络或服务器异常');
					}
				});
				this.showCode = false;
			}
		}
	}
</script>

<style>
	html{min-height:100%; }
 	body{padding-bottom:6rem;position:relative;min-height:100%;font-size:1.4rem;color:#333333; text-align:center; background: #F3F3F5;}
 	.eps{display:block;white-space:nowrap;word-break:keep-all;overflow:hidden;text-overflow:ellipsis;}
 	.ticketBox{position:relative;margin:0 1rem 2rem;background:#fff;border:1px solid #E0E4E5;border-top:none;border-radius:9px;}
	.ticketBox header{border-top-left-radius:9px;border-top-right-radius:9px;height:5.5rem;font-weight:bold;display:-webkit-box;padding:0 0.5rem;background:url(http://img.wgmf.com/ticket/img4.png) repeat-x left center;background-size:1rem 5.5rem;}
	.ticketBox .left{-webkit-box-flex:1;color:#fff;font-size:1.8rem;line-height:5.5rem;font-weight:bold;text-align:left;padding-right:0.5rem;}
	.ticketBox .right{padding:1rem 1rem 0 0;}
	.ticketBox .right b{color:#fff;}
	.ticketBox .right .use{display:block;border:1px solid #fff;margin-top:0.5rem;padding:0.5rem 1rem;background:;border-radius:4px;color:#fff;}
	.ticketBox .right b{font-size:1.6rem;}
	.ticketBox .box{padding:1rem;font-size:1.4rem;text-align:left;}
	.ticketBox .p2{font-weight:bold;color:#323232;}
	.ticketBox .box p{line-height:2rem;}
	.ticketBox .p1{color:#989898;}
	.ticketBox.xianShang header{background:url(http://img.wgmf.com/ticket/img3.png) repeat-x left center;background-size:1rem 5.5rem;}
	.ticketBox.pastDue header,.ticketBox.hasUsed header{background:url(http://img.wgmf.com/ticket/img5.png) repeat-x left center;background-size:1rem 5.5rem;}
	.ticketBox.pastDue .p2 .pl,.ticketBox.hasUsed .p2 .pl{color:#989898;}
	.noTicket{margin:7rem auto;width:50%;}
	.noTicket img{padding-bottom:2rem;}
	.bottom_btn{
		bottom: 0;
		position: fixed;
		height: 5rem;
		line-height: 5rem;
		text-align: center;
		background: #FF461D;
		color: white;
		width: 100%;
		font-size: 18px;
		font-weight:bold ;
	}
	.ticket-header{position:fixed;background:#fff;margin-bottom:2rem;overflow: auto;width: 100%;z-index: 10;}
	.ticket-header .type_item{
		width: 33.3333%;
		float: left;
		height: 5rem;
		line-height: 5rem;
		font-size: 1.6rem;
		position: relative;
	}
	.ticket-header .type_item.active{color: #FFBB0A;}
	.ticket-header .type_item span{
		position: absolute;top: 1.5rem;bottom: 1.5rem;border-right: 1px solid #ECECEF;width: 0;right: 0;padding: 0;
	}
	.ticket-header .active-line{
		position: absolute;
		border-bottom: 0.4rem solid #FFBB0A;
		width: 23.33%;bottom: 0;left: 5%;
		transition: 0.3s;
	}
	.mask_layer{
		position: fixed;
		top: 0;bottom: 0;
		left: 0;right: 0;
		background: rgba(0,0,0,0.6);
		z-index: 30;
	}
	
	.active_ticket{
		background: white;
		border-radius: 0.5rem;
		width: 26rem;
		margin: -12rem 0 0 -13rem;
		position: absolute;
		top: 50%;left: 50%;
	}
	.active_ticket .title{
		text-align: center;
		font-size: 1.8rem;
		font-weight: bold;
		padding: 1.5rem 0;
	}
	.active_ticket .input{
		height: 5rem;
		padding: 0 1.5rem;
	}
	.active_ticket .input-style{
		height: 100%;
		width: 100%;
		line-height: 5rem;
		border: 1px solid #DCDCDC;
		border-radius: 0.5rem;
		box-sizing: border-box;
		padding: 0 1.5rem;
	}
	.active_ticket .label{
		text-align: left;
		font-size: 1.4rem;
		padding: 2rem 1.5rem;
	}
	.active_ticket .btn{
		border-top: 1px solid #DCDCDC;
		height: 5rem;
		color: #FFA425;
		font-size: 1.8rem;
		font-weight: bold;
	}
	.active_ticket .btn span{
		float: left;
		box-sizing: border-box;
		width: 50%;
		height: 100%;
		line-height: 5rem;
	}
</style>