常见监控项目：
QPS                 : 每秒查询数量
I/O                 : 读写性能
Memory              : 内存使用
Connections         : 连接数
Page Faults         : 缺页中断（数据不再内存中，从磁盘读取数据）
Index hit           : 索引命中率（内存命中数据的比率）
Background flush    : 后台刷新，一次刷新数据量过大会影响性能
Queue               : 队列

常用监控工具：
Mongostat
Mongotop
Mongosniff
Mongodb Monitoring Service(MMS) 少于8台免费
ZABBIX

参数
qr/qw   读队列、写队列
ar/aw   正在进行的读、写操作
netIn   网卡流量，进入
netOut  网卡流量，流出
conn    连接数
set     复制集
repl    复制集状态    