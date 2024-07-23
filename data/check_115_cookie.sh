#!/bin/bash

    cookie=$(head -n1 "/data/115_cookie.txt")
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch"
    url="https://passportapi.115.com/app/1.0/web/1.0/check/sso"
    headers="Cookie: $cookie; User-Agent: $user_agent; Referer: https://appversion.115.com/1/web/1.0/api/chrome"
    response=$(curl -s -D - -H "$headers" "$url")
	echo $response

    if echo -e "${response}" | grep -q "user_id"; then
        echo "有效 115 Cookie"
    else
        echo "请求失败，请检查 Cookie 或网络连接是否正确。"
    fi
