const fs = require('fs');
const CACHE_DIR = '/tmp/xy_cache/';
const CACHE_TTL = 4 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 100;
const CLEANUP_THRESHOLD = 150;
const PRELOAD_THRESHOLD = 80; // 播放进度超过 80% 时预加载下一集

(function initCacheDir() {
    try {
        fs.mkdirSync(CACHE_DIR, { recursive: true, mode: 0o755 });
    } catch (e) {}
})();

function joinPath() {
    var parts = Array.prototype.slice.call(arguments);
    var filtered = [];
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] !== '' && parts[i] !== null && parts[i] !== undefined) {
            filtered.push(parts[i]);
        }
    }
    if (filtered.length === 0) return '';
    var result = filtered.join('/');
    result = result.replace(/\/+/g, '/');
    if (result.length > 1 && result.endsWith('/')) {
        result = result.slice(0, -1);
    }
    return result;
}

function getCacheKey(url, ua, itemId) {
    var cleanUrl = url;
    var queryIdx = url.indexOf('?');
    if (queryIdx !== -1) {
        cleanUrl = url.substring(0, queryIdx);
    }
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
    var pathStart = cleanUrl.indexOf('/');
    if (pathStart !== -1) {
        cleanUrl = cleanUrl.substring(pathStart);
    }
    if (cleanUrl.indexOf('/d/') === 0) {
        cleanUrl = cleanUrl.substring(3);
    }
    var pathPart = cleanUrl.replace(/[\/\\&=:]/g, '_');
    pathPart = pathPart.substring(0, 250);
    var uaKey = ua.replace(/[\/\\&=: ]/g, '_');
    return pathPart + '_' + uaKey + '_' + itemId;
}

function getFromCache(cacheKey, r) {
    try {
        var filePath = joinPath(CACHE_DIR, cacheKey + '.json');
        var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.expire && data.expire > Date.now()) {
            return data.value;
        }
        try { fs.unlinkSync(filePath); } catch (e) {}
    } catch (e) {}
    return null;
}

function setToCache(cacheKey, value, r) {
    try {
        var filePath = joinPath(CACHE_DIR, cacheKey + '.json');
        var data = JSON.stringify({
            value: value,
            expire: Date.now() + CACHE_TTL
        });
        try { fs.mkdirSync(CACHE_DIR, { recursive: true, mode: 0o755 }); } catch (e) {}
        try {
            var files = fs.readdirSync(CACHE_DIR);
            if (files.length > CLEANUP_THRESHOLD) {
                var sorted = [];
                for (var i = 0; i < files.length; i++) {
                    var f = files[i];
                    try {
                        var mtime = fs.statSync(joinPath(CACHE_DIR, f)).mtimeMs;
                        sorted.push({ name: f, mtime: mtime });
                    } catch (e) {
                        sorted.push({ name: f, mtime: 0 });
                    }
                }
                sorted = sorted.filter(function(f) { return f.mtime > 0; });
                sorted.sort(function(a, b) { return a.mtime - b.mtime; });
                var toDelete = Math.ceil(MAX_CACHE_SIZE * 0.2);
                for (var j = 0; j < toDelete && j < sorted.length; j++) {
                    try { fs.unlinkSync(joinPath(CACHE_DIR, sorted[j].name)); } catch (e) {}
                }
            }
        } catch (e) {}
        fs.writeFileSync(filePath, data, 'utf8');
		if (r && typeof r.warn === 'function') {
            r.warn('✅ [缓存写入]  ' + filePath);
        }
        return true;
    } catch (e) {
        return false;
    }
}

function isAlistErrorResponse(text) {
    try {
        var json = JSON.parse(text);
        if (json.code !== undefined && json.code !== 200 && json.code !== 0) {
            return true;
        }
        if (json.message && typeof json.message === 'string') {
            var msg = json.message.toLowerCase();
            if (msg.includes('error') || msg.includes('fail') || msg.includes('loading storage')) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function getCachedXYUrl(url, ua, itemId, cookie, r) {
    var cacheKey = getCacheKey(url, ua, itemId);
    var cached = getFromCache(cacheKey, r);
    if (cached) {
        return cached;
    }
    try {
        var result = await fetchXYApi(url, ua, cookie);
        var isError = result.startsWith('error');
        var isHtmlError = result.includes('<html') || result.includes('<!DOCTYPE');
        var isEmpty = result.trim() === '';
        var isJsonError = isAlistErrorResponse(result);
        if (!isError && !isHtmlError && !isEmpty && !isJsonError) {
            setToCache(cacheKey, result, r);
        }
        return result;
    } catch (e) {
        return 'error: ' + e;
    }
}

async function fetchXYApi(xyurl, ua, cookie) {
    try {
        var res = await ngx.fetch(xyurl, {
            headers: {
                "Content-Type": 'application/json;charset=utf-8',
                "User-Agent": ua,
                "X-Alist-OriUA": ua
            },
            max_response_body_size: 65535
        });
        if (res.status >= 301 && res.status <= 307) {
            var loc = res.headers["Location"] || res.headers["location"];
            return loc || "error: no location";
        }
        var text = await res.text();
        try {
            var json = JSON.parse(text);
            if (json.url) return json.url;
            return text;
        } catch (e) {
            return text;
        }
    } catch (error) {
        return 'error: xy_api fetch failed';
    }
}

// ---------- fetchAlistPathApi ----------
async function fetchAlistPathApi(alistApiPath, alistFilePath, alistPwd) {
    try {
        var response = await ngx.fetch(alistApiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            max_response_body_size: 65535,
            body: '{"path":"' + alistFilePath + '","password":"' + alistPwd + '"}'
        });
        if (!response.ok) {
            return 'error: alist_path_api ' + response.status;
        }
        var result = await response.json();
        if (!result) return 'error: alist_path_api response is null';
        if (result.message === 'success') {
            if (result.data.type === 'file') {
                return result.data.files[0].url;
            }
            if (result.data.type === 'folder') {
                var names = [];
                for (var i = 0; i < result.data.files.length; i++) {
                    names.push(result.data.files[i].name);
                }
                return names.join(',');
            }
        }
        if (result.code === 401) {
            return 'error401: alist_path_api ' + result.message;
        }
        if (result.message.includes('account') || result.message === 'path not found') {
            return 'error404: alist_path_api ' + result.message;
        }
        return 'error: alist_path_api ' + result.message;
    } catch (error) {
        return 'error: alist_path_api fetchAlistFiled';
    }
}

async function fetchEmbyFilePath(itemInfoUri, mediaSourceId) {
    try {
        var res = await ngx.fetch(itemInfoUri, { max_response_body_size: 65535 });
        if (!res.ok) {
            return 'error: emby_api ' + res.status;
        }
        var result = await res.json();
        if (!result) return 'error: emby_api response is null';
        var mediaSource = null;
        if (mediaSourceId) {
            for (var i = 0; i < result.MediaSources.length; i++) {
                if (result.MediaSources[i].Id == mediaSourceId) {
                    mediaSource = result.MediaSources[i];
                    break;
                }
            }
        } else {
            if (result.MediaSources && result.MediaSources.length > 0) {
                mediaSource = result.MediaSources[0];
            }
        }
        if (!mediaSource) {
            return 'error: emby_api mediaSource not found';
        }
        return mediaSource.Path;
    } catch (error) {
        return 'error: emby_api fetch failed';
    }
}

async function getNextEpisodeId(currentItemId, userId, apiKey, r) {
    try {
        var embyHost = 'EMBY_SERVER';
        var itemUri = embyHost + '/emby/Users/' + userId + '/Items/' + currentItemId + '?api_key=' + apiKey;
        var itemRes = await ngx.fetch(itemUri, { max_response_body_size: 65535 });
        if (!itemRes.ok) return null;
        var itemData = await itemRes.json();
        if (!itemData || !itemData.SeriesId || !itemData.IndexNumber) {
            return null;
        }
        var seriesId = itemData.SeriesId;
        var currentSeason = itemData.ParentIndexNumber || 1;
        var currentEpisode = itemData.IndexNumber || 1;
        var nextEpisode = currentEpisode + 1;
        var seriesUri = embyHost + '/emby/Users/' + userId + '/Items?api_key=' + apiKey +
                        '&ParentId=' + seriesId +
                        '&Fields=Id,IndexNumber,ParentIndexNumber&Recursive=true';
        var seriesRes = await ngx.fetch(seriesUri, { max_response_body_size: 65535 });
        if (!seriesRes.ok) return null;
        var seriesData = await seriesRes.json();
        var items = seriesData.Items || [];
        var sortedItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.ParentIndexNumber === currentSeason &&
                item.IndexNumber &&
                item.IndexNumber > currentEpisode) {
                sortedItems.push(item);
            }
        }
        sortedItems.sort(function(a, b) {
            return a.IndexNumber - b.IndexNumber;
        });
        if (sortedItems.length > 0) {
            return sortedItems[0].Id;
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function getPlaybackPath(itemId, userId, apiKey, r) {
    var embyHost = 'EMBY_SERVER';

    try {
        var strmUri = embyHost + '/emby/Videos/' + itemId + '/stream.strm?api_key=' + apiKey;
        var res = await ngx.fetch(strmUri, {
            max_response_body_size: 65535,
            headers: { 'X-Emby-Token': apiKey }
        });
        if (res.ok) {
            var content = await res.text();
            var url = content.trim();
            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                return url;
            }
            if (url && url.includes('DOCKER_ADDRESS')) {
                return url;
            }
        }
    } catch (e) {}

    try {
        var playInfoUri = embyHost + '/emby/Items/' + itemId + '/PlaybackInfo?api_key=' + apiKey;
        var res = await ngx.fetch(playInfoUri, { max_response_body_size: 65535 });
        if (res.ok) {
            var data = await res.json();
            if (data && data.MediaSources && data.MediaSources.length > 0) {
                var mediaPath = data.MediaSources[0].Path;
                if (mediaPath) {
                    return mediaPath;
                }
            }
        }
    } catch (e) {}
    return null;
}

async function getPostBody(r) {
    try {
        var body = await r.requestBuffer;
        if (body) {
            return String(body);
        }
        return '';
    } catch (e) {
        return '';
    }
}

async function onPlaybackProgress(r) {
    var body = await getPostBody(r);
    var data = null;
    try {
        data = JSON.parse(body);
    } catch (e) {
        r.internalRedirect("@backend");
        return;
    }
    
    var itemId = data.ItemId || data.Id || null;
    var userId = data.UserId || null;
    if (!userId) {
        var authHeader = r.headersIn["X-Emby-Authorization"];
        if (authHeader) {
            var userIdMatch = /UserId="([^"]+)"/.exec(authHeader);
            if (userIdMatch) {
                userId = userIdMatch[1];
            }
        }
    }
    if (!userId) {
        userId = '1';
    }
    
    var playedPercentage = 0;
    if (data.PositionTicks !== undefined && data.RunTimeTicks !== undefined && data.RunTimeTicks > 0) {
        playedPercentage = (data.PositionTicks / data.RunTimeTicks) * 100;
    } else if (data.PlayedPercentage !== undefined) {
        playedPercentage = data.PlayedPercentage;
    }
    
    var api_key = r.args.api_key || 'e825ed6f7f8f44ffa0563cddaddce14d';
    
    if (r && typeof r.warn === 'function') {
        r.warn('📊 [进度回调] itemId=' + itemId + ', 进度=' + playedPercentage.toFixed(1) + '%');
    }

	if (itemId && playedPercentage >= PRELOAD_THRESHOLD) {

		var ua = r.headersIn["User-Agent"] || 'unknown';
		var cookie = r.headersIn["Cookie"] || '';
		
		(async function() {
			try {
				var nextItemId = await getNextEpisodeId(itemId, userId, api_key, r);
				if (!nextItemId) {
					if (r && typeof r.warn === 'function') {
						r.warn('ℹ️ [进度回调] 没有下一集');
					}
					return;
				}
				
				var nextPath = await getPlaybackPath(nextItemId, userId, api_key, r);
				if (!nextPath || (!nextPath.includes('http') && !nextPath.includes('DOCKER_ADDRESS'))) {
					return;
				}
				
				var alistFilePath = nextPath.replace('DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('_DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('http://xiaoya.host:5678', 'http://127.0.0.1:80') + '?sign=XIAOYASIGN';
				//var alistFilePath = nextPath.replace('DOCKER_ADDRESS', 'http://127.0.0.1:5234').replace('_DOCKER_ADDRESS', 'http://127.0.0.1:5234').replace('http://xiaoya.host:5678', 'http://127.0.0.1:5234') + '?sign=XIAOYASIGN';
				//var alistFilePath = nextPath.replace('DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('http://xiaoya.host:5678', 'http://127.0.0.1:80');
				
				// 🔑 生成缓存 Key
				var cacheKey = getCacheKey(alistFilePath, ua,  itemId);
				
				// ============================================================
				// 🔑 一行判断：进度达标 + 缓存不存在 → 才执行预热
				// ============================================================
				if (playedPercentage >= PRELOAD_THRESHOLD && !getFromCache(cacheKey, r)) {
					var result = await getCachedXYUrl(alistFilePath, ua,  nextItemId, cookie, r);
					if (r && typeof r.warn === 'function' && String(result).startsWith('error')) {
						r.warn('cachekey:' + cacheKey);
						r.warn('🔄 [进度回调] 下一集未缓存，开始预热');
					}
				} 
			} catch (e) {
				if (r && typeof r.warn === 'function') {
					r.warn('⚠️ [进度回调] 异常: ' + (e.message || e));
				}
			}
		})();
	}
    
    r.internalRedirect("@backend");
}

// ---------- 主函数 redirect2Pan ----------
async function redirect2Pan(r) {
    var embyHost = 'EMBY_SERVER';
    var alistPwd = '56965779';
    var alistApiPath = '_DOCKER_ADDRESS/';
    var ua = r.headersIn["User-Agent"];
    var cookie = r.headersIn["Cookie"];
    
    var itemIdMatch = /\/Videos\/(\d+)/.exec(r.uri);
    var itemId = itemIdMatch ? itemIdMatch[1] : null;
    if (!itemId) {
        r.return(400, 'Bad Request');
        return;
    }
    
    var mediaSourceId = r.args.MediaSourceId;
    var api_key = r.args.api_key || 'e825ed6f7f8f44ffa0563cddaddce14d';
    
    if (r.uri.indexOf("Subtitles") !== -1) {
        r.internalRedirect("@backend");
        return;
    }
    
    var itemInfoUri = embyHost + '/emby/Items/' + itemId + '/PlaybackInfo?api_key=' + api_key;
    var embyRes = await fetchEmbyFilePath(itemInfoUri, mediaSourceId);
    if (embyRes.startsWith('error')) {
        r.return(500, embyRes);
        return;
    }
    
    var doesNotContainHttp = !embyRes.includes("http");
    var doesNotContainDOCKER = !embyRes.includes("DOCKER_ADDRESS");
    var contain115helper = embyRes.includes("P115StrmHelper");
    
    if (contain115helper) {
        var helperRedirectUrl = await fetchXYApi(embyRes, ua, cookie);
        if (helperRedirectUrl.startsWith('error')) {
            r.internalRedirect("@backend");
            return;
        }
        r.return(302, helperRedirectUrl);
        return;
    }
    
    if (doesNotContainHttp && doesNotContainDOCKER) {
        r.internalRedirect("@backend");
        return;
    }
    
    if (embyRes.indexOf("/static/http") !== -1) {
        r.return(302, embyRes);
        return;
    }
    
    var alistFilePath = embyRes.replace('DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('_DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('http://xiaoya.host:5678', 'http://127.0.0.1:80') + '?sign=XIAOYASIGN';
	//var alistFilePath = embyRes.replace('DOCKER_ADDRESS', 'http://127.0.0.1:5234').replace('_DOCKER_ADDRESS', 'http://127.0.0.1:5234').replace('http://xiaoya.host:5678', 'http://127.0.0.1:5234') + '?sign=XIAOYASIGN';
	//var alistFilePath = embyRes.replace('DOCKER_ADDRESS', 'http://127.0.0.1:80').replace('http://xiaoya.host:5678', 'http://127.0.0.1:80');
    
    var alistRes = await getCachedXYUrl(alistFilePath, ua, itemId, cookie, r);
    
    if (!alistRes.startsWith('error')) {
        if (alistRes.indexOf("http") !== -1) {
            r.return(302, alistRes);
            return;
        }
        if (alistRes.includes("object not found")) {
            r.return(302, "http://image.xiaoya.pro/404.mp4");
            return;
        }
        r.internalRedirect("@backend");
        return;
    }
    
    if (alistRes.startsWith('error401')) {
        r.return(401, alistRes);
        return;
    }
    
    if (alistRes.startsWith('error404')) {
        var filePath = alistFilePath.substring(alistFilePath.indexOf('/', 1));
        var foldersRes = await fetchAlistPathApi(alistApiPath, '/', alistPwd);
        if (foldersRes.startsWith('error')) {
            r.return(500, foldersRes);
            return;
        }
        var folders = foldersRes.split(',');
        folders.sort();
        for (var i = 0; i < folders.length; i++) {
            var driverRes = await fetchAlistPathApi(alistApiPath, '/' + folders[i] + filePath, alistPwd);
            if (!driverRes.startsWith('error')) {
                r.return(302, driverRes);
                return;
            }
        }
        r.return(404, alistRes);
        return;
    }
    
    r.return(500, alistRes);
}

// ---------- 导出 ----------
export default { redirect2Pan, onPlaybackProgress };
