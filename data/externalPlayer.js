 function init() {
        let playBtns = document.getElementById("ExternalPlayersBtns");
        if (playBtns) {
            playBtns.remove();
        }
        let mainDetailButtons = document.querySelector("div[is='emby-scroller']:not(.hide) .mainDetailButtons");
        let buttonhtml = `<div id="ExternalPlayersBtns" class ="detailButtons flex align-items-flex-start flex-wrap-wrap">
    <button id="embyPot" type="button" class="button-flat detailButton emby-button" title="Potplayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-PotPlayer">　</i>  <span class="button-text">Pot</span> </div> </button>
            <button id="embyVlc" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="VLC"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-VLC">　</i>  <span class="button-text">VLC</span>  </div> </button>
            <button id="embyIINA" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="IINA"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-IINA">　</i>  <span class="button-text">IINA</span> </div> </button>
            <button id="embyNPlayer" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="NPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-NPlayer">　</i>  <span class="button-text">NPlayer</span> </div> </button>
            <button id="embyMX" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="MXPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-MXPlayer">　</i>  <span class="button-text">MX</span> </div> </button>
            <button id="embyInfuse" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="InfusePlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-infuse">　</i>  <span class="button-text">Infuse</span> </div> </button>
            <button id="embyFileball" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="Fileball"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-Fileball">　</i>  <span class="button-text">Fileball</span> </div> </button>			
            <button id="embySenPlayer" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="SenPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-SenPlayer">　</i>  <span class="button-text">SenPlayer</span> </div> </button>
            <button id="embyMPV" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="MPV"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-MPV">　</i>  <span class="button-text">MPV</span> </div> </button>
            <button id="embyCopyUrl" type="button" class="detailButton  emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="复制串流地址"> <div class="detailButton-content"> <i class="md-icon detailButton-icon button-icon button-icon-left icon-Copy">　</i>  <span class="button-text">复制链接</span> </div> </button>
            </div>`
        mainDetailButtons.insertAdjacentHTML('afterend', buttonhtml)
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
 
        //add icons
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
    }
 
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
        let response = await ApiClient.getItem(userId, itemId);
        //继续播放当前剧集的下一集
        if (response.Type == "Series") {
            let seriesNextUpItems = await ApiClient.getNextUpEpisodes({ SeriesId: itemId, UserId: userId });
            console.log("nextUpItemId: " + seriesNextUpItems.Items[0].Id);
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
 
 
    async function getEmbyMediaInfo() {
        let itemInfo = await getItemInfo();
        let mediaSourceId = itemInfo.MediaSources[0].Id;
        let selectSource = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSource");
        if (selectSource && selectSource.value.length > 0) {
            mediaSourceId = selectSource.value;
        }
        //let selectAudio = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectAudio");
        let mediaSource = itemInfo.MediaSources.find(m => m.Id == mediaSourceId);
        let domain = `${ApiClient._serverAddress}/emby/videos/${itemInfo.Id}`;
        let subPath = getSubPath(mediaSource);
        let subUrl = subPath.length > 0 ? `${domain}${subPath}?api_key=${ApiClient.accessToken()}` : '';
        let streamUrl = `${domain}/stream.${mediaSource.Container}?api_key=${ApiClient.accessToken()}&Static=true&MediaSourceId=${mediaSourceId}`;
        let position = parseInt(itemInfo.UserData.PlaybackPositionTicks / 10000);
        let intent = await getIntent(mediaSource, position);
        console.log(streamUrl, subUrl, intent);
        return {
            streamUrl: streamUrl,
            subUrl: subUrl,
            intent: intent,
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
        if (e.detail.contextPath.startsWith("/item?id=") ) {
            const mutation = new MutationObserver(function() {
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


