<template>
	<div class="text-wrapper">
    	<div class="text-scroller" :style="descStyle">{{text}}</div>
    </div>
</template>

<script>
	import $ from '@/assets/js/zepto'
	export default {
		name:'scroll-text',
		props:{
			text:String
		},
		data(){
			return {
				descStyle:{//滚动公告样式
					transform: 'translate(0px, 0px) translateZ(0px)',
                	transitionDuration: 0,
                	transitionTimingFunction:'linear'
				},
			}
		},
		watch:{
			text(n,o){
				if(!n) return;
				var vm = this;
				var w = $('.text-wrapper').width();
				var tw = $('.text-scroller').width();
				if(tw>0){
					var min = Math.min(w,tw)
					var offset = min;
					vm.descStyle.transform = 'translate('+offset+'px, 0px)';
					var max = -Math.max(w,tw);
					function step(){
						offset--;
						if(offset<max){
							offset = min;
						}
						vm.descStyle.transform = 'translate('+offset+'px, 0px) translateZ(0px)';
					}
					setInterval(step,50);
				}
			}
		}
	}
</script>

<style>
	.text-wrapper{
		padding: 5px 0;
		overflow: hidden;
		text-align: right;
	}
	.text-scroller{
		word-break: break-all;
		white-space: nowrap;
		overflow:visible;
		display: inline-block;
		color: red;
	}
</style>