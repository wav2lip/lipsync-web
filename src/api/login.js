import HTTP from './base';



export const LoginAPI = {
    name: 'login'
}

export const testAPI = {
    name: 'test'
}

// 登录
export function POST_LOGIN(data, opts) {
    return HTTP.post('/discovery/v1/login', data, opts)
}
