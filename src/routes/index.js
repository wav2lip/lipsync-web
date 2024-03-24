import { nextTick } from 'vue'

import { createRouter, createWebHistory } from 'vue-router'

import { Message, Modal } from '@arco-design/web-vue'

import { useUserStore } from '@/stores/userStore'

const DEFAULT_LAYOUT = () => import('@/layouts/index.vue');


const routes = [
    {
        path: '/',
        // name: 'index',
        // redirect: { name: 'index' },
        component: DEFAULT_LAYOUT,
        children: [
            {
                path: '',
                name: 'index',
                component: () => import('@/views/index.vue'),
            },

            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/login.vue'),
            },

            {
                path: 'produce',
                name: 'produce',
                component: () => import('@/views/produce.vue'),
                meta: { auth: true },
            },

            {
                path: 'work',
                name: 'work',
                component: () => import('@/views/work.vue'),
                meta: { auth: true },
            }
        ]
    },

    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: { name: 'index', params: {} }
    },
]


const router = createRouter({
    history: createWebHistory(),

    routes,

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { top: 0, behavior: 'smooth' }
        }
    },
})

router.beforeResolve(async (to, from) => {
    
    const userStore = useUserStore();

    // 刷新情况下
    userStore.setToken();

    await nextTick();

    if(to.meta?.auth) {
        if(userStore.isLogin) {
            return true;
        }
        else {
            Message.error({
                id: 'NOT_LOGIN',
                content: '请先进行登录~'
            })
            nextTick(() => {
                userStore.switchLoginVisible(true)
            })
            return { name: 'index' }
        }
    }
    else {
        return true;
    }

})

export default router;


