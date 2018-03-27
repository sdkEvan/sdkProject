
import index from '../../views/user/index.vue'
import allUser from '../../views/user/allUser.vue'
import rebateHistory from '../../views/user/rebateHistory.vue'
import withdrawCheck from '../../views/money/withdrawCheck.vue'
import transferCheck from '../../views/money/transferCheck.vue'
import staticReport from '../../views/user/staticReport.vue'
import bankcardCheck from '../../views/user/bankcardCheck.vue'

let userRouter = [
    {
        path: 'index',
        name: '首页',
        meta: {
            index: '1',
        },
        component: index
    },{
        path: 'allUser',
        name: '查看所有用户',
        meta: {
            index: '2-1',
        },
        component: allUser
    },{
        path: 'rebateHistory',
        name: '佣金历史',
        meta: {
            index: '2-2',
        },
        component: rebateHistory
    },{
        path: 'withdrawCheck',
        name: '出金审核',
        meta: {
            index: '2-3',
        },
        component: withdrawCheck
    },{
        path: 'transferCheck',
        name: '转账审核',
        meta: {
            index: '2-4',
        },
        component: transferCheck
    },{
        path: 'staticReport',
        name: '统计报告',
        meta: {
            index: '2-5',
        },
        component: staticReport
    },{
        path: 'bankcardCheck',
        name: '银行卡审核',
        meta: {
            index: '2-6',
        },
        component: bankcardCheck
    }
];
export default userRouter
