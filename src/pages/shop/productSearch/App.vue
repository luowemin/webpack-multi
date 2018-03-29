<template>
	<div id="app">
		<div class="pro-search"><input type="text" placeholder="请输入产品名称" v-model="word"><span @click="search"></span></div>
		<div class="search-result">
			<div v-if="isSearch && list.length===0" class="search-null">没有搜索到你想要的产品！</div>
			<table class="result-item" v-if="list.length>0" v-for="product in list" @click="goProductDetail(product.id)">
				<tbody>
					<tr>
						<td rowspan="2" class="pro-img"><img :src="getIcon(product.groupedImages)" alt=""/></td>
						<td class="pro-name">{{product.productTemplateName}}</td>
					</tr>
					<tr><td class="pro-price">￥{{product.minPrice ===product.maxPrice?product.minPrice:product.minPrice+"~"+product.maxPrice}}</td></tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	import $ from '@/assets/js/zepto'
	export default {
		name: 'app',
		components: {
		},
		data(){
			return {
				container:{},
				list:[],
				word:'',
				proName:'',
				needPoints:0,
				showConfirm:false,
				showToast:false,
				showLoading:false,
				isSearch:false,
				curTicket:{}
			}
		},
		created(){
//			this.$toast(JSON.stringify(this.$info));
			this.word = this.$browser.getURLParameter('word');
			if(this.word){
				this.search();
			}
		},
		methods:{
			search:function(){
				var vm = this;
				console.log(this);
				var name = this.word;
				if(!name){
					vm.$toast("请输入产品名称");
					return;
				}
				$("#loading").show();
				vm.isSearch = true;
				$.ajax({
					type:"get",
					url:"/wechat-shop-back/product/search/"+name,
					success:function(data){
						if(data.status === 0){
							vm.list = data.data;
						}else{
							vm.list = [];
							vm.$toast(data.msg);
						}
						$("#loading").hide();
					},
					error:function(){
						vm.$toast("网络或服务器异常");
						$("#loading").hide();
					}
				});
			},
			goProductDetail:function(id){
				var webStatParam = location.search.substr(1);
    			if(webStatParam){
    				webStatParam = "&"+webStatParam;
    			}
				window.location.href = "productDetail.html?pId="+id+webStatParam;
			},
			getIcon(images){
				if(images && images.icon && images.icon[0].imageUrl){
					return images.icon[0].imageUrl;
				}else{
					return '';
				}
			}
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>



<style type="text/css">
	.pro-search{
		border: 1px solid #9F9F9D;
		height: 35px;
		margin: 15px;
		line-height: 35px;
		padding-left: 45px;
		padding-right: 60px;
		border-radius: 5px;
		color: #C0B8AB;
		box-shadow: #9F9F9D 1px 2px 3px;
		-webkit-box-shadow: #9F9F9D 1px 2px 3px;
		-moz-box-shadow: #9F9F9D 1px 2px 3px;
		background: url('http://7xv1io.com1.z0.glb.clouddn.com/product/image/pro_index_search.png') no-repeat 10px center/auto 25px;
		position: relative;
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
	}
	.pro-search span{
		position: absolute;
		background: url('http://7xv1io.com1.z0.glb.clouddn.com/product/image/pro_index_search1.png') no-repeat 10px center/auto 25px;
		width: 60px;height: 100%;
		right: 0;
		top: 0;
	}
	.search-result{
		font-size: 16px;
		padding: 5px 0;
	}
	.search-null{
		text-align: center;
		font-size: 16px;
		height: 150px;
		line-height: 150px;
	}
	.result-item{
		margin: 10px 0;
		background-color: white;
		border-bottom: 1px solid #DCDCDC;
		width: 100%;
	}
	.result-item .pro-img{
		width: 80px;
		height: 80px;
		padding: 10px;
	}
	.result-item .pro-img img{
		max-width: 100%;
		max-height: 100%;
	}
	.result-item .pro-name{
		font-size: inherit;
		padding: 5px 0;
		height: 48px;
		text-align: left;
	}
	.result-item .pro-price{
		color: red;
		font-size: inherit;
		text-align: left;
	}
	.mask-layer{
		display: none;
		position: fixed;
		top: 0;bottom: 0;
		left: 0;right: 0;
		background-color: rgba(0,0,0,0.6);
		z-index: 100;
		transition: 300ms;
	}
	.mask-layer img{
		width: 60px;
		height: 60px;
		position: absolute;
		top: 50%;left: 50%;
		margin: -30px 0 0 -30px;
	}
	
</style>