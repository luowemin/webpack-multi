<template>
	<div class="seckill">
		<div class="seckill_right">
			<div class="seckill_time_label">{{activity.title}}</div>
			<div class="seckill_time">
				<span>{{secD}}</span>天<span>{{secH}}</span>时<span>{{secM}}</span>分<span class="red">{{secS}}</span>秒
			</div>
		</div>
		<div class="seckill_left">
			<div class="seckill_price">
				<span>￥{{activity.price}}</span>
				<span class="seckill_price1 or_price">{{activity.virtualPrice}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'timer-tick',
		props:{
			activity:{
				type:Object,
				required:true
			},
		},
		data() {
			return {
				secD:0,
				secH:0,
				secM:0,
				secS:0
			}
		},
		methods: {
			startTick(storeTime){
				if(storeTime > 0){
					var vm = this;
					var tick = function(){
						storeTime--;
						if(storeTime > 0){
							vm.secD = Math.floor(storeTime / (60*60*24));
							vm.secH = Math.floor(storeTime / (60*60)) - vm.secD*24;
							vm.secM = Math.floor(storeTime % (60*60) / 60);
							vm.secS = Math.floor(storeTime % 60);
						}else{
							vm.$emit('tickDone');
							clearInterval(timer);
						}
					}
					tick();
					var timer = setInterval(tick,1000);
				}
			}
		},
	}
</script>

<style>
	.seckill{
		background: #FF3C00;
		color: white;
		position: relative;
		height: 5rem;
	}
	.seckill_label{
		position: absolute;
		height: 2.8rem;
		line-height: 2.8rem;
		padding: 0 3rem 0 1rem;
		top: -2.6rem;
		background: url(http://7xv1io.com1.z0.glb.clouddn.com/product/image/seckiil.png) no-repeat 90% center/auto 2rem #FF3C00;
		border-radius: 0 .5rem 0 0;
		font-size: 1.4rem;
	}
	.seckill_left{
		padding:0 1rem;
		height: 100%;
	}
	.seckill_right{
		float: right;
		height: 100%;
		width: 16rem;
		background: #FEF4F1;
		color: #4D4B4A;
		text-align: center;
		padding-right: 3rem;
	}
	.seckill_price{
		font-size: 2.6rem;
		padding: .4rem 0;
	}
	.seckill_price1{
		font-size: 1.4rem;
		color: white !important;
	}
	.seckill_time_label{
		font-size: 1.4rem;
		height: 2rem;
		line-height: 2rem;
		padding-top: .6rem;
	}
	.seckill_time{
		height: 2rem;
		line-height: 2rem;
		font-size: 1.2rem;
		padding-bottom: .5rem;
	}
	.seckill_time span{
		background: #111111;
		border-radius: .5rem;
		color: white;
		display: inline-block;
		width: 2.2rem;
		height: 2rem;
	}
	.seckill_time span.red{
		background: #D61415;
	}
</style>