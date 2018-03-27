<template>
	<div class="login-container" id="home" :style="note">
		<canvas id="canvas" class="canvas"></canvas>
		<el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
		class="card-box login-form" style="z-index:10">
			<h3 class="title"><img src="../../assets/img/login/svs_login_logo.png"></h3>
			<span class="changeLang" @click="changeLanguage"><span v-if="isEnglish"><el-tag>CN</el-tag></span><span v-else><el-tag>EN</el-tag></span></span>
			<el-form-item prop="login">
				<span class="svg-account"><i class="fa fa-user" aria-hidden="true"></i></span>
				<el-input name="login" type="text" v-model="loginForm.login" @keyup.enter.native="handleLogin" autoComplete="on" :placeholder="!isEnglish ? '请输入账号' : 'Please enter your username'"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<span class="svg-container"><i class="fa fa-lock" aria-hidden="true"></i></span>
				<el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
				:placeholder="isEnglish ? 'Please enter your password' : '请输入密码'"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" style="width:100%;" :loading="loading" @click.enter.prevent="handleLogin">
				<span>{{isEnglish ? 'Login' : '登录'}}</span>
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import loginbg from "@/assets/img/login/loginbg.jpg";
import { requestLogin } from "@/api/login/login"
export default {
	name: "login",
	data() {
		return {
			loginForm: {
				login: "",
				password: "",
			},
			loginRules: {
				login: [
					{ required: true, trigger: "blur", validator: this.validateLogin }
				],
				password: [
					{ required: true, trigger: "blur", validator: this.validatePass }
				]
			},
			loading: false,
			showDialog: false,
			note: {
				/* backgroundImage: "url("+ loginbg + ")",
				backgroundRepeat: "no-repeat",
				backgroundSize: "100% auto" */
			},
			isEnglish: sessionStorage.getItem('language') ? (sessionStorage.getItem('language') == 'en' ? true : false) : false 
		};
	},
	/* 计算属性 */
	computed: {
		/* isEnglish: function(){
			let langSession = sessionStorage.getItem('language');
			let bool;
			if(langSession){
				if(langSession == 'en'){
					bool = false;
				}else{
					bool = true;
				}
			}else{
				bool = false;
			}
			return bool;
		} */
	},
	mounted() {
		this.drawCanvas();
	},
	methods: {
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true;
					let params = {
						username: this.loginForm.login,
						password: this.loginForm.password
					}
					requestLogin(params).then( v => {
						this.loading = false;
						if(v.code == 0){
							sessionStorage.setItem('access-token',v.data.access_token);
							let pData = [];
							v.data.privilege.map( pv => {
								pData.push(pv.method);
							})
							sessionStorage.setItem('authList',JSON.stringify(pData));
							sessionStorage.setItem('user_info',JSON.stringify(v.data.user_info));
							sessionStorage.setItem('disabledCode',false);
							this.$router.push({ path: "/allAccount" });
						}else{
							this.$message({
								message: this.isEnglish ? 'Username or password is invalid' : '用户名或密码错误',
								type: 'error'
							});
						}
					})
				} else {
					return false;
				}
			});
		},
		validateLogin(rule, value, callback){
    		if(value === ''){
				let loginMsg1 = this.isEnglish ? 'Please enter your username' : '请输入用户名'
	          	callback(new Error(loginMsg1));
	        }else{
	        	var ptn = /^[A-Za-z0-9_]{2,15}$/;
	        	var res = ptn.test(value);
	        	if(!res){
					let loginMsg2 = this.isEnglish ? 'Please enter the correct username' : '用户名不正确'
	        		callback(new Error(loginMsg2));
	        	}else{
	        		callback();
	        	}
	        }
    	},
		validatePass(rule, value, callback){
    		if(value === ''){
				let passMsg1 = this.isEnglish ? 'Please enter your password' : '请输入密码'
	          	callback(new Error(passMsg1));
	        }else{
	        	var ptn = /^[\S]{4,20}$/;
	        	var res = ptn.test(value);
	        	if(!res){
					let passMsg2 = this.isEnglish ? 'Please enter the correct password' : '密码不正确'
	        		callback(new Error(passMsg2));
	        	}else{
		          	callback();
	        	}	
	        }
    	},
		drawCanvas(){
			var canvas = document.querySelector('canvas'),
			ctx = canvas.getContext('2d')
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			ctx.lineWidth = .3;
			ctx.strokeStyle = (new Color(150)).style;

			// var mousePosition = {
			// 	x: 30 * canvas.width / 100,
			// 	y: 30 * canvas.height / 100
			// };
			var mousePosition = {
				x:  canvas.width - 100,
				y:  canvas.height - 60
			};

			var dots = {
				nb: 250,
				distance: 100,
				d_radius: 150,
				array: []
			};

			function colorValue(min) {
				return Math.floor(Math.random() * 255 + min);
			}

			function createColorStyle(r,g,b) {
				return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
			}

			function mixComponents(comp1, weight1, comp2, weight2) {
				return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
			}

			function averageColorStyles(dot1, dot2) {
				var color1 = dot1.color,
				color2 = dot2.color;

				var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
				g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
				b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
				return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
			}

			function Color(min) {
				min = min || 0;
				this.r = colorValue(min);
				this.g = colorValue(min);
				this.b = colorValue(min);
				this.style = createColorStyle(this.r, this.g, this.b);
			}

			function Dot(){
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;

				this.vx = -.5 + Math.random();
				this.vy = -.5 + Math.random();

				this.radius = Math.random() * 2;

				this.color = new Color();
			}

			Dot.prototype = {
				draw: function(){
					ctx.beginPath();
					ctx.fillStyle = this.color.style;
					ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
					ctx.fill();
				}
			};

			function createDots(){
				for(var i = 0; i < dots.nb; i++){
					dots.array.push(new Dot());
				}
			}

			function moveDots() {
				for(var i = 0; i < dots.nb; i++){

					var dot = dots.array[i];

					if(dot.y < 0 || dot.y > canvas.height){
						dot.vx = dot.vx;
						dot.vy = - dot.vy;
					}
					else if(dot.x < 0 || dot.x > canvas.width){
						dot.vx = - dot.vx;
						dot.vy = dot.vy;
					}
					dot.x += dot.vx;
					dot.y += dot.vy;
				}
			}

			function connectDots() {
				for(var i = 0; i < dots.nb; i++){
					for(var j = 0; j < dots.nb; j++){
						var i_dot = dots.array[i];
						var j_dot = dots.array[j];

						if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
							if((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
								ctx.beginPath();
								ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
								ctx.moveTo(i_dot.x, i_dot.y);
								ctx.lineTo(j_dot.x, j_dot.y);
								ctx.stroke();
								ctx.closePath();
							}
						}
					}
				}
			}

			function drawDots() {
				for(var i = 0; i < dots.nb; i++){
					var dot = dots.array[i];
					dot.draw();
				}
			}

			function animateDots() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				moveDots();
				connectDots();
				drawDots();

				requestAnimationFrame(animateDots);	
			}

			//----------------------跟着鼠标动--------------------
			document.getElementById('home').addEventListener('mousemove', function(e){
				mousePosition.x = e.pageX;
				mousePosition.y = e.pageY;
			});

			document.getElementById('home').addEventListener('mouseleave', function(e){
				mousePosition.x = canvas.width / 2;
				mousePosition.y = canvas.height / 2;
			});
			//----------------------跟着鼠标动--------------------

			createDots();
			requestAnimationFrame(animateDots);
		},
		changeLanguage(){
			if(this.isEnglish){
				this.$i18n.locale = 'cn';
			}else{
				this.$i18n.locale = 'en';
			}
			this.isEnglish = !this.isEnglish;
			/* 记录使用语言 中/英文 */
			sessionStorage.setItem('language',this.$i18n.locale);
			this.loginForm.login = '';
			this.loginForm.password = '';
			/* 移除表单的校验结果 */
			this.$refs.loginForm.clearValidate();
		}
	},
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/assets/css/mixin.scss";
.tips {
	font-size: 14px;
	color: #fff;
	margin-bottom: 5px;
}
.login-container {
	@include relative;
	height: 100vh;
	background-color: #2d3a4b;
	.el-form-item__content {
		display: flex;
	}
	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		color: #454545;
	}
	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
		-webkit-text-fill-color: #fff !important;
	}
	input {
		background: transparent;
		border: 0px;
		-webkit-appearance: none;
		border-radius: 0px;
		padding: 12px 5px 12px 15px;
		color: #eeeeee;
		height: 47px;
	}
	.el-input {
		display: inline-block;
		height: 47px;
		// width: 85%;
	}
	.svg-container {
		padding: 5px 5px 6px 15px;
		color: #FFF;
	}
	.svg-account{
		padding: 4px 5px 6px 15px;
		color: #FFF;
	}
	.title {
		font-size: 26px;
		font-weight: 400;
		color: #eeeeee;
		margin: 0px auto 25px auto;
		text-align: center;
		font-weight: bold;
	}
	.login-form {
		position: absolute;
		left: 0;
		right: 0;
		width: 330px;
		padding: 35px 35px 15px 35px;
		margin: calc((100vh - 362px)/2) auto;
		background: rgba(158, 160, 162, 0.6);
		border-radius: 10px;
	}
	.forget-pwd {
		color: #fff;
	}
	.el-button{
		border-radius: 10px;
	}
	.changeLang{
		position:absolute;
		top:20px;
		right:15px;
		cursor: pointer;
	}
	.el-tag{
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.1);
		width: 40px;
		background-color: rgba(0, 0, 0, 0.1);
	}
}
</style>
<style>
#home{
	position: relative;
	width: 100%;
	height: 100%;
	color: #fff;
	overflow-x: hidden;
	background: rgba(7,17,27,0.95);
}
.canvas {
    position: fixed;
    z-index: 1;
}
.svg-container .fa{
	font-size: 18px;
}
.svg-account .fa{
	font-size: 16px;
}
</style>
