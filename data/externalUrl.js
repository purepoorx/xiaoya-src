let oriData = '';

function HeaderFilter(r) {
    r.headersOut['Content-Length'] = null;
}
const incloudUrl = (r, data, flags) => {
    oriData += data;
    if (flags.last) {
        oriData += `
         <script type="text/javascript" src="externalPlayer.js"></script>
         <script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
         <script src="https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js"></script>
        `;
        r.sendBuffer(oriData, flags);
        r.done();
    }
}
export default { HeaderFilter, incloudUrl };
