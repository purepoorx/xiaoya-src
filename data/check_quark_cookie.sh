#!/bin/bash

if [[ ! -f /data/quark_cookie.txt ]] && [[ ! -s /data/quark_cookie.txt ]]; then
	exit
fi

cookie=$(head -n1 /data/quark_cookie.txt)
referer="https://pan.quark.cn"
user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch"
#url="https://drive-pc.quark.cn/1/clouddrive/member?pr=ucpro&fr=pc&uc_param_str=&fetch_subscribe=true&_ch=home&fetch_identity=true"
url="https://drive-pc.quark.cn/1/clouddrive/config?pr=ucpro&fr=pc&uc_param_str="

headers="Cookie: $cookie; User-Agent: $user_agent; Referer: $referer"

response=$(curl -s -D - -H "$headers" "$url")
#member=$(echo $response | jq -r '.data.member_status.SUPER_VIP')
set_cookie=$(echo "$response" | grep -i "^Set-Cookie:" | sed 's/Set-Cookie: //')
status=$(echo "$response" | grep -i status|cut -f2 -d:|cut -f1 -d,)

if [ "$status" == "401" ]; then
    echo "无效夸克cookie"
elif [ "$status" == "200" ]; then
	state_url="https://drive-m.quark.cn/1/clouddrive/capacity/growth/info?pr=ucpro&fr=pc&uc_param_str="
	response=$(curl -s -H "$headers" "$state_url")
	sign_daily_reward=$(echo "$response" | jq -r '.data.cap_sign.sign_daily_reward')
	if [ $sign_daily_reward != null ]; then
		#sign_daily_reward=$(echo "$response" |cut -f6 -d\{|cut -f4 -d:|cut -f1 -d,)
		sign_daily_reward_mb=$(echo "scale=2; $sign_daily_reward / (1024 * 1024)" | bc)
		echo "夸克签到获取 $sign_daily_reward_mb" "MB"
	fi
	echo "有效夸克cookie"
else
        echo "请求失败，请检查Cookie或网络连接是否正确。"
fi

