---
title: 简明 MongoDB 入门教程
date: 2017/8/8 00:00:00
categories:
- 数据库
tags:
- MongoDB
---

MongoDB 是免费开源的跨平台 NoSQL 数据库，命名源于英文单词 hu**mongo**us，意思是「巨大无比」，可见开发组对 MongoDB 的定位。与关系型数据库不同，MongoDB 的数据以类似于 JSON 格式的二进制文档存储：

```
{
    name: "Angeladady",
    age: 18,
    hobbies: ["Steam", "Guitar"]
}
```

文档型的数据存储方式有几个重要好处：文档的数据类型可以对应到语言的数据类型，如数组类型（Array）和对象类型（Object）；文档可以嵌套，有时关系型数据库涉及几个表的操作，在 MongoDB 中一次就能完成，可以减少昂贵的连接花销；文档不对数据结构加以限制，不同的数据结构可以存储在同一张表。

MongoDB 的文档数据模型和索引系统能有效提升数据库性能；复制集功能提供数据冗余，自动化容灾容错，提升数据库可用性；分片技术能够分散单服务器的读写压力，提高并发能力，提升数据库的可拓展性。MongoDB 高性能，高可用性、可扩展性等特点，使其至 2009 年发布以来，逐渐被认可，并被越来越多的用于生产环境中。AWS、GCP、阿里云等云平台都提供了十分便捷的 MongoDB 云服务。

## 开启 MongoDB 之旅

第一步，[安装 MongoDB](https://segmentfault.com/a/1190000010556564)。到官网下载压缩包或安装包，解压或安装后，可以把 bin 目录添加到环境变量，方便后续命令的执行。在开始阶段，要用到 mongo 和 mongod 两个命令。文章示例以 Linux 为标准。

### 启动实例 

第二步，通过 mongod 命令启动实例。启动之前，新建一个目录来存放 mongoDB 的数据和日志：
```
mkdir mongoDB_example
cd mongoDB_example
mkdir bin data conf log
touch log/mongodb.log
```

上面的命令创建了四个目录：

- *bin* 如果不打算把 mongodb 的命令放到环境变量，可以将常用命令复制到 bin 目录，方便调用，如 mongo 和 mongod。也可以把编写的脚本，如副本集的启动脚本，放在 bin 目录里
- *data* 用来存放数据
- *log* 用来存放日志文件
- *conf* 用来存放配置文件

在项目目录中，使用 mongod 命令来启动 mongoDB 进程：
```
mongod --fork --port 12345 --dbpath data\db  --logpath log/mongodb.log
```

上面命令中选项的意义：

- *port* 指定端口
- *dbpath* 指定数据存放路径
- *logpath* 指定日志存放路径 
- *fork* 后台运行（退出 shell 后进程不会被中断了）

启动顺利的话，就可以输入`ps aux | grep mongod`，查看到启动的 mongod 实例。如果启动没有成功，最好先检查下路径设置和端口占用。

### 配置文件启动实例
相比设定选项来启动实例，通过配置文件启动更具有可维护性。在 conf 目录下新建一个配置文件：
```
vi conf/mongodb.conf
```

配置文件使用`<option> = <value>`的格式。接下来，把刚才的启动配置输入到配置文件中：
```
port = 12345
dbpath = data
logpath = log/mongodb.log
fork = true
```

启动之前别忘了先杀掉之前启动的实例`kill -2 <pid>`，然后再重新启动 mongoDB：
```
mongod -f conf/mongodb.conf
```

在没有指定接口时，默认启动在 27017 端口。在配置的时候使用绝对路径替代相对路径，有利于在排查故障时查找 mongoDB 进程启动的目录。

## 连接实例
第三步，通过 mongo 命令来连接 mongoDB 实例：
```
mongo [options] [db address] [file names]
```

之前启动实例的是在本地 12345 端口，安全模式未被开启，所以不需要输入用户名和密码即可直接连接：
```
mongo 127.0.0.1:12345
```

或者通过`--host`和`--port`选项指定主机和端口。一切顺利的话，就进入了 mongoDB shell，shell 会报出一连串权限警告，不过不用担心，这并不会影响之后的操作。在添加授权用户和开启认证后，这些警告会自动消失。

## 数据库 CRUD 操作

在进行增查改删操作之前，先了解下常用的 shell 操作：

- `db` 显示当前所在数据库，默认为 test
- `show dbs` 列出可用数据库
- `show tables` `show collections` 列出数据库中可用集合  
- `use <database>` 用于切换数据库

mongoDB 预设有两个数据库，admin 和 local，admin 用来存放系统数据，local 用来存放该实例数据，在副本集中，一个实例的 local 数据库对于其它实例是不可见的。使用 use 命令切换数据库：
```
> use admin
> use local
> use newDatabase
```

可以 use 一个不存在的数据库，当你存入新数据时，mongoDB 会创建这个数据库：

```
> use newDatabase
> db.newCollection.insert({x:1})
WriteResult({ "nInserted" : 1 })
```

以上命令向数据库中插入一个文档，返回 1 表示插入成功，mongoDB 自动创建 newCollection 集合和数据库 newDatabase。下面将创建一个 drivers 集合，进行增查改删操作。

### 创建（Create）

MongoDB 提供 **insert** 方法创建新文档：

- `db.collection.inserOne()` 插入单个文档
WriteResult({ "nInserted" : 1 })
- `db.collection.inserMany()` 插入多个文档
- `db.collection.insert()` 插入单条或多条文档

这里以 insert 方法为例：
```
> db.drivers.insert({name:"Chen1fa",age:18})
> db.drivers.insert({name:"Xiaose",age:35})
> db.drivers.insert({_id:91,name:"Sun1feng",age:34})
```

要注意，`age:18`和`age:"18"`是不一样的，前者插入的是数值，后者插入的是字符串。插入新文档如果未指定 _id，mongoDB 会自动为插入的文档添加 _id 字段。使用 `db.dirvers.find()` 命令即可看到刚刚插入的文档：
```
> db.dirvers.find()
{ "_id" : ObjectId("598964bd56b8c69ae1e5f36a"), "name" : "Chen1fa", "age" : 18 }
{ "_id" : ObjectId("598964d456b8c69ae1e5f36b"), "name" : "Xiaose", "age" : 35 }
{ "_id" : 91, "name" : "Sun1feng", "age" : 34 }
```

### 查找（Read）

MongoDB 提供 **find** 方法查找文档，第一个参数为查询条件：
```
> db.drivers.find() #查找所有文档
{ "_id" : ObjectId("598964bd56b8c69ae1e5f36a"), "name" : "Chen1fa", "age" : 18 }
{ "_id" : ObjectId("598964d456b8c69ae1e5f36b"), "name" : "Xiaose", "age" : 35 }
{ "_id" : 91, "name" : "Sun1feng", "age" : 34 }

> db.drivers.find({name: "Xiaose"}) #查找 name 为 Xiaose 的文档
{ "_id" : ObjectId("598964d456b8c69ae1e5f36b"), "name" : "Xiaose", "age" : 35 }

> db.drivers.find({age:{$gt:20}}) #查找 age 大于 20 的文档
{ "_id" : ObjectId("598964d456b8c69ae1e5f36b"), "name" : "Xiaose", "age" : 35 }
{ "_id" : 91, "name" : "Sun1feng", "age" : 34 }
```

上述代码中的`$gt`对应于大于号`>`的转义。第二个参数可以传入投影（projection，投影仪中，白色光源通过分光镜、液晶板、投影镜头的光学变换后，投射到反射面上，显示出了彩色图像）文档映射数据：
```
> db.drivers.find({age:{$gt:20}},{name:1})
{ "_id" : ObjectId("598964d456b8c69ae1e5f36b"), "name" : "Xiaose" }
{ "_id" : 91, "name" : "Sun1feng" }
```

上述命令将查找 age 大于 20 的文档，返回 name 字段，排除其它字段。投影文档中字段为 1 或真值表示包含，0 或假值表示排除，可以设置多个字段为 1 或 0，但不能混合使用。

除此之外，还可以通过 count、skip、limit 等指针（Cursor）方法，改变文档查询的执行方式：

```
> db.drivers.find().count() #统计查询文档数目
3
> db.drivers.find().skip(1).limit(10).sort({age:1})
{ "_id" : 91, "name" : "Sun1feng", "age" : 34 }
{ "_id" : ObjectId("598964d456b8c69ae1e5f36b"), "name" : "Xiaose", "age" : 35 }
```

上述查找命令跳过 1 个文档，限制输出 10 个，以 name 子段正序排序（大于 0 为正序，小于 0 位反序）输出结果。最后，可以使用 Cursor 方法中的 pretty 方法，提升查询文档的易读性，特别是在查看嵌套的文档和配置文件的时候：

```
> db.drivers.find().pretty()
```

### 更新（Update)

MongoDB 提供 **updata** 方法更新文档：
- `db.collection.updateOne()` 更新最多一个符合条件的文档
- `db.collection.updateMany()` 更新所有符合条件的文档
- `db.collection.replaceOne()` 替代最多一个符合条件的文档
- `db.collection.update()` 默认更新一个文档，可配置 multi 参数，跟新多个文档

以 update() 方法为例。其格式：
```
> db.collection.update(
    <query>,
    <update>,
    {
        upsert: <boolean>,
        multi: <boolean>
    }
)
```

各参数意义：
- *query* 为查询条件
- *update* 为修改的文档
- *upsert* 为真，查询为空时插入文档
- *multi* 为真，更新所有符合条件的文档

下面的命令将 name 字段为 Chen1fa 的文档，更新 age 字段为 30：
```
> db.drivers.update({name:"Chen1fa"},{name:"Chen1fa", age:30})
```

要注意的是，如果更新文档只传入 age 字段，那么文档会被更新为`{age: 30}`，而不是`{name:"Chen1fa", age:30}`。要避免文档被覆盖，需要用到 $set 指令，$set 仅替换或添加指定字段：
```
> db.drivers.update({name:"Chen1fa"},{$set:{age:30}})
```

如果要在查询的文档不存在的时候插入文档，要把 upsert 参数设置真值：
```
> db.drivers.update({name:"Alen"},{age:24},{upsert: true})
```

update 方法默认情况只更新一个文档，如果要更新符合条件的所有文档，要把 multi 设为真值，并使用 $set 指令：
```
> db.drivers.update({age:{$gt:25}},{$set:{license:'A'}},{multi: true})
> db.drivers.update({age:{$lt:25}},{$set:{license:'C'}},{multi: true})
```

最终结果：
```
> db.dirvers.find()
{ "_id" : ObjectId("598964bd56b8c69ae1e5f36a"), "name" : "Chen1fa", "age" : 30, "license" : "A" }
{ "_id" : ObjectId("598964d456b8c69ae1e5f36b"), "name" : "Xiaose", "age" : 35, "license" : "A" }
{ "_id" : 91, "name" : "Sun1feng", "age" : 34, "license" : "A" }
{ "_id" : ObjectId("598968b3ed1eccef17e79abe"), "age" : 24, "license" : "C" }
```

### 删除（Delete）

MongoDB 提供了 **delete** 方法删除文档：
- `db.collection.deleteOne()` 删除最多一个符合条件的文档
- `db.collection.deleteMany()` 删除所有符合条件的文档
- `db.collection.remove()` 删除一个或多个文档

以 remove 方法为例：
```
> db.drivers.remove({name:"Xiaose"}) #删除所有 name 为 Xiaose 的文档
> db.drivers.remove({age:{$gt:30}},{justOne:true}) #删除所有 age 大于 30 的文档
> db.drivers.find()
{ "_id" : ObjectId("598964bd56b8c69ae1e5f36a"), "name" : "Chen1fa", "age" : 30, "license" : "A" }
{ "_id" : ObjectId("598968b3ed1eccef17e79abe"), "age" : 24, "license" : "C" }
```

MongoDB 提供了 drop 方法删除集合，返回 true 表面删除集合成功：
```
> db.drivers.drop() 
```

### 后话

相比传统关系型数据库，MongoDB 的 CURD 操作更像是编写程序，更符合开发人员的直觉，不过 MongoDB 同样也支持 SQL 语言。MongoDB 的 CURD 引擎配合索引技术、数据聚合技术和 JavaScript 引擎，赋予 MongoDB 用户更强大的操纵数据的能力。

## 关闭实例
关闭 mongoDB 服务：
```
> use admin
> db.shutdownServer()
```

使用 exit 或 Ctrl + C 断开连接:
```
> exit
```

## 结语

上述，我们启动了一个不安全的 MongoDB 实例，应用到生产环境中，还需要了解 MongoDB 的安全机制，了解如何建立索引提升数据库的读写速度。随着数据的增长，需要了解副本集技术如何将多个实例部署到不同的服务器、了解分片技术对数据库进行横向扩展。为保证服务器性能和安全，需要了解如何对 MongoDB 进行测试和监控…

「冰封三尺，非一日之寒」，同样，要想完全掌握 MongoDB 还有很长的路要走。愿戒骄戒躁，在学习的路上，与君共勉。


## 参考

- [Wikipedia MongoDB](https://en.wikipedia.org/wiki/MongoDB)
- [MongoDB introduction](https://docs.mongodb.com/manual/introduction/)
- [MongoDB CRUD Operations](https://docs.mongodb.com/manual/crud/)
- [Imooc MongoDB series course - SeanZ](http://www.imooc.com/u/1196301/courses?sort=publish)
- [MongoDB University](https://university.mongodb.com/)
- [怎样学 MongoDB？- 知乎](https://www.zhihu.com/question/19882468)














