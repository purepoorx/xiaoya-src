#!/bin/bash

/updateall
#/bin/busybox-extras httpd -p 81 -h /www
/sign.sh
/usr/sbin/nginx

if [[ -f /data/mytoken.txt ]] && [[ -s /data/mytoken.txt ]]; then
        user_token=$(head -n1 /data/mytoken.txt|cut -f1 -d" ")
        #/token $user_token
        echo `date` "User's own token $user_token has been updated into database successfully"
	#/ali_auto_checkin.sh $user_token
	newtoken=$(/checktoken $user_token)
	newtoken_len=${#newtoken} 
	if [ $newtoken_len -eq 32 ]; then
		echo "$(sed "s/$user_token/$newtoken/" /data/mytoken.txt)" > /data/mytoken.txt
	fi
	open_token=$(head -n1 /data/myopentoken.txt| tr -d '\r')
	newopentoken=$(/checkopentoken $open_token)
        newopentoken_len=${#newopentoken}
        if [[ $newopentoken_len -eq 280 ]] || [[ $newopentoken_len -eq 335 ]]; then
                echo "$(sed "s/$open_token/$newopentoken/" /data/myopentoken.txt)" > /data/myopentoken.txt
        fi
fi

sqlite3 /opt/alist/data/data.db <<EOF
delete from x_storages where driver = 'PikPakShare' OR driver = 'PikPak';
EOF
if [[ -f /data/pikpak.txt ]] && [[ -s /data/pikpak.txt ]]; then
	/pikpak
	echo `date` "User's own PikPak account has been updated into database successfully"
fi

if [ -f /data/guestlogin.txt ]; then
	if [[ -f /data/guestpass.txt ]] && [[ -s /data/guestpass.txt ]]; then
        guest_pass=$(head -n1 /data/guestpass.txt | tr -d '\r')
        /guestpass $guest_pass
        echo `date` "User's guest password has been updated into database successfully"
	fi
        sqlite3 /opt/alist/data/data.db <<EOF
update x_users set disabled = 1 where id = 2;
INSERT OR REPLACE INTO x_users VALUES(3,'dav',"$guest_pass",'/',0,368,'',0,0,'');
EOF
        echo `date` "Mandatory Login has been enabled"
else
	sqlite3 /opt/alist/data/data.db <<EOF
update x_users set disabled = 0, permission = '368'  where id = 2;
EOF

fi

if [ -s /data/strm_dir.txt ]; then
    sqlite3 /opt/alist/data/data.db <<EOF
INSERT INTO x_storages VALUES(20002,'/strm',0,'Local',10,'work','{"root_folder_path":"/strm","directory_size":false,"thumbnail":false,"thumb_cache_folder":"","thumb_concurrency":"16","video_thumb_pos":"20%","show_hidden":true,"mkdir_perm":"777","recycle_bin_path":"delete permanently"}','','2022-09-29 20:14:52.313982364+00:00',0,'name','ASC','front',0,'native_proxy','');
EOF
fi

if [ -s /data/strm.txt ]; then
	sqlite3 /opt/alist/data/data.db <<EOF
INSERT INTO x_storages VALUES (20003,'/strm', 0, 'StrmList', 30, 'work', '{"txt_path":"/data/strm.txt","db_path":"/opt/alist/data/strm_internal.db"}', 'strm驱动', datetime('now','localtime'), 0, 'name', 'asc', '', 0, 'native', '');
EOF
fi
	
version=$(head -n1 /docker.version)
data_version=$(head -n1 /www/data/version.txt)
sqlite3 /opt/alist/data/data.db <<EOF  
INSERT INTO x_storages VALUES(20001,'/©️ 镜像版本: $version 数据版本: $data_version',0,'AliyundriveCron',300000,'work','{"refresh_token":"3f46710d73424aaaa18db8ce2e521fff","share_id":"wtT3hMC4vti","share_pwd":"","root_folder_id":"6884e97ae2ff249cc28e49e18826118c5067ab4f","order_by":"name","order_direction":"ASC"}','','2023-10-24 18:36:56.698065575+00:00',0,'name','ASC','front',0,'302_redirect','');
EOF

if [[ -s /data/mytoken.txt ]] && [[ -s /data/myopentoken.txt ]] && [[ -s /data/temp_transfer_folder_id.txt ]]; then
	oauth_token_url="http://auth.xiaoya.pro/api/ali_open/refresh"
        if [ -s /data/opentoken_url.txt ]; then
                oauth_token_url=`cat /data/opentoken_url.txt`
        fi
	client_id=""
	client_secret=""
	if [ -s /data/open_api.txt ]; then
		oauth_token_url=$(cat /data/open_api.txt | cut -f1 -d" ")
		client_id=$(cat /data/open_api.txt | cut -f2 -d" ")
		client_secret=$(cat /data/open_api.txt | cut -f3 -d" ")
	fi
	echo $oauth_token_url > /data/opentoken_url.txt
	sed -i "s#https://api-cf.nn.ci/alist/ali_open/token#$oauth_token_url#" /opt/alist/data/config.json
        user_open_token=$(head -n1 /data/myopentoken.txt| tr -d '\r')
        user_token=$(head -n1 /data/mytoken.txt| tr -d '\r')
        tempfolderid=$(head -n1 /data/temp_transfer_folder_id.txt| tr -d '\r')
        sqlite3 /opt/alist/data/data.db <<EOF
update x_storages set driver = "AliyundriveShare2Open" where driver = 'AliyundriveShare';
update x_storages set driver = "AliyundriveShare2Open" where driver = 'AliyundriveShare2Pan115';
update x_storages set addition = json_set(addition, '$.RefreshToken', "$user_token") where driver = 'AliyundriveShare2Open' or driver = 'AliyundriveCron';
update x_storages set addition = json_set(addition, '$.RefreshTokenOpen', "$user_open_token") where driver = 'AliyundriveShare2Open' or driver = 'AliyundriveCron';
update x_storages set addition = json_set(addition, '$.TempTransferFolderID', "$tempfolderid") where driver = 'AliyundriveShare2Open' or driver = 'AliyundriveCron';
update x_storages set addition = json_set(addition, '$.oauth_token_url', "$oauth_token_url") where driver = 'AliyundriveShare2Open' or driver = 'AliyundriveCron';
update x_storages set addition = json_set(addition, '$.client_id', "$client_id") where driver = 'AliyundriveShare2Open' or driver = 'AliyundriveCron';
update x_storages set addition = json_set(addition, '$.client_secret', "$client_secret") where driver = 'AliyundriveShare2Open' or driver = 'AliyundriveCron';
update x_storages set addition = json_set(addition, '$.rorb', "r") where driver = 'AliyundriveShare2Open' or driver = 'AliyundriveCron';
EOF
		sqlite3 /opt/alist/data/data.db <<EOF
delete from x_storages where id >= 5000 and id <5500;
EOF
        if [[ -f /data/alishare_list.txt ]] && [[ -s /data/alishare_list.txt ]]; then
                id=5000
                cat  /data/alishare_list.txt | while read line;
                do
		   if [ ! -z "$line" ]; then
                        id=`expr $id + 1`
                        mount_path=$(echo $line |cut -f1 -d" ")
                        share_id=$(echo $line |cut -f2 -d" ")
                        root_folder_id=$(echo $line |cut -f3 -d" ")
			pwd=$(echo $line |cut -f4 -d" ")
                        sqlite3 /opt/alist/data/data.db <<EOF
INSERT OR REPLACE  INTO x_storages VALUES($id,"/🈴我的阿里分享/$mount_path",0,'AliyundriveShare2Open',30,'work','{"RefreshToken":"$user_token","RefreshTokenOpen":"$user_open_token","TempTransferFolderID":"$tempfolderid","share_id":"$share_id","share_pwd":"$pwd","root_folder_id":"$root_folder_id","order_by":"name","order_direction":"ASC","oauth_token_url":"$oauth_token_url","client_id":"$client_id","client_secret":"$client_secret","rorb":"$rorb"}','','2022-09-29 20:15:08.418227781+00:00',0,'name','ASC','front',0,'302_redirect','');
EOF
		   fi
                done
        fi
else
	echo "请检查已正确配置 mytoken.txt myopentoken.txt temp_transfer_folder_id.txt 后再重启容器"
	exit
fi
	
if [[ -f /data/quarkshare_list.txt ]] && [[ -s /data/quarkshare_list.txt ]]; then
	id=14000
	echo "delete from x_storages where id >=14000 and id < 15000" | sqlite3 /opt/alist/data/data.db
	cat /data/quarkshare_list.txt |while read line;
	do
	if [ ! -z "$line" ]; then
		id=`expr $id + 1`
        mount_path=$(echo $line |cut -f1 -d" ")
        share_id=$(echo $line |cut -f2 -d" ")
        root_folder_id=$(echo $line |cut -f3 -d" ")
		if [ "$root_folder_id" == "root" ]; then
			root_folder_id=""
		fi
		pwd=$(echo $line |cut -f4 -d" ")
		sqlite3 /opt/alist/data/data.db <<EOF
INSERT INTO x_storages VALUES($id,"/🌀我的夸克分享/$mount_path",0,'QuarkShare',10,'work','{"cookie":"xxx","root_folder_id":"$root_folder_id","order_by":"name","order_direction":"asc","share_id":"$share_id","pass_code":"$pwd"}','','2022-09-29 20:14:52.313982364+00:00',0,'name','ASC','front',0,'native_proxy','');	
EOF
	fi
	done
fi

if [[ -f /data/ucshare_list.txt ]] && [[ -s /data/ucshare_list.txt ]]; then
    id=15000
    echo "delete from x_storages where id >=15000 and id < 16000" | sqlite3 /opt/alist/data/data.db
    cat /data/ucshare_list.txt |while read line;
    do
    if [ ! -z "$line" ]; then
        id=`expr $id + 1`
        mount_path=$(echo $line |cut -f1 -d" ")
        share_id=$(echo $line |cut -f2 -d" ")
        root_folder_id=$(echo $line |cut -f3 -d" ")
        if [ "$root_folder_id" == "root" ]; then
            root_folder_id=""
        fi
        pwd=$(echo $line |cut -f4 -d" ")
        sqlite3 /opt/alist/data/data.db <<EOF
INSERT INTO x_storages VALUES($id,"/🐿️我的UC分享/$mount_path",0,'UCShare',10,'work','{"cookie":"xxx","root_folder_id":"$root_folder_id","order_by":"name","order_direction":"asc","share_id":"$share_id","pass_code":"$pwd"}','','2022-09-29 20:14:52.313982364+00:00',0,'name','ASC','front',0,'native_proxy','');
EOF
    fi
    done
fi

if [ -s /data/115_cookie.txt ]; then
    echo "delete from x_storages where id >=16000 and id < 17000" | sqlite3 /opt/alist/data/data.db

if [ -s /data/115share_internal.txt ]; then
	id=16000
    cat /data/115share_internal.txt |while read line;
    do
    if [ ! -z "$line" ]; then
        id=`expr $id + 1`
        mount_path=$(echo $line |cut -f1 -d" ")
        share_id=$(echo $line |cut -f2 -d" ")
        root_folder_id=$(echo $line |cut -f3 -d" ")
        if [ "$root_folder_id" == "root" ]; then
            root_folder_id=""
        fi
        pwd=$(echo $line |cut -f4 -d" ")
        sqlite3 /opt/alist/data/data.db <<EOF
INSERT INTO x_storages VALUES($id,"/🏷️我的115分享/$mount_path",0,'115 Share',86400,'work','{"cookie":"xxx","root_folder_id":"$root_folder_id","qrcode_token":"","qrcode_source":"linux","page_size":300,"limit_rate":2,"share_code":"$share_id","receive_code":"$pwd"}','','2022-09-29 20:14:52.313982364+00:00',0,'name','ASC','front',0,'302_redirect','');
EOF
    fi
    done
fi

if [ -s /data/115share_list.txt ]; then
	id=16200
    cat /data/115share_list.txt |while read line;
    do
    if [ ! -z "$line" ]; then
        id=`expr $id + 1`
        mount_path=$(echo $line |cut -f1 -d" ")
        share_id=$(echo $line |cut -f2 -d" ")
        root_folder_id=$(echo $line |cut -f3 -d" ")
        if [ "$root_folder_id" == "root" ]; then
            root_folder_id=""
        fi
        pwd=$(echo $line |cut -f4 -d" ")
        sqlite3 /opt/alist/data/data.db <<EOF
INSERT OR IGNORE INTO x_storages VALUES($id,"/🏷️我的115分享/$mount_path",0,'115 Share',86400,'work','{"cookie":"xxx","root_folder_id":"$root_folder_id","qrcode_token":"","qrcode_source":"linux","page_size":300,"limit_rate":2,"share_code":"$share_id","receive_code":"$pwd"}','','2022-09-29 20:14:52.313982364+00:00',0,'name','ASC','front',0,'302_redirect','');
EOF
    fi
    done
fi

fi

if [[ -f /data/115_list.txt ]] && [[ -s /data/115_list.txt ]]; then
    id=17000
    echo "delete from x_storages where id >=17000 and id < 18000" | sqlite3 /opt/alist/data/data.db
    cat /data/115_list.txt |while read line;
    do
    if [ ! -z "$line" ]; then
        id=`expr $id + 1`
        mount_path=$(echo $line |cut -f1 -d" ")
        root_folder_id=$(echo $line |cut -f2 -d" ")
        if [ "$root_folder_id" == "" ]; then
            root_folder_id="0"
        fi
        sqlite3 /opt/alist/data/data.db <<EOF
INSERT INTO x_storages VALUES($id,"/🏷️我的115/$mount_path",0,'115 Cloud',5,'work','{"cookie":"xxx","root_folder_id":"$root_folder_id","qrcode_token":"","qrcode_source":"linux","page_size":300,"limit_rate":2}','','2022-09-29 20:14:52.313982364+00:00',0,'name','ASC','front',0,'302_redirect','');
EOF
    fi
    done
fi	

if [[ -f /data/show_my_ali.txt ]] && [[ -s /data/myopentoken.txt ]]; then
	user_open_token=$(head -n1 /data/myopentoken.txt| tr -d '\r')
		sqlite3 /opt/alist/data/data.db <<EOF
INSERT OR REPLACE  INTO x_storages VALUES(10000,'/📀我的阿里云盘/资源盘',0,'AliyundriveOpen',0,'work','{"root_folder_id":"root","refresh_token":"$user_open_token","order_by":"name","order_direction":"ASC","oauth_token_url":"$oauth_token_url","client_id":"$client_id","client_secret":"$client_secret","rorb":"r"}','','2023-03-01 17:22:05.432198521+00:00',0,'name','ASC','front',0,'302_redirect','');
INSERT OR REPLACE  INTO x_storages VALUES(10001,'/📀我的阿里云盘/备份盘',0,'AliyundriveOpen',0,'work','{"root_folder_id":"root","refresh_token":"$user_open_token","order_by":"name","order_direction":"ASC","oauth_token_url":"$oauth_token_url","client_id":"$client_id","client_secret":"$client_secret","rorb":"b"}','','2023-03-01 17:22:05.432198521+00:00',0,'name','ASC','front',0,'302_redirect','');
EOF
fi

sqlite3 /opt/alist/data/data.db <<EOF
delete from x_storages where id >= 18000 and id <18500;
EOF
if [[ -f /data/webdav_list.txt ]] && [[ -s /data/webdav_list.txt ]]; then
    id=18000
        cat  /data/webdav_list.txt | while read line;
    do
        if [ ! -z "$line" ]; then
            id=`expr $id + 1`
            mount_path=$(echo $line |cut -f1 -d" ")
            address=$(echo $line |cut -f2 -d" ")
            root_folder_path=$(echo $line |cut -f3 -d" ")
            username=$(echo $line |cut -f4 -d" ")
            password=$(echo $line |cut -f5 -d" ")
			
            sqlite3 /opt/alist/data/data.db <<EOF
INSERT OR REPLACE  INTO x_storages VALUES($id,'/🌐我的webdav/$mount_path',0,'WebDav',5,'work','{"vendor":"other","address":"$address","username":"$username","password":"$password","root_folder_path":"$root_folder_path"}','','2022-11-12 13:05:12.467024193+00:00',0,'name','ASC','front',0,'native_proxy','');
EOF
                fi
        done
fi

sqlite3 /opt/alist/data/data.db <<EOF
delete from x_storages where id >= 12000 and id <12500;
EOF
if [[ -f /data/alist_list.txt ]] && [[ -s /data/alist_list.txt ]]; then
	id=12000
        cat  /data/alist_list.txt | while read line;
	do
		if [ ! -z "$line" ]; then
			id=`expr $id + 1`
			mount_path=$(echo $line |cut -f1 -d" ")
        	alist_ver=$(echo $line |cut -f2 -d" ")
			site=$(echo $line |cut -f3 -d" ")
        	root_folder_id=$(echo $line |cut -f4 -d" ")
			access_token=$(echo $line |cut -f5 -d" ")
			if [[ $access_token == "0" ]]; then
				cache="0"
				access_token=$(echo $line |cut -f6 -d" ")
			fi
			if [[ $alist_ver == "v2" ]] || [[ $alist_ver == "V2" ]]; then  
				alist_type="AList V2"
			elif [[ $alist_ver == "v3" ]] || [[ $alist_ver == "V3" ]]; then
                                alist_type="AList V3"
			fi
			sqlite3 /opt/alist/data/data.db <<EOF
INSERT OR REPLACE  INTO x_storages VALUES($id,'/🎎我的套娃/$mount_path',0,'$alist_type',0,'work','{"root_folder_path":"$root_folder_id","url":"$site","password":"","access_token":"$access_token","cache":"$cache"}','','2022-11-12 13:05:12.467024193+00:00',0,'name','ASC','front',0,'302_redirect','');
EOF
                fi
        done
fi

if [ -s /data/ali2115.txt ]; then
    source /data/ali2115.txt
	if [ -s /data/115_cookie.txt ]; then
		cookie=$(head -n1 /data/115_cookie.txt| tr -d '\r')
	fi
    sqlite3 /opt/alist/data/data.db <<EOF
update x_storages set driver = "AliyundriveShare2Pan115" where driver = 'AliyundriveShare2Open';
update x_storages set addition = json_set(addition, '$.purge_ali_temp', '$purge_ali_temp') where driver = 'AliyundriveShare2Pan115';
update x_storages set addition = json_set(addition, '$.cookie', "$cookie") where driver = 'AliyundriveShare2Pan115';
update x_storages set addition = json_set(addition, '$.purge_pan115_temp', '$purge_pan115_temp') where driver = 'AliyundriveShare2Pan115';
update x_storages set addition = json_set(addition, '$.dir_id', '$dir_id') where driver = 'AliyundriveShare2Pan115';
EOF
fi

if [ -s /data/quark_cookie.txt ]; then
	/check_quark_cookie.sh
	cookie=$(head -n1 /data/quark_cookie.txt| tr -d '\r')
    sqlite3 /opt/alist/data/data.db <<EOF
update x_storages set addition = json_set(addition, '$.cookie', '$cookie') where driver = 'QuarkShare';
EOF
else
	sqlite3 /opt/alist/data/data.db <<EOF
delete from x_storages where id >=13000 and id < 14000;
delete from x_storages where driver = 'QuarkShare';
EOF
fi

if [ -s /data/uc_cookie.txt ]; then
    /check_uc_cookie.sh
    cookie=$(head -n1 /data/uc_cookie.txt| tr -d '\r')
    sqlite3 /opt/alist/data/data.db <<EOF
update x_storages set addition = json_set(addition, '$.cookie', '$cookie') where driver = 'UCShare';
EOF
else
    sqlite3 /opt/alist/data/data.db <<EOF
delete from x_storages where driver = 'UCShare';
EOF
fi

if [ -s /data/115_cookie.txt ]; then
	/check_115_cookie.sh
    cookie=$(head -n1 /data/115_cookie.txt| tr -d '\r')
    sqlite3 /opt/alist/data/data.db <<EOF
update x_storages set addition = json_set(addition, '$.cookie', '$cookie') where driver = '115 Share';
update x_storages set addition = json_set(addition, '$.cookie', '$cookie') where driver = '115 Cloud';
EOF
else
    sqlite3 /opt/alist/data/data.db <<EOF
delete from x_storages where driver = '115 Share';
EOF
fi

if [[ -f /data/tv.txt ]] && [[ -s /data/tv.txt ]]; then
	a=`echo -n "INSERT OR REPLACE  INTO x_storages VALUES(2050,'/🇹🇻直播',0,'UrlTree',0,'work','{\"url_structure\":\""`
        while read line
        do
   	if [ ! -z "$line" ]; then
                p1=$(echo $line |awk -F',' '{print $1}')
                p2=$(echo $line |awk -F',' '{print $2}')
		if [[ ! $p2 ]] || [[ $p2 == "#genre#" ]]; then
			a+="`echo -n "$p1:\n"`"
		elif [[ ! $p2 == "" ]] && [[ $p1 ]]; then	
			a+="`echo -n "  $p1.m3u8:$p2\n"`"
		else
			a+="`echo -n "\n"`"
		fi
	fi			
	done < /data/tv.txt
	a+=`echo -n "\",\"head_size\":false}','','2023-06-21 07:43:44.508544832+00:00',0,'name','ASC','front',0,'302_redirect','');"`
	sqlite3 /opt/alist/data/data.db <<EOF
$a
EOF
fi


if [[ -f /data/proxy.txt ]] && [[ -s /data/proxy.txt ]]; then
	proxy_url=$(head -n1 /data/proxy.txt| tr -d '\r')
	export HTTP_PROXY=$proxy_url
	export HTTPS_PROXY=$proxy_url
	export no_proxy="localhost,127.0.0.1,192.168.1.0/24,.aliyundrive.com,.115.com,.quark.cn"
fi

#a=$(lscpu | grep "Model name")
#b=$(grep '^NAME=' /etc/os-release | cut -d'"' -f2 | tr ' ' '_')
#c=$(grep '^VERSION_ID=' /etc/os-release | cut -d'"' -f2)
#d=$(echo $a OS:$b ver:$c)
d="xiaoya"
if [ ! -f /data/.device_id ]; then
    e=$(echo $(echo $d |sha256sum | base64 | head -c 16)-$(head -c 5 /dev/urandom | od -An -tu4 | tr -d ' '))
    echo $e > /data/.device_id
else
    e=$(cat /data/.device_id)
fi

curl --retry 3 --max-time 10 -X POST http://quark-uc.xiaoya.pro:9099/save  -F "device_info=$d"  -F "device_id=$e" 

echo "启动容器(Bridge模式)......"

cd /opt/alist
exec "$@"
