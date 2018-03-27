
import withdraw from '../../views/money/withdraw.vue'
import transferApply from '../../views/money/transferApply.vue'

let moneyRouter = [
    {
        path: 'withdraw',
        name: '出金申请',
        component: withdraw
    },
    {
        path: 'transfer',
        name: '转账申请',
        component: transferApply
    }
];
export default moneyRouter
