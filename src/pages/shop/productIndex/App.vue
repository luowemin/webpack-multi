<template>
	<div id="app" class="container">
		<div v-show="showSearch" class="pro-search"><input type="text" placeholder="请输入产品名称" v-model="word"><span @click="search"></span></div>
		<div v-for="item in list">
			<div v-if="item.type===0" @click="goPage(item.link)" :style="item.styleObj">
				<img :search="item.isSearch?1:0" v-lazy="item.imgUrl" />
			</div>
			<div v-else-if="item.type===1" class="pro_row" :style="item.styleObj">
				<div class="pro_col1" :style="item.items[0].styleObj"><img @click="goPage(item.items[0].link)" v-lazy="item.items[0].imgUrl" /></div>
				<div class="pro_col1" :style="item.items[1].styleObj"><img @click="goPage(item.items[1].link)" v-lazy="item.items[1].imgUrl" /></div>
			</div>
			<div v-else-if="item.type===2" :style="item.styleObj">
				<div class="pro_row">
					<div class="pro_col2" :style="item.items[0].styleObj"><img @click="goPage(item.items[0].link)" v-lazy="item.items[0].imgUrl" /></div>
				</div>
				<div class="pro_row">
					<div class="pro_col1">
						<div :style="item.items[1].styleObj"><img @click="goPage(item.items[1].link)" v-lazy="item.items[1].imgUrl" /></div>
					</div>
					<div class="pro_col1">
						<div :style="item.items[2].styleObj"><img @click="goPage(item.items[2].link)" v-lazy="item.items[2].imgUrl" /></div>
					</div>
				</div>
			</div>
			<div v-else-if="item.type===3" :style="item.styleObj">
				<div class="pro_row">
					<div class="pro_col1">
						<div :style="item.items[0].styleObj"><img @click="goPage(item.items[0].link)" v-lazy="item.items[0].imgUrl" /></div>
					</div>
					<div class="pro_col1">
						<div :style="item.items[1].styleObj"><img @click="goPage(item.items[1].link)" v-lazy="item.items[1].imgUrl" /></div>
					</div>
				</div>
				<div class="pro_row">
					<div class="pro_col1">
						<div :style="item.items[2].styleObj"><img @click="goPage(item.items[2].link)" v-lazy="item.items[2].imgUrl" /></div>
					</div>
					<div class="pro_col1">
						<div :style="item.items[3].styleObj"><img @click="goPage(item.items[3].link)" v-lazy="item.items[3].imgUrl" /></div>
					</div>
				</div>
			</div>
			<div v-else-if="item.type===4" class="pro_relative" :style="item.styleObj">
				<div class="pro-search"><input type="text" placeholder="请输入产品名称" v-model="word"><span @click="search"></span></div>
			</div>
			<div v-else-if="item.type===5" class="pro_row" :style="item.styleObj">
				<div class="pro_col5" :style="item.items[0].styleObj"><img @click="goPage(item.items[0].link)" v-lazy="item.items[0].imgUrl" /></div>
				<div class="pro_col5" :style="item.items[1].styleObj"><img @click="goPage(item.items[1].link)" v-lazy="item.items[1].imgUrl" /></div>
				<div class="pro_col5" :style="item.items[2].styleObj"><img @click="goPage(item.items[2].link)" v-lazy="item.items[2].imgUrl" /></div>
				<div class="pro_col5" :style="item.items[3].styleObj"><img @click="goPage(item.items[3].link)" v-lazy="item.items[3].imgUrl" /></div>
				<div class="pro_col5" :style="item.items[4].styleObj"><img @click="goPage(item.items[4].link)" v-lazy="item.items[4].imgUrl" /></div>
			</div>
			<div v-else-if="item.type===6" class="pro_row" :style="item.styleObj">
				<div class="pro_col3" :style="item.items[0].styleObj"><img @click="goPage(item.items[0].link)" v-lazy="item.items[0].imgUrl" /></div>
				<div class="pro_col3" :style="item.items[1].styleObj"><img @click="goPage(item.items[1].link)" v-lazy="item.items[1].imgUrl" /></div>
				<div class="pro_col3" :style="item.items[2].styleObj"><img @click="goPage(item.items[2].link)" v-lazy="item.items[2].imgUrl" /></div>
			</div>
			<div v-else-if="item.type===7" class="pro_relative pro_title">
				<img v-lazy="item.imgUrl" />
				<img v-lazy="item.text" class="text" />
			</div>
			<div v-if="item.type===8" class="pro_row" :style="item.styleObj">
				<div class="pro_col2"><img @click="goPage(item.link)" :src="item.imgUrl" /></div>
			</div>
			<div v-else-if="item.type===9" class="pro_row" :style="item.styleObj">
				<div class="pro_col4" :style="item.items[0].styleObj"><img @click="goPage(item.items[0].link)" v-lazy="item.items[0].imgUrl" /></div>
				<div class="pro_col4" :style="item.items[1].styleObj"><img @click="goPage(item.items[1].link)" v-lazy="item.items[1].imgUrl" /></div>
				<div class="pro_col4" :style="item.items[2].styleObj"><img @click="goPage(item.items[2].link)" v-lazy="item.items[2].imgUrl" /></div>
				<div class="pro_col4" :style="item.items[3].styleObj"><img @click="goPage(item.items[3].link)" v-lazy="item.items[3].imgUrl" /></div>
			</div>
			<div v-else-if="item.type===10" class="pro_row" :style="item.styleObj">
				<iframe frameborder="0" width="100%" height="250px" src="https://v.qq.com/iframe/player.html?vid=l0525wrh298&tiny=0&auto=0" allowfullscreen></iframe>
			</div>
			<div v-else-if="item.type===11" class="pro_row" :style="item.styleObj">
				<Slider :autoplay="3000">
					<SliderItem v-for="(image,index) in item.items" :key="index">
						<img @click="goPage(image.link)" :src="image.imgUrl"/>
					</SliderItem>
				</Slider>
			</div>
		</div>
		<Footer :activeIndex="0" :cartTotal="cartTotal"/>
		<Contact />
		<Login ref="login" /><!-- @checkSuccess="checkSuccess"-->
	</div>
</template>

<script>
	import Footer from '@/components/Footer'
	import Contact from '@/components/Contact'
	import Slider from '@/components/Slider'
	import SliderItem from '@/components/SliderItem'
	import Login from '@/components/Login'
	import getTicket from '@/assets/js/getTicket'
	import $ from '@/assets/js/zepto'
	export default {
		name: 'app',
		components: {
			Footer,
			Contact,
			Slider,
			SliderItem,
			Login
		},
		data(){
			var cartTotal = 0;
			var info = this.$info;
			if(info.wxBrowser || info.cusId){
				cartTotal = this.$shopCart.getCartCount();
			}
			return {
				list:[],
				word:'',
				needPoints:0,
//				showConfirm:false,
				cartTotal,
//				curTicket:{},
				showSearch:false
			}
		},
		created(){
//			this.$toast(JSON.stringify(this.$info));
			this.getPageData();
		},
		methods:{
			getPageData(){
				var vm = this;
				$.ajax({
					type:'get',
					url:'/micro-mall-serve/act/selfBuiltMallIndexModel/indexMallPageData',
					dataType:'json',
					success:(data) => {
						vm.$loading.hide()
						if(data.status === 0){
							var listStr =  data.data.jsonData;
							var list = JSON.parse(listStr);
							for (var i=0;i<list.length;i++) {
								var item = list[i];
								if(item.type == 0 && item.link && item.link.indexOf){
									item.isSearch = item.link.indexOf('productSearch.html') > -1;
									vm.word = vm.$browser.getURLParameter('word',item.link.split("?")[1]);
									setTimeout(() => {
										vm._bindScroll();
									},600);
									break;
								}
							}
							vm.list = list;
						}else{
							vm.$toast(data.msg);
						}
					},
					error:() => {
						console.trace(e);
						vm.$toast('网络或服务器异常');
						vm.$loading.hide()
					}
				});
			},
			goPage:function(url,evt){
				if(!url) return;
    			var webStatParam = location.search.substr(1);
    			if(webStatParam){
    				webStatParam = "&"+webStatParam;
    			}
    			if(evt){
    				webStat.logCustomEvent(evt);
    			}
				if(!isNaN(url)){
					var pId = url;
	    			webStat.logCustomEvent('shouye_'+pId);
	    			MtaH5 && MtaH5.clickStat('shouye',{'pid':pId});
	    			location.assign('productDetail.html?pId='+pId+"&v="+Date.now()+webStatParam);
				}else if(/^ticket_[\d]+_[\d]+_[\d]+/.test(url)){
					// TODO 领取优惠券
					var arr = url.split('_');
					var item = {id:arr[1],needPoints:arr[2],userCopAmount:arr[3]};
					getTicket(item,this);
				}else if(url==='top'){
					window.scrollTo(0,0);
				}else{
					if(url.indexOf("?")>0){
						var urlSplit = url.split('?');
						window.location.href = urlSplit[0]+'?a=3'+webStatParam +'&'+ urlSplit[1];
					}else{
						window.location.href = url+"?a=3"+webStatParam;
					}
				}
			},
			_bindScroll(){
				var search = document.querySelector('img[search="1"]');
	    		if(search){
	    			var topS = search.offsetTop;
			    	window.addEventListener('scroll',(e) =>{
		    			var topY = $(window).scrollTop();
		    			if(topY > topS){
		    				this.showSearch = true;
		    			}else{
		    				this.showSearch = false;
		    			}
			    	});
	    		}
			},
//			checkSuccess(data){
//				if(data.codeType === 1){//登陆成功
//					var cusId = data.resultInfo && data.resultInfo.customerId
//					this.$browser.setCookie('customerId',cusId);
//					location.reload();
//				}else{//微信号绑定成功
//					this.$browser.requestOauth();
//				}
//			},
			search:function(){
				var word = this.word;
    			var webStatParam = location.search.substr(1);
    			if(webStatParam){
    				webStatParam = "&"+webStatParam;
    			}
    			location.assign('productSearch.html?word='+word+webStatParam);
			},
		},
	}
</script>
<style type="text/css">
img{
	width: 100%;
	height: auto;
	clear: both;
	vertical-align:bottom;
	margin-bottom: -1px;
}
.container{
	padding-bottom: 6rem;
}
.pro_row{overflow: hidden;}

.pro_relative{position: relative;}
.pro_relative .text{
	position: absolute;
	bottom: 9px;
	width: 30%;
	height: auto;
	left: 35%;
}
.pro_title{margin: 25px 10px 5px 10px;}
.pro_col1,.pro_col2,.pro_col4,.pro_col5,.pro_col3{float: left;box-sizing: border-box;}
.pro_col2{width: 100%;}
.pro_col1{width: 50%;}
.pro_col3{width: 33.333%;}
.pro_col4{width: 25%;}
.pro_col5{width: 20%;}
.cross{
	padding:5px 0;
	height: 60px;
	line-height: 10px;
}
.pro-header{padding-top: 10px;}
.pro-search{
	border: 1px solid #9F9F9D;
	height: 35px;
	line-height: 35px;
	padding-left: 45px;
	padding-right: 60px;
	border-radius: 5px;
	color: #C0B8AB;
	box-shadow: #9F9F9D 1px 2px 3px;
	-webkit-box-shadow: #9F9F9D 1px 2px 3px;
	-moz-box-shadow: #9F9F9D 1px 2px 3px;
	background: url('http://7xv1io.com1.z0.glb.clouddn.com/product/image/pro_index_search.png') no-repeat 10px center/auto 25px white;
	position: fixed;
	top: 15px;left: 15px;right: 15px;
	z-index: 10;
}
.pro-search input{
	height: 100%;
	box-sizing: border-box;
	padding: 5px 0;
	width: 100%;
	border: none;
	background-color: inherit;
	color: inherit;
	outline: none;
	font-size: 1.5rem;
}
.pro-search span{
	position: absolute;
	background: url('http://7xv1io.com1.z0.glb.clouddn.com/product/image/pro_index_search1.png') no-repeat 10px center/auto 25px;
	width: 60px;height: 100%;
	top: 0;right: 0;
}

</style>