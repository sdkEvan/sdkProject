// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex/store'
import Vuex from 'vuex'

import 'font-awesome/css/font-awesome.css'
import './static/font/iconfont.css'

// 设置axios全局参数
import './api/config'

// 过滤器
import * as filters from './filters/filters'
// 国际化
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ChineseLangSetting from '../src/i18n/chinese/index.js'
import EnglishLangSetting from '../src/i18n/english/index.js'
// lodash
import _ from 'lodash'
// 全局注册过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
	if(to.path == '/'){
		next({ path: '/login' });
		return;
	}else{
		next();
	}
	if(to.path == '/login'){
		sessionStorage.removeItem('access-token');
		sessionStorage.removeItem('authList');
		sessionStorage.removeItem('user_info');
	}
	let accToken = sessionStorage.getItem('access-token');
	if(!accToken && to.path != '/login'){
		next({ path: '/login' });
	}else{
		if(to.path == '/login'){
			next();
		}else{
			if(to.path == '/undefined'){
				next({path: '/404'})
				return;
			}else{
				next();
			}
		}
	}
})

// 国际化
const langs = {
		en: EnglishLangSetting,
		cn: ChineseLangSetting
	}
let langSession = sessionStorage.getItem('language');
const selectedLanguage = langSession ? langSession : 'cn';
Vue.use(VueI18n);
const i18n = new VueI18n({
	locale: selectedLanguage, // set locale
	messages: langs, // set locale messages
})
if(selectedLanguage == 'cn'){
	Vue.use(ElementUI, { locale: zhLocale })
}else{
	Vue.use(ElementUI, { locale: enLocale })
}

//console.log(Vue.$prettyDom("<!DOCTYPE html> <html > <head> <title>Home</title></head> <body> This is content. </body> </html>"));
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	i18n,
	template: '<App/>',
	components: { App }
})
