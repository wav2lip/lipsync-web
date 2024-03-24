import axios from 'axios'


// 下载
export function download(url, mode = 1, name = '') {
    // [视频链接] 2和3的效果还是会进入播放 不会下载的！！

    if(mode == 1) {
        window.open(url, '_blank')
    }
    else if(mode == 2) {
        const aEl = document.createElement('a');
        aEl.href = url;
        name && (aEl.download = name);
        aEl.rel = 'noopener noreferrer';
        document.body.appendChild(aEl);
        aEl.click();
        aEl.remove();
    }
    else {
        axios.get(url, {
            responseType: 'blob'
        }).then(res => {
            const aEl = document.createElement('a');
            const aUrl = window.URL.createObjectURL(res.data);
            aEl.href = aUrl;
            // aEl.style.display = 'none';
            name && (aEl.download = name);
            aEl.rel = 'noopener noreferrer';
            document.body.appendChild(aEl);
            aEl.click();
            
            // 这个加了 会播放不出来???
            // window.URL.revokeObjectURL(aUrl);
            aEl.remove();
        })
    }

}