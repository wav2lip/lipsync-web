// 基础类

import HTTP from './base';

// 上传
export function POST_UPLOAD_FILE(data, opts) {
    return HTTP.post('/discovery/digital/upload_files', data, {
        headers: {
            "Content-Type": 'multipart/form-data'
        },
        ...opts,
    })
}