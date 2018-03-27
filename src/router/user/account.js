
import allAccount from '../../views/account/allAccount.vue'
import introduceBroker from '../../views/account/introduceBroker.vue'
import retailAccount from '../../views/account/retailAccount.vue'



let accountRouter = [
    {
        path: 'allAccount',
        name: '所有账户',
        meta: {
            index: '3-1',
        },
        component: allAccount
    },{
        path: 'introduceBroker',
        name: '我的介绍经纪商',
        meta: {
            index: '3-2',
        },
        component: introduceBroker
    },{
        path: 'retailAccount',
        name: '我的直属客户',
        meta: {
            index: '3-3',
        },
        component: retailAccount
    }
];
export default accountRouter
