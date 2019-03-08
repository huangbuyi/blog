arp -a 查看物理地址
arp 协议用于局域网通讯，局域网通讯依靠 MAC 地址，跨局域网通讯依靠 IP 地址

IP 
ICIP 协议（Ping操作）

TCP 面向连接 
UDP 

netstat –apn
netstat -antup
netstat -aon | grep pord 查看端口占用
ps aux 查看进程
pgrep -l pid 查看指定 pid 进程

arp -a 显示APR高速缓存中的所有内容

### IP地址分类
|网络类别|最大网络数|          IP地址范围         |最大主机数|私有IP地址范围|
| --- | ------- |  ----------------         | --------| ------------ |
|  A  | 2^7-2   | 1.0.0.0-126.255.255.255 | 2^24-2 | 10.0.0.0-10.255.255.255 |
|  B  | 2^14    | 128.0.0.0-191.255.255.255| 2^16-2 |172.16.0.0-172.31.255.255|
|  C  | 2^21    | 192.0.0.0-223.255.255.255|2^8-2|192.168.0.0-192.168.255.255| 

A类地址中,1.0.0.0代表网络本身，不能分配。1.255.255.255代表当前网络的广播地址，不能分配。私有ip不能直接访问

### 子网掩码
标准
A 255.0.0.0
B 255.255.0.0 
C 255.255.255.0
网络地址 主机位=0
广播地址 主机位=1

### 端口号
0-2^16
小于10000 系统使用
大于10000 客户程序使用
常见端口号 
FTP 20 21
SSH 22
telnet 23(明文传递，无加密，不推荐)
DNS 53
HTTP 80
SMTP 25
POP3 110
HTTPS 

netstat -an
-a 查看所有连接和端口
-n 显示IP地址和端口号，不显示域名和服务
查询游戏服务器IP，关闭其他网络服务，通过netstat查看连接

### DNS
hosts 文件：静态Ip和域名对应
(mac /private/etc/hosts)

DNS服务器

域名空间结构  
根域名   .
顶域名(一级域名)
- 组织、国家地区域名 edu gov com org cn mil net
二级域名 imooc microsoft google
主机名(三级) www news3

DNS 查询过程
查找www.imooc.com.cn

(递归查询)
客户机 -> 本地域名服务器

(迭代查询)
本地域名服务器 <-> 根DNS服务器
本地域名服务器 <-> cn服务器
本地域名服务器 <-> com.cn服务器
本地域名服务器 <-> immoc.com.cn服务器

本地域名服务器 -> 客户机
客户机 <-> web服务器(www.imooc.com.cn)

递归查询：要么做出成功相应，要么做出失败响应，一般客户机和服务器之间属递归查询，若DNS服务器本身不能解析，则会向另外的DNS服务器发出查询请求，得到结果后转交给客户机
迭代查询：服务器收到一次迭代查询回复一次结果，这个结果不一定的域名的IP，也可以是其它DNS服务器地址

### 网关
网关又称协议转换器，在网络层实现网络互连，仅用于两个高层协议不同的网络互连。网关既可以用于广域网互连，也可以用于局域网互连。它是一种充当转换重任的服务器或路由器。
局域网通讯可以不需要网关和DNS

### IP地址配置
DHCP服务器，自动分配IP地址，可把IP设为自动获得IP地址
setup工具（Redhat）
ifconfig
```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
        inet 172.31.29.172  netmask 255.255.240.0  broadcast 172.31.31.255
        inet6 fe80::1a:d5ff:fe48:a858  prefixlen 64  scopeid 0x20<link>
        ether 02:1a:d5:48:a8:58  txqueuelen 1000  (Ethernet)
        RX packets 376371(接收数据包大小)  bytes 212025139 (202.2 MiB)(接收数据报总大小)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 260529(发送数据报大小)  bytes 175030084 (166.9 MiB)(接收数据报总大小)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```

ifconfig eth0 192.168.0.200 netmask 255.255.255.0(临时配置ip和子网掩码  ，不推荐)

配置完后，重启网络
service network restart

修改网络配置文件
#### 1. 网卡信息文件（/etc/sysconfig/network-scripts/ifcfg-eth0）
```
DEVICE="eth0"     网卡设备名
BOOTPROTO="dhcp"  是否自动获取 IP(none、static、dhcp)
ONBOOT="yes"      是否随网络服务启动，eth0 生效
TYPE="Ethernet"   类型为以太网
USERCTL="yes"     是否允许非 root 用户控制此网卡 
PEERDNS="yes"     
IPV6INIT="no"     是否启用 IPv6 

HWADDR=00:0c:29:17:c4:09    MAC 地址

设置自动获取 IP，以下配置可没有
NM_CONTROLLED=yes   是否可以有 Network Manager 图形管理工具托管
UUID="44b76c..."    唯一识别码
IPADDR=192.168.0.252    IP 地址
NETMASK=255.255.255.0   子网掩码
GATEWAY=192.168.0.1     网关
DNS1=202.106.0.20       DNS
```
如果网卡没有启动，注意 ONBOOT 选项是否被设为了 no 值。
不同实例中，唯一识别码不能相同
USERCTL 建议使用 no

#### 2. 主机名文件（/etc/sysconfig/network）
```
NETWORKING=yes       是否正在工作
HOSTNAME=localhost   主机名
```

#### 3. DNS 配置文件（/etc/resolv.conf）
```
search us-west2-2.compute.internal
nameserver 172.31.0.2                名称服务器
```

### Linux 网络命令
ifconfig 查看网卡信息
ifdown 禁用网卡
ifup 启用网卡
netstat 
    -t 列出 TCP 协议端口
    -u 列出 UDP 协议端口
    -n 不使用域名与服务名，而使用 IP 地址和端口号
    -l 仅列出在监听状态网络服务
    -a 列出所有的网络连接
    -r 显示网关（同 route -n）
netstat -lunt

route add default gw 192.168.1.1 临时修改网关
nslookup   查看 DNS

#### 网络测试命令
ping
    -c 次数

telnet [域名或IP] [端口]  端口探测（未加密，不推荐用作远程管理）
traceroute 路由跟踪命令
wget 下载命令

tcpdump 抓包工具
    -i 指定网卡接口
    -nn 转为 IP 和端口
    -X 以十六进制和 ASCII 码显示数据报内容
    port 指定端口号
`tcpdump -i eth0 -nnX port 21` 抓取 eth0 网卡，21 端口的包

## ssh 协议
非对称加密
远程主机公钥重置后，删除 .ssh/known_hosts 中的公钥，重新获取即可

scp [-r] 用户名@ip:文件路径 本地路径  #下载文件
scp [-r] 本地文件 用户名@ip:上传路径  #上传路径
```
# 上传 promise.md 到服务器
scp -i ~/.ssh/amazon_aws.pem ec2-user@54.186.187.30 promise.md ec2-user@54.186.187.30:/home/ec2-user

# 下载 promise.md 到本地
scp -i ~/.ssh/amazon_aws.pem ec2-user@54.186.187.30  ec2-user@54.186.187.30:/home/ec2-user/promise.md /Users/huangshibin/Documents
```

基于 ssh 协议的远程工具
secureCRT（收费）
Xshell（推荐）
winSCP

lsof -i tcp:port 查看端口进程信息







