#!/bin/bash

# 镜像URL列表，不包含官方URL，官方的后面自动添加
alive_urls=($(curl --ipv4 -s --max-time 4 "https://api.akams.cn/github" |jq -r '.data | sort_by(-.speed, .latency) | .[:10] | .[].url' |sed 's#$#/https://raw.githubusercontent.com/xiaoyaDev/data/main#g' ))

mirror_base_urls=(
    "https://www.gitproxy.click/https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://tvv.tw/https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://github.tbedu.top/https://raw.githubusercontent.com/xiaoyaDev/data/main"
    "https://gh-proxy.ygxz.in/https://raw.githubusercontent.com/xiaoyaDev/data/main"
)

base_urls=($(printf "%s\n" "${mirror_base_urls[@]}" | shuf))
base_urls=("https://raw.githubusercontent.com/xiaoyaDev/data/main" "${base_urls[@]}" "${alive_urls[@]}")

error="\033[93m请确保有科学环境并执行下面命令\ndocker exec xiaoya rm -rf /www/data/version.txt && docker restart xiaoya && docker logs -f -n 100 xiaoya\n\n只要提示下载github数据出错就是百分百没有科学环境或科学环境设置有问题，自行处理解决\033[0m"

data_dir="/www/data"
rm -f ${data_dir}/*.bak 2>/dev/null

# 没有传入参数（容器启动调用场景），优先使用自定义URL（自定义URL有可能是127.0.0.1，新建容器场景必然是失败，可以继续尝试其他内置的url）
# 有传入参数（crontab调用场景），优先使用内置URL
if [ -f /data/download_url.txt ]; then
	download_url=$(head -n1 /data/download_url.txt)
else
	download_url=""
	echo "http://127.0.0.1:81/data" > /data/download_url.txt
fi

if [[ "$1" == "" ]]; then
    if grep -q 127.0.0.1 /data/download_url.txt && [[ ! -f ${data_dir}/tvbox.zip  ]] && [[ ! -f ${data_dir}/index.zip  ]] && [[ ! -f ${data_dir}/update.zip  ]] && [[ ! -f ${data_dir}/version.txt  ]]; then
		base_urls=("${base_urls[@]}")
    else
		base_urls=("$download_url" "${base_urls[@]}")
    fi
else
    if grep -q 127.0.0.1 /data/download_url.txt; then
    	base_urls=("${base_urls[@]}" "$download_url")
    else
		base_urls=("$download_url" "${base_urls[@]}")
    fi
fi

# 获取远端版本号
success=false
for base_url in "${base_urls[@]}"; do
    remote_ver=$(curl --ipv4 ${base_url}/version.txt 2>/dev/null | grep -q -e '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
    if [ $? -eq 0 ] && [ -n "$remote_ver" ]; then
        success=true
        version_url=$base_url
        echo "有效地址为：$base_url"
        break
    fi
done

if [ "$success" = false ]; then
    echo "错误：下载github数据 version.txt 出错"
    echo -e "$error"
    exit 1
fi

mkdir -p "${data_dir}"
touch "${data_dir}/version.txt"
local_ver=$(cat "${data_dir}/version.txt")

# 检查是否需要更新
if [ "$(printf '%s\n' "$local_ver" "$remote_ver" | sort -V | head -n1)" != "$remote_ver" ] || [ ! -f "${data_dir}/tvbox.zip" ] || [ ! -f "${data_dir}/update.zip" ] || [ ! -f "${data_dir}/index.zip" ]; then
    echo "最新版本 $remote_ver 开始更新下载....."
    echo ""

    # 为每个文件创建临时备份文件名
    tvbox_zip_bak="$(cat /proc/sys/kernel/random/uuid)".bak
    update_zip_bak="$(cat /proc/sys/kernel/random/uuid)".bak
    index_zip_bak="$(cat /proc/sys/kernel/random/uuid)".bak
    version_txt_bak="$(cat /proc/sys/kernel/random/uuid)".bak
    a115share_txt_bak="$(cat /proc/sys/kernel/random/uuid)".bak
    
    # 下载状态标记
    success=true
    
    # 下载tvbox.zip（失败时尝试其他镜像）
    if [ "$success" = true ]; then
        for base_url in "${base_urls[@]}"; do
            if curl --ipv4 --insecure -fsSL -o "${data_dir}/${tvbox_zip_bak}" ${base_url}/tvbox.zip >/dev/null 2>&1 && unzip -t "${data_dir}/${tvbox_zip_bak}" >/dev/null 2>&1; then
                echo "成功下载 tvbox.zip 地址：${base_url}/tvbox.zip"
                mv ${data_dir}/${tvbox_zip_bak} ${data_dir}/tvbox.zip
                break
            else
                if [ "$base_url" == "${base_urls[-1]}" ]; then
                    success=false
                fi
            fi
        done

        if [ "$success" = false ]; then
            echo "错误：下载github数据 tvbox.zip 出错"
            echo -e "$error"
        fi
    fi
    
    # 下载update.zip（失败时尝试其他镜像）
    if [ "$success" = true ]; then
        for base_url in "${base_urls[@]}"; do
            if curl --ipv4 --insecure -fsSL -o "${data_dir}/${update_zip_bak}" ${base_url}/update.zip >/dev/null 2>&1 && unzip -t "${data_dir}/${update_zip_bak}" >/dev/null 2>&1; then
                echo "成功下载 update.zip 地址：${base_url}/update.zip"
                mv ${data_dir}/${update_zip_bak} ${data_dir}/update.zip
                break
            else
                if [ "$base_url" == "${base_urls[-1]}" ]; then
                    success=false
                fi
            fi
        done

        if [ "$success" = false ]; then
            echo "错误：下载github数据 update.zip 出错"
            echo -e "$error"
        fi
    fi
    
    
    # 下载index.zip（失败时尝试其他镜像）
    if [ "$success" = true ]; then
        for base_url in "${base_urls[@]}"; do
            if curl --ipv4 --insecure -fsSL -o "${data_dir}/${index_zip_bak}" ${base_url}/index.zip >/dev/null 2>&1 && unzip -t "${data_dir}/${index_zip_bak}" >/dev/null 2>&1; then
                echo "成功下载 index.zip 地址：${base_url}/index.zip"
                mv ${data_dir}/${index_zip_bak} ${data_dir}/index.zip
                break
            else
                if [ "$base_url" == "${base_urls[-1]}" ]; then
                    success=false
                fi
            fi
        done

        if [ "$success" = false ]; then
            echo "错误：下载github数据 index.zip 出错"
            echo -e "$error"
        fi
    fi

    # 下载115share_list.txt（失败时尝试其他镜像）
    if [ "$success" = true ]; then
        for base_url in "${base_urls[@]}"; do
            if curl --ipv4 --insecure -fsSL -o "${data_dir}/${a115share_txt_bak}" ${base_url}/115share_list.txt >/dev/null 2>&1 && cat "${data_dir}/${a115share_txt_bak}" | grep -q "电影"; then
                echo "成功下载 115share_list.txt 地址：${base_url}/115share_list.txt"
                mv ${data_dir}/${a115share_txt_bak} ${data_dir}/115share_list.txt
                break
            else
                if [ "$base_url" == "${base_urls[-1]}" ]; then
                    success=false
                fi
            fi
        done

        if [ "$success" = false ]; then
            echo "错误：下载github数据 115share_list.txt 出错"
            echo -e "$error"
        fi

    fi
    
    # 下载version.txt（失败时尝试其他镜像）
    if [ "$success" = true ]; then
        for base_url in "${base_urls[@]}"; do
            if curl --ipv4 --insecure -fsSL -o "${data_dir}/${version_txt_bak}" ${base_url}/version.txt >/dev/null 2>&1 && cat "${data_dir}/${version_txt_bak}" | grep -q -e '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$' ; then
                echo "成功下载 version.txt 地址：${base_url}/version.txt"
                break
            else
                if [ "$base_url" == "${base_urls[-1]}" ]; then
                    success=false
                fi
            fi
        done

        if [ "$success" = false ]; then
            echo "错误：下载github数据 version.txt 出错"
            echo -e "$error"
        fi

    fi

    if [ "$success" == true ]; then
        mv ${data_dir}/${version_txt_bak} ${data_dir}/version.txt
    fi

else
    echo "数据版本已经是最新的 $local_ver，无须更新"
fi
