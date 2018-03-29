<template>
	<div id="app" class="ticket">
		<div class="card-header" >
			<div class="left" :class="{active:type=='staff'}" @click="type='staff'">门店优惠券</div>
			<div class="right" :class="{active:type=='shop'}" @click="type='shop'">会员商城优惠券</div>
			<span class="active-line" :style="{left:type=='staff'?'5%':'55%'}"></span>
			<span class="split"></span>
		</div>
		<div style="height: 80px;"></div>
		<div v-show="type=='staff'">
			<div v-show="staffTickets.length ==0" class="noTicket" style="color:#999;"><img style="width:6rem" src="http://7xv1io.com1.z0.glb.clouddn.com/memberXb-icon_no_ticket.png"/><br/>您没有优惠券哦</div>
			<div v-for="item in staffTickets" class="ticketBox" :class="classObj(item.codeStatus)">
				<!--<header>
					<div class="left eps">{{item.name}}</div>
					<div class="right"><a @click="goStaff(item)" class="use">{{ useText(item.codeStatus) }}</a></div>
				</header> 
				<div class="box">
					<p class="p2"><span class="pl">有效期至:{{item.validTime}}</span><span class="pr">门店专用</span></p>
					<div class="p1"><article @click="showRule">使用规则说明<b></b></article><section>{{item.content}}</section></div>
				</div>-->
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
		<div v-show="type=='shop'">
			<div v-show="shopTickets.length ==0" class="noTicket" style="color:#999;"><img style="width:6rem" src="http://7xv1io.com1.z0.glb.clouddn.com/memberXb-icon_no_ticket.png"/><br/>您没有优惠券哦</div>
			<div v-for="item in shopTickets" class="ticketBox xianShang" :class="classObj(item.codeStatus)">
				<header>
					<div class="left eps">{{item.name}}</div>
					<div class="right"><a @click="goShop(item)" class="use">{{useText(item.codeStatus)}}</a></div>
				</header>
				<div class="box">
					<div class="p1">{{item.content}}</div>
					<p class="p2">有效期:</p>
					<div>{{item.startTime}}至{{item.validTime || item.endTime}}</div>
				</div>
				<!--<header>
					<div class="left eps">{{item.name}}</div>
					<div class="right"><a @click="goShop(item)" class="use">{{useText(item.codeStatus)}}</a></div>
				</header>
				<div class="box">
					<p class="p2"><span class="pl">有效期至:{{item.validTime || item.endTime}}</span><span class="pr">会员商城专用</span></p>
					<div class="p1"><article @click="showRule">使用规则说明<b></b></article><section>{{item.content}}</section></div>
				</div>-->
			</div>
		</div>
	</div>
</template>

<script>
	
	export default {
		name: 'app',
		components: {
		},
		data(){
			return {
				type:"staff",
				staffTickets:[],
				shopTickets:[]
			}
		},
		created(){
			this.getTickets()
		},
		methods:{
			getTickets(){
				var vm = this;
				var openid = this.$info.openId;
				var cusid = this.$info.cusId;
				$.ajax({
					type : "get",
					url:"/base-data-service/act/getSpecialAct",
					data:{openid,cusid},
					dataType : 'json',
					success : function(data) {
						vm.$loading.hide();
						data.forEach(function(item,index){
							if(item.channelType ==1){
								vm.shopTickets.push(item);
							}else{
								vm.staffTickets.push(item);
							}
						});
					},
					error : function() {
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
			classObj:function(code){
				return {pastDue:code==1,hasUsed:code==2 || code==4};
			},
			showRule:function(e){
				$(e.target).next("section").slideToggle();
			},
			goStaff:function(item){
				if(item.codeStatus == 3){
					localStorage.setItem("ticket",JSON.stringify(item));
					window.location.href = "cardTicketUse.html?openId="+cardTicket.openId+"&cusId="+cardTicket.cusId;
				}
			},
			goShop:function(item){
				if(item.codeStatus == 3){
					window.location.href =item.buyLink;
				}
			}
		}
	}
</script>

<style>
	html{min-height:100%;}
 	body{padding-bottom:6rem;position:relative;min-height:100%;font-size:1.4rem;color:#333333; text-align:center; font-family:"华文细黑","Helvetica Neue",Helvetica,STHeiTi,sans-serif;background: #F3F3F5;}
 	*{ margin:0; padding:0; list-style:none;}
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
	
	.card-header{position:fixed;background:#fff;margin-bottom:2rem;overflow: auto;width: 100%;z-index: 10;}
	.card-header div{color:#1B1B1B;font-size:1.7rem;width: 50%;float: left;padding: 1.5rem 0;}
	.card-header div.active{color: #FFBB0A;}
	.card-header .split{position: absolute;top: 1.5rem;bottom: 1.5rem;border-right: 1px solid #ECECEF;width: 0;left: 50%;padding: 0;}
	.card-header .active-line{
		position: absolute;
		border-bottom: 4px solid #FFBB0A;
		width: 40%;bottom: 0;left: 5%;
		transition: 0.3s;
	}
</style>