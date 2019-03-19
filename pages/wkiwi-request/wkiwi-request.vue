<template>
	<view class="content">
		wkiwi-request
	</view>
</template>

<script>
	export default {
		name:'wkiwi-request'
		data() {
			return {
				title: 'Hello',
				page: 1,
			}
		},
		onLoad() {
			this.loadList();
		},
		methods: {
			loadList(){
				let _this = this;
				var allParams = {
					url: '/goods/list?page='+ _this.page,//地址为Config.restUrl拼接地址 
					setUpUrl: true, //不需要拼接请设置为false 
					type: 'get', //请求类型
					sCallback: function (data) {
						console.log(data)
					},
					eCallback: function () {
					}
				};
				console.log(_this.$base)
				_this.$base.request(allParams);
			},
		}
	}
</script>

<style>
</style>
