import axios from 'axios'
import Qs from 'qs'

/* 出金申请 表单 */
export const addWithdrawInfo = params => { return axios.post(`/profile/withdraw`, Qs.stringify(params)).then( res => res.data ); };

/* 默认出金信息 */
export const withdrawDefault = params => { return axios.post(`/profile/withdraw_default_list`, Qs.stringify(params)).then( res => res.data ); };

/* 出金申请列表 */
export const withdrawList = params => { return axios.post(`/profile/withdraw_list`, Qs.stringify(params)).then( res => res.data ); };

/* 出金审核列表 */
export const withdrawCheckList = params => { return axios.post(`/user/withdraw_check_list`, Qs.stringify(params)).then( res => res.data ); };

/* 管理员 出金申请确认 */
export const withdrawSubmit = params => { return axios.post(`/user/withdraw_submit 
`, Qs.stringify(params)).then( res => res.data ); };

/* 管理员 拒绝出金申请 */
export const withdrawReject = params => { return axios.post(`/user/withdraw_reject`, Qs.stringify(params)).then( res => res.data ); };

/* 修改出金申请 */
export const editWithdraw = params => { return axios.post(`/user/update_withdraw`, Qs.stringify(params)).then( res => res.data ); };

/* 出金申请手续费用 */
export const getCharge = params => { return axios.post(`/user/get_charge`, Qs.stringify(params)).then( res => res.data ); };

/* 更改手续费用 */
export const updateCharge = params => { return axios.post(`/user/update_charge`, Qs.stringify(params)).then( res => res.data ); };

/* 出金申请银行卡信息 */
export const getWithdrawCardList = params => { return axios.post(`/user/withdraw_card_list`, Qs.stringify(params)).then( res => res.data ); };

/* 转账申请 */
export const transferRequest = params => { return axios.post(`/user/transfer`, Qs.stringify(params)).then( res => res.data ); };

/* 转账申请列表 */
export const transferList = params => { return axios.post(`/user/transfer_list`, Qs.stringify(params)).then( res => res.data ); };

/* 转账申请审核列表 */
export const transferCheckList = params => { return axios.post(`/user/transfer_check_list`, Qs.stringify(params)).then( res => res.data ); };

/* 确认转账申请 */
export const transferSubmit = params => { return axios.post(`/user/transfer_submit`, Qs.stringify(params)).then( res => res.data ); };

/* 拒绝转账申请 */
export const transferReject = params => { return axios.post(`/user/transfer_reject`, Qs.stringify(params)).then( res => res.data ); };







