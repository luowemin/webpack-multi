<template>
	<transition name="slide-bottom" mode="out-in">
		<div v-show='showTickets' class="quantity-bg">
			<div class="price_container">
				<div class="tickets_container">
					<div>
						<div v-for="item in tickets" class="t_item">
							<div class="t_name">{{item.name}}</div>
							<div class="t_time">满{{item.rule && item.rule.money}}元可使用</div>
							<div class="t_time">有效期至:{{item.validTime || item.endTime}}</div>
						</div>
					</div>
				</div>
				<div @click="close" class="t_close">关闭</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'comment-item',
		props:{
			tickets:{
				type:Array,
				required:true
			},
		},
		data() {
			return {
				showTickets:false,
			}
		},
		methods: {
			show(){
				this.showTickets = true;
				var h = $(window).height();
				$('html,body').css({'height':h,'overflow':'hidden'});
			},
			close(){
				this.showTickets = false;
				var fontSize = $('html').css('font-size');
				$('html,body').removeAttr('style');
				$('html,body').css({fontSize});
			}
		},
	}
</script>

<style>
	.slide-bottom-enter .price_container,
	.slide-bottom-leave-active .price_container{
		transform: translateY(100%);
	}
	.price_container{
		background-color: white;
		position: absolute;
		bottom: 0;
		width: 100%;
		transition: 0.3s;
	}
	.tickets_container{
		max-height: 30rem;
		overflow: auto;
		-webkit-overflow-scrolling : touch;
	}
	.t_item{
		padding: 1.5rem 1rem;
		border-bottom: 1px solid #DCDCDC;
	}
	.t_item .t_name{
		font-size: 1.6rem;
	}
	.t_item .t_time{
		font-size: 1.4rem;
		color: #B3B3B3;
	}
	.t_close{
		text-align: center;
		padding: 1.5rem;
		background: #E84E40;
		color: white;
	}
</style>