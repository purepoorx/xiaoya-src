function init() {
    let playBtns = document.getElementById("ExternalPlayersBtns");
    if (playBtns) {
        playBtns.remove();
    }
    let mainDetailButtons = document.querySelector("div[is='emby-scroller']:not(.hide) .mainDetailButtons");
    let buttonhtml = `<div id="ExternalPlayersBtns" class="detailButtons flex align-items-flex-start flex-wrap-wrap">
             <button id="embyPot" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="Potplayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-PotPlayer">　</i> <span class="button-text">Pot</span> </div> </button>
            <button id="embyVlc" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="VLC"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-VLC">　</i> <span class="button-text">VLC</span> </div> </button>
            <button id="embyIINA" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="IINA"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-IINA">　</i> <span class="button-text">IINA</span> </div> </button>
            <button id="embyNPlayer" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="NPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-NPlayer">　</i> <span class="button-text">NPlayer</span> </div> </button>
            <button id="embyMX" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="MXPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-MXPlayer">　</i> <span class="button-text">MX</span> </div> </button>
            <button id="embyInfuse" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="InfusePlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-infuse">　</i> <span class="button-text">Infuse</span> </div> </button>
            <button id="embyFileball" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="Fileball"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-Fileball">　</i> <span class="button-text">Fileball</span> </div> </button>			
            <button id="embySenPlayer" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="SenPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-SenPlayer">　</i> <span class="button-text">SenPlayer</span> </div> </button>
            <button id="embyMPV" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="MPV"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-MPV">　</i> <span class="button-text">MPV</span> </div> </button>
            <button id="embyCopyUrl" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="复制串流地址"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-Copy">　</i> <span class="button-text">复制链接</span> </div> </button>
    </div>`;
    mainDetailButtons.insertAdjacentHTML('afterend', buttonhtml);
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyPot").onclick = embyPot;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyIINA").onclick = embyIINA;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyNPlayer").onclick = embyNPlayer;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyMX").onclick = embyMX;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyCopyUrl").onclick = embyCopyUrl;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyVlc").onclick = embyVlc;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyInfuse").onclick = embyInfuse;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyFileball").onclick = embyFileball;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embySenPlayer").onclick = embySenPlayer;
    document.querySelector("div[is='emby-scroller']:not(.hide) #embyMPV").onclick = embyMPV;
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-PotPlayer").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-PotPlayer.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-IINA").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-IINA.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-MXPlayer").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-MXPlayer.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-infuse").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-infuse.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-VLC").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-VLC.webp)no-repeat;background-size: 100% 100%;font-size: 1.3em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-NPlayer").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-NPlayer.webp)no-repeat;background-size: 100% 100%;font-size: 1.3em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-Fileball").style.cssText += 'background: url(https://emby-external-url.7o7o.cc/embyWebAddExternalUrl/icons/icon-Fileball.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-SenPlayer").style.cssText += 'background: url(https://emby-external-url.7o7o.cc/embyWebAddExternalUrl/icons/icon-SenPlayer.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-MPV").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-MPV.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    document.querySelector("div[is='emby-scroller']:not(.hide) .icon-Copy").style.cssText += 'background: url(https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-Copy.webp)no-repeat;background-size: 100% 100%;font-size: 1.4em';
    // 劫持播放按钮和海报
    hijackDefaultPlayButton();
}

function hijackDefaultPlayButton() {
    const observer = new MutationObserver(() => {
        // 劫持详情页播放按钮
        const playButtons = document.querySelectorAll('button[is="emby-button"]:not(.hijacked)[class*="btnPlay"], button[is="emby-button"]:not(.hijacked)[class*="btnResume"]');
        playButtons.forEach(button => {
            button.classList.add('hijacked');
            button.onclick = null;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Hijacked detail page ${button.title} button, triggering Artplayer2`);
                Artplayer2();
                blockNavigation();
            }, { capture: true });
        });

        // 劫持海报上的播放图标
        const posterPlayButtons = document.querySelectorAll('.cardOverlayFab-primary:not(.hijacked), .fab-mini-play:not(.hijacked)');
        posterPlayButtons.forEach(button => {
            button.classList.add('hijacked');
            button.onclick = null;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Hijacked poster play button, triggering Artplayer2`);
                Artplayer2();
                blockNavigation();
            }, { capture: true });
        });

        // 劫持海报图片容器
        const posterImages = document.querySelectorAll('.cardImageContainer:not(.hijacked)');
        posterImages.forEach(container => {
            container.classList.add('hijacked');
            container.onclick = null;
            container.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const img = container.querySelector('img.cardImage');
                if (img && img.src.includes('/emby/Items/')) {
                    console.log(`Hijacked poster image click, triggering Artplayer2`);
                    Artplayer2();
                    blockNavigation();
                }
            }, { capture: true });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 初始检查详情页按钮
    const initialPlayButtons = document.querySelectorAll('button[is="emby-button"]:not(.hijacked)[class*="btnPlay"], button[is="emby-button"]:not(.hijacked)[class*="btnResume"]');
    initialPlayButtons.forEach(button => {
        button.classList.add('hijacked');
        button.onclick = null;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Hijacked detail page ${button.title} button, triggering Artplayer2`);
            Artplayer2();
            blockNavigation();
        }, { capture: true });
    });

    // 初始检查海报播放按钮
    const initialPosterButtons = document.querySelectorAll('.cardOverlayFab-primary:not(.hijacked), .fab-mini-play:not(.hijacked)');
    initialPosterButtons.forEach(button => {
        button.classList.add('hijacked');
        button.onclick = null;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Hijacked poster play button, triggering Artplayer2`);
            Artplayer2();
            blockNavigation();
        }, { capture: true });
    });

    // 初始检查海报图片容器
    const initialPosterImages = document.querySelectorAll('.cardImageContainer:not(.hijacked)');
    initialPosterImages.forEach(container => {
        container.classList.add('hijacked');
        container.onclick = null;
        container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const img = container.querySelector('img.cardImage');
            if (img && img.src.includes('/emby/Items/')) {
                console.log(`Hijacked poster image click, triggering Artplayer2`);
                Artplayer2();
                blockNavigation();
            }
        }, { capture: true });
    });

    // 导航拦截函数
    function blockNavigation() {
        const originalHash = window.location.hash || '#!/item?id=' + new URLSearchParams(window.location.search).get('id') + '&serverId=' + new URLSearchParams(window.location.search).get('serverId');
        
        // 立即恢复 hash
        if (window.location.hash.includes('/videoosd/videoosd.html')) {
            window.location.hash = originalHash;
            console.log("Immediately restored hash to block /videoosd/videoosd.html");
        }

        // 监听 hash 变化
        window.addEventListener('hashchange', function hashChangeHandler(e) {
            if (window.location.hash.includes('/videoosd/videoosd.html')) {
                e.preventDefault();
                console.log("Blocked hash change to /videoosd/videoosd.html");
                window.location.hash = originalHash;
            }
        }, { passive: false, once: false });

        // 监听 viewbeforeshow 事件
        document.addEventListener('viewbeforeshow', function viewBeforeShowHandler(e) {
            if (e.detail && e.detail.contextPath && e.detail.contextPath.includes('videoosd')) {
                e.preventDefault();
                e.stopPropagation();
                console.log("Blocked viewbeforeshow event for /videoosd/videoosd.html");
                window.location.hash = originalHash;
            }
        }, { capture: true, once: false });

        // 拦截 history.pushState
        const originalPushState = window.history.pushState;
        window.history.pushState = function(state, title, url) {
            if (typeof url === 'string' && url.includes('/videoosd/videoosd.html')) {
                console.log('Intercepted pushState to /videoosd/videoosd.html');
                return;
            }
            originalPushState.apply(this, arguments);
        };
    }

    // 初始化时执行导航拦截
    blockNavigation();
}
/////////////////////////////////////////
function showFlag() {
    return true;
    let mainDetailButtons = document.querySelector("div[is='emby-scroller']:not(.hide) .mainDetailButtons");
    if (!mainDetailButtons) {
        return false;
    }
    let videoElement = document.querySelector("div[is='emby-scroller']:not(.hide) .selectVideoContainer");
    if (videoElement && videoElement.classList.contains("hide")) {
        return false;
    }
    let audioElement = document.querySelector("div[is='emby-scroller']:not(.hide) .selectAudioContainer");
    return !(audioElement && audioElement.classList.contains("hide"));
}

async function getItemInfo() {
    let userId = ApiClient._serverInfo.UserId;
    let itemId = /\?id=(\d*)/.exec(window.location.hash)[1];
    console.log(/\?id=(\d*)/.exec(window.location.hash));
    let response = await ApiClient.getItem(userId, itemId);
    //继续播放当前剧集的下一集
    if (response.Type == "Series") {
        let seriesNextUpItems = await ApiClient.getNextUpEpisodes({ SeriesId: itemId, UserId: userId });
        console.log("nextUpItemId: " + seriesNextUpItems.Items[0].id);
        return await ApiClient.getItem(userId, seriesNextUpItems.Items[0].Id);
    }
    //播放当前季season的第一集
    if (response.Type == "Season") {
        let seasonItems = await ApiClient.getItems(userId, { parentId: itemId });
        console.log("seasonItemId: " + seasonItems.Items[0].Id);
        return await ApiClient.getItem(userId, seasonItems.Items[0].Id);
    }
    //播放当前集或电影
    console.log("itemId:  " + itemId);
    return response;
}

function getSeek(position) {
    let ticks = position * 10000;
    let parts = []
        , hours = ticks / 36e9;
    (hours = Math.floor(hours)) && parts.push(hours);
    let minutes = (ticks -= 36e9 * hours) / 6e8;
    ticks -= 6e8 * (minutes = Math.floor(minutes)),
        minutes < 10 && hours && (minutes = "0" + minutes),
        parts.push(minutes);
    let seconds = ticks / 1e7;
    return (seconds = Math.floor(seconds)) < 10 && (seconds = "0" + seconds),
        parts.push(seconds),
        parts.join(":")
}

function getSubPath(mediaSource) {
    let selectSubtitles = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSubtitles");
    let subTitlePath = '';
    //返回选中的外挂字幕
    if (selectSubtitles && selectSubtitles.value > 0) {
        let SubIndex = mediaSource.MediaStreams.findIndex(m => m.Index == selectSubtitles.value && m.IsExternal);
        if (SubIndex > -1) {
            let subtitleCodec = mediaSource.MediaStreams[SubIndex].Codec;
            subTitlePath = `/${mediaSource.Id}/Subtitles/${selectSubtitles.value}/Stream.${subtitleCodec}`;
        }
    }
    else {
        //默认尝试返回第一个外挂中文字幕
        let chiSubIndex = mediaSource.MediaStreams.findIndex(m => m.Language == "chi" && m.IsExternal);
        if (chiSubIndex > -1) {
            let subtitleCodec = mediaSource.MediaStreams[chiSubIndex].Codec;
            subTitlePath = `/${mediaSource.Id}/Subtitles/${chiSubIndex}/Stream.${subtitleCodec}`;
        } else {
            //尝试返回第一个外挂字幕
            let externalSubIndex = mediaSource.MediaStreams.findIndex(m => m.IsExternal);
            if (externalSubIndex > -1) {
                let subtitleCodec = mediaSource.MediaStreams[externalSubIndex].Codec;
                subTitlePath = `/${mediaSource.Id}/Subtitles/${externalSubIndex}/Stream.${subtitleCodec}`;
            }
        }

    }
    return subTitlePath;
}

function getSubPathvtt(mediaSource) {
    let selectSubtitles = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSubtitles");
    let subTitlePath = '';
    //返回选中的外挂字幕
    if (selectSubtitles && selectSubtitles.value > 0) {
        let SubIndex = mediaSource.MediaStreams.findIndex(m => m.Index == selectSubtitles.value && m.IsExternal);
        if (SubIndex > -1) {
            subTitlePath = `/${mediaSource.Id}/Subtitles/${selectSubtitles.value}/Stream.vtt`;
        }
    }
    else {
        //默认尝试返回第一个外挂中文字幕
        let chiSubIndex = mediaSource.MediaStreams.findIndex(m => m.Language == "chi" && m.IsExternal);
        if (chiSubIndex > -1) {
            subTitlePath = `/${mediaSource.Id}/Subtitles/${chiSubIndex}/Stream.vtt`;
        } else {
            //尝试返回第一个外挂字幕
            let externalSubIndex = mediaSource.MediaStreams.findIndex(m => m.IsExternal);
            if (externalSubIndex > -1) {
                subTitlePath = `/${mediaSource.Id}/Subtitles/${externalSubIndex}/Stream.vtt`;
            }
        }

    }
    return subTitlePath;//返回一个VTT字幕
}


async function getEmbyMediaInfo(useVtt = false) {
    let itemInfo = await getItemInfo();
    let mediaSourceId = itemInfo.MediaSources[0].Id;
    let selectSource = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSource");
    if (selectSource && selectSource.value.length > 0) {
        mediaSourceId = selectSource.value;
    }
    let mediaSource = itemInfo.MediaSources.find(m => m.Id == mediaSourceId);
    let domain = `${ApiClient._serverAddress}/emby/videos/${itemInfo.Id}`;

    // 根据 useVtt 标志选择 subPath 或 subPathVtt
    let subPath;
    if (useVtt) {
        subPath = getSubPathvtt(mediaSource);
    } else {
        subPath = getSubPath(mediaSource);
    }

    let subUrl = subPath.length > 0 ? `${domain}${subPath}?api_key=${ApiClient.accessToken()}` : '';
    let streamUrl = `${domain}/stream.${mediaSource.Container}?api_key=${ApiClient.accessToken()}&Static=true&MediaSourceId=${mediaSourceId}`;
    let position = parseInt(itemInfo.UserData.PlaybackPositionTicks / 10000);
    let intent = await getIntent(mediaSource, position);
    console.log(streamUrl, subUrl, intent);
    return {
        streamUrl: streamUrl,
        subUrl: subUrl,
        intent: intent,
        itemid: itemInfo.Id,
    }
}





async function getIntent(mediaSource, position) {
    let title = mediaSource.Path.split('/').pop();
    let externalSubs = mediaSource.MediaStreams.filter(m => m.IsExternal == true);
    let subs = ''; //要求是android.net.uri[] ?
    let subs_name = '';
    let subs_filename = '';
    let subs_enable = '';
    if (externalSubs) {
        subs_name = externalSubs.map(s => s.DisplayTitle);
        subs_filename = externalSubs.map(s => s.Path.split('/').pop());
    }
    return {
        title: title,
        position: position,
        subs: subs,
        subs_name: subs_name,
        subs_filename: subs_filename,
        subs_enable: subs_enable
    };
}

async function embyPot() {
    let mediaInfo = await getEmbyMediaInfo();
    let intent = mediaInfo.intent;
    let poturl = `potplayer://${encodeURI(mediaInfo.streamUrl)} /sub=${encodeURI(mediaInfo.subUrl)} /current /title="${intent.title}" /seek=${getSeek(intent.position)}`;
    await writeClipboard(poturl);
    console.log(poturl);
    poturl = `potplayer:///current/clipboard`;
    window.open(poturl, "_blank");

}

//https://wiki.videolan.org/Android_Player_Intents/ 
async function embyVlc() {
    let mediaInfo = await getEmbyMediaInfo();
    let intent = mediaInfo.intent;
    //android subtitles:  https://code.videolan.org/videolan/vlc-android/-/issues/1903 
    let vlcUrl = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=org.videolan.vlc;type=video/*;S.subtitles_location=${encodeURI(mediaInfo.subUrl)};S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
    if (getOS() == "windows") {
        //桌面端需要额外设置,参考这个项目: https://github.com/stefansundin/vlc-protocol 
        vlcUrl = `vlc://${encodeURI(mediaInfo.streamUrl)}`;
    }
    if (getOS() == 'ios') {
        //https://code.videolan.org/videolan/vlc-ios/-/commit/55e27ed69e2fce7d87c47c9342f8889fda356aa9 
        vlcUrl = `vlc-x-callback://x-callback-url/stream?url=${encodeURIComponent(mediaInfo.streamUrl)}&sub=${encodeURIComponent(mediaInfo.subUrl)}`;
    }
    console.log(vlcUrl);
    window.open(vlcUrl, "_blank");
}

//https://github.com/iina/iina/issues/1991 
async function embyIINA() {
    let mediaInfo = await getEmbyMediaInfo();
    let iinaUrl = `iina://weblink?url=${encodeURIComponent(mediaInfo.streamUrl)}&new_window=1`;
    console.log(`iinaUrl= ${iinaUrl}`);
    window.open(iinaUrl, "_blank");
}

//https://sites.google.com/site/mxvpen/api 
async function embyMX() {
    let mediaInfo = await getEmbyMediaInfo();
    let intent = mediaInfo.intent;
    //mxPlayer free
    let mxUrl = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=com.mxtech.videoplayer.ad;S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
    //mxPlayer Pro
    //let mxUrl = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=com.mxtech.videoplayer.pro;S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
    console.log(mxUrl);
    window.open(mxUrl, "_blank");
}

async function embyNPlayer() {
    let mediaInfo = await getEmbyMediaInfo();
    let nUrl = getOS() == 'macOS' ? `nplayer-mac://weblink?url=${encodeURIComponent(mediaInfo.streamUrl)}&new_window=1` : `nplayer-${encodeURI(mediaInfo.streamUrl)}`;
    console.log(nUrl);
    window.open(nUrl, "_blank");
}

//infuse
async function embyInfuse() {
    let mediaInfo = await getEmbyMediaInfo();
    let infuseUrl = `infuse://x-callback-url/play?url=${encodeURIComponent(mediaInfo.streamUrl)}`;
    console.log(`infuseUrl= ${infuseUrl}`);
    window.open(infuseUrl, "_blank");
}

async function embyFileball() {
    const mediaInfo = await getEmbyMediaInfo();
    // see: app 关于, URL Schemes
    const url = `filebox://play?url=${encodeURIComponent(mediaInfo.streamUrl)}`;
    console.log(`FileballUrl= ${url}`);
    window.open(url, "_self");
}

async function embySenPlayer() {
    const mediaInfo = await getEmbyMediaInfo();
    // see: app 关于, URL Schemes
    const url = `SenPlayer://x-callback-url/play?url=${encodeURIComponent(mediaInfo.streamUrl)}`;
    console.log(`SenPlayerUrl= ${url}`);
    window.open(url, "_self");
}

//MPV
async function embyMPV() {
    let mediaInfo = await getEmbyMediaInfo();
    //桌面端需要额外设置,使用这个项目: https://github.com/akiirui/mpv-handler 
    let streamUrl64 = btoa(mediaInfo.streamUrl).replace(/\//g, "_").replace(/\+/g, "-").replace(/\=/g, "");
    let MPVUrl = `mpv://play/${streamUrl64}`;
    if (mediaInfo.subUrl.length > 0) {
        let subUrl64 = btoa(mediaInfo.subUrl).replace(/\//g, "_").replace(/\+/g, "-").replace(/\=/g, "");
        MPVUrl = `mpv://play/${streamUrl64}/?subfile=${subUrl64}`;
    }

    if (getOS() == "ios" || getOS() == "android") {
        MPVUrl = `mpv://${encodeURI(mediaInfo.streamUrl)}`;
    }

    console.log(MPVUrl);
    window.open(MPVUrl, "_blank");
}
async function embyCopyUrl() {
    let mediaInfo = await getEmbyMediaInfo();
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'absolute';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.value = mediaInfo.streamUrl;
    textarea.select();
    if (document.execCommand('copy', true)) {
        console.log(`copyUrl = ${mediaInfo.streamUrl}`);
        this.innerText = '复制成功';
    }
    //need https
    // if (navigator.clipboard) {
    //     navigator.clipboard.writeText(mediaInfo.streamUrl).then(() => {
    //          console.log(`copyUrl = ${mediaInfo.streamUrl}`);
    //          this.innerText = '复制成功';
    //     })
    // }
}

async function writeClipboard(text) {
    let flag = false;
    if (navigator.clipboard) {
        // 火狐上 need https
        try {
            await navigator.clipboard.writeText(text);
            flag = true;
            console.log("成功使用 navigator.clipboard 现代剪切板实现");
        } catch (error) {
            console.error('navigator.clipboard 复制到剪贴板时发生错误:', error);
        }
    } else {
        flag = writeClipboardLegacy(text);
        console.log("不存在 navigator.clipboard 现代剪切板实现,使用旧版实现");
    }
    return flag;
}

function writeClipboardLegacy(text) {
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'absolute';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.value = text;
    textarea.select();
    if (document.execCommand('copy', true)) {
        return true;
    }
    return false;
}

function getOS() {
    let u = navigator.userAgent
    if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
        return 'windows'
    } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
        return 'macOS'
    } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
        return 'ios'
    } else if (u.match(/android/i)) {
        return 'android'
    } else if (u.match(/Ubuntu/i)) {
        return 'Ubuntu'
    } else {
        return 'other'
    }
}
// monitor dom changements
document.addEventListener("viewbeforeshow", function (e) {
    if (e.detail.contextPath.startsWith("/item?id=")) {
        const mutation = new MutationObserver(function () {
            if (showFlag()) {
                init();
                mutation.disconnect();
            }
        })
        mutation.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true,
        })
    }
})
///////////////////////////////////////////////////////////////////////////////////////////
// 提取全局变量
const embyServerUrl = window.location.protocol + '//' + window.location.host; // 当前页面的地址
let accessToken; // 替换为你的 Emby 访问令牌
let userId; // 替换为你的 Emby 用户 ID

// 初始化 Emby 配置
async function initEmbyConfig() {
    accessToken = await ApiClient.accessToken(); // 替换为你的 Emby 访问令牌
    userId = ApiClient._serverInfo.UserId; // 替换为你的 Emby 用户 ID
}

//生成一个随机UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 合并功能到一个通用函数
async function sendEmbyPlayingEvent(targetPath, data) {
    fetch(`${embyServerUrl}${targetPath}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MediaBrowser-Token': accessToken
        },
        body: JSON.stringify(data)
    });
}

async function getNextEpisodeMediaInfo(currentItemId) {
    try {
        // 获取当前剧集信息
        let currentMediaInfo = await getItemInfo();
        if (currentMediaInfo.Type === "Episode") {
            // 获取当前剧集所属的系列
            let seriesNextUpItems = await ApiClient.getNextUpEpisodes({
                SeriesId: currentMediaInfo.SeriesId,
                UserId: userId
            });
            if (seriesNextUpItems.Items.length > 0) {
                let nextItemId = seriesNextUpItems.Items[0].Id;
                // 获取下一集的媒体信息
                let nextItemInfo = await ApiClient.getItem(userId, nextItemId);
                return await getEmbyMediaInfo(true, nextItemId);
            }
        }
        return null;
    } catch (error) {
        console.error('Failed to get next episode:', error);
        return null;
    }
}

// 定义全局变量
let artPlayerInstance = null;
let currentItemId = null;

async function Artplayer2() {
    await initEmbyConfig();

    let mainDetailButtons = document.querySelector("div[is='emby-scroller']:not(.hide) .mainDetailButtons");
    if (!mainDetailButtons) {
        console.error('Main detail buttons not found');
        return;
    }

    // 清理现有播放器
    let existingPlayer = document.getElementById('ArtplayerApp');
    if (existingPlayer) {
        if (artPlayerInstance) {
            artPlayerInstance.destroy();
            artPlayerInstance = null;
            console.log("Artplayer destroyed");
        }
        existingPlayer.remove();
    }

    // 创建播放器容器
    let playerContainer = document.createElement('div');
    playerContainer.id = 'ArtplayerApp';
    playerContainer.style.position = 'relative';
    playerContainer.style.width = '640px';
    playerContainer.style.height = '360px';
    mainDetailButtons.insertAdjacentElement('afterend', playerContainer);

    // 获取当前媒体信息并播放
    (async () => {
        try {
            let mediaInfo = await getEmbyMediaInfo(true);
            currentItemId = mediaInfo.itemid;

            // 初始化播放器
            artPlayerInstance = new Artplayer({
                container: '#ArtplayerApp',
                url: mediaInfo.streamUrl,
                ...(mediaInfo.subUrl ? { subtitle: { url: mediaInfo.subUrl, lang: 'zh' } } : {}),
                playbackRate: true,
                danmaku: false,
                theme: '#23ade5',
                logo: false,
                fullscreen: true,
                setting: true,
                pip: true,
                contextmenu: [],
                webtorrent: false,
                hls: true,
                autoPlayback: true,
                title: mediaInfo.intent.title, // 显示当前媒体标题
                controls: [
                    {
                        position: 'right',
                        html: '官方群组',
                        index: 1,
                        tooltip: '打开小雅群聊',
                        style: { marginRight: '20px' },
                        click: function () {
                            window.open('https://t.me/xiaoyaliu00');
                        },
                    },
                ],
            });

            let playSessionId = generateUUID();
            let isPaused = false;
            let playbackRate = 1.0;
            let playMethod = 'DirectPlay';
            let progressInterval = null;

            // 启动播放
            artPlayerInstance.play().then(() => {
                sendEmbyPlayingEvent('/Sessions/Playing', {
                    ItemId: currentItemId,
                    PlaySessionId: playSessionId,
                    PositionTicks: artPlayerInstance.currentTime * 10000000,
                    IsPaused: isPaused,
                    PlaybackRate: playbackRate,
                    PlayMethod: playMethod,
                    UserId: userId
                });

                progressInterval = setInterval(() => {
                    if (!isPaused) {
                        sendEmbyPlayingEvent('/Sessions/Playing/Progress', {
                            ItemId: currentItemId,
                            PlaySessionId: playSessionId,
                            PositionTicks: artPlayerInstance.currentTime * 10000000,
                            IsPaused: isPaused,
                            PlaybackRate: playbackRate,
                            PlayMethod: playMethod,
                            UserId: userId
                        });
                    }
                }, 5000);
            }).catch(error => {
                console.error('Failed to play video automatically:', error);
            });

            // 暂停事件
            artPlayerInstance.on('pause', () => {
                isPaused = true;
                sendEmbyPlayingEvent('/Sessions/Playing/Progress', {
                    ItemId: currentItemId,
                    PlaySessionId: playSessionId,
                    PositionTicks: artPlayerInstance.currentTime * 10000000,
                    IsPaused: isPaused,
                    PlaybackRate: playbackRate,
                    PlayMethod: playMethod,
                    UserId: userId
                });
                clearInterval(progressInterval);
            });

            // 播放事件
            artPlayerInstance.on('play', () => {
                isPaused = false;
                sendEmbyPlayingEvent('/Sessions/Playing/Progress', {
                    ItemId: currentItemId,
                    PlaySessionId: playSessionId,
                    PositionTicks: artPlayerInstance.currentTime * 10000000,
                    IsPaused: isPaused,
                    PlaybackRate: playbackRate,
                    PlayMethod: playMethod,
                    UserId: userId
                });
                clearInterval(progressInterval);
                progressInterval = setInterval(() => {
                    if (!isPaused) {
                        sendEmbyPlayingEvent('/Sessions/Playing/Progress', {
                            ItemId: currentItemId,
                            PlaySessionId: playSessionId,
                            PositionTicks: artPlayerInstance.currentTime * 10000000,
                            IsPaused: isPaused,
                            PlaybackRate: playbackRate,
                            PlayMethod: playMethod,
                            UserId: userId
                        });
                    }
                }, 5000);
            });

            // 播放结束事件
            artPlayerInstance.on('ended', () => {
                sendEmbyPlayingEvent(`/Users/${userId}/PlayedItems/${currentItemId}`, {
                    datePlayed: new Date().toISOString()
                });
                clearInterval(progressInterval);
                console.log('Playback ended');
            });

            // 错误事件
            artPlayerInstance.on('error', (error) => {
                console.error('Player error:', error);
                clearInterval(progressInterval);
            });

        } catch (error) {
            console.error('Failed to initialize player:', error);
        }
    })();
}


// 页面切换清理
document.addEventListener("viewbeforeshow", function (e) {
    if (e.detail.contextPath.startsWith("/item?id=")) {
        const newItemIdMatch = e.detail.contextPath.match(/item\?id=(\d+)/);
        const newItemId = newItemIdMatch ? newItemIdMatch[1] : null;
        if (newItemId && currentItemId && newItemId !== currentItemId) {
            if (artPlayerInstance) {
                artPlayerInstance.destroy();
                artPlayerInstance = null;
                console.log(`Artplayer destroyed due to itemId change: ${currentItemId} -> ${newItemId}`);
            }
            let playerContainer = document.getElementById('ArtplayerApp');
            if (playerContainer) {
                playerContainer.remove();
                console.log("Artplayer container removed");
            }
            playlist = [];
            currentIndex = 0;
        }
        const mutation = new MutationObserver(function () {
            if (showFlag()) {
                init();
                mutation.disconnect();
            }
        });
        mutation.observe(document.body, { childList: true, characterData: true, subtree: true });
    } else {
        if (artPlayerInstance) {
            artPlayerInstance.destroy();
            artPlayerInstance = null;
            console.log("Artplayer destroyed due to page navigation");
        }
        let playerContainer = document.getElementById('ArtplayerApp');
        if (playerContainer) {
            playerContainer.remove();
            console.log("Artplayer container removed");
        }
        currentItemId = null;
        playlist = [];
        currentIndex = 0;
    }
});

// 页面卸载清理
window.addEventListener('beforeunload', function () {
    if (artPlayerInstance) {
        artPlayerInstance.destroy();
        artPlayerInstance = null;
        console.log("Artplayer destroyed on page unload");
    }
    let playerContainer = document.getElementById('ArtplayerApp');
    if (playerContainer) {
        playerContainer.remove();
    }
    currentItemId = null;
    playlist = [];
    currentIndex = 0;
});

