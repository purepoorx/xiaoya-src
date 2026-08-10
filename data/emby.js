const fs = require('fs');

// ---------- 配置 ----------
const CACHE_DIR = '/tmp/xy_cache/';
const CACHE_TTL = 4 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;
const CLEANUP_THRESHOLD = 1500; // 超过此值才清理

(function initCacheDir() {
    try {
        fs.mkdirSync(CACHE_DIR, { recursive: true, mode: 0o755 });
    } catch (e) {}
})();

function joinPath(...parts) {
    const filtered = parts.filter(p => p !== '' && p !== null && p !== undefined);
    if (filtered.length === 0) return '';
    let result = filtered.join('/');
    result = result.replace(/\/+/g, '/');
    if (result.length > 1 && result.endsWith('/')) {
        result = result.slice(0, -1);
    }
    return result;
}

function getCacheKey(url, ua) {
    let pathPart = url.replace(/^https?:\/\/[^\/]+\/d\//, ''); // 去掉 http://127.0.0.1:80/d/
    const queryIdx = pathPart.indexOf('?');
    if (queryIdx !== -1) {
        pathPart = pathPart.substring(0, queryIdx);
    }
    
    pathPart = pathPart.replace(/[\/\\&=:]/g, '_');
    pathPart = pathPart.substring(0, 60);
    let hash = 0;
    const str = url + '|' + (ua || 'unknown');
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    const hashStr = (hash >>> 0).toString(16).padStart(8, '0');
    return pathPart + '_' + ua.replace(' ', '-').replace('/', '-') + '_' + hashStr;
}

function getCacheFilePath(cacheKey) {
    return joinPath(CACHE_DIR, cacheKey + '.json');
}

function getFromCache(cacheKey, r) {
    try {
        const filePath = getCacheFilePath(cacheKey);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.expire && data.expire > Date.now()) {
            if (r) r.warn(`📂 缓存命中`);
            return data.value;
        }
        // 过期则删除
        try { fs.unlinkSync(filePath); } catch (e) {}
    } catch (e) {}
    return null;
}

function setToCache(cacheKey, value, r) {
    try {
        const filePath = getCacheFilePath(cacheKey);
        const data = JSON.stringify({
            value: value,
            expire: Date.now() + CACHE_TTL
        });
        
        try { fs.mkdirSync(CACHE_DIR, { recursive: true, mode: 0o755 }); } catch (e) {}
        try {
            const files = fs.readdirSync(CACHE_DIR);
            if (files.length > CLEANUP_THRESHOLD) {
                const sorted = files
                    .map(f => {
                        try {
                            return { name: f, mtime: fs.statSync(joinPath(CACHE_DIR, f)).mtimeMs };
                        } catch (e) {
                            return { name: f, mtime: 0 };
                        }
                    })
                    .filter(f => f.mtime > 0)
                    .sort((a, b) => a.mtime - b.mtime);
                
                const toDelete = Math.ceil(MAX_CACHE_SIZE * 0.2);
                for (let i = 0; i < toDelete && i < sorted.length; i++) {
                    try { fs.unlinkSync(joinPath(CACHE_DIR, sorted[i].name)); } catch (e) {}
                }
            }
        } catch (e) {}
        
        fs.writeFileSync(filePath, data, 'utf8');
        if (r) r.warn(`💾 缓存写入成功`);
        return true;
    } catch (e) {
        if (r) r.warn(`💾 缓存写入失败: ${e.message}`);
        return false;
    }
}

// ---------- 检测 Alist 错误响应 ----------
function isAlistErrorResponse(text) {
    try {
        const json = JSON.parse(text);
        // code 不为 200 且不为 0（部分 API 用 0 表示成功）
        if (json.code !== undefined && json.code !== 200 && json.code !== 0) {
            return true;
        }
        // message 包含错误关键词
        if (json.message && typeof json.message === 'string') {
            const msg = json.message.toLowerCase();
            if (msg.includes('error') || msg.includes('fail') || msg.includes('loading storage') || msg.includes('not found')) {
                return true;
            }
        }
        // data 为 null 且 code 不是成功码
        if (json.data === null && json.code !== 200 && json.code !== 0) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function getCachedXYUrl(url, ua, cookie, r) {
    const cacheKey = getCacheKey(url, ua);
    if (r) r.warn(`🔑 缓存Key: ${cacheKey}`);
    
    let cached = getFromCache(cacheKey, r);
    if (cached) {
        if (r) r.warn(`✅ 缓存命中!`);
        return cached;
    }
    
    if (r) r.warn(`🔄 缓存未命中，请求: ${url.substring(0, 60)}...`);
    const result = await fetchXYApi(url, ua, cookie);
    
    if (r) r.warn(`📡 返回长度: ${result.length}，前100字符: ${result.substring(0, 100)}`);
    
    // 判断是否应该缓存
    const isError = result.startsWith('error');
    const isHtmlError = result.includes('<html') || result.includes('<!DOCTYPE');
    const isEmpty = result.trim() === '';
	const isHttpLink = result.trim().startsWith('http://') || result.trim().startsWith('https://');
    const isJsonError = isAlistErrorResponse(result);
    
    // ✅ 只有正常响应才缓存
    if (!isError && !isHtmlError && !isEmpty && !isJsonError && isHttpLink) {
        const ok = setToCache(cacheKey, result, r);
        if (ok && r) r.warn(`💾 缓存写入完成`);
    } else {
        if (r) r.warn(`⛔ 未缓存: isError=${isError}, isHtmlError=${isHtmlError}, isEmpty=${isEmpty}, isJsonError=${isJsonError}`);
    }
    
    return result;
}

async function fetchXYApi(xyurl, ua, cookie) {
    try {
        const res = await ngx.fetch(xyurl, {
            headers: {
                "Content-Type": 'application/json;charset=utf-8',
                "User-Agent": ua,
                "X-Alist-OriUA": ua
            },
            max_response_body_size: 65535
        });
        if (res.status >= 301 && res.status <= 307) {
            return res.headers["Location"] || res.headers["location"] || "error: no location";
        }
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            if (json.url) return json.url;
            if (json.data && typeof json.data === 'string' && json.data.startsWith('http')) {
                return json.data;
            }
            return text;
        } catch (e) {
            return text;
        }
    } catch (error) {
        return `error: xy_api fetch failed, ${error}`;
    }
}

async function fetchAlistPathApi(alistApiPath, alistFilePath, alistPwd) {
    try {
        const response = await ngx.fetch(alistApiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            max_response_body_size: 65535,
            body: `{"path":"${alistFilePath}","password":"${alistPwd}"}`
        });
        if (!response.ok) {
            return `error: alist_path_api ${response.status} ${response.statusText}`;
        }
        const result = await response.json();
        if (!result) return `error: alist_path_api response is null`;
        if (result.message === 'success') {
            if (result.data.type === 'file') {
                return result.data.files[0].url;
            }
            if (result.data.type === 'folder') {
                return result.data.files.map(item => item.name).join(',');
            }
        }
        if (result.code === 401) {
            return `error401: alist_path_api ${result.message}`;
        }
        if (result.message.includes('account') || result.message === 'path not found') {
            return `error404: alist_path_api ${result.code} ${result.message}`;
        }
        return `error: alist_path_api ${result.code} ${result.message}`;
    } catch (error) {
        return `error: alist_path_api fetchAlistFiled ${error}`;
    }
}

async function fetchEmbyFilePath(itemInfoUri, mediaSourceId) {
    try {
        const res = await ngx.fetch(itemInfoUri, { max_response_body_size: 65535 });
        if (!res.ok) {
            return `error: emby_api ${res.status} ${res.statusText}`;
        }
        const result = await res.json();
        if (!result) return `error: emby_api itemInfoUri response is null`;
        const mediaSource = result.MediaSources.find(m => m.Id == mediaSourceId);
        if (!mediaSource) {
            return `error: emby_api mediaSourceId ${mediaSourceId} not found`;
        }
        return mediaSource.Path;
    } catch (error) {
        return `error: emby_api fetch mediaItemInfo failed, ${error}`;
    }
}

async function redirect2Pan(r) {
    const embyHost = 'EMBY_SERVER'; 
    const embyMountPath = '/';  // rclone 的挂载目录, 例如将od, gd挂载到/mnt目录下:  /mnt/onedrive  /mnt/gd ,那么这里就填写 /mnt  
    const alistPwd = '56965779';      //alist password
    const alistApiPath = '_DOCKER_ADDRESS/'; 
	const ua = r.headersIn["User-Agent"];
    const cookie = r.headersIn["Cookie"];
    const all = JSON.stringify(r.headersIn);
    r.warn(`all: ${all}`);

    //fetch mount emby file path
    const itemId = /[\d]+/.exec(r.uri)[0];
    if (!itemId) {
        r.error(`无法从 URI 提取 itemId: ${r.uri}`);
        r.return(400, 'Bad Request');
        return;
    }
    
    const mediaSourceId = r.args.MediaSourceId;
    const api_key = r.args.api_key || infuseApiKey;
    r.error(`api key: ${api_key}`);

    if (r.uri.includes("Subtitles")) {
        r.internalRedirect("@backend");
        return;
    }
    
    const itemInfoUri = `${embyHost}/emby/Items/${itemId}/PlaybackInfo?api_key=${api_key}`;
    r.error(`itemInfoUri: ${itemInfoUri}`);
    
    let embyRes = await fetchEmbyFilePath(itemInfoUri, mediaSourceId);
    if (embyRes.startsWith('error')) {
        r.error(embyRes);
        r.return(500, embyRes);
        return;
    }
    r.error(`mount emby file path: ${embyRes}`);

    const doesNotContainHttp = !embyRes.includes("http");
    const doesNotContainDOCKER = !embyRes.includes("DOCKER_ADDRESS");
    const contain115helper = embyRes.includes("P115StrmHelper");
    
    if (contain115helper) {
        r.warn(`115StrmHelper 发现链接: ${embyRes}`);
        let helperRedirectUrl = await fetchXYApi(embyRes, ua, cookie);
        if (helperRedirectUrl.startsWith('error')) {
            r.error(`获取115直链失败: ${helperRedirectUrl}`);
            r.internalRedirect("@backend");
            return;
        }
        r.warn(`115StrmHelper 跳转: ${helperRedirectUrl}`);
        r.return(302, helperRedirectUrl);
        return;
    }

    if (doesNotContainHttp && doesNotContainDOCKER) {
        r.warn(`跳转到本地链接`);
        r.internalRedirect("@backend");
        return;
    }

    if (embyRes.includes("/static/http")) {
        r.warn(`返回cd2链接: ${embyRes}`);
        r.return(302, embyRes);
        return;
    }

	const alistFilePath = embyRes.replace('DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('_DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('http://xiaoya.host:5678', 'http://127.0.0.1:80') + '?sign=XIAOYASIGN';
	//const alistFilePath = embyRes.replace('DOCKER_ADDRESS', 'http://127.0.0.1:5234').replace('_DOCKER_ADDRESS', 'http://127.0.0.1:5234').replace('http://xiaoya.host:5678', 'http://127.0.0.1:5234') + '?sign=XIAOYASIGN';
	//const alistFilePath = embyRes.replace('DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('http://xiaoya.host:5678', 'http://127.0.0.1:80');

    let alistRes = await getCachedXYUrl(alistFilePath, ua, cookie, r);
    r.warn(`xiaoya容器返回: ${alistRes}`);

    if (!alistRes.startsWith('error')) {
        if (alistRes.includes("http")) {
            r.warn(`跳转到小雅链接: ${alistRes}`);
            r.return(302, alistRes);
            return;
        }
        if (alistRes.includes("object not found")) {
            r.warn(`strm 文件内路径错误`);
            r.return(302, "http://image.xiaoya.pro/404.mp4");
            return;
        }
        r.warn(`非预期返回，回退到 backend`);
        r.internalRedirect("@backend");
        return;
    }

    if (alistRes.startsWith('error401')) {
        r.error(alistRes);
        r.return(401, alistRes);
        return;
    }
    
    if (alistRes.startsWith('error404')) {
        const filePath = alistFilePath.substring(alistFilePath.indexOf('/', 1));
        const foldersRes = await fetchAlistPathApi(alistApiPath, '/', alistPwd);
        if (foldersRes.startsWith('error')) {
            r.error(foldersRes);
            r.return(500, foldersRes);
            return;
        }
        const folders = foldersRes.split(',').sort();
        for (let i = 0; i < folders.length; i++) {
            r.error(`try to fetch alist path from /${folders[i]}${filePath}`);
            const driverRes = await fetchAlistPathApi(alistApiPath, `/${folders[i]}${filePath}`, alistPwd);
            if (!driverRes.startsWith('error')) {
                r.error(`redirect to: ${driverRes}`);
                r.return(302, driverRes);
                return;
            }
        }
        r.error(alistRes);
        r.return(404, alistRes);
        return;
    }
    
    r.error(alistRes);
    r.return(500, alistRes);
}

export default { redirect2Pan };
