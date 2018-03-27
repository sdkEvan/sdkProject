
import personalReport from '../../views/report/personalReport.vue'
import saleManagerReport from '../../views/report/saleManagerReport.vue'
import salesReport from '../../views/report/salesReport.vue'
import IBReport from '../../views/report/IBReport.vue'
import subIBReport from '../../views/report/subIBReport.vue'
import retailClient from '../../views/report/retailClient.vue'
import clientReport from '../../views/report/clientReport.vue'
import positionReport from '../../views/report/positionReport.vue'
import houseMIBReport from '../../views/report/houseMIBReport.vue'
import houseSibReport from '../../views/report/houseSibReport.vue'
import houseClientReport from '../../views/report/houseClientReport.vue'
import tradingHistory from '../../views/report/tradingHistory.vue'
import validCalculator from '../../views/report/validCalculator.vue'

let reportRouter = [
    {
        path: 'personalReport',
        name: '个人统计',
        meta: {
            index: '4-1',
        },
        component: personalReport
    },{
        path: 'IBReport',
        name: '介绍经纪商',
        meta: {
            index: '4-2',
        },
        component: IBReport
    },{
        path: 'retailClient',
        name: '直属客户',
        meta: {
            index: '4-3',
        },
        component: retailClient
    },{
        path: 'positionReport',
        name: '持仓报表',
        meta: {
            index: '4-4',
        },
        component: positionReport
    },{
        path: 'tradingHistory',
        name: '交易历史',
        meta: {
            index: '4-5',
        },
        component: tradingHistory
    }
];
export default reportRouter
