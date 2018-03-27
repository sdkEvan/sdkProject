import axios from 'axios'
import Qs from 'qs'

/* 获取持仓报表 */
export const getPositionList = params => { return axios.post(`/report/trade_report`, Qs.stringify(params)).then( res => res.data ); };

/* 获取交易历史列表 */
export const getHistoryList = params => { return axios.post(`/report/trade_history_report`, Qs.stringify(params)).then( res => res.data ); };

/* 获取个人统计数据 */
export const getPersonalInfo = params => { return axios.post(`/report/self_report`, Qs.stringify(params)).then( res => res.data ); };

/* 获取介绍经纪商列表 */
export const getIBData = params => { return axios.post(`/report/broker_report`, Qs.stringify(params)).then( res => res.data ); };

/* 获取我的直属客户列表 */
export const getRetailData = params => { return axios.post(`/report/retail_report`, Qs.stringify(params)).then( res => res.data ); };

/* 根据id 获取下级列表 */
export const getRetailList = params => { return axios.post(`/report/get_sub_report`, Qs.stringify(params)).then( res => res.data ); };

