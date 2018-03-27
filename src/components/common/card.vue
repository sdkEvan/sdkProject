<template>
    <div class="wrap">
		<div class="card-wrap" :style="{border:'1px solid'+ bgcolor}">
			<div class="card-head" v-if="showTitle" :style="{background:bgcolor,height:headHeight+'px',lineHeight:headHeight+'px',color: headColor}">
				<slot name="title"></slot>
			</div>
			<div class="card-content">
				<slot name="content"></slot>
			</div>
		</div>
    </div>
</template>
<script>
export default {
	name: 'card',
	data() {
		return {
			
		}
	},
	props:{
		showTitle: {
			type: Boolean,
			default:true
		},
		headHeight: {
			type: Number,
			default: 60
		},
		bgcolor: {
			type: String,
			default: '#fff'
		},
		headColor: {
			type: String,
			default: 'black'
		}
	},
	computed: {

	},
	mounted(){

	},
	methods: {
		
	}
}
</script>
<style lang='scss' scoped>
.wrap{
	height: 100%;
	.card-wrap{
		border: 1px solid #e6ebf5;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
		color: black;
		height: 100%;
		border-radius: 4px;
		.card-head{
			padding: 18px 20px;
			font-size: 18px;
		}
	}
}
</style>
<style>

</style>