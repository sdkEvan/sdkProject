import axios from 'axios'
import Qs from 'qs'

/* 获取用户组列表 */
export const getUserGroup = params => { return axios.post(`/settings/user_group`, Qs.stringify(params)).then( res => res.data ); };

/* 添加用户组 */
export const addUserGroup = params => { return axios.post(`/settings/add_group`, Qs.stringify(params)).then( res => res.data ); };

/* 修改用户组 */
export const updateUserGroup = params => { return axios.post(`/settings/update_group`, Qs.stringify(params)).then( res => res.data ); };

/* 所有菜单列表 */
export const getMenuList = params => { return axios.post(`/settings/get_menu`, Qs.stringify(params)).then( res => res.data ); };

/* 获取该用户组权限 */
export const getGroupAuth = params => { return axios.post(`/settings/get_group_settings`, Qs.stringify(params)).then( res => res.data ); };

/* 用户组权限提交 */
export const editGroupAuth = params => { return axios.post(`/settings/privilege_settings`, Qs.stringify(params)).then( res => res.data ); };

/* 禁用/解禁用户组 */
export const forbidGroupAuth = params => { return axios.post(`/settings/disable_group`, Qs.stringify(params)).then( res => res.data ); };



