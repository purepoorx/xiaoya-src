const fs = require('fs');

// ---------- 配置区 ----------
const CACHE_DIR = '/tmp/xy_cache/';      // 缓存目录
const CACHE_TTL = 4 * 60 * 60 * 1000;    // 4小时（毫秒）
const MAX_CACHE_SIZE = 1000;              // 最多缓存100个条目

// ---------- 工具函数：替代 path.join ----------
function joinPath(...parts) {
    // 过滤空值，然后拼接
    const filtered = parts.filter(p => p !== '' && p !== null && p !== undefined);
    if (filtered.length === 0) return '';
    
    // 用 '/' 连接，并处理多余的 '/'
    let result = filtered.join('/');
    // 将多个连续的 '/' 替换为单个 '/'
    result = result.replace(/\/+/g, '/');
    // 确保不以 '/' 结尾（除非是根目录）
    if (result.length > 1 && result.endsWith('/')) {
        result = result.slice(0, -1);
    }
    return result;
}

// ---------- 工具函数：获取文件名 ----------
function basename(filepath) {
    if (!filepath) return '';
    // 移除末尾的 '/'
    let p = filepath;
    while (p.endsWith('/')) {
        p = p.slice(0, -1);
    }
    const parts = p.split('/');
    return parts[parts.length - 1] || '';
}

// ---------- 缓存初始化 ----------
function initCacheDir() {
    try {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true, mode: 0o755 });
        }
    } catch (e) {
        // 静默失败
    }
}
initCacheDir();

function getCacheKey(url, ua) {
    const raw = url + '|' + (ua || 'unknown');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const hashStr = (hash >>> 0).toString(16).padStart(8, '0');
    
    // 从 URL 中提取路径部分（去除协议和域名）
    let pathPart = url.replace(/^https?:\/\/[^\/]+\/d\//, ''); // 去掉 http://127.0.0.1:80
    pathPart = pathPart.replace(/[\/\\?&=:]/g, '_');      // 只替换路径分隔符和查询参数符号
    pathPart = pathPart.substring(0, 60);                 // 取前 60 个字符
    
    return pathPart + '_' + hashStr;
}

function getCacheFilePath(cacheKey) {
    return joinPath(CACHE_DIR, cacheKey + '.json');
}

// ---------- njs 兼容的缓存读写（使用 try-catch，不用 existsSync） ----------
function getFromCache(cacheKey, r) {
    try {
        const filePath = getCacheFilePath(cacheKey);
        // njs 不支持 existsSync，直接用 readFileSync + try-catch
        const stat = fs.statSync(filePath);
        const now = Date.now();
        if (now - stat.mtimeMs > CACHE_TTL) {
            fs.unlinkSync(filePath);
            if (r) r.warn(`📂 缓存已过期，删除`);
            return null;
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (r) r.warn(`📂 缓存读取成功`);
        return data.value;
    } catch (e) {
        // 文件不存在或读取失败
        if (r && e.message && !e.message.includes('No such file')) {
            r.warn(`📂 缓存读取异常: ${e.message}`);
        }
        return null;
    }
}

function setToCache(cacheKey, value, r) {
    try {
        const filePath = getCacheFilePath(cacheKey);
        
        // 确保目录存在
        try {
            fs.mkdirSync(CACHE_DIR, { recursive: true, mode: 0o777 });
        } catch (e) {}
        
        // 检查缓存数量（njs 兼容方式）
        try {
            const files = fs.readdirSync(CACHE_DIR);
            if (files.length >= MAX_CACHE_SIZE) {
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
                    try {
                        fs.unlinkSync(joinPath(CACHE_DIR, sorted[i].name));
                    } catch (e) {}
                }
            }
        } catch (e) {}
        
        fs.writeFileSync(filePath, JSON.stringify({ value }), 'utf8');
        if (r) r.warn(`💾 缓存写入成功`);
        return true;
    } catch (e) {
        if (r) r.warn(`💾 缓存写入失败: ${e.message}`);
        return false;
    }
}

// ---------- 核心缓存函数 ----------
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
    
    if (r) r.warn(`📡 返回内容长度: ${result.length}，前100字符: ${result.substring(0, 100)}`);
    
    // 缓存所有非错误、非 HTML 的响应
    const isError = result.startsWith('error');
    const isHtmlError = result.includes('<html') || result.includes('<!DOCTYPE') || result.includes('<HTML');
    const isEmpty = result.trim() === '';
    
    if (!isError && !isHtmlError && !isEmpty) {
        const ok = setToCache(cacheKey, result, r);
        if (ok && r) {
            r.warn(`💾 缓存写入完成`);
        }
    } else {
        if (r) r.warn(`⛔ 未缓存: isError=${isError}, isHtmlError=${isHtmlError}, isEmpty=${isEmpty}`);
    }
    
    return result;
}

// ---------- fetchXYApi ----------
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
            const loc = res.headers["Location"] || res.headers["location"];
            if (loc) {
                return loc;
            }
            return "error: redirect status " + res.status + " but Location header missing";
        } else {
            return res.text();
        }
    } catch (error) {
        return (`error: xy_api fetch failed, ${error}`);
    }
}

// ---------- fetchAlistPathApi ----------
async function fetchAlistPathApi(alistApiPath, alistFilePath, alistPwd) {
    const alistRequestBody = {
        "path": alistFilePath,
        "password": alistPwd
    }
    try {
        const response = await ngx.fetch(alistApiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            max_response_body_size: 65535,
            body: JSON.stringify(alistRequestBody)
        })
        if (response.ok) {
            const result = await response.json();
            if (result === null || result === undefined) {
                return `error: alist_path_api response is null`;
            }
            if (result.message == 'success') {
                if (result.data.type == 'file') {
                    return result.data.files[0].url;
                }
                if (result.data.type == 'folder') {
                    return result.data.files.map(item => item.name).join(',');
                }
            }
            if (result.code == 401) {
                return `error401: alist_path_api ${result.message}`;
            }
            if (result.message.includes('account')) {
                return `error404: alist_path_api ${result.code} ${result.message}`;
            }
            if (result.message == 'path not found') {
                return `error404: alist_path_api ${result.message}`;
            }
            return `error: alist_path_api ${result.code} ${result.message}`;
        } else {
            return `error: alist_path_api ${response.status} ${response.statusText}`;
        }
    } catch (error) {
        return (`error: alist_path_api fetchAlistFiled ${error}`);
    }
}

// ---------- fetchEmbyFilePath ----------
async function fetchEmbyFilePath(itemInfoUri, mediaSourceId) {
    try {
        const res = await ngx.fetch(itemInfoUri, { max_response_body_size: 65535 });
        if (res.ok) {
            const result = await res.json();
            if (result === null || result === undefined) {
                return `error: emby_api itemInfoUri response is null`;
            }
            const mediaSource = result.MediaSources.find(m => m.Id == mediaSourceId);
            if (mediaSource === null || mediaSource === undefined) {
                return `error: emby_api mediaSourceId ${mediaSourceId} not found`;
            }
            return mediaSource.Path;
        } else {
            return (`error: emby_api ${res.status} ${res.statusText}`);
        }
    } catch (error) {
        return (`error: emby_api fetch mediaItemInfo failed, ${error}`);
    }
}

// ---------- 主函数 redirect2Pan ----------
async function redirect2Pan(r) {
    const embyHost = 'EMBY_SERVER'; //这里默认emby的地址是宿主机,要注意iptables给容器放行端口
    const embyMountPath = '/';  // rclone 的挂载目录, 例如将od, gd挂载到/mnt目录下:  /mnt/onedrive  /mnt/gd ,那么这里就填写 /mnt  
    const alistPwd = '56965779';      //alist password
    const alistApiPath = '_DOCKER_ADDRESS/'; //访问宿主机上5244端口的alist api, 要注意iptables给容器放行端口
	const ua = r.headersIn["User-Agent"];
    const cookie = r.headersIn["Cookie"];
    const all = JSON.stringify(r.headersIn);
    r.warn(`all: ${all}`);

    //fetch mount emby file path
    const itemId = /[\d]+/.exec(r.uri)[0];
    const mediaSourceId = r.args.MediaSourceId;
    let api_key = r.args.api_key;
    //infuse用户需要填写下面的api_key, 感谢@amwamw968
    if ((api_key === null) || (api_key === undefined)) {
        api_key = 'INFUSE_API_KEY';//这里填自己的API KEY
        r.error(`api key for Infuse: ${api_key}`);
    }

    
    if (r.uri.indexOf("Subtitles") != -1) {
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
    //const containQUARK = embyRes.includes("夸克") || embyRes.includes("%E5%A4%B8%E5%85%8B");
    //const containUC = embyRes.includes("（UC）") || embyRes.includes("%EF%BC%88UC%EF%BC%89");
    const contain115helper = embyRes.includes("P115StrmHelper");
    
    if (contain115helper) {
        r.warn(`115StrmHelper 发现链接: ${embyRes}`);
        let helperRedirectUrl = await fetchXYApi(embyRes, ua, cookie);
        if (helperRedirectUrl.startsWith('error')) {
            r.error(`获取115直链失败: ${helperRedirectUrl}`);
            r.internalRedirect("@backend");
            return;
        }
        r.warn(`115StrmHelper 成功获取直链，302跳转至: ${helperRedirectUrl}`);
        r.return(302, helperRedirectUrl);
        return;
    }

    if (doesNotContainHttp && doesNotContainDOCKER) {
        r.warn(`跳转到本地链接`);
        r.internalRedirect("@backend");
        return;
    }

    if (embyRes.indexOf("/static/http") != -1) {
        r.warn(`返回cd2链接: ${embyRes}`);
        r.return(302, embyRes);
        return;
    }

	const alistFilePath = embyRes.replace('DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('_DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('http://xiaoya.host:5678', 'http://127.0.0.1:80') + '?sign=XIAOYASIGN';

    // 🚀 使用带文件缓存的函数
    let alistRes = await getCachedXYUrl(alistFilePath, ua, cookie, r);
    r.warn(`xiaoya容器返回: ${alistRes}`);

    if (!alistRes.startsWith('error')) {
        if (alistRes.indexOf("http") != -1) {
            r.warn(`跳转到小雅链接: ${alistRes}`);
            r.return(302, alistRes);
            return;
        }
        if (alistRes.includes("object not found")) {
            r.warn(`strm 文件内路径错误，请检查资源是否被删除，或被更名`);
            r.return(302, "http://image.xiaoya.pro/404.mp4");
            return;
        }
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

// ---------- 导出 ----------
export default { redirect2Pan };
