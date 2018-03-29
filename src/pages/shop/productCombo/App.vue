<template>
	<div id="app">
		<div class="combo_header">
			<table class="header_text">
				<tr>
					<td v-for="(item,i) in titles" :class="{active:curIndex==i,split_line:i>0}" @click="curIndex = i">{{item}}</td>
				</tr>
			</table>
		</div>
		<div class="combo_container">
			<div class="combo_main">
				<table class="combo_item" v-for="data in combos()">
					<tr>
						<td class="combo_img" @click="goProductDetail(data.templateId)">
							<img :src="data.proImage"/>
						</td>
						<td class="top_padding">
							<div class="product_name">{{data.name}}</div>
							<div class="sub_font">{{data.skuName}}</div>
						</td>
						<td class="top_padding" style="text-align: right;">
							<div class="price_label">￥{{data.specialPrice}}</div>
							<div class="sub_font mid_line">￥{{data.price}}</div>
						</td>
					</tr>
					<tr>
						<td colspan="3" class="operator_num">
							<span @click="addItem(data)" class="op_up" :class="{disabled:!canAdd(data)}">+</span>
							<span class="op_num">{{data.quantity}}</span>
							<span @click="minusItem(data)" class="op_down" :class="{disabled:!canMinus(data)}">-</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="combo_btn">
			<div class="combo_pay" @click="payCombo">立刻购买</div>
			<div class="combo_info">
				<div class="combo_total">合计：<span class="price_label">￥{{total}}</span></div>
				<div class="sub_font">优惠：￥{{smallPrice}}</div>
			</div>
		</div>
		<Login ref="login"/>
	</div>
</template>

<script>
	import Login from '@/components/Login'
	export default {
		name: 'app',
		components: {
			Login
		},
		props:{
			list:{
				type:Array,
				required:true
			}
		},
		data:function(){
			var titles = ["套餐一","套餐二","套餐三"];
			var len = this.list.length;
			return {
				curIndex:0,
				msg:"hello",
				titles:titles.slice(0,len)
			}
		},
		computed:{
			total:function(){
				var curCombos = this.list[this.curIndex].combos;
				var sum = 0;
				curCombos.forEach(function(item){
					sum += item.quantity*item.specialPrice;
				});
				return Math.round(sum*100)/100;
			},
			smallPrice:function(){
				var curCombos = this.list[this.curIndex].combos;
				var sum = 0;
				var org = 0;
				curCombos.forEach(function(item){
					sum += item.quantity*item.specialPrice;
					org += item.quantity*item.price;
				});
				var res = org - sum;
				return Math.round(res*100)/100;
			},
		},
		methods:{
			canAdd:function(data){
				return data.quantity<data.max;
			},
			canMinus:function(data){
				return data.quantity>data.min;
			},
			minusItem:function(data){
				data.quantity--;
			},
			addItem:function(data){
				data.quantity++;
			},
			goProductDetail:function(pid){
				location.assign('productDetail.html?pId='+pid);
			},
			payCombo:function(){
				var info = this.$info;
				if(!info.cusId){
					if(info.wxBrowser){
						this.$refs.login.showBind();
					}else{
						this.$refs.login.showLogin();
					}
					return;
				}
				var index = this.curIndex;
				var curCombo = this.list[index];
				var actId = curCombo.actId;
				//TODO 下单数据处理
				var param = [];
				curCombo.combos.forEach(function(item){
					param.push({
						icon:item.proImage,
						price:item.specialPrice,
						skuName:item.skuName,
						name:item.name,
						stock:item.stock,
						transportFee:0,
						productId:item.code,
						productTemplateId:item.templateId,
						warehouseCode:item.wareHouseCode,
						quantity:item.quantity
					});
				});
				localStorage.setItem('payCombo',JSON.stringify(param));
				location.assign('payOrder.html?actComboId='+actId);
			},
			combos:function(){
				var index = this.curIndex;
				var list = this.list[index].combos;
				return list;
			}
		}
	}
</script>

<style>
	#app {
	}
	body{
		background: #F3F3F5;
	}
	*{margin: 0;padding: 0;}
	.operator_num{
		padding-bottom: 10px;
	}
	.operator_num span.disabled{
		pointer-events: none;
		color: #D4D4D4;
		border-color: #D4D4D4;
	}
	.operator_num span{
		float: right;
		height: 36px;
		line-height: 36px;
		width: 36px;
		font-size: 22px;
		text-align: center;
		border: 1px solid gray;
		transition: 0.3s;
	}
	.operator_num .op_down{
		border-radius: 6px 0 0 6px;
	}
	.operator_num .op_up{
		border-radius:0 6px 6px 0;
	}
	.operator_num .op_num{
		width: 46px;
		border-width: 1px 0;
	}
	.operator_num .op_down:active,.operator_num .op_up:active{
		background-color: gray;
	}
	.combo_img{
		width: 90px;
		height: 90px;
		padding: 10px;
		text-align: center;
	}
	.combo_img img{
		max-width: 100%;
		max-height: 100%;
	}
	.sub_font{
		font-size: 14px;color: gray;
	}
	.product_name{
		font-size: 16px;
	}
	.price_label{
		color: red;
		font-size: 16px;
	}
	.combo_header{
		position: fixed;
		top: 0;left: 0;right: 0;
		height: 50px;
		line-height: 50px;
		background: white;
	}
	.header_text{
		width: 100%;
		text-align: center;
		border: none;
		font-weight: bold;
		font-size: 1.6rem;
		border-collapse: collapse;
	}
	.header_text td{position: relative;}
	.split_line:before{
		position: absolute;
		content: '';
		border-left: 1px solid #EFEFF1;
		left: 0;top: 15px;bottom: 15px;
	}
	.header_text .active{
		color: #FC891A;
	}
	.header_text .active:after{
		content: '';
		position: absolute;
		bottom: 0;left: 15px;right: 15px;
		border-bottom: 3px solid #FC891A;
	}
	.combo_container{
		background: white;
		margin: 60px 0 70px 0;
	}
	.combo_main{
		margin: 0 10px;
	}
	.combo_list{
	}
	.combo_list .combo_item{
		padding: 10px 10px 0 30px;
		border-bottom: 1px solid #F4F4F4;
	}
	.combo_list .combo_img{
		width: 80px;
		height: 80px;
	}
	.combo_item{
		width: 100%;
		/*border-bottom: 2px dashed #F0E5DD;*/
		border-bottom: 1px solid #F4F4F4;
	}
	.mid_line{
		text-decoration: line-through;
	}
	.combo_btn{
		position: fixed;
		bottom: 0;
		left: 0;right: 0;
		height: 60px;
		border-top: 1px solid #FF6521;
		background: white;
	}
	.combo_info{
		float: right;
		height: 100%;
		padding: 10px 10px 0 0;
		text-align: right;
	}
	.combo_pay{
		float: right;
		height: 100%;
		line-height: 60px;
		width: 30%;
		text-align: center;
		background-color: #FF451C;color: white;font-size: 16px;
	}
	.top_padding{
		vertical-align: top;
		padding-top: 10px;
	}
</style>