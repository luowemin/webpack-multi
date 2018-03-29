<template>
	<div class="group-style">
		<div class="group-timer">
			<div class="group-split"></div>
			<div class="timer-container">
				<span>剩余</span>
				<span class="num">{{toFixed(h)}}</span>
				<span>:</span>
				<span class="num">{{toFixed(m)}}</span>
				<span>:</span>
				<span class="num">{{toFixed(s)}}</span>
				<span>结束</span>
			</div>
			<div class="group-split"></div>
		</div>
    	
		<div class="group-list-wrapper">
			<ul :style="scrollStyle">
				<li v-for="item in listMember">{{item.phone}}刚刚{{item.groupPurchaseStatus===1?"开团":"参团"}}</li>
			</ul>
		</div>
    </div>
</template>

<script>
	import $ from '@/assets/js/zepto'
	export default {
		name:'group-style',
		props:{
			lastTime:Number,
			listMember:Array,
		},
		data(){
			return {
				h:'00',
				m:'00',
				s:'00',
				scrollStyle:{
					transform: 'translate(0, 0)',
                	transitionDuration: 0,
				},
				startIndex:0,
				timer:null
			}
		},
		created(){
			this.startTick();
		},
		watch:{
			listMember(n,o){//观察参团成员变化来启动loop
				var len = n.length;
				if(len === 0){
					return;
				}
				if(this.timer){
					clearInterval(this.timer);
				}
				this.timer = setInterval(() => {
					this.startIndex++;
					if(this.startIndex >= len-1){//复位滚动列表
						this.startIndex = 0;
						this.scrollStyle = {
							transform: 'translate(0, 0)',
		                	transitionDuration: '0s',
						};
						return;
					}
					var offset = "translate(0,-"+this.startIndex*4+"rem)";
					this.scrollStyle = {
						transform: offset,
	                	transitionDuration: '1s',
					};
				},3000);
			}
		},
		methods:{
			toFixed(num){
				if(num < 10){
					return "0" + num;
				}else{
					return num;
				}
			},
			startTick(){
				var leftTime = this.lastTime/1000;
				if(leftTime > 0){
					var vm = this;
					var timer;
					var tick = function(){
						leftTime -= 1;
						if(leftTime < 0){
							clearInterval(timer);
						}
						vm.h = Math.floor(leftTime/(60*60));
						vm.m = Math.floor(leftTime%(60*60)/60);
						vm.s = Math.floor(leftTime%60);
					}
					tick();
					timer = setInterval(tick,1000);
				}
			},
		}
	}
</script>

<style lang="less">
	@group-bg:rgba(0,0,0,0.5);
	.group-style{
		position: absolute;
		background: @group-bg;
		bottom: 0;
		left: 0;right: 0;
		z-index: 10;
	}
	
	.group-timer{
		text-align: center;
	    padding: 0.5rem;
	   	.group-split{
	   		border-top: 1px solid white;
	   		display: inline-block;
	   		width: 12%;
	   	}
	    .timer-container{
	        position: relative;
	        padding:.5rem;
	        color:white;
	        display: inline-block;
	        font-size: 1.6rem;
	    	vertical-align: middle;
	    }
	}
	
	.timer-container .num {
		display: inline-block;
		height: 3rem;
		width: 3rem;
		text-align: center;
		line-height: 3rem;
		background-color: black;
		color: white;
		border-radius: 2px;
	}
	.group-list-wrapper{
		position: absolute;
		top: -15rem;
		overflow: hidden;
	}
	.group-list-wrapper ul{
		list-style: none;
		margin: 0;
		padding: 0 1rem;
		color: white;
		height: 8rem;
	}
	.group-list-wrapper li{
		background: @group-bg;
		height: 3rem;
		line-height: 3rem;
		padding: 0 1.5rem;
		box-sizing: border-box;
		border-radius: 50rem;
		margin-bottom: 1rem;
	}
</style>