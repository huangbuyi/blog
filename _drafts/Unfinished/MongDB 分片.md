为什么要分片？
架构上：读写均衡、去中心化
结构上：复制集节点限制（不大于 12 节点，2.6 之前版本） 
硬件上：内存、硬盘容量限制（mongo 吃内存）

分片目的
改善单台机器数据的存储及数据吞吐性能，提高大量数据下随机访问性能

分片与复制集对比
|     | Shard | Replication |
|-----|-------|-------------|
| 实现意义 | 提升并发性能 | 数据冗余、提升读性能 |
| 架构    | 水平化       |  中心化   |
| 实现原理 |  数据打散分布 | 数据镜像 |
| 维护成本 |  相对较高     | 相对容易 |

Mongos 
接入前端请求，进行对应消息路由

启动 shard 节点
添加 --shardsvgr 参数

启动 config 节点
添加 --configsvr 参数
记录块元信息

启动消息节点
使用 mongos 启动
mongos --configdb <ip:port>

分片-步骤
1 连接 mongos
2 Add Shards
单数据库 { addShard: "<hostname><:port>", maxSize: <size>, name: "<shard_name>"}
复制集 { addShard: "<replica_set>/<hostname><:port>", maxSize: <size>, name: "<shard_name>"}
mongos 和 shard 在同一台机器，不要使用 localhost 添加分片

3 Enable Sharding
4 对一个集合进行分片
db.runCommand({shardcollection: "<namespace>", key:"<key>"})

```
use admin
// 添加分片节点
db.runCommand({"addShard": "10。156.11.233：27017"})
// ...创建 shardtest 表

use admin
// enadble sharding
db.runCommand({enablesharding: "shardtest"})

// 对集合分片
db.runCommand({shardcollection: "shardtest.test", key:{user_id: 1})
```

测试
查看分片成员
```
use config
db.shards.find() 

查看集合状态 db.<collection>.status() 
查看分片状态 db.printShardSta tus()
```

Chunk:
MongoDB 分片后，存储数据的单元块，默认大小 64MB

哈希分片：
分片过程中利用哈希索引作为分片的单个键
```
use shardtest
// 建立 hash 索引
db.test.ensureIndex({user_id: "hashed"})
// hash 分片
db.runCommand({shardcollection: "shardtest.test", key:{user_id: hashed})
```

为什么要手动分片？
为了减少自动平衡过程带来的 IO 等资源消耗
前提：关闭自动平衡，auto balance；对数据有重分了解
```
sh.stopBalance()
sh.startBalance()
```

