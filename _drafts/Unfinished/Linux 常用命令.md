## 目录处理
ls
-h
-a
-l
-i 查看i节点
ll 同ls -l

pwd 显示当前路径

mkdir 创建目录
-p 递归创建

cd(change directory) 进入目录
~ 进入home目录
- 进入上次目录
.. 进入上级目录
. 当前目录
/ 进入根目录
../usr/local/src/ 相对路径
/etc/ 绝对路径，从根目录开始指定

双击tab键 补全目录或命令 

rm(remove) 移除文件
-r 删除目录
-f 静默
/path/* 删除目录中内容

cp(copy) 复制
-r 复制目录
-p 连带文件属性复制，包括修改该时间不会改变等
-d 复制链接文件
-a 同-rpd

mv(move) 剪切或改名

/bin usr/bin 任何用户都可执行的系统命令
/sbin usr/sbin 只有root用户能够执行
/boot 用户启动数据目录
/dev 特殊文件目录
/etc 系统配置文件目录
/lib 函数库目录
/media /mnt /misc 外接存储挂载点
/proc /sys 内存挂载点，直接写入内存
/tmp 临时目录
/var 系统可变文档目录
/home 

### 链接命令
ln 连接命令
-s 软链接

硬链接（看成同一文件的两个引用，不推荐）：
- 拥有相同的i节点和存储块，可以看做同一个文件
- 可通过i节点识别 
- 不能跨分区
- 不能针对针对目录
- 删除原文件，仍可使用
- 引用计数+1

软链接（类似快捷方式）：
- 拥有自己的I节点和存储块，仅用来保存原文件的文件名和I节点号
- 软链接文件权限都为lrwxrwxrwx
- 修改任意文件，其它的都改变
- 删除原文件，软链接不再可用
- 引用计数不变
- 源文件要写绝对路径，除非与目标文件在同一目录

## 文件搜索命令
locate 在后台数据库中按文件名搜索，搜索速度快，只能按文件名搜索
updatedb 更新数据库
/etc/updatedb.conf 搜索规则配置文件
运行locate httpd.conf，提示`locate: command not found`错误。则需要安装mlocate软件包：`yum install mlocate`
搜索，提示`locate: can not stat () /var/lib/mlocate/mlocate.db`: 没有那个文件或目录。忘生成数据库了，执行：`updatedb`

whereis 搜索系统命令位置和文档的命令
-b 只查找可执行文件
-m 只查找帮助文件

which 搜索系统命令位置和别名

find [搜索范围] [搜索条件] 功能强大，消耗资源大
通配符：* 匹配任意内容；? 匹配任意一个字符；[] 匹配任意一个其中字符 
-iname 不区分大小写
-user 文件拥有者
-nouser 无所有者文件
-mtime 修改时间
-atime 文件访问时间
-ctime 改变文件属性
        +10 10天内修改的文件
        10  10天前当天修改的文件
        -10 10天前修改的文件
-size 查找文件大小
        -25k 查找小于25k文件
        25k 查找等于25k文件
        +25k 查找大于25k文件
默认单位扇区，千字节小写k，兆字节大写M
-inum 查找i节点
-a and逻辑与
—o or逻辑或
-exec ls -lh {} \; 对搜索结果执行 ls -lh 操作

`grep [选项] 字符串 文件名`文件中的字符串搜索命令
-v 取反
-i 忽略大小写
-n 输出行号
--color=auto 关键词上色

## 帮助命令
man （manul）查看官方文档
-f 查看命令帮助等级(同 whatis)
-k 查看命令所有帮助(同 apropos) 

some -help

helo cd 查看shell命令的帮助

info 在文档中检索命令

## 压缩命令

zip 压缩文件名（最好加上.zip后缀） 源文件：（.zip）
-r 压缩目录
unzip 解压缩

gzip 源文件：源文件会消失(.gz)
-r 压缩目录所有子文件
gzip -d 解压缩
gunzip 解压缩

bzip2 源文件：不支持压缩目录（.bz2）
-k 压缩之后保留源文件
bzip -d 解压缩
bunzip 解压缩

(.tar.gz)(.tar.bz2)
tar -cvf 打包文件名 源文件：打包目录
-c 打包
-v 显示过程
-f 指定打包或解压后的文件名
-x 解打包
-z 压缩或解压.tar.gz格式
-j 压缩或解压.tar.bz2格式 
-t 测试，不解压缩查看压缩包内容
-xvf 解压缩
-zcvf 压缩为.tar.gz
-zxvf 解压缩.tar.gz
-jcvf 压缩为.tar.bz2
-jxvf 解压缩.tar.bz2
-tvf 查看压缩包的内容，不解压，ztvf，jtvf
    -C 指定位置


## Yum 命令
yum search 查找软件包
yum list 列出所有可安装软件包
yum list updates 列出所有可更新软件包
yum list installed 列出所有已安装软件包
yum list extras 列出所有已安装但不在Yum Repository内的软件包
yum list ~ 累出指定软件包
yum info ~ 列出指定软件包的信息 $
yum info 列出所有软件包的信息
yum info updates 列出可更新的软件包的信息
yum info installed 
yum info extras
yum provides ~ 列出软件包提供哪些文件 $

## 关机和重启
shutdown [options] time （time为now立即关机）
-c 取消前一个关机命令
-h 关机
-r 重启
例子：
shutdown -r 5:30
shutdown -r 5:30 & 放入后台执行

其它关机命令（慎用）:
halt 
poweroff 
init 0 
其它重启命令（慎用）
reboot
init 6

系统运行级别：
0 关机 
1 单用户（启动最小程序，类似安全模式，做系统修复）
2 不完全多用户，不包含NFS服务
3 完全多用户
4 未分配
5 图形界面
6 重启

runlevel 查看运行级别 // n 3 n代表前一级，为null，3位当前级别，前一级为null表示一开机便进入了当前级别

logout 退出登录 $

## 挂载命令（分配盘符）
mount 查看系统挂载的设备
-a 自动挂载
/etc/fstab 自动挂载配置
mount[-t 文件系统] [-o 特殊选项] 设备 文件名 挂载点
-t 文件系统：可以是ext3，ext4，iso9660等文件系统
-o 额外选项
    atime/noatime 是否更新访问时间
    async/sync 异步/同步
    auto/noauto 手动/自动
    defaults 定义默认值
    exec/noexec 执行/不执行，是否允许文件系统中执行可执行文件，默认exec
    remount 重新挂载，用于修改特殊权限
    rw/ro 读写/只读，默认rw
    suid/nosuid 是否具有SUID权限，默认有
    user/nouser 允许/不允许用户挂载，默认不允许
    usrquota 系统支持用户磁盘配额
    grpquota 系统支持组磁盘配额
常用挂载点 /mnt /media
dev/sr0
unmount 卸载设备（不可省略）

fdisk -l 查看U盘设备文件名
（Linux默认不支持NTFS文件系统的）

## 用户登录
w 查看登录用户信息
USER    TTY     FROM      LOGIN@     IDLE    JCPU      PCPU       WHAT
用户名  登录终端  登录IP地址 登录时间  闲置时间  所有进程占用 当前进程占用 正在执行的命令
who 查看用户信息
last 过往登录信息（/var/log/wtmp）
lastlog 查看所欲用户最后一次登录

shell 是命令行解释器，将命令翻译为机器能识别的二进制命令，传递给内核，由内核调用硬件处理


echo $SHELL 
vi /etc/shells 支持的shell
输入shell名 调用子该shell

echo [选项] [输出内容]
-e 支持反斜杠控制的字符转换，颜色显示，用于格式控制

alias 查看系统别名
alias 别名=‘原命令’（临时，重启失效）
unalias 删除别名（临时）
~/.bashrc 配置永久别名
shell快捷键：
ctrl+c 强制终止
ctrl+l 清屏 $
ctrl+a 移动到行首 $
ctrl+e 移动到行尾 $
ctrl+u 从光标位置删除到行首 $
ctrl+z 把命令放入后台
ctrl+r 在历史命令中搜索

## 历史命令
history [option] [file] 查看历史命令
-c 清空历史命令
-w 把缓存中的历史命令写入保存文件~/.bash_history
默认保存1000条，可以再 /etc/profile 中 HISTSIZE 进行修改

!n 执行编号为n的历史命令
!! 重复执行上一条命令
!字符串 执行最近一个该字符串开头的命令
tab 查看并补全路径或命令，检测输入错误（tab没反应说明打错了）

## 输出重定向
将输出位置从显示器重定向到文件

标准输入设备
设备 设备文件名 文件描述符 类型
键盘 dev/stdin 0 标准输入
显示器 /dev/sdtout 1 标准输出
显示器 /dev/sdterr 2 标准错误输出

命令 > 文件     覆盖方式输出
命令 >> 文件        追加方式输出
错误指令 2>文件      覆盖方式
错误指令 2>>文件     追加方式，不能有空格

命令 > 文件 2>&1 （同 &>文件，&1代前一个文件）
命令 >> 文件 2>&1 （同 &>>文件）
命令 >> 文件1 2>> 文件2

&>/dev/null 黑洞文件，啥都不记录

wc [选项][文件名] 统计输入
-c 统计字节数
-w 统计单词数
-l 统计行数

cat file 显示文件

## 管道符
; 顺序执行
&& 前一个命令正确执行才执行下一个
|| 前一个命令未正确执行才执行下一个

date; tar -zcvf some.tar.gz /etc ; date 典型应用，查看执行时间
command && echo yes || echo no 正确执行报yes，错误报no

命令1 | 命令2 ：前一个命令的正确输出作为后一个命令的操作对象
ls -l /etc | more 

netstat 查看所有连接
netstat -an | grep ESTABLISHED | wc -l 查找ESTABLISHED状态的连接的数量

## 通配符

?
*
[]
[-]
[^]

'' 单引号，引号内特殊字符无意义
"" 双引号，特殊字符有意义
`` 反引号，引号内的系统命令会先执行，和$()作用一样
# 注释
$ 用于调用变量值
\ 转义符


## du
查看目录大小

## cron
定时执行脚本

kill -2 在实例空闲后，关闭实例
kill -9 强制关闭实例

uname -a    查看系统信息

ps -ef 查看进程
ps -ef|grep nginx

tail -n20 file.log  查看日志

## chmod 权限设置

常见设定
```
-rw------- 600 属主有读、写权限
-rw-r--r-- 644 属主有读、写权限，其它组只有读权限
-rwx------ 700 属主有读、写、执行权限
-rwxr-xr-x 755 属主有读、写、执行权限，其他组只有读、执行权限
-rwx--x--x 711 属主有读、写、执行权限，其它组只有执行权限
```

## pgrep pkill
```
pgrep pattern
pkill pattern
```
pgrep 搜索正在运行的程序，返回所有符合条件的程序的 PID
pgrep 搜索正在运行的程序，终止所有符合条件的程序
```
kill -2 `pgerp pattern`
```


## 查看进程
ps 
ps -L -p <pid> 查看进程的线程
top
htop 插件，查看所有线程









