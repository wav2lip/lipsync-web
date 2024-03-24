import HTTP from './base';


// 获取作品列表
export function GET_WORK_LIST(opts) {
    return HTTP.get('/discovery/digital/video_creations', opts)
}