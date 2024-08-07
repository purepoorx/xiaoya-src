#!/bin/bash

if [[ ! -f /data/uc_cookie.txt ]] && [[ ! -s /data/uc_cookie.txt ]]; then
	exit
fi

cookie=$(head -n1 /data/uc_cookie.txt)
referer="https://drive.uc.cn"
user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch"
url="https://pc-api.uc.cn/1/clouddrive/file/sort?pr=UCBrowser&fr=pc&pdir_fid=0&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc"
#url="https://pc-api.uc.cn/1/clouddrive/config?pfr=pc&platform=pc"
#url="https://pc-api.uc.cn/api/config?fr=pc&platform=pc"
headers="Cookie: $cookie; User-Agent: $user_agent; Referer: $referer"

response=$(curl -s -D - -H "$headers" "$url")
set_cookie=$(echo "$response" | grep -i "^Set-Cookie:" | sed 's/Set-Cookie: //')
status=$(echo "$response" | grep -i status|cut -f2 -d:|cut -f1 -d,)

if [ "$status" == "401" ]; then
    echo "无效UC cookie"
elif [ "$set_cookie" != "" ]; then
		if [ "$1" = 'update' ]; then
			new_puus=$(echo "$set_cookie" | cut -f2 -d\:|cut -f1 -d\;)
			new_cookie=$(echo "$cookie" |sed "s#__puus=[^;]*#$new_puus#")
			echo "$new_cookie" > /data/uc_cookie.txt
    		echo "有效UC cookie 并更新"
		else
			echo "有效UC cookie"
		fi

elif [[ "$set_cookie" == "" ]] && [[ "$status" == "200" ]]; then
		echo "有效UC cookie"
else
    	echo "请求失败，请检查Cookie或网络连接是否正确。"
fi

