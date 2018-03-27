import axios from 'axios'
import apiUrl from './apiUrl'
import Qs from 'qs'
import router from '../router'

axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.timeout = 1000 * 3600 //请求超时时间
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded' //请求头部类型
/* axios.defaults.headers.AUTHORIZTION_FLAG = ''; //权限标识 */

// 拦截器
axios.interceptors.request.use(request => {
    request.headers['access-token'] = sessionStorage.getItem('access-token') ? sessionStorage.getItem('access-token') : "13ece11f39000f2cd18597bbcfb20192";
    return request;
})

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if(response.data.code == '200005' || response.data.code == '200004'){
            router.push({ path: 'login' });
        }
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    if (error.response && error.response.data && error.response.data.message) {
                        /*Notice.error(
                            {
                                title: error.response.data.message,
                                duration: 5,
                                closable: true
                            }
                        )*/
                    }
                    break;
                case 401:
                    // 401 清除token信息
                    
                    break;
                case 403:
                    /*Notice.error(
                        {
                            title: '没有操作权限',
                            duration: 5,
                            closable: true
                        }
                    )*/
                    break;
                case 500:
                    /*Notice.error(
                        {
                            title: '服务器出了小问题',
                            duration: 5,
                            closable: true
                        }
                    )*/
                    break;

            }
        }
        return Promise.reject(error)
    }
);
  