通过配置文件启动服务
mongod -f conf/mongodb.conf

mkdir data log conf bin
vi conf/mongod.conf
配置 mongod.conf 文件：
port = 12345
dbpath = data
logpath = log/mongod.log
fork = true

连接 mongo 服务
mongo [options] [db address] [file names]




mongo 命令：
db.shutdownServer() 关闭连接
use admin 切换的 admin 权限 

创建数据库：
use newDBName
MongoDB 会在适当的时候创建数据库，如插入一条数据，即会创建新的数据库

插入数据：
db.dbName_collection.insert()

查询数据：
show collections 显示所有表
db.test_collection.find() 查找表

db.dbName_collection.find().count() 统计条目
db.dbName_collection.skip(3).limit(2).sort({x:1})  跳过 3 条，限制返回 2 条，以 x 排序，x 值大于 0 正序，小于 0 反序

db.dbName_collection.update(target, replace) 查找 target 条目，更新为 replace
db.dbName_collection.update({x:1}, {x:99}) 查找 x 为 1 的条目，跟新为 99
db.dbName_collection.update({x:1}, {$set:{y:99}}) 查找 x 为 1 的条目，将 {x:1,y:2,z:3} 中的 y 更新为 99，不适用 set 将会覆盖原有值
db.dbName_collection.update(p1, p2, true) 第三个参数为 true，表示更新条目不存在，自动插入
db.dbName_collection.update({c:1},{$set:{c:2}},false,true) update 默认只允许更新一条数据，将第四个参数设为 true，使用 set，来更新所有条目

删除数据
db.dbName_collection.remove({x: 2}) 删除所有 x 为 2 的数据
db.dbName_collection.drop() 删除表

db.dbName_collection.getIndexes() 查看索引
db.dbName_collection.ensureIndex({x:1}) 创建索引

1._id 索引：默认设置
2.单键索引：值为单一的值，如字符串、数字、日期
3.多键索引：值具有多个记录，如数组
4.复合索引：查询条件不只有一个时，需要建立复合索引

5.过期索引
db.dbName.ensureIndex({time:1},{expireAfterSeconds:30}) 插入的数据在 30s 后被删除
过期索引的限制：
存储在过期索引字段的值必须是指定的时间类型（ISODate 或 ISODate 数组，不能使用时间戳。否则不能自动被删除）
删除索引不能是复合索引
删除时间不精确（删除程序每 60s 执行一次，删除过程也需要时间）

6.全文索引
db.articles.ensureIndex({key:"text"})
db.articles.ensureIndex({key1:"text",key2:"text"})
db.articles.ensureIndex({"$**":"text"}) 对集合中所有字段创建索引

查询
db.articles.find({$text:{$search:"coffee"}}) 查询关键词 coffee
“aa bb” 查询包含 aa 或 bb
"aa -bb" 查询 aa 不包含 bb
"\"aa\" \"bb\"" 查找既包含 aa 又包含 bb 

相似度查询
db.articles.find({$text:{$search:"aa bb"}},{score:{$meta:"textScore"}}) 全文索引查询相似度
db.articles.find({$text:{$search:"aa bb"}},{score:{$meta:"textScore"}}).sort({score:{$meta:"textScore"}})
查询相似度，并按相似度排序

限制：
每次查询只能指定一个 $text 查询
$text 查询不能出现在 $nor 查询中
查询中包含 $text，hint 不再起作用
全文索引还不支持中文

索引
db.name.ensureIndex({x:1,y:1},{name:"normal_index"}) 命名索引
db.name.dropIndex(indexName) 删除索引

db.name.ensureIndex({x:1,y:1},{unique:true}) 创建唯一索引
db.name.ensureIndex({},{sparse:true/false}) 稀疏索引



7.地理位置索引
分为 2d 索引（平面距离）和 2d sphere （球面距离）索引
范围 -180 到 180，超出会报错
维度 -90 到 90，超过不会报错

查找方式：
查找距离某个点一定距离内的点
查找包含在某个区域内的点
$near 查询：查询距离某个点最近的点
$geoWithin 查询：查询某个形状内的点
db.location.find({w:{$near:[1,1]}}) 查询距离（1,1）最近的 100 个点
db.location.find({w:{$near:[1,1],$minDistance:10}}) 查询距离（1,1）最近的，距离小于 10 的 100 个点

{$box:[[x1,y1],[x2,y2]]} 矩形
{$center:[[x1.y1],r]} 圆形
{$polygon:[[X1,Y1],[X2,Y2],[X3,Y3],...]} 多边形
db.location.find({w:{$geoWithin:{$box:[[0,0],[3,3]]}}})
db.location.find({w:{$geoWithin:{$center:[[0,0],3]}}})
db.location.find({w:{$geoWithin:{$polygon:[[0,0],[0,5],[5,0]]}}})

geoNear 查询：geoNear 使用 runCommand 命令进行使用：
db.runCommand(
  {
    geoNear: <collection>,
    near:[x,y],
    minDistance:(2d 索引无效)
    maxDistance:
    nums:返回个数
    ...
  }
)
db.runCommand({geoNear:"location",near:[1,2],maxDistance:10,nums:2})
除了返回查询数据，还返回一些统计数据

2dsphere 索引
创建方式：db.collection.ensureIndex({w:"2dsphere"})
位置表示方式，GeoJSON，描述一个点、直线、多边形等形状
{type:"", coordinates:[<coordinates>]}

## 评判索引构建情况
索引好处：加快索引相关的查询
索引坏处：增加磁盘空间消耗，降低写入性能

### mongostat 分析
mongostat -h ip:port

### profile 集合介绍
db.getProfilingStatus() 查看状态
db.getProfilingLevel()
0 profile 关闭
1 记录超过 slowms 的操作
2 记录所有操作
其中 system.profile 为记录文件

查询最近的 10 条操作数据（$natural 为自然排序，一般按写入顺序排序）
db.system.profile.find().sort({$natrural: -1}).limit(10)  

profile 一般在数据库搭建测试阶段开启，在生产环节中建议关闭

### 日志
在配置文件中设置
verbose = vvvvv (v 数量越多，记录越详细)

### explain
查询特定查询情况
db.name.find({x:1}).explain() 

# 安全
物理隔离 > 网络隔离 > 防火墙隔离 > 用户名密码

## 开启安全认证
在配置文件中设置 
auth = true

没用进行权限设置会报警告，开启认证并添加用户后，警告自动消失

## 创建用户
createUser(
    {
        user: "<name>",
        pwd: "<chartext password>",
        customData: {<any information>},
        roles: [{role: "<role>", db: "<dababase>"}]
    }
)
内建角色类型：
- read
- readWrite
- dbAdmin
- dbOwner
- userAdmin

db.createUser({user: "imooc", pwd:"imooc", roles:[{role:"userAdmin",db:"admin"},{role:"read",db:"test"}]})

数据库角色（read,readWrite,dbAdmin,dbOwner,userAdmin）
集群角色（clusterAdmin,clusterManager...）
备份角色（backup,restore...）
其它特殊权限（DBAdminAnyDatabase...）

## mongod 配置选项说明
--sloms arg (=100)      $ 慢查询时间设置，单位 ms
--profile arg           $ 0=off,1=slow,2=all 设置为1记录慢查询日志
--dbpath (=/data/db)    $
--noIndexBuildRetry     $ 创建索引中断后不重新创建，避免系统重新创建的所有存在问题
--noprealloc            不进行空间预分配，会影响性能
--asyncdelay arg (=60)  同步到磁盘的时间（0 表示永驻内存）
--repair                修复数据库
--repairpath arg        复制出数据进行修复的路径，要预留足够空间
--journal               $ 默认开启，推荐开启
--nojournal

复制集选项
--oplogSize arg         $ 复制集通过 oplog 复制，oplog 是封顶表，当数据超过大小，会覆盖原有数据进行复制，这个大小决定了复制窗口的大小，在可接受的范围内越大越好。默认为可用空间的人 5%
--replset arg           $ 指定复制集名，所有复制集名要一致
--replIndexPrefetch     预取索引





