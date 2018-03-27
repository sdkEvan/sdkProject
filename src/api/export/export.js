import axios from 'axios'
import Qs from 'qs'

/* 导出佣金报表 */
export const exportRebateInfo = params => { return axios.post(`/user/user_rebate_report`, Qs.stringify(params)).then( res => res.data ); };

/* 导出佣金历史报表 */
export const exportHistoryInfo = params => { return axios.post(`/user/get_rebate_history_by_login`, Qs.stringify(params)).then( res => res.data ); };

/* 单独导出excel */
export const exportAloneInfo = params => { return axios.post(`/report/calculate`, Qs.stringify(params)).then( res => res.data ); };

/* 导出出金历史报表 */
export const exportWithdrawInfo = params => { return axios.post(`/user/get_withdraw_history_by_login`, Qs.stringify(params)).then( res => res.data ); };

/* 导出转账申请报表 */
export const exportTransferInfo = params => { return axios.post(`/user/get_transfer_history_by_login`, Qs.stringify(params)).then( res => res.data ); };

/* 导出用户余额报表 */
export const exportUserBalance = params => { return axios.post(`/user/get_balance_by_login`, Qs.stringify(params)).then( res => res.data ); };
