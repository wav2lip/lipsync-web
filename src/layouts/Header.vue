<template>
    <header :class="[{ 'header-fixed': isFixed }]">
        <a-affix>
            <div
                :class="[{ 'bg-#FFF': !isFixed }]"
                class="h-40px p-20px flex justify-between items-center"
            >
                <h1
                    class="text-transparent cursor-pointer"
                    style="background-clip: text; background-image: linear-gradient(to right, #746fff, #81adff);"
                    @click="$router.push({ name: 'produce' })"
                >HiFly</h1>
                <div v-if="!userStore.isLogin">
                    <a-button
                        type="primary"
                        size="large"
                        shape="round"
                        @click="userStore.switchLoginVisible(true)"
                    >登录</a-button>
                </div>
            </div>
        </a-affix>
    </header>
</template>

<script>
export default {
    name: 'layout-header'
}
</script>

<script setup>
import { computed } from 'vue'

import { useRoute } from 'vue-router'

import { useUserStore } from '@/stores/userStore'

const $route = useRoute();

const userStore = useUserStore();

const isFixed = computed(() => {
    const RouteNames = ['index'];

    return RouteNames.includes($route.name)
})

</script>

<style lang="scss" scoped>

.header-fixed {
    --uno: position-fixed top-0 left-0 right-0;
}

</style>