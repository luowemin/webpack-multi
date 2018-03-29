<template>
	<div class="comment-item">
		<div class="comment-header">
			<span class="comment-date">{{item.createDate | dateFormat('yyyy-MM-dd')}}</span>
			<div class="comment-user-info">
				<span class="user-img">
					<img v-lazy="imgFormat(item.evaluatorHeadImgUrl,'imageView2/2/w/100/h/100')" alt=""/>
				</span>
				<span class="user-name">{{item.evaluatorName}}</span>
			</div>
		</div>
		<div class="comment-star">
			<span v-for="i in 5" :class="{active:item.ratingScore>=i}"></span>
		</div>
		<div class="coment-content">{{item.ratingDesc}}</div>
		<div class="comment-img">
			<img v-for="img in item.evaluationImages"
				 @click="preImg(img.imgUrl,item.evaluationImages)" 
				 v-lazy="imgFormat(img.imgUrl,'imageView2/1/w/200/')">
		</div>
		<div v-if="item.reply" class="reply-comment">客服回复：{{item.reply}}</div>
	</div>
</template>

<script>
	export default {
		name: 'comment-item',
		props:{
			item:{
				type:Object,
				required:true
			},
		},
		data() {
			return {
				showComments: true,
				hasMoreComment: true,
				comments: [],
				curPage:1,
			}
		},
		methods: {
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
