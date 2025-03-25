#!/bin/bash

base_urls=(
    "https://slink.ltd/https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://gitdl.cn/https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://gh-proxy.com/https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://ghproxy.cc/https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://gh.llkk.cc/https://raw.githubusercontent.com/xiaoyaDev/data/main"
)

if [[ -f /data/download_url.txt ]] && [[ "$1" == "" ]]; then
	download_url=$(head -n1 /data/download_url.txt)
	remote_ver=$(curl --ipv4 ${download_url}/version.txt 2>/dev/null | grep -e '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
else
	success=false
	for base_url in "${base_urls[@]}"; do
    	remote_ver=$(curl --ipv4 ${base_url}/version.txt 2>/dev/null | grep -e '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
    	if [ $? -eq 0 ]; then
        	success=true
			download_url="${base_url}"
        	echo "有效地址为：$download_url" 
        	break
    	fi
	done

	if [ "$success" = false ]; then
    	echo "找不到有效下载地址"
    	exit 1
	fi
fi

data_dir="/www/data"
mkdir -p "${data_dir}"
touch "${data_dir}/version.txt"
local_ver=$(cat "${data_dir}/version.txt")
if [ "$(printf '%s\n' "$local_ver" "$remote_ver" | sort -V | head -n1)" != "$remote_ver" ] || [ ! -f "${data_dir}/tvbox.zip" ] || [ ! -f "${data_dir}/update.zip" ] || [ ! -f "${data_dir}/index.zip" ]; then
echo "最新版本 $remote_ver 开始更新下载....."
    echo ""	
    if curl --ipv4 --insecure -fsSL -o "${data_dir}/tvbox.zip" $download_url/tvbox.zip; then echo "成功更新 tvbox.zip"; fi 
    if [ curl --ipv4 --insecure -fsSL -o "${data_dir}/update.zip" $download_url/update.zip ]; then 
	echo "成功更新 update.zip"
    else
	echo -e '\033[93m请确保有科学环境并执行下面命令\ndocker exec xiaoya rm -rf /www/data/version.txt && docker restart xiaoya && docker logs -f -n 100 xiaoya\n\n只要下载不到github数据，\n或日志出现 “curl: (7) Failed to connect to raw.githubusercontent.com port 443 after 30 ms: Could not connect to server” \n或 “Parse error near line 1: no such table: x_storages” \n就是百分百没有科学环境或科学环境设置有问题，自行处理解决\033[0m'
    fi
    if curl --ipv4 --insecure -fsSL -o "${data_dir}/index.zip" $download_url/index.zip; then echo "成功更新 index.zip"; fi 
    if curl --ipv4 --insecure -fsSL -o "${data_dir}/version.txt" $download_url/version.txt; then echo "成功更新 version.txt"; fi 
else
    echo "数据版本已经是最新的无须更新"		
fi
