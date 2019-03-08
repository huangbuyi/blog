复制集成员
数据节点：存放数据（实体物理文件 *.ns，*.0 等）的节点，包括主节点、从节点
投票节点：不存放数据仅作选举和充当复制集节点

一个复制集最多拥有 12 个节点，最多只能有 7 个投票节点

按

隐藏节点作用，为节点上锁，保持数据一致性用于备份。前端通过 isMaster() 查看复制集信息，isMater() 查看不到隐藏节点，隐藏节点对前端是不可见的，因此也无法为前端提供服务
延时节点，误操作后回滚数据
无索引：只复制数据，不复制索引，不建议设置

主机点： priority>=1
从节点： priority>=0
延迟节点： priority=0 hidden=true slaveDelay=n
隐藏节点： priority=0 hidden=true
无索引： priority=0 bui ldIndexes=true 



参考配置：
```
port=28001
bind_ip=192.168.56.3
logpath=/usr/local/mongodb/log/28001.log
dbpath=/usr/local/mongodb/data/28001/
logappend=true
pidfilepath=/usr/local/mongodb/data/28001/28001.pid
fork=true
oplogSize=1024
replSet=IMOOC
```


配置文件参数：
_id
host
arbiterOnly
priority        0~1000 设为0节点不会提升为主节点，默认为1
hidden          0|1 priority为0时才能设置
votes           0|1 默认1 投票的票数‘
slaveDelay      Int 默认3600秒 延迟时间
buildIndexes    boolean 默认true 是否从主节点复制索引

## 方法
rs.initialte(config)  初始化复制集
rs.stepDown(5)     5 秒内将主节点降级为从节点
rs.freeze()        将节点冻结，规定时间内不能作为主节点
rs.config()
rs.reconfig()      重新初始化 
rs.status()        复制集状态
rs.isMaster()      查看复制集信息
rs.slaveOk(1)      将节点设置为可读
rs.add()           添加节点

大多数原则：当可用节点数小于等于总结点数的二分之一时，主节点降级为从节点，复制集不再提供写服务。大多数原则确保一个或多个节点断开后，超过二分之一可用节点的复制集能选举出主节点，继续提供写入操作，而小于二分之一的复制集主节点降为从节点，不再提供写入服务。从而保证遇到故障时，如复制集运行的两个机房间断网时，最多只有一个主节点提供写入操作，以此保持数据的一致性。

选举触发条件：主节点网络不可达；rs.stepDown() 主动退位

数据回滚：在主节点故障降级时，仍有部分数据写入，导致数据不一致。在该节点恢复后，成为从节点，它会回滚到 oplog 最近一致性操作，不一致数据会被删除，存储的数据库目录下 rollback 文件。

读策略：只读主、优先主、只读从、优先从、就近（网络延迟）

## oplog
ts : timestamp 操作发生时的时间戳
h : 唯一标识码
v : 版本
op : 操作类型，i(insert), u(update), d(delete), c(db cmd), n(null)
ns : 命名空间（db_name.coll_name）
o : 操作对应的文档。文档更新前状态  
o2 : 仅 update 操作，更新操作的变更内容

创建一个 5G 的封顶表：
db.createCollection(
    "coll_name",
    {
        capped: true,
        size: 1024*1024*1024*5
    }
)

建议大小：40G

## 搭建复制集
启动多个 mongod 实例

在命令栏中配置文件：
```
config = {
    "_id" : "IMOOC",
    "members" : [
        {
            "_id" : 0,
            "host" : "192.168.1.101:28001"
        },
        {
            "_id" : 1,
            "host" : "192.168.1.101:28002"
        },
        {
            "_id" : 3,
            "host" : "192.168.1.101:28003",
            "arbiterOnly" : true
        }
    ]
}
rs.initialte(config)
```







