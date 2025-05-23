#!/bin/bash

if [ ! -f /data/nosign.txt ] && [ -f /data/guestpass.txt ] && [ -f /data/guestlogin.txt ]; then
    sign=$(cat /data/guestpass.txt | tr -d '\r\n' | md5sum | awk '{print $1}')
fi

config_location() {
    sign=$1
    if [ -z "$sign" ]; then
        NEW_CONFIG=''
    else
        NEW_CONFIG='
                if ($modified_uri ~ ^/d/[^\\?]*(?!.*sign='"$sign"'($|&))) {
                    return 403;
                }
                '
    fi

    # 配置文件路径
    CONFIG_FILE="/etc/nginx/http.d/default.conf" 

    # 临时文件
    TMP_FILE=$(mktemp)

    # 检查文件是否存在
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "Error: Nginx configuration file not found at $CONFIG_FILE"
        exit 1
    fi

    # 处理文件
    awk -v new_config="$NEW_CONFIG" '
    BEGIN {
        in_target_block = 0
    }

    # 匹配到目标location行时立即插入配置
    /location \/d\/ \{/ {
        print
        # 立即插入新配置
        printf("%s",new_config)
        in_target_block = 1
        next
    }

    /location.*我的115.*\{/ {
        print
        # 立即插入新配置
        printf("%s",new_config)
        in_target_block = 1
        next
    }

    # 在目标块中检查现有的if (sign=)条件
    in_target_block && /if.*sign=/ {
        # 跳过现有的if块（不打印）
        while (getline > 0) {
            if (/}[[:space:]]*$/) {
                break
            }
        }
	in_target_block = 0
        next
    }

    # 其他情况直接打印
    {
        print
    }
    ' "$CONFIG_FILE" | sed '/^[[:space:]]*$/N; /^\n$/D' > "$TMP_FILE"

    mv -f "$TMP_FILE" "$CONFIG_FILE"

}

config_geo() {
    sign=$1
    if [ -z "$sign" ]; then
        NEW_CONFIG=''
    else
        NEW_CONFIG='
geo $remote_addr $is_external {
    default 1;

    192.168.0.0/16    0;
    10.0.0.0/8        0;
    172.16.0.0/12     0;
    127.0.0.0/8       0;
    100.64.0.0/10     0;
}
'
    fi

    # 配置文件路径
    CONFIG_FILE="/etc/nginx/http.d/default.conf" 

    # 临时文件
    TMP_FILE=$(mktemp)

    # 检查文件是否存在
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "Error: Nginx configuration file not found at $CONFIG_FILE"
        exit 1
    fi

    # 处理文件
    awk -v new_config="$NEW_CONFIG" '
    BEGIN {
        print
        # 立即插入新配置
        printf("%s",new_config)
    }

    # 在目标块中检查现有的geo块
    /geo \$remote_addr \$is_external/ {
        # 跳过现有的块（不打印）
        while (getline > 0) {
            if (/}[[:space:]]*$/) {
                break
            }
        }
        next
    }

    # 其他情况直接打印
    {
        print
    }
    ' "$CONFIG_FILE" | sed '/^[[:space:]]*$/N; /^\n$/D' > "$TMP_FILE"

    mv -f "$TMP_FILE" "$CONFIG_FILE"

}

config_uri_map() {
    sign=$1
    if [ -z "$sign" ]; then
        NEW_CONFIG=''
    else
        NEW_CONFIG='
map $is_external $modified_uri {
    default         $uri?sign=$arg_sign;
    0               $uri?sign='"$sign"';
    1               $uri?sign=$arg_sign;
}
'
    fi

    # 配置文件路径
    CONFIG_FILE="/etc/nginx/http.d/default.conf" 

    # 临时文件
    TMP_FILE=$(mktemp)

    # 检查文件是否存在
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "Error: Nginx configuration file not found at $CONFIG_FILE"
        exit 1
    fi

    # 处理文件
    awk -v new_config="$NEW_CONFIG" '
    BEGIN {
        print
        # 立即插入新配置
        printf("%s",new_config)
    }

    # 在目标块中检查现有的map块
    /map \$is_external \$modified_uri/ {
        # 跳过现有的块（不打印）
        while (getline > 0) {
            if (/}[[:space:]]*$/) {
                break
            }
        }
        next
    }

    # 其他情况直接打印
    {
        print
    }
    ' "$CONFIG_FILE" | sed '/^[[:space:]]*$/N; /^\n$/D' > "$TMP_FILE"

    mv -f "$TMP_FILE" "$CONFIG_FILE"

}

config_location "$sign"
config_uri_map "$sign"
config_geo "$sign"
nginx -s reload
