
import rebateSetting from '../../views/setting/rebateSetting.vue'
import userGroup from '../../views/setting/userGroup.vue'
import operationLog from '../../views/setting/operationLog.vue'

let settingRouter = [
    {
        path: 'rebateSetting',
        name: '折扣设置',
        meta: {
            index: '5-1'
        },
        component: rebateSetting
    },
    {
        path: 'userGroup',
        name: '用户组设置',
        meta: {
            index: '5-2'
        },
        component: userGroup
    },
    {
        path: 'operationLog',
        name: '操作日志',
        meta: {
            index: '5-3'
        },
        component: operationLog
    }
];
export default settingRouter
