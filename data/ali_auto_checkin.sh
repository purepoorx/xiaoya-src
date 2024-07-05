#!/bin/bash

function get_json_value()
{
	local json=$1
        local key=$2

        if [[ -z "$3" ]]; then
             local num=1
        else
             local num=$3
        fi

	local value=$(echo "${json}" | awk -F"[,:}]" '{for(i=1;i<=NF;i++){if($i~/'${key}'\042/){print $(i+1)}}}' | tr -d    '"' | sed -n ${num}p)
        echo ${value}
}


_refresh_token=$1
_token=$(curl -s -X POST -H "Content-Type: application/json" -d '{"grant_type": "refresh_token", "refresh_token":                 "'"$_refresh_token"'"}' https://auth.aliyundrive.com/v2/account/token)
_access_token=$(get_json_value $_token "access_token")
_nick_name=$(get_json_value $_token "nick_name")

for (( i=0; i<3; i++ ))
do
	_sign=$(curl -s -X POST -H "Content-Type: application/json" -H 'Authorization:Bearer '$_access_token'' -d '{"grant_type":           "refresh_token", "refresh_token": "'"$_refresh_token"'"}' https://member.aliyundrive.com/v1/activity/sign_in_list)
	_success=$(echo $_sign | cut -f1 -d, | cut -f2 -d:)
    if [ -z "$_success" ]; then
        _success="false"
    fi
	if [ $_success = "true" ]; then
		i=3
	fi
done

echo $_sign |jq > /tmp/ali_auto_checkin.log

if [ $_success = "true" ]; then
	_signInCount=$(echo $_sign | jq '.result.signInCount')
	cards=$(echo "$_sign" | jq '[.result.signInLogs[] | select(.status == "normal" and .isReward == false)]' | jq '.[] | .day')
	count=$(echo "$_sign" | jq '[.result.signInLogs[] | select(.status == "normal" and .isReward == false)]' | jq '.[] | .day' | wc -l)
    wait=()
    if [ $count -gt 0 ]; then
        for day in ${cards[@]}
        do
            _res=$(curl -s -H 'Authorization:Bearer '$_access_token'' -H "Content-Type: application/json" -X POST -d '{"signInDay": '$day'}' "https://member.aliyundrive.com/v1/activity/sign_in_reward?_rx-s=mobile")            
            outres='今日签到获得 '$(echo $_res | jq '.result.name'| sed 's/\"//g')$(echo $_res | jq '.result.description'| sed 's/\"//g')"\n"
            wait+=($outres)
        done
    fi
	echo -e "\e[32m"
	if [ $count -gt 0 ]; then
		echo -e $_nick_name" 签到成功,本月累计"$_signInCount"天\n${wait[*]}"
	else        
		echo -e $_nick_name" 签到成功,本月累计"$_signInCount"天"
	fi
else
	echo -e "\e[31m"
    echo "阿里签到失败"
fi
echo -e "\e[0m"
