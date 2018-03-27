import axios from 'axios'
import Qs from 'qs'

/* 获取所有用户列表 */
export const getAllUser = params => { return axios.post(`/user/user_index`, Qs.stringify(params)).then( res => res.data ); };

/* 根据login获取子层列表 */
export const getSubordinateUser = params => { return axios.post(`/user/get_subordinate_user`, Qs.stringify(params)).then( res => res.data ); };

/* 根据login获取交易列表 */
export const getTradeList = params => { return axios.post(`/account/get_trade`, Qs.stringify(params)).then( res => res.data ); };

/* 根据login获取交易历史 */
export const getTradeHistory = params => { return axios.post(`/account/get_trade_history`, Qs.stringify(params)).then( res => res.data ); };

/* 获取客户数月增长数据 */
export const getClientStatistic = params => { return axios.post(`/manage/register_statistic`, Qs.stringify(params)).then( res => res.data ); };

/* 交易量统计 */
export const getVolumeStatistic = params => { return axios.post(`/manage/volume_statistic`, Qs.stringify(params)).then( res => res.data ); };

/* 本月客户活跃度 */
export const getActiveStatistic = params => { return axios.post(`/manage/active_statistic`, Qs.stringify(params)).then( res => res.data ); };

/* 首页统计数据 */
export const getIndexStatistic = params => { return axios.post(`/manage/statistic`, Qs.stringify(params)).then( res => res.data ); };

/* 添加用户 */
export const addUser = params => { return axios.post(`/user/add`, Qs.stringify(params)).then( res => res.data ); };

/* 修改用户 */
export const editUser = params => { return axios.post(`/user/edit`, Qs.stringify(params)).then( res => res.data ); };

/* 修改用户权限 */
export const editUserAuth = params => { return axios.post(`/user/lock`, Qs.stringify(params)).then( res => res.data ); };

/* 绑定下级交易账号 */
export const bindLowerAccount = params => { return axios.post(`/user/bind_trading_account`, Qs.stringify(params)).then( res => res.data ); };

/* 发送开户邮件 */
export const sendEmail = params => { return axios.post(`/user/send_account_email`, Qs.stringify(params)).then( res => res.data ); };

/* 获取用户信息 */
export const getProUserinfo = params => { return axios.post(`/profile/get_user`, Qs.stringify(params)).then( res => res.data ); };

/* 佣金历史 */
export const rebateHistoryInfo = params => { return axios.post(`/user/rebate_history`, Qs.stringify(params)).then( res => res.data ); };

/* 佣金历史类型 */
export const getCmdType = params => { return axios.post(`/user/cmd_type`, Qs.stringify(params)).then( res => res.data ); };

/* 添加佣金信息 */
export const insertRebate = params => { return axios.post(`/user/insert_rebate`, Qs.stringify(params)).then( res => res.data ); };

/* 获取用户最新余额 */
export const getNewBalance = params => { return axios.post(`/user/get_balance`, Qs.stringify(params)).then( res => res.data ); };

/* 余额变动记录 */
export const getBalanceRecord = params => { return axios.post(`/user/balance_record`, Qs.stringify(params)).then( res => res.data ); };

/* 验证银行卡信息 */
export const verifyCardInfo = params => { return axios.post(`/user/verify_card_info`, Qs.stringify(params)).then( res => res.data ); };

/* 修改银行卡信息 */
export const editCardInfo = params => { return axios.post(`/user/update_card_info`, Qs.stringify(params)).then( res => res.data ); };

