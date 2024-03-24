<template>
    <div class="min-h-100vh bg-dark-700 text-#FFF flex-center flex-col">
        <p class="text-12px">[beta]</p>

        <h1 class="my-15px text-72px">an API for realtime lip-sync</h1>
        <p class="text-24px">visually dub any video to any audio in any language -</p>
        <p class="mt-10px text-#d97706 text-24px">no training required</p>

        <a-button
            v-if="!userStore.isLogin"
            type="primary"
            size="large"
            shape="round"
            class="mt-20px text-24px py-10px px-65px h-auto"
            style="border-radius: 30px;"
            @click="userStore.switchLoginVisible(true)"
        >登&ensp;录</a-button>
    </div>
</template>

<script>
export default {
    name: 'Index',
}
</script>

<script setup>

import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore();


</script>

<style>

</style>