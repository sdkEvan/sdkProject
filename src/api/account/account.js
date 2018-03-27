import axios from 'axios'
import Qs from 'qs'

/* 获取所有用户列表 */
export const getAccountIndex = params => { return axios.post(`/account/account_index`, Qs.stringify(params)).then( res => res.data ); };

/* 根据login获取子层列表 */
export const getAccountList = params => { return axios.post(`/account/get_account_list`, Qs.stringify(params)).then( res => res.data ); };

/* 获取我的介绍经纪商列表 */
export const getBrokerList = params => { return axios.post(`/account/my_brokers`, Qs.stringify(params)).then( res => res.data ); };

/* 获取我的直属客户列表 */
export const getRetailList = params => { return axios.post(`/account/my_retails`, Qs.stringify(params)).then( res => res.data ); };