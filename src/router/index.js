import Vue from 'vue'
import Router from 'vue-router'

import login from '../views/login/login.vue'
import NotFound from '../views/error/404.vue'
//import login from '../views/error/401.vue'
import home from '../views/home.vue'

import userRouter from './user/user'
import accountRouter from './user/account'
import reportRouter from './user/report'
import settingRouter from './user/setting'
import moneyRouter from './user/money'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: '登录',
            component: login
        },{
            path: '/404',
            name: '404',
            component: NotFound
        },{
            path: '/',
            name: '主页',
            component: home,
            children: [
                ...userRouter,
                ...accountRouter,
                ...reportRouter,
                ...settingRouter,
                ...moneyRouter
            ]
        }
    ]
})
