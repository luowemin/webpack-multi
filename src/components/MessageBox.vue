<template>
	<transition name="msgbox-bounce">
		<div class="modal-mask" v-show="show">
			<div class="confirm-style">
				<h3 v-if="title" class="title">{{title}}</h3>
				<div class="content">{{msg}}</div>
				<div class="btn-content">
					<span v-show="showCancel" class="cancel" @click="show = false">{{cancelText}}</span>
					<span @click="callback" :style="{width:(showCancel?'50%':'100%')}">{{confirmText}}</span>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'message-box',
		data() {
			return {
				show:false,
				title:"提示",
				msg:"",
				confirmText:'确定',
				cancelText:'取消',
				showCancel:true,
				todo:null
			}
		},
		watch:{
			show(n){
				if(n){
					document.body.style.overflow = 'hidden';
					document.documentElement.style.overflow = 'hidden';
				}else{
					document.body.style.overflow = '';
					document.documentElement.style.overflow = '';
				}
			}
		},
		methods:{
			callback(){
				if(this.todo){
					this.todo();
				}
				this.show = false;
			},
			alert(option){
				if(!option){
					this.show = true;
					return;
				}
				if(option.title){
					this.title = option.title;
				}
				if(option.confirmText){
					this.confirmText = option.confirmText;
				}
				this.msg = option.msg;
				this.todo = option.todo;
				this.show = true;
				this.showCancel = false;
			},
			confirm(option){
				if(!option){
					this.show = true;
					return;
				}
				if(option.title){
					this.title = option.title;
				}
				if(option.confirmText){
					this.confirmText = option.confirmText;
				}
				if(option.cancelText){
					this.cancelText = option.cancelText;
				}
				this.msg = option.msg;
				this.todo = option.todo;
				this.show = true;
				this.showCancel = true;
			},
		},
	}
</script>

<style>
	.msgbox-bounce-enter,.msgbox-bounce-leave-active{
		opacity: 0;
	}
	.msgbox-bounce-enter .confirm-style,.msgbox-bounce-leave-active .confirm-style{
		/*opacity: 0;*/
		transform:  scale(0.7);
	}
	
	/*.msgbox-bounce-leave-active .confirm-style{
		opacity: 0;
		transform:  scale(0.9);
	}*/
	.modal-mask {position: fixed;z-index: 99;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, .5);}
	.confirm-style{width:80%;background-color: white;margin: 40% auto;border-radius: 5px;transition: all .3s ease;}
	.confirm-style>div{padding: 1rem 0;}
	.confirm-style .title{font-size: 1.6rem;font-weight: bold;padding: 1rem 0;text-align: center;margin: 0;}
	.confirm-style .content{font-size: 1.6rem;padding:1rem;text-align:center;word-wrap:break-word;word-break:break-all;line-height: 2.5rem;}
	.confirm-style .btn-content{padding: 0 !important;margin-top:1rem;border-top: 1px solid #E6E6E6;font-size: 1.6rem;overflow: hidden;text-align: center;}
	
	.confirm-style .btn-content>span{float: left;padding: 1rem 0;box-sizing: border-box;color: blue;}
	.confirm-style .btn-content .cancel{color: gray !important;width: 50%;border-right: 1px solid #E6E6E6;}
</style>