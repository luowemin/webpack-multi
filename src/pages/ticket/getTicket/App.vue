<template>
	<div id="app" class="ticket">
		<img @click="getTicket" :src="ticket.actImgUrl"/>
		<Login ref="login" />
	</div>
</template>

<script>
	import Login from '@/components/Login'
	import getTicket from '@/assets/js/getTicket'
	export default {
		name: 'app',
		components: {
			Login,
		},
		props:{
			ticket:{
				type:Object,
				required:true
			}
		},
		methods:{
			getTicket(){
				var item = this.ticket;
				var param = {
					id:item.id,
					needPoints:item.needPoints,
					userCopAmount:item.userTkcpAmount,
					tolink:item.tkcpButtonUrl || ''
				};
				getTicket(param,this);
			}
		}
	}
</script>

<style>
	html,body,.ticket{
		margin: 0;padding: 0;height: 100%;
	}
	.ticket img{
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}
</style>