<template>
	<Mask>
		<ul>
			<li v-for="i in 10">{{i}}</li>
		</ul>
	</Mask>
</template>

<script>
	import Mask from './Mask'
	export default {
		name:'scroll',
		components:{
			Mask
		},
		data(){
			return {
				list:[]
			}
		}
	}
</script>

<style>
</style>