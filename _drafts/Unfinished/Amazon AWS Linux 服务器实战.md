香港阿里云B区

## shadowsockets 
启动命令：sudo ssserver -c /home/user/ss/ssserver.json -d start 



## yum

Yum (全称为：Yellow dog Updater, Modified) 由Duke University团队，修改Yellow Dog Linux的Yellow Dog Updater开发而成，是一个基于RPM 包管理的字符前端软件包管理器。能够从指定的服务器自动下载 RPM 包并且安装，可以处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装。被Yellow Dog Linux本身，以及Fedora、Red Hat Enterprise Linux采用。




## 相关命令：

### 硬件和系统
uname -a 查看系统版本
lscpu 查看cpu信息
lsblk 查看硬盘和分区
fdisk -l 硬盘分区详细
lspci | grep -i 'eth' 查看网卡硬件信息
dmidecode -q 查看所有硬件信息


### 安装

vi 使用vim
xz 解压xz压缩包
bar -xvf 解压bar压缩包
bar -zxvf 解压bar.gz压缩包
echo $HOME 
echo $PATH 查看全局变量
echo $SHELL


### 文件

rm -rf pathname 移除文件夹及文件夹中的文件
mv fileOrPath targetPath 移动文件或文件夹
ln -s /home/ec2-user/software/node/bin/npm /usr/local/bin/npm 建立软连接



### 插件

mget 通过 http/https 下载
make 


### ssh

ssh-keygen 重新生产.ssh文件夹
ssh -i ~/.ssh/amazon_aws.pem ec2-user@34.212.21.74


### 网络
ifconfig
ip link show
netstat 接口信息
netstat -I 打印接口信息
netstat -in 打印出IP地址，而不是主机名
apr 检查ARP高速缓存 
