#!/bin/bash

    cookie=$(head -n1 "/data/115_cookie.txt")
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch"
    #url="https://passportapi.115.com/app/1.0/web/1.0/check/sso"
	url="https://my.115.com/?ct=ajax&ac=nav"
    headers="Cookie: $cookie; User-Agent: $user_agent; Referer: https://appversion.115.com/1/web/1.0/api/chrome"
    response=$(curl -s -H "$headers" "$url")
	#vip=$(echo  "${response}" |jq .data.vip)
	vip=$(echo "$response" | sed 's/.*vip\"\:\([[:digit:]]\).*/\1/' )
    if echo -e "${response}" | grep -q "user_id"; then
		if [ $vip == "0" ];then
        	echo "有效的 115 Cookie, 但你不是115会员"
    	else
        	echo "有效的 115 Cookie, 你是115尊贵的会员"
    	fi
    else
        echo "请求失败，请检查 Cookie 或网络连接是否正确。"
    fi
