import axios from 'axios'
import Qs from 'qs'

/* group列表 */
export const getUsdGroup = params => { return axios.post(`/settings/get_groups`, params).then( res => res.data ); };

/* 获取该组数据 */
export const getGroupData = params => { return axios.post(`/settings/get_settings_by_group`, Qs.stringify(params)).then( res => res.data ); };

/* 新增/修改数据 */
export const updateSetting = params => { 
    return axios.post(`/settings/rebate_settings`, Qs.stringify(params)).then( res => res.data ); 
};
