<template>
    <a-layout class="layout w-full h-full">
        <a-layout-header>
		    <Header />
        </a-layout-header>


        <a-layout has-sider class="overflow-auto">
            <a-layout-sider
                v-if="showSidebar"
                :width="240"
            >
                <a-scrollbar type="embed" outer-class="layout-scrollbar h-full" class="h-full overflow-auto" style="">
                    
                    <a-menu
                        :collapsed="false"
                        :selected-keys="selectedKeys"
                        @menu-item-click="handleMenuItem"
                    >
                        <a-menu-item key="produce">
                            <div class="menu-item">
                                <icon-home :size="24" :stroke-width="6"/>
                                <span>数字人</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="work">
                            <div class="menu-item">
                                <icon-live-broadcast :size="24" :stroke-width="6"/>
                                <span>作品管理</span>
                            </div>
                        </a-menu-item>
                    </a-menu>

                </a-scrollbar>
            </a-layout-sider>

            <a-layout-content class="layout-content">
                <a-scrollbar type="embed" outer-class="layout-scrollbar h-full" class="h-full overflow-auto" style="">
                    <router-view #default="{ Component }">
                        <!-- <transition> -->
                            <keep-alive>
                                <component :is="Component"></component>
                            </keep-alive>
                        <!-- </transition> -->
                    </router-view>
                </a-scrollbar>
            </a-layout-content>
        </a-layout>

    </a-layout>
</template>

<script>
export default {
    name: 'layout',
}
</script>

<script setup>
import { computed } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import Header from '@/layouts/Header.vue';

const $router = useRouter(), $route = useRoute();

const showSidebar = computed(() => {
    const { name } = $route;

    const excludeMenus = [
        'index',
    ]

    return !excludeMenus.includes(name);
})

const selectedKeys = computed(() => {
    const { name } = $route;

    return [name]
})

const handleMenuItem = (key) => {
    const { name } = $route;

    if(name == key) return;

    $router.push({ name: key })
}


</script>

<style lang="scss" scoped>

.layout-content {
    background-color: var(--color-neutral-2);
}

.menu-item {
    --uno: inline-flex justify-between items-center font-semibold text-16px;
}

.layout-scrollbar {
    :deep() {
        .arco-scrollbar-thumb-bar {
            // background-color: rgb(var(--primary-4));
            background-color: #81adff;
        }

        .arco-scrollbar-thumb-dragging, .arco-scrollbar-thumb:hover {
            .arco-scrollbar-thumb-bar {
                // background-color: rgb(var(--primary-7));
                background-color: #746fff;
            }
        }
    }
}
</style>