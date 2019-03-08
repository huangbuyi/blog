mongoDB 启动时默认未开启安全模式，但会在命令栏发出警告。mongoDB 中，通过角色（role）和权限（privilege）来实现权限控制。

## 开启权限认证
开启权限控制之后，连接数据库需要对用户进行认证。所以在开启权限控制前，需要保证 admin 数据库至少有一个 userAdmin 或 userAdminAnyDatabase 角色的用户，这两个角色用于创建和管理其它用户的角色和权限。连接数据库时，我们以担当这两个角色的用户或它们所创建的用户来登录数据库。 

### 创建用户管理者
首先，以非安全模式启动 mongoDB 实例，这时候连接数据库是不需要任何认证的：

```
mongod --fork --port 12345 --dbpath data --logpath log/mongodb.log

mongo 127.0.0.1:12345
```

进入到 mongoDB 命令栏后，切换到 admin 数据库，添加一个 userAdmin 角色的用户:
```
> use admin
> db.createUser(
    {
        user: "abc123",
        pwd: "abc123",
        roles: [{role: "userAdmin", db: "admin"}]
    }
  )
```

这里添加了一个 userAdmin 角色的用户，你也可以添加为 userAdminAnyDatabase 角色的用户。添加后，就可以关闭命令栏了。

### 重启 mongoDB
再次重启 mongoDB 时，我们要开启选项 **--auth**：
```
mongod --auth --fork --port 12345 --dbpath data --logpath log/mongodb.log
```

如果是通过配置文件启动，将`auth = true`添加到配置文件。

### 再次连接 mongoDB
再次连接 mongoDB，就可以对在登录的用户进行认证：
```
mongo 127.0.0.1:12345 -u "userAdmin" -p "abc123"
```

也可以先建立连接，再在命令栏内通过 **db.auth()** 方法进行认证：
```
mongo 127.0.0.1:12345

> use admin
> db.auth("userAdmin", "abc123")
```

开启权限模式后，命令栏权限警告就会自动消失了。

## 用户角色和权限
以用户管理员的角色登录，能够管理用户，为用户授予各种角色和权限。但我们在创建用户管理员的时候，只授予了 userAdmin 的角色，所以其它的操作，如读写数据，会报出错误。

mongoDB 角色可分为内置角色、自定义角色和集合层角色三类。

### 内置角色（Built-in Roles）
每个数据库都内置了数据库用户角色和数据库管理角色，admin 数据库另外还包含一些其它内置角色。

#### 数据库用户角色（Database User Roles）
它包括两个角色，read 和 readWrite

| 角色 | 简介 |
|------|-----|
| read | 可以读取所有非系统数据集 |
| readWrite | 包含 read 所有权限，还可以修改所有非系统数据集 |

#### 数据库管理角色（Database User Roles）
它包括三个角色，dbAdmin、dbOwner 和 userAdmin：

| 角色 | 简介 |
|------|------|
| dbAdmin | 可以执行管理操作（如，创建索引），但没有用户和角色管理的权限 |
| dbOwner | 可以执行所有操作，包含 readWrite, dbAdmin 和 userAdmin 角色的所有权限 |
| userAdmin | 可以创建和修改当前数据库的用户和角色，所以该角色也是个间接的超级用户 |

在启动权限控制时，我们已经创建了一个 userAdmin 角色，admin 数据库中的 userAdmin 角色是整个数据库间接的超级用户。

#### 集群管理角色（Cluster Administration Roles）
只有 admin 数据库拥有这类角色，它们可以管理整个系统，而非特定数据库.

| 角色 | 简介 |
|------|------|
| clusterAdmin | 最高级集群管理权限，包括了以下三种角色所有权限，还有 dropDatabase 的权限 |
| clusterManager | 
| clusterMonitor
| hostManager

#### 备份还原角色（Backup and Restoration Roles）


#### 全数据库角色（All-Database Roles）

### 自定义角色（User-Defined Roles）

### 集合层角色（Collection-Level Access Control）



### 

## 角色和权限管理

### 创建角色
db.createUser()

### 删除角色 



## 复制集安全
auth 单点认证
keyFile 集群间验证

keyFile 注意事项：
1. base64 编码 [a-z A-Z + /]
2. 1000 bytes 长度以内
3. chmod 600 keyFile 以上权限

```
openssl rand -base64 102 > .keyFile

```

changUserPassword()
dropUser()
dropAllUser()

自定义角色
```
db.createRole({
    role:<role_name>,
    privileges: [
        { 
            reources: {db:<db_name>, collection:<collection_name>},
            actions: [<action_name>]
        },
    ],
    Roles: [
        { role:<role_name, db:<db_name>>}
    ]
})
```

查看权限
```
db.runCommand({userInfo:'admin', showPrivileges:1})
```

修改用户密码
```
db.changeUserPassword(<user_name>, <new_password>)
db.updateUser(<user_name>, {update_object})
```

权限伸缩
```
db.grantRolesToUser(<username>, [{role:<role_name>, db:<db_name>},...])

db.revokeRolesToUser(<username>, [{role:<role_name>, db:<db_name>},...])
```





