import { defineStore } from 'pinia'

const TOKEN_KEY = 'FF_TOKEN';

export const useUserStore = defineStore('userStore', {
    state() {
        return {
            // 登录弹窗
            loginVisible: false,

            // 登录凭证
            acToken: '',
        }
    },

    getters: {
        // 是否有登录
        isLogin() {
            return !!this.acToken
        }
    },

    actions: {
        switchLoginVisible(bool) {
            this.loginVisible = bool
        },

        setToken(val) {

            let token = val || ''

            if(!val) {
                token = localStorage.getItem(TOKEN_KEY) || ''
            }
            else {
                // 重新设置值时才操作storage
                localStorage.setItem(TOKEN_KEY, token)
            }

            this.acToken = token
        },

        clearToken() {
            this.acToken = ''
            localStorage.clear()
        },

    },
})