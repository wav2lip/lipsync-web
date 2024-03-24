import axios from 'axios'

import { nextTick } from 'vue'

import { Message } from '@arco-design/web-vue'

import { useUserStore } from '@/stores/userStore'

import Router from '@/routes'

const HTTP = axios.create({
    baseURL: 'http://xxx.com',
    timeout: 15000,

})

// Add a request interceptor
HTTP.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log('请求体--', config)

    const userStore = useUserStore()

    if(userStore.acToken) {
        config.headers.accessToken = userStore.acToken;
    }

    // config.headers.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3V1aWQiOiI0MjlkMDY5ZjczZTk0MmFhOWVlZWQ1ODg3NWU2ZGZiMSIsInVzZXJfbmFtZSI6IndvcmsiLCJleHAiOjE3MDgxNTQ2NzJ9.AI-pzjcPYxH50wMC5-QNDjGRGaoYtw0lFHIwYodHrUQ'
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
HTTP.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('响应体--', response)

    const RES_STATUS = response.data?.result || -1;

    const userStore = useUserStore();

    if(RES_STATUS == 200) {
        // 因为这里已经预先读取
        // 返回对象内的result的字段作判断
        // 因此调用接口时不需要再.result判断状态了
        // 而是直接判断不为空即可！
        return response.data;
    }
    else if(RES_STATUS == 3401) {
        // 登录失效
        userStore.clearToken();

        Message.error({
            id: 'NOT_LOGIN',
            content: response.data?.data?.login_res || '请先进行登录~',
        })
        nextTick(() => {
            userStore.switchLoginVisible(true)
        })
        Router.replace({ name: 'index' })
    }
    else {

        Message.error({
            id: 'SYS_ERROR',
            content: '系统错误~',
        })

        // 正规的应该是封装成Promise
        // return Promise.reject(false)
        return null;
    }

}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('响应体error--', error)
    // 这里没有捕获到 HTTP请求的原始状态码！！！axios配置validateStatus
    if(error.code == 'ERR_NETWORK') {
        Message.error({
            id: 'SYS_ERROR',
            content: '系统错误~',
        })
    }else if(error?.message?.indexOf('timeout') > -1) {
        Message.error({
            id: 'SYS_TIMEOUT',
            content: '接口超时~',
        })
    }

    // return Promise.reject(error);
    return null;
});


export default HTTP;
