<template>
    <div class="main-wrapper">

        <div style="width: 750px; ">

            <a-form 
                :model="form"
                :rules="rules"
                @submit="handleSubmit"
            >
                <a-form-item
                    field="human_uuid"
                    label="选择人物"
                    show-colon
                >
                    <a-select
                        v-model="form.human_uuid"
                        value-key="human_uuid"
                        placeholder="请选择"
                        :options="humenList"
                        :field-names="humenFields"
                    >
                    </a-select>
                </a-form-item>
                <a-form-item
                    field="audio_urls"
                    label="上传音频"
                    show-colon
                >
                    <a-upload
                        v-model:file-list="form.audio_urls"
                        name="file"
                        action="/"
                        accept="audio/*"
                        :custom-request="handleUpload"
                        draggable
                        multiple
                        :limit="5"
                        :auto-upload="true"
                        :show-link="false"
                        tip="支持上传1至5段音频"
                    />
                </a-form-item>
                <a-form-item content-class="justify-end">
                    <a-button html-type="submit" type="primary" size="large">提交</a-button>
                </a-form-item>
            </a-form>
            
        </div>

        <div class="mt-30px">
            <h3 class="text-24px">Personal Items<span v-if="readyInfo.list.length"> ({{ readyInfo.list.length }})</span></h3>
            <div class="mt-30px">
                <a-spin :loading="readyInfo.loading" tip="加载中..." :size="40" class="w-full" style="min-height: 400px;">

                    <a-empty v-if="!readyInfo.loading && !readyInfo.list.length" class="ready-empty flex-col-center" style="min-height: inherit;"/>
                    <a-row v-else-if="!readyInfo.loading && readyInfo.list.length" :gutter="[0, 30]" align="stretch" class="" >
                        <a-col
                            v-for="(vItem, vIdx) in readyInfo.list"
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
    </div>
</template>

<script>
export default {
    name: 'Produce',
}
</script>

<script setup>
import { reactive, shallowReactive, shallowRef, nextTick, onMounted, markRaw } from 'vue'

import { Message, Modal } from '@arco-design/web-vue'

import { PRODUCE_API, COMMON_API } from '@/api'

import { download } from '@/utils'

const form = reactive({
    human_uuid: '',
    audio_urls: [],
}), rules = shallowReactive({
    human_uuid: [
        { required: true, message: '请选择人物' }
    ],
    audio_urls: [
        { type: 'array', required: true, minLength: 1, maxLength: 5, message: '请上传音频' }
    ]
})

// 获取数字人
const humenList = shallowRef([]),
    humenFields = markRaw({
        value: 'human_uuid',
        label: 'human_name'
    });
const queryHumanList = async () => {
    const res = await PRODUCE_API.GET_HUMAN_LIST();

    if(res) {
        humenList.value = res?.data?.human_list || [];
    }
}

// 已完成的视频
const readyInfo = shallowReactive({
    loading: true,

    list: []
})
const queryReadyList = async () => {

    readyInfo.loading = true;

    const res = await PRODUCE_API.GET_VIDEO_LIST();

    if(res) {
        readyInfo.list = res?.data?.video_list || []
    }

    readyInfo.loading = false;
}

// 上传
const handleUpload = async (opts) => {
    const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name
    } = opts;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 设置超时时间为 30 秒
    const res = await COMMON_API.POST_UPLOAD_FILE({
        file: fileItem.file
    },{
        signal: controller.signal
    }).finally(() => clearTimeout(timeoutId)); // 清除超时计时器
    // signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds [nodejs 17.3+]
    // const res = await COMMON_API.POST_UPLOAD_FILE({
    //     file: fileItem.file
    // },{
    //     signal: controller.signal
    // })
    if(res) {
        // 这里会往fileItem对象上的response添加onSuccess的参数
        onSuccess(res?.data?.audio_urls || [])
    }
    else {
        onError(res || [])
    }
    

    return {
        abort() {
            controller.abort();
        }
    }
}

const handleSubmit = async ({ values, errors }) => {

    if(errors) {
        Message.warning('请先完善必填信息~');
        return;
    }
    else {
        const hasUnloadUrl = values.audio_urls.some(item => {
            return item.status != 'done' || !(item.response && item.response.length)
        })

        let isSure = true;

        if(hasUnloadUrl) {
            // Message.warning('上传音频中存在失效音频将会自动过滤~')
            await new Promise((resolve) => {
                Modal.warning({
                    title: '提示',
                    content: '上传音频中失败的或者存在失效音频将会自动过滤，是否确认提交？',
                    hideCancel: false,
                    onCancel: () => {
                        isSure = false
                        resolve(false)
                    },
                    onOk: () => {
                        isSure = true
                        resolve(true)
                    }
                })
            })
            
        }

        if(isSure) {
            const res = await PRODUCE_API.POST_MAKE_VIDEO({
                human_uuid: values.human_uuid,
                audio_urls: values.audio_urls.reduce((prev, cur) => {
                    if(cur.status == 'done' && cur.response && cur.response.length) {
                        prev.push(...cur.response)
                    }

                    return prev;
                }, [])
            });

            if(res) {
                Message.success('操作成功，请等候视频生成~');
                queryReadyList();
            }
        }

    }
}

// 下载
const handleDownload = (vItem) => {
    download(vItem.oss_url, 1)
}

onMounted(() => {
    queryHumanList();

    queryReadyList();
})

</script>

<style lang="scss" scoped>

.ready-empty {
    :deep() {
        .arco-empty-image {
            font-size: 88px;
        }
    }
}
</style>