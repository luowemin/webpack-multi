<template>
	<transition name="slide-left" mode="out-in">
		<div v-show="showComments" class="comments-bg">
			<div class="comments-container">
				<div class="comments-close" @click="hide">
					<em></em>
					<img src="http://7xv1io.com1.z0.glb.clouddn.com/product/image/close_fbxd.png" />
				</div>
				<div class="comments-list">
					<div v-if="comments.length>0">
						<CommentItem v-for="(item,index) in comments" :key="index" :item="item" />
					</div>
					<div v-else class="comment-null">暂无评论！</div>
					<div v-show="comments.length>0" class="comment-more" @click="getComment" :style="{color:(hasMoreComment?'blue':'gray')}">
						{{hasMoreComment?"查看更多...":"没有更多了"}}
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import $ from '@/assets/js/zepto'
	import CommentItem from './CommentItem'
	export default {
		name: 'comment',
		components: {
			CommentItem,
		},
		props:{
			tplId:{
				type:String,
				required:true
			},
			pageSize:{
				type:Number,
				default:20
			}
		},
		data() {
			return {
				showComments: false,
				hasMoreComment: true,
				comments: [],
				curPage:1,
			}
		},
		created(){
			this.getComment();
		},
		methods: {
			show(){
				this.showComments = true;
				var h = $(window).height();
				$('html,body').css({'height':h,'overflow':'hidden'});
			},
			hide(){
				this.showComments = false;
				var fontSize = $('html').css('font-size');
				$('html,body').removeAttr('style');
				$('html,body').css({fontSize});
			},
			getComment() {
				if(!this.hasMoreComment){
					return;
				}
				var vm = this; 
				var pageSize = this.pageSize;
				var curPage = this.curPage;
				var pId = this.tplId;
				$.ajax({
	    			type:"get",
	    			url:"/wechat-shop-back/evaluation/list",
	    			data:{productTemplateId:pId,pageSize:pageSize,curPage:curPage},
	    			success:function(data){
	    				if(data.status === 0){
	    					data.data.forEach(function(item){
	    						vm.comments.push(item);
	    					});
	    					if(data.data.length < pageSize){
	    						vm.hasMoreComment = false;
	    					}
	    				}else{
	    					vm.hasMoreComment = false;
	    				}
	    			},
	    			error:function(){
	    				$("#loading").hide();
	    			}
	    		});
			},
			preImg(cur,urls){
				var isWX = this.$info.wxBrowser;
				if(isWX){
					var imgs = [];
					var len = urls.length;
					for(var i=0;i<len ;i++){
						imgs.push(urls[i].imgUrl || urls[i].imageUrl);
					}
					wx.previewImage({
						current:cur,
						urls:imgs
					});
				}
			},
		},
	}
</script>

<style>
	.slide-left-enter-active,
	.slide-left-leave-active {
		transition: all .2s ease;
	}
	.slide-left-enter,
	.slide-left-leave-active{
		opacity: 0;
	}
	.slide-left-enter .comments-container,
	.slide-left-leave-active .comments-container{
		transform: translateX(100%);
	}
	.comments-bg {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.6);
		transition: 0.3s;
		z-index: 100;
	}
	
	.comment-container {
		background-color: #F3F3F5;
		padding-top: 1px;
	}
	
	.comment-item {
		background-color: white;
		padding: 1rem 1.5rem;
		margin-bottom: 1rem;
	}
	
	.comment-header {
		height: 4rem;
		line-height: 4rem;
	}
	
	.comment-header .comment-user-info {
		height: 100%;
	}
	
	.comment-user-info .user-img {
		float: left;
		width: 4rem;
		height: 4rem;
	}
	
	.comment-user-info .user-img img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	
	.comment-user-info .user-name {
		font-size: 1.4rem;
		color: #4B4B4B;
		margin-left: 1rem;
	}
	
	.comment-header .comment-date {
		height: 100%;
		font-size: 1.2rem;
		color: #D0D0D0;
		float: right;
	}
	
	.comment-star {
		margin-top: 1rem;
		height: 3rem;
		line-height: 3rem;
	}
	
	.comment-star span {
		float: left;
		width: 2rem;
		height: 2rem;
		background: url(http://7xv1io.com1.z0.glb.clouddn.com/product/star2.png) no-repeat center /100% auto;
		margin-right: 5px;
	}
	
	.comment-star span.active {
		background: url(http://7xv1io.com1.z0.glb.clouddn.com/product/star1.png) no-repeat center /100% auto;
	}
	
	.coment-content {
		font-size: 1.6rem;
		color: #121212;
	}
	
	.comment-null {
		height: 30rem;
		line-height: 30rem;
		text-align: center;
	}
	
	.reply-comment {
		background-color: #F7F7FA;
		color: #4E5984;
		padding: 1rem 2rem;
		font-size: 14px;
	}
	
	.comment-img {
		margin-top: 2rem;
		overflow: auto;
	}
	
	.comment-img img {
		float: left;
		width: 6rem;
		height: 6rem;
		margin: 0 1rem 1rem 0;
	}
	
	.comment-title {
		padding: 1rem 1.5rem 0 1.5rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
	}
	
	.more-comments {
		text-align: center;
		padding-bottom: 1.5rem;
	}
	
	.more-comments span {
		color: #CE446E;
		border: 1px solid #CE446E;
		padding: .5rem 2rem;
		border-radius: 5rem;
		display: inline-block;
	}
	
	.comments-container {
		position: absolute;
		bottom: 13%;
		height: 74%;
		width: 100%;
		background-color: #DCDCDC;
		transition: 0.3s;
	}
	
	.comments-container .comments-list {
		overflow: auto;
		height: 100%;
	}
	
	.comments-container .comments-close {
		position: absolute;
		top: -5rem;
		right: 0;
		width: 5rem;
		height: 5rem;
	}
	
	.comments-container .comments-close img {
		position: absolute;
		top: 0px;
		left: 50%;
		margin-left: -1.5rem;
		width: 3rem;
		height: 3rem;
	}
	
	.comments-container .comments-close em {
		position: absolute;
		top: 3rem;
		bottom: 0;
		left: 50%;
		margin-left: -1px;
		border: 1px solid red;
	}
	.comment-more{
		padding: 1.5rem 0;
		text-align: center;
		color: blue;
		font-size: 1.6rem;
		background-color: white;
	}
</style>