<template>
	<div id="app">
		<div class="box-white">
			<div v-for="item in list" class="product-info bottom-line">
				<div class="img-content">
					<img :src="item.icon" alt="" />
				</div>
				<div class="">
					<div class="name ellipsis">{{item.name}}</div>
					<!--
					<div class="price ellipsis">
						{{item.price | currency '￥'}}
						x{{item.quantity}}
					</div>
					-->
				</div>
			</div>
			<div class="serve-type bottom-line">
				<span class="label">售后类型</span>
				<div @click="showType=true" class="text right">{{showTypeDes()}}</div>
			</div>
			<div class="bottom-line">
				<div class="serve-type">
					<span class="label">问题描述</span>
					<div class="text"></div>
				</div>
				<div class="input-content">
					<textarea placeholder="最多填写200字" maxlength="200" v-model="content"></textarea>
					<span>{{content.length}}/200</span>
				</div>
			</div>
			<div class="upload-img-content">
				<div class="upload-imgs">
					<div id="upload-pre">
						<div v-for="img in preImgs" class="img-pre">
							<img :src="img.src" alt="" />
							<label class="progress" :style="{width:img.percent}"></label>
							<span @click="removeImg(img)" class="remove-img"></span>
						</div>
					</div>
					<div class="upload-btn">
						<span ref="uploader" class="add-icon"></span>
						<span class="add-text">最多上传5张</span>
					</div>
				</div>
			</div>
		</div>
		<div class="submit-content">
			<span @click="submitData" class="submit-btn" :style="disabed">确认</span>
		</div>
		<transition name="slide-bottom" mode="out-in">
			<div v-show="showType" class="mask-layer">
				<div class="request-type" transition="slide">
					<p @click="selectType('1')" :class="{active:requestType==1}">退货退款</p>
					<p @click="selectType('2')" :class="{active:requestType==2}">退款</p>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import MessageBox from '@/assets/js/messageBox';
	import $ from '@/assets/js/zepto'
	var param = {
		requestImages: []
	};
	var sortNum = 1;
	var uploader;
	export default {
		name: 'app',
		data() {
			var list = localStorage.getItem("applyItem");
			list = JSON.parse(list);
			return {
				content: "",
				requestType: -1,
				showType: false,
				list: list,
				preImgs: [],
				disabed: {}
			}
		},
		created() {
			param.orderId = this.$browser.getURLParameter('id');
			param.orderDetailId = this.$browser.getURLParameter('detailId');
			param.customerId = this.$info.cusId;
			this.$loading.hide();
		},
		mounted() {
			this._initUploader();
		},
		methods: {
			removeImg(img) {
				this.preImgs = this.preImgs.filter((item) => {
					return img.id !== item.id;
				});
				uploader.removeFile(img.id);
			},
			selectType: function(type) {
				this.requestType = type;
				this.showType = false;
			},
			showTypeDes: function() {
				var type = this.requestType;
				if(type == -1) {
					return "请选择处理方式";
				} else if(type == 1) {
					return "退货退款";
				} else if(type == 2) {
					return "退款";
				}
			},
			submitData: function() {
				var self = this;
				var type = this.requestType;
				if(type == -1) {
					this.$toast("请选择售后类型");
					return;
				}
				if(!this.content) {
					this.$toast("请填写问题描述！");
					return;
				}
				this.$loading.show();
				this.disabed = {
					"pointer-events": "none",
					"background-color": "gray"
				};
				param.requestType = type;
				param.requestDesc = this.content;
				uploader.start();
			},
			postData(){
				var self = this;
				$.ajax({
					type:"post",
					url:"/wechat-shop-back/afterSales/confirm",
					contentType:"application/json",
					data:JSON.stringify(param),
					success:function(data){
						self.$loading.hide();
						var msg = '您已成功申请售后，我们的客服将在3个工作日内处理您的申请';
						if(data.status !== 0){
							msg = data.msg;
						}
						MessageBox.alert({
							msg,
							todo(){
								location.assign("orderList.html?v="+Date.now());
							}
						})
					},
					error:function(){
						self.$loading.hide();
						self.$toast("网络或服务器异常");
					}
				});
			},
			_initUploader: function() {
				var self = this;
				var btn = this.$refs.uploader;
				
				uploader = new Qiniu.uploader({
					runtimes: 'html5,flash,html4',
					browse_button: btn,
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
									self.preImgs.push({
										id: f.id,
										src: imgsrc,
										percent:0,
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
							var s = self.preImgs;
							for (var i = 0; i < s.length; i++) {
								if(s[i].id === file.id){
									s[i].percent = file.percent + "%"
									break;
								}
							}
						},
						'UploadComplete': function() {
							self.postData();
						},
						'FileUploaded': function(up, file, info) {
							var s = self.preImgs;
							for (var i = 0; i < s.length; i++) {
								if(s[i].id === file.id){
//									s[i].percent = 0
									var domain = up.getOption('domain');
									var sourceLink = domain + "/" + file.name;
									param.requestImages.push({
										imgUrl: sourceLink,
										sortingOrder: s[i].sortingOrder
									});
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
	html,
	body {
		padding: 0;
		margin: 0;
		min-height: 100%;
		background-color: #F3F3F5;
	}
	
	.bottom-line {
		position: relative;
	}
	
	.bottom-line:before {
		content: '';
		position: absolute;
		left: 1rem;
		right: 0;
		bottom: 0;
		border-bottom: 1px solid #F3F3F5;
	}
	
	.btn-primary {
		padding: 1rem 1.5rem;
		margin: 1rem 3rem;
	}
	
	.box-white {
		background-color: white;
		margin-top: 1rem;
	}
	
	.product-info {
		overflow: auto;
		padding: 1rem;
		font-size: 1.6rem;
	}
	
	.img-content {
		float: left;
		width: 6rem;
		height: 6rem;
		margin-right: 1rem;
	}
	img{
		max-height: 100%;
		max-width: 100%;
	}
	.serve-type {
		padding: 1.5rem 1rem;
		font-size: 1.6rem;
		color: #A9A9A9;
	}
	
	.serve-type .label {
		color: #363636;
		margin-right: 2rem;
		float: left;
	}
	
	.serve-type .right {
		padding-right: 2rem;
		background: url("http://7xv1io.com1.z0.glb.clouddn.com/memberXb-icon_jiantou1.gif") no-repeat right center /1rem auto;
	}
	
	.input-content {
		margin: 0 1rem;
		height: 10rem;
		position: relative;
	}
	
	.input-content span {
		position: absolute;
		bottom: 0;
		right: 0.5rem;
		color: #BCBCBC;
	}
	
	.input-content textarea {
		width: 100%;
		height: 99%;
		resize: none;
		border: none;
		border-radius: 5px;
		font-size: 1.4rem;
		box-sizing: border-box;
	}
	
	.upload-img-content {
		margin: 0 1rem;
	}
	
	.upload-imgs {
		overflow: auto;
		padding: 1rem 0;
	}
	
	.upload-imgs .img-pre {
		width: 8rem;
		height: 8rem;
		line-height: 8rem;
		border: 1px solid #F2F2F2;
		float: left;
		margin: 1rem 1rem 0 0;
		text-align: center;
		position: relative;
	}
	
	.remove-img {
		position: absolute;
		top: -1rem;
		right: -1rem;
		width: 2rem;
		height: 2rem;
		background-color: red;
		background: url("http://7xv1io.com1.z0.glb.clouddn.com/close.png") no-repeat center/100% auto;
	}
	
	.upload-imgs .img-pre img {
		vertical-align: middle;
	}
	
	.upload-imgs .img-pre .progress {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 0;
		background-color: rgba(0, 0, 0, 0.5);
		transition: width 0.2s linear;
	}
	
	.upload-btn {
		display: inline-block;
		height: 8rem;
		margin-top: 1rem;
		line-height: 8rem;
		float: left;
	}
	
	.upload-btn .add-icon {
		float: left;
		height: 8rem;
		width: 8rem;
		border: 1px solid #F2F2F2;
		margin-right: 0.5rem;
		background: url("http://7xv1io.com1.z0.glb.clouddn.com/product/image/add-img.png") no-repeat center /4rem auto;
	}
	
	.upload-btn .add-text {
		font-size: 1.4rem;
		color: #BCBCBC;
	}
	
	.submit-content {
		text-align: center;
		margin-top: 8rem;
		height: 10rem;
		line-height: 10rem;
	}
	
	.submit-content .submit-btn {
		color: white;
		background-color: #41B21F;
		border-radius: 5px;
		font-size: 1.6rem;
		height: 4rem;
		width: 80%;
		display: inline-block;
		line-height: 4rem;
	}
	
	.mask-layer {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background-color: rgba(0, 0, 0, 0.6);
		transition: 0.3s;
	}
	
	.mask-layer .request-type {
		position: absolute;
		width: 80%;
		top: 50%;
		margin-top: -4rem;
		left: 10%;
		background-color: white;
		border-radius: 5px;
		transition: 0.3s;
	}
	
	.request-type p {
		font-size: 1.6rem;
		text-align: left;
		padding: 0 1rem;
		height: 4rem;
		line-height: 4rem;
	}
	
	.request-type p:first-child {
		border-bottom: 1px solid #DEDEDE;
	}
	
	.request-type p:before {
		content: "";
		display: inline-block;
		float: left;
		width: 2rem;
		height: 2rem;
		margin-right: 1rem;
		margin-top: 1rem;
		background: url("http://7xv1io.com1.z0.glb.clouddn.com/product/image/check-icon.png") no-repeat right center /4rem auto;
	}
	
	.request-type p.active:before {
		background: url("http://7xv1io.com1.z0.glb.clouddn.com/product/image/check-icon.png") no-repeat left center /4rem auto;
	}
	
	.slide-bottom-enter .request-type,
	.slide-bottom-leave-active .request-type {
		transform: translateX(100%);
	}
</style>