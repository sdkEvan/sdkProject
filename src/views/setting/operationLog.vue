<template>
    <div class="operationLog">
        <el-button class="BtnHover">按钮</el-button>
        <div class="tri-up"></div>


        <!-- <ul id="list">
  		<li v-for="(val,i) in arr" :key="i" :style="[{'z-index':arr.length-i},completeIndex>=i&&{'background':'#13CE66'}]">
        <em class="before" v-show="i!==0"></em>
        <span :style="[i===0&&{'left':'5px;'},completeIndex>=i&&{'color':'#fff'}]">{{val.first_name}}<i v-show="i===activeIndex" class="el-icon-loading" style="font-size:14px;margin-left:5px;"></i></span>
        <em class="after" v-show="i!==(arr.length-1)" :style="completeIndex>=i&&'background:#13CE66'"></em>
      </li>
  	</ul> -->
        <ul id="list">
                <li>
                    <em class="before"></em>
                    <span>loading</span>
                    <em class="after"></em>
                </li>
        </ul>



    </div>
</template>
<script>
export default {
    name:'operationLog',
      data() {
        return {
        
        }
    },
    mounted(){
        
    },
    methods: {
        
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">

#list{
    width: 10%;
    list-style: none;
    display: flex;
    margin: 0 auto 10px;
    padding: 0;
    li{
        border-left: 1px solid green;
        background: green;
        text-align: center;
        float: left;
        flex: 1;
        margin: 10px 5px 0;
        border-top: 1px solid green;
        height: 45px;
        position: relative;
        span{
            line-height: 45px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: absolute;
            top: 0;
            left: 15px;
            z-index: 100;
            display: inline-block;
            text-align: center;
            width: 100%;
            &:first-child{
            left: 5px;
            }
        }
        .before{
            border: #E5E9F2 solid;
            border-width: 1px 1px 0 0;
            width: 32px;
            height: 32px;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            float: left;
            top: 0;
            margin: 6px 10px 0px -17px;
            background: #fff;
            z-index: 1;
        }
        .after{
            float: right;
            border: #E5E9F2 solid;
            border-width: 1px 1px 0 0;
            width: 32px;
            height: 32px;
            margin: 6px -17px 0px 10px;
            top: 0;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            background: green;
            z-index:4;
        }
    }
}



/* .tri-up{
    width: 0;
    height:100;
    border-left:20px solid blue;
    border-right: 20px solid yellow;
    border-top: 20px solid pink;  
    border-bottom: 20px solid red;  
} */




/* .BtnHover{
    overflow: hidden;
    position: relative;
    &:after{
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0;
        border-color: transparent #185a62 transparent transparent;
        position: absolute;
        top: 0;
        right: 0;
        -webkit-transition: .5s;
        transition: .5s;
    }
}
.BtnHover:hover{
    &:after{
        border-width: 100px;
    }
} */



.BtnHover{
	overflow:hidden;
	position:relative;
	z-index:1;
	margin-left:200px;
	&:before{
		content: '';
	    width: 0;
	    height: 0;
	    border-style: solid;
	    border-width: 0;
	    border-color: transparent transparent transparent #185a62;
	    position: absolute;
	    bottom: 0;
	    left: 0;
	    -webkit-transition: 5s;
	    transition: 5s;
	    z-index: -1
	}
	&:after{
		content: '';
	    width: 0;
	    height: 0;
	    border-style: solid;
	    border-width: 0;
	    border-color: transparent #185a62 transparent transparent;
	    position: absolute;
	    top: 0;
	    right: 0;
	    -webkit-transition: .5s;
	    transition: .5s;
	    z-index: -1
	}

}

.BtnHover:hover{
	color:red;
	&:before{
		border-width:80px 0 0 80px;
	}
	&:after{
		border-width:0 80px 80px 0;
	}
}
</style>

