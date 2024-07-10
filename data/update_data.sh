#!/bin/bash

base_urls=(
    "https://gitlab.com/xiaoyaliu/data/-/raw/main"
    "https://raw.githubusercontent.com/xiaoyaliu00/data/main"
    "https://cdn.wygg.shop/https://raw.githubusercontent.com/xiaoyaliu00/data/main"
    "https://fastly.jsdelivr.net/gh/xiaoyaliu00/data@latest"
    "https://521github.com/extdomains/github.com/xiaoyaliu00/data/raw/main"
    "https://cors.zme.ink/https://raw.githubusercontent.com/xiaoyaliu00/data/main"
    "https://git.jasonml.xyz/https://raw.githubusercontent.com/xiaoyaliu00/data/main/"
    "https://cdn.wygg.shop/https://raw.githubusercontent.com/xiaoyaliu00/data/main/"
    "https://gh.ddlc.top/https://raw.githubusercontent.com/xiaoyaliu00/data/main/"
    "https://git.886.be/https://raw.githubusercontent.com/xiaoyaliu00/data/main/"
    "https://gh.idayer.com/https://raw.githubusercontent.com/xiaoyaliu00/data/main/"
    "https://slink.ltd/https://raw.githubusercontent.com/xiaoyaliu00/data/main/"
)

success=false
for base_url in "${base_urls[@]}"; do
    remote_ver=$(curl --ipv4 ${base_url}/version.txt 2>/dev/null)
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

data_dir="/www/data"
mkdir -p "${data_dir}"
touch "${data_dir}/version.txt"
local_ver=$(cat "${data_dir}/version.txt")
if [ "$local_ver"x != "$remote_ver"x ] || [ ! -f "${data_dir}/tvbox.zip" ] || [ ! -f "${data_dir}/update.zip" ] || [ ! -f "${data_dir}/index.zip" ]; then
echo "最新版本 $remote_ver 开始更新下载....."
    echo ""	
    if curl --ipv4 --insecure -fsSL -o "${data_dir}/tvbox.zip" $download_url/tvbox.zip; then echo "成功更新 tvbox.zip"; fi 
    if curl --ipv4 --insecure -fsSL -o "${data_dir}/update.zip" $download_url/update.zip; then echo "成功更新 update.zip"; fi
    if curl --ipv4 --insecure -fsSL -o "${data_dir}/index.zip" $download_url/index.zip; then echo "成功更新 index.zip"; fi 
    if curl --ipv4 --insecure -fsSL -o "${data_dir}/version.txt" $download_url/version.txt; then echo "成功更新 version.txt"; fi 
else
    echo "数据版本已经是最新的无须更新"		
fi