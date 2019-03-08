# 数据模型设计
数据模型设计主要考虑的是使用嵌入文档还是文档的引用

## 嵌入式数据模型
将一些相关的数据嵌入到数据结构中，这在传统关系型数据库中被认为中「不规范」的，但在 MongoDB 中，则有利于减少事物所需的查询和更新次数。下面的数据模型嵌入了 contact 和 aceess 两个子文档。

```
{
    _id: <ObjectId1>,
    username: "Ritian Zhao"
    contact: {
        phone: "123-456-7890"，
        email: "ritian@example.com"
    },
    access: {
        level: 100,
        group: "dev"
    }
}
```

嵌入式数据适用场景：
- 两个实体是包含关系（一对一关系）
- 两个实体是一对多关系，且子文档（一对多中的多）在父文档（一对多中的一）中总是存在的。

一般来说，内嵌有更高读性能，提高请求和检索数据的速度。嵌入式数据模型能实现单个原子写操作数据的更新。

但是数据嵌入会导致文档增长，文档增长会影响 MMAPv1 存储引擎的写入速度，产生数据碎片

## 规范数据模型
规范数据模型通过引用描述两个文档间的人关系

```
// user document
{
    _id: <ObjectId1>,
    username: "Ritian Zhao"
}

// contact document
{
    _id: <ObjectId2>,
    user_id: <ObjectId1>,
    phone: "123-456-7890",
    emal: "ritian@example.com"
}

// access document
{
    _id: <ObjectId3>,
    user_id: <ObjectId1>,
    level: 5，
    group: "dev"
}
```

规范数据模型适用场景：
- 嵌入数据造成数据冗余，读取速度提升无法弥补冗余带来的影响
- 多对多关系
- 结构复杂的数据集