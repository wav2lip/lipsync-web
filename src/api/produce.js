import HTTP from './base';

// 获取数字人列表
export function GET_HUMAN_LIST(opts) {
    return HTTP.get('/discovery/digital/my_human_list', opts)
}

// 制作视频
export function POST_MAKE_VIDEO(data, opts) {
    return HTTP.post('/discovery/digital/make_video', data, opts)
}

// 视频列表
export function GET_VIDEO_LIST(opts) {
    return HTTP.get('/discovery/digital/video_list', opts)
}