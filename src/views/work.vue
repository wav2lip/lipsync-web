<template>
    <div class="main-wrapper">
        <div class="flex">
            <span class="" style="width: 4px; background: linear-gradient(to bottom, #8976ff, #90c7ff);"></span>
            <h3 class="ml-10px text-24px">作品管理</h3>
        </div>

        <div class="mt-30px">
            <a-spin :loading="workInfo.loading" tip="加载中..." :size="40" class="w-full" style="min-height: 400px;">

                <a-empty v-if="!workInfo.loading && !workInfo.list.length" class="ready-empty flex-col-center" style="min-height: inherit;"/>
                <a-row v-else-if="!workInfo.loading && workInfo.list.length" :gutter="[0, 30]" align="stretch" class="" >
                    <a-col
                        v-for="(vItem, vIdx) in workInfo.list"
                        :key="vIdx"
                        :span="6"
                        class="px-30px flex flex-col"
                    >
                        <div class="w-full position-relative">
                            <a-image
                                :src="vItem.cover_img"
                                :preview="false"
                                width="100%"
                                height="180"
                                class="rounded-12px"
                            >
                            </a-image>

                            <div
                                class="position-absolute left-0 right-0 bottom-0 py-8px px-10px flex justify-between items-center"
                                style="background-color: var(--color-mask-bg); border-radius: 0 0 12px 12px;"
                            >
                                <!-- <template v-if="vItem.make_status_code == 1 && vItem.oss_url">
                                    <a-tag color="purple" style="line-height: normal; align-items: flex-end;">
                                        <template #icon>
                                            <icon-video-camera size="16"/>
                                        </template>
                                        <span class="text-14px">12</span>s
                                    </a-tag>
                                </template> -->
                                <!-- <template v-else> -->
                                    <a-tag
                                        :color="vItem.make_status_code == 0 ? 'orangered' : vItem.make_status_code == 1 ? 'green' : 'magenta'"
                                        style="line-height: normal;"
                                    >{{ vItem.make_status }}</a-tag>
                                <!-- </template> -->

                                <a-tooltip
                                    v-if="vItem.make_status_code == 1 && vItem.oss_url"
                                    content="下载"
                                    content-class="text-white"
                                    background-color="rgb(var(--purple-6))"
                                >
                                    <icon-download
                                        size="18"
                                        class="text-#FFF cursor-pointer"
                                        @click="handleDownload(vItem)"
                                    />
                                </a-tooltip>
                            </div>
                        </div>
                        <a-tooltip
                            :content="vItem.video_name"
                            background-color="#165DFF"
                        >
                            <p class="mt-20px truncate">{{ vItem.video_name }}</p>
                        </a-tooltip>
                        <p class="mt-10px text-12px text-#999">{{ vItem.created_at }}</p>
                    </a-col>
                </a-row>

            </a-spin>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Work'
}
</script>

<script setup>

import { shallowReactive, onMounted } from 'vue'

import { WORK_API, COMMON_API } from '@/api'

import { download } from '@/utils'

// 已完成的视频
const workInfo = shallowReactive({
    loading: true,

    list: []
})
const queryWorkList = async () => {

    workInfo.loading = true;

    const res = await WORK_API.GET_WORK_LIST();

    if(res) {
        workInfo.list = res?.data?.video_list || []
    }

    workInfo.loading = false;
}

// 下载
const handleDownload = (vItem) => {
    download(vItem.oss_url, 1)
}

onMounted(() => {
    queryWorkList()
})

</script>

<style>

</style>