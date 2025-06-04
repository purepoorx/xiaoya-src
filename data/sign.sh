#!/bin/bash

direct_link=$(cat /opt/alist/alist | grep -ao "\\\$\\{[a-z]*\\}\\\$\\{[a-z]*\\}\\\$\\{[a-z]*\\}" | sed "s/\\\$/\$dollar/g")
sign_cond=$(cat /opt/alist/alist | grep -ao '[a-z]*!=="preview"&&[a-z]*\.sign' | sed "s/\\\$/\$dollar/g")
sign_str=$(cat /opt/alist/alist | grep -ao '\?sign=\$\{[a-z]*\.sign\}' | sed "s/\\\$/\$dollar/g")
direct_link_sign=$direct_link
if [ ! -f /data/nosign.txt ] && [ -f /data/guestpass.txt ] && [ -f /data/guestlogin.txt ]; then
    sign=$(cat /data/guestpass.txt | tr -d '\r\n' | md5sum | awk '{print $1}')
    js='
(function(){
    return "?sign='"$sign"'";
})();
'
    js=$(echo -n "$js" | base64 -w 0)
    direct_link_sign="$(cat /opt/alist/alist | grep -ao "\\\$\\{[a-z]*\\}\\\$\\{[a-z]*\\}\\\$\\{[a-z]*\\}" | sed "s/\\\$/\$dollar/g")\$dollar{(()=>{const encodedFunc = \"$js\"; const decodedFunc = atob(encodedFunc); return eval(decodedFunc);})()}"
fi

# 配置文件路径
CONFIG_FILE="/etc/nginx/http.d/default.conf" 

alist_address="http://127.0.0.1:$(cat $CONFIG_FILE | grep -o ":52[0-9]*" | tr -d ":" | head -n1)"

sed -i "s/XIAOYASIGN/$sign/g" /etc/nginx/http.d/emby.js

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

}
'
    fi

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

config_geo_dollar() {
    sign=$1
    if [ -z "$sign" ]; then
        NEW_CONFIG=''
    else
        NEW_CONFIG='
geo $dollar {
    default "$";
}
'
    fi

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
    /geo \$dollar/ {
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

config_location_assets() {
    sign=$1
    if [ -z "$sign" ]; then
        NEW_CONFIG=''
    else
        NEW_CONFIG='
    location /assets {
        proxy_pass '"$alist_address"';
        proxy_set_header Accept-Encoding "";
        sub_filter '"'$direct_link'"' '"'$direct_link_sign'"';
        sub_filter '"'$sign_str'"' '"''"';
        sub_filter '"'$sign_cond'"' '"'false'"';
        sub_filter_once off;
        sub_filter_types *;
        proxy_cache apicache;
    }
'
    fi

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

    # 匹配到目标server行时立即插入配置
    /server \{/ {
        print
        # 立即插入新配置
        printf("%s",new_config)
        in_target_block = 1
        next
    }

    # 在目标块中检查现有的location /assets
    in_target_block && /location \/assets/ {
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

config_location "$sign"
config_uri_map "$sign"
config_geo "$sign"

#给网页直链加上签名
config_geo_dollar "$sign"
config_location_assets "$sign"
if [ -f /run/nginx/nginx.pid ]; then
    nginx -s reload
fi
