import axios from 'axios'
import Qs from 'qs'

/* 登录 */
export const requestLogin = params => { return axios.post(`/login/login`, Qs.stringify(params)).then( res => res.data ); };

/* 修改密码 */
export const updatePassword = params => { return axios.post(`/profile/change_pwd`, Qs.stringify(params)).then( res => res.data ); };

/* 推广链接 */
export const referLinkData = params => { return axios.post(`/profile/refer_link`, Qs.stringify(params)).then( res => res.data ); };

/* 系统公告 */
export const systemMessageData = params => { return axios.post(`/message/message_index`, Qs.stringify(params)).then( res => res.data ); };

/* 删除选中数据 */
export const deleteMessage = params => { return axios.post(`/message/delete_message`, Qs.stringify(params)).then( res => res.data ); };

/* 标记消息状态 */
export const markMessage = params => { return axios.post(`/message/mark`, Qs.stringify(params)).then( res => res.data ); };

/* 发布消息 */
export const sendMessage = params => { return axios.post(`/message/send_message`, Qs.stringify(params)).then( res => res.data ); };


