<template>
	<div id="app">
		<div v-for="product in list" class="box-white">
			<div class="product-info">
				<div class="img-content">
					<img :src="product.icon" alt=""/>
				</div>
				<div class="">
					<div class="name ellipsis">{{product.name}}</div>
					<div class="sub-name">{{product.skuName}}</div>
					<!--<div class="price ellipsis">{{product.price | currency '￥'}}</div>-->
				</div>
			</div>
			<div class="star-content">
				<span v-for="i in 5" :class="{active:product.star>=i}" @click="product.star=i"></span>
			</div>
			<div class="input-content">
				<textarea maxlength="200" placeholder="评价留言:" v-model="product.content"></textarea>
				<span>{{product.content.length}}/200</span>
			</div>
			<div class="upload-img-content">
				<div class="upload-imgs">
					<div id="upload-pre" class="upload-pre">
						<div v-for="img in filterImgs(product.productId)" class="img-pre">
							<img :src="img.src" alt="" />
							<label class="progress" :style="{width:img.percent}"></label>
							<span @click="removeImg(img)" class="remove-img"></span>
						</div>
					</div>
					<!--{{product}}-->
					<div class="upload-btn" @click="setPid(product.productId)">
						<span class="add-icon"></span>
						<span class="add-text">添加晒单图片</span>
					</div>
				</div>
			</div>
		</div>
		<div class="submit-content">
			<span class="submit-btn" @click="submit">确认</span>
		</div>
	</div>
</template>

<script>
	import MessageBox from '@/assets/js/messageBox';
	import $ from '@/assets/js/zepto'
	var postParam = [];
	var sortNum = 1
	var uploader;
	export default {
		name: 'app',
		data(){
			var param = localStorage.getItem("productComment");
			try{
				param = JSON.parse(param);
			}catch(e){
				//TODO handle the exception
				param = [];
			}
			var openId = this.$info.openId;
			var cusId = this.$info.cusId;
			for(var i=0;i<param.length;i++){
				param[i].star = 5;
				param[i].content = "";
				postParam.push({
					evaluationImages:[],
					productId:param[i].productId,
					productTemplateId:param[i].productTemplateId,
					orderDetailId:param[i].orderDetailId,
					orderId:param[i].orderId,
					customerId:openId,
					cusId
				});
			}
			return {
				list:param,
				curPId:'',
				preImgs:[]
			}
		},
		created(){
			this.$loading.hide();
		},
		mounted(){
			this.initUploader();
		},
		methods:{
			setPid(pId){
				this.curPId = pId;
			},
			filterImgs(pId){
				return this.preImgs.filter((img) => {
					return img.pId === pId;
				});
			},
			removeImg(img) {
				this.preImgs = this.preImgs.filter((item) => {
					return img.id !== item.id;
				});
				uploader.removeFile(img.id);
			},
			submit(){
				var self = this;
				var flag = false;
				var list = this.list;
				for (var i = 0; i < list.length; i++) {
					if(!list[i].content){
						self.$toast("请输入"+list[i].name+"的评价信息");
						flag = true;
						break;
					}
				}
				if(flag) return;
				for (var i=0;i<list.length;i++) {
					for (var j=0;j<postParam.length;j++) {
						if(list[i].productId == postParam[j].productId){
							postParam[j].ratingDesc = list[i].content;
							postParam[j].ratingScore = list[i].star;
						}
					}
				}
				$(".submit-btn").addClass("disabled");
				this.$loading.show();
				uploader.start();
			},
			_submitComment:function(){
				var self = this;
				var imgs = this.preImgs;
				postParam.forEach((pro) => {
					imgs.forEach((img) => {
						if(pro.productId === img.pId){
							pro.evaluationImages.push({
								imgUrl:img.imgUrl,
								sortingOrder:img.sortingOrder
							})
						}
					});
				});
				$.ajax({
					type:"post",
					url:"/wechat-shop-back/evaluation/confirm",
					data:JSON.stringify(postParam),
					contentType:"application/json",
					success:function(data){
						self.$loading.hide();
						var msg = "评价成功,感谢您的评价！";
						if(data.status !== 0){
							msg = data.msg;
						}
						MessageBox.alert({
							msg,
							todo(){
								location.assign("orderList.html?v="+Date.now());
							}
						}).then(() => {
						});
					},
					error:function(){
						self.$toast("服务器维护中...");
						self.$loading.hide();
					}
				});
			},
			initUploader(){
				var vm = this;
				var arr = document.getElementsByClassName('add-icon');
				var btns = Array.prototype.slice.call(arr);
				
				uploader = new Qiniu.uploader({
					runtimes: 'html5,flash,html4',
					browse_button: btns,
					max_file_size: '100mb',
					flash_swf_url: '/shop-web/static/js/plupload/Moxie.swf',
					dragdrop: false,
					chunk_size: '4mb',
					multi_selection: !(mOxie.Env.OS.toLowerCase() === "ios"),
					uptoken_func: function() {
						$.get("/qiniu/getUploadToken?content", function(data) {
							Qiniu.token = data.retInfo;
						});
					},
					domain: 'http://img.wgmf.com',
					get_new_uptoken: false,
					auto_start: false,
					resize: {
						quality: 60
					},
					init: {
						'FilesAdded': function(up, files) {
							for(var i = 0, len = files.length; i < len; i++) {
								var f = files[i];
								var preloader = new mOxie.Image();
								preloader.onload = function() {
									this.embed(this.uid, {
										width: 100,
										height: 100,
										crop: true,
										swf_urf: o.resolveUrl(up.getOption("flash_swf_url"))
									});
									var imgsrc = this.type === 'image/jpeg' ? this.getAsDataURL('image/jpeg', 80) : this.getAsDataURL();
									vm.preImgs.push({
										id: f.id,
										src: imgsrc,
										percent:0,
										pId:vm.curPId,
										sortingOrder:sortNum++
									})
									
								};
								preloader.load(f.getSource());
							}
						},
						'BeforeUpload': function(up, file) {
							console.log(file.size);
						},
						'UploadProgress': function(up, file) {
							var s = vm.preImgs;
							for (var i = 0; i < s.length; i++) {
								if(s[i].id === file.id){
									s[i].percent = file.percent + "%"
									break;
								}
							}
						},
						'UploadComplete': function() {
							vm._submitComment();
						},
						'FileUploaded': function(up, file, info) {
							var s = vm.preImgs;
							for (var i = 0; i < s.length; i++) {
								if(s[i].id === file.id){
//									s[i].percent = 0
									var domain = up.getOption('domain');
									var sourceLink = domain + "/" + file.name;
									s[i].imgUrl = sourceLink
									break;
								}
							}
						},
						'Error': function(up, err, errTip) {
							self.$toast("上传图片失败");
						}
					}
				});
			},
		}
	}
</script>

<style>
	#app {
		
	}
	.btn-primary{
		padding: 1rem 1.5rem;
		margin: 1rem 3rem;
	}
	.box-white{
		background-color: white;
		margin-top: 1rem;
	}
	.product-info{
		border-bottom: 1px solid #F3F3F5;
		margin: 0 1rem;
		overflow: auto;
		padding: 1rem 0;
		font-size: 1.6rem;
	}
	.img-content{
		float: left;
		width: 6rem;
		height: 6rem;
		margin-right: 1rem;
	}
	img{
		max-height: 100%;
		max-width: 100%;
	}
	.sub-name{
		font-size: 1.4rem;color: gray;
	}
	.star-content,.submit-content{
		padding: 2rem 0;
		text-align: center;
		margin: 0 1rem;
	}
	.star-content>span{
		width: 4rem;height: 4rem;
		display: inline-block;
		background: url(http://7xv1io.com1.z0.glb.clouddn.com/product/star2.png) no-repeat center /3rem auto;
	}
	.star-content>span.active{
		background: url(http://7xv1io.com1.z0.glb.clouddn.com/product/star1.png) no-repeat center /3rem auto !important;
	}
	.input-content{
		margin: 0 1rem;
		height: 16rem;
		position: relative;
	}
	.input-content span{
		position: absolute;
		bottom: .5rem;right: 0.5rem;
		color: #BCBCBC;
	}
	.input-content textarea{
		width: 100%;
		height: 100%;
		resize: none;
		padding: 1rem;
		background-color: #F2F2F2;
		border: none;
		border-radius: 5px;
		font-size: 1.4rem;
		box-sizing: border-box;
	}
	.upload-img-content{
		margin: 0 1rem;
	}
	.upload-imgs{
		overflow: auto;
		padding: 1rem 0;
	}
	.upload-imgs .img-pre{
		width: 8rem;
		height: 8rem;
		line-height: 8rem;
		border: 1px solid #F2F2F2;
		float: left;
		margin: 1rem 1rem 0 0;
		text-align: center;
		position: relative;
	}
	.remove-img{
		position: absolute;
		top: -1rem;right: -1rem;
		width: 2rem;height: 2rem;
		background-color: red;
		background: url("http://7xv1io.com1.z0.glb.clouddn.com/close.png") no-repeat center/100% auto;
	}
	.upload-imgs .img-pre img{
		vertical-align: middle;
	}
	.upload-imgs .img-pre .progress{
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 0;
		background-color: rgba(0,0,0,0.5);
		transition: width 0.2s linear;
	}
	.upload-btn{
		display: inline-block;
		height: 8rem;
		margin-top: 1rem;
		line-height: 8rem;
		float: left;
	}
	.upload-btn .add-icon{
		float: left;
		height: 8rem;
		width: 8rem;
		border: 1px solid #F2F2F2;
		margin-right: 0.5rem;
		background: url("http://7xv1io.com1.z0.glb.clouddn.com/product/image/add-img.png") no-repeat center /4rem auto;
	}
	.upload-btn .add-text{
		font-size: 1.4rem;
		color:#BCBCBC;
	}
	.submit-btn{
		display: inline-block;
		background-color: #28C11F;
		color: white;
		width: 80%;
		border-radius: 5px;
		font-size: 1.6rem;
		padding: 1rem 0;
	}
	.submit-btn.disabled{
		pointer-events: none;
		background-color: #DCDCDC;
	}
</style>