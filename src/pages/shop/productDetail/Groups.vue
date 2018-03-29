<template>
	<div class="groups">
    	<h4 class="groups-title">
    		支付并邀请<label class="groups-red">{{groupNum - 1}}</label>人参团,人数不够自动退款
    		详见<span @click="show('r')">拼团玩法</span>
    	</h4>
    	<div class="group-list">
    		<div :style="scrollStyle">
		    	<table v-for="item in listGroup" class="group-item">
		    		<tr>
		    			<td rowspan="2" class="item-header">
		    				<img :src="headerImg(item.evaluatorHeadImgUrl)"/>
		    			</td>
		    			<td rowspan="2"><div class="group-name">{{item.nickName || "匿名"}}</div></td>
		    			<td class="group-info">还差<label class="groups-red">{{item.purchaseNumber}}</label>人成团</td>
		    			<td rowspan="2" class="item-right-btn">
		    				<span @click="goGroup(item.grouppurchaseCode)">去参团</span>
		    			</td>
		    		</tr>
		    		<tr>
		    			<td class="group-time">剩余{{item.timeLabel}}</td>
		    		</tr>
		    	</table>
    		</div>
    	</div>
    	<div v-if="listGroup.length > 2" class="groups-more" @click="show('g')">
    		查看更多<span class="groups-right"></span>
    	</div>
    	<div v-show="showRule || showGroups" class="groups-bg">
    		<div class="groups-rule-container">
				<img @click="closeMask" class="groups-close" src="http://7xv1io.com1.z0.glb.clouddn.com/product/image/close_fbxd.png" />
	    		<div v-show="showRule" class="groups-rule">
		    		<img class="rule" src="http://img.wgmf.com/group/pop_group_process.jpg"/>
	    		</div>
	    		<div v-show="showGroups" class="groups-list">
	    			<h4 class="groups-list-title">正在拼单</h4>
	    			<div class="groups-list-inner">
			    		<table v-for="item in listGroup" class="group-item">
				    		<tr>
				    			<td rowspan="2" class="item-header">
				    				<img :src="headerImg(item.evaluatorHeadImgUrl)"/>
				    			</td>
				    			<td class="groups-nick">{{item.nickName || "匿名"}}</td>
				    			<td rowspan="2" class="groups-left-num">还差<label class="groups-red">{{item.purchaseNumber}}</label>人</td>
				    			<td rowspan="2" class="item-right-btn">
				    				<span @click="goGroup(item.grouppurchaseCode)">去参团</span>
				    			</td>
				    		</tr>
				    		<tr>
				    			<td class="groups-item-time">剩余{{lastTime(item.endTime)}}</td>
				    		</tr>
				    	</table>
	    			</div>
			    	<div class="groups-list-tip">仅显示10个正在拼单的人</div>
	    		</div>
    		</div>
    	</div>
    </div>
</template>

<script>
	import $ from '@/assets/js/zepto'
	var tickTimer;
	export default {
		name:'groups',
		props:{
			listGroup:Array,
			groupNum:Number
		},
		data(){
			return {
				showRule:false,
				showGroups:false,
				scrollStyle:{
					transform: 'translate(0, 0)',
                	transitionDuration: 0,
				},
				index:0
			}
		},
		watch:{
			listGroup(n,o){
				var len = n.length;
				if(len > 0){
					var vm = this;
					var time = 0;
					var tick = function(){
						var flag = true;
						n.forEach((item) => {
							item.endTime -= 1000;
							if(item.endTime > 0){
								flag = false;
							}
							item.timeLabel = vm.lastTime(item.endTime);
						});
						if(flag){
							clearInterval(tickTimer);
						}
						time++;
						if(time === 4 && len > 2){
							time = 0;
							vm.index++;
							if(vm.index >= len - 1){
								vm.index = 0;
								vm.scrollStyle = {
									transform: 'translate(0, 0)',
				                	transitionDuration: '0s',
								};
								return
							}
							var offset = "translate(0,-"+vm.index*7+"rem)";
							vm.scrollStyle = {
								transform: offset,
			                	transitionDuration: '1s',
							};
						}
					}
					tick();
					tickTimer = setInterval(tick,1000);
				}
			}
		},
		methods:{
			closeMask(){
				this.showRule = false;
				this.showGroups = false;
				var fontSize = $('html').css('font-size');
				$('html,body').removeAttr('style');
				$('html,body').css({fontSize});
			},
			show(type){
				var h = $(window).height();
				$('html,body').css({'height':h,'overflow':'hidden'});
				if(type === 'r'){
					this.showRule=true;
				}else{
					this.showGroups = true;
				}
			},
			headerImg(img){
				return img || "http://7xv1io.com1.z0.glb.clouddn.com/img_default.png";//http://img.wgmf.com/group/image_07.png
			},
			goGroup(code){
				location.assign('groupBooking.html?grouppurchaseCode='+code)
			},
			toFixed(num){
				if(num < 10){
					return "0" + num;
				}else{
					return num;
				}
			},
			lastTime(time){
				if(time <= 0){
					return "00:00:00";
				}
				var leftTime = time / 1000;
				var h = this.toFixed(Math.floor(leftTime/(60*60)));
				var m = this.toFixed(Math.floor(leftTime%(60*60)/60));
				var s = this.toFixed(Math.floor(leftTime%60));
				return h+":"+m+":"+s;
			},
		}
	}
</script>

<style>
	.groups{
		background: white;
		margin-bottom: 0.6rem;
	}
	.groups-title{
		margin: 0;
		padding: 1rem;
		font-size: 1.6rem;
		font-weight: normal;
	}
	.groups-title span{
		color: #1ec21a;
		font-weight: bold;
		text-decoration: underline;
	}
	.group-list{
		max-height: 14rem;
		overflow: hidden;
	}
	.group-item{
		border: none;
		width: 100%;
		height: 7rem;
		font-size: 1.4rem;
		border-top: 1px solid #E6E6E6;
		box-sizing: border-box;
	}
	.item-header{
		width: 5rem;height: 5rem;
		padding: .5rem;
	}
	.item-header img{
		vertical-align: middle;
		width: 100%;height: 100%;
		border-radius: 50%;
	}
	.group-name{
		width: 5.5rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.group-info{
		vertical-align: bottom;
		text-align: right;
	}
	.group-time{
		vertical-align: top;
		text-align: right;
		color: #808080;
	}
	.item-right-btn{
		width: 5rem;
		padding:0 0.5rem;
	}
	.item-right-btn span{
		display: block;
		padding: 1rem 0;
		text-align: center;
		background: #FF4103;
		color: white;
		border-radius: 0.5rem;
	}
	.groups-more{
		text-align: right;
		padding: 1rem;
		font-size: 1.6rem;
		color: #666666;
		border-top: 1px solid #E6E6E6;
	}
	.groups-right{
		padding-right: 1rem;
		background: url(http://7xv1io.com1.z0.glb.clouddn.com/memberXb-icon_jiantou1.gif) no-repeat right center /auto 1.2rem;
	}
	.groups-rule-container{
		width: 90%;
		height: 80%;
		position: absolute;
		top: 10%;left: 5%;
		padding: 0.5rem;
		box-sizing: border-box;
	}
	.groups-rule{
		padding: 1rem 0;
		border-radius: .5rem;
		overflow: auto;
		background: white;
		width: 100%;
		height: 100%;
	}
	.groups-rule .rule{
		width: 100%;
	}
	.groups-close{
		position: absolute;
		top: 0;right: 0;
		width: 2rem;height: 2rem;
	}
	.groups-list{
		background: white;
		padding: 1rem 0;
		border-radius: 0.5rem;
	}
	.groups-list .group-item{
		height: 6rem !important;
	}
	.groups-list-title{
		margin: 0;
		padding-bottom: 1rem;
		text-align: center;
		font-size: 1.6rem;
	}
	.groups-list-inner{
		height: 30rem;
		overflow: auto;
	}
	.groups-list .item-header{
		width: 4rem !important;
		height: 4rem !important;
	}
	.groups-list .item-right-btn span{
		padding: 0.5rem 0 !important;
	}
	.groups-left-num{
		text-align: right;
		font-size: 1.4rem;
	}
	.groups-nick{
		vertical-align: bottom;
		font-size: 1.6rem;
	}
	.groups-item-time{
		font-size: 1.2rem;
		color: #808080;
		vertical-align: top;
	}
	.groups-list-tip{
		text-align: center;
		color: #999999;
		font-size: 1.4rem;
		padding-top: 1rem;
	}
	.groups-red{
		color: #FF4103;
	}
</style>