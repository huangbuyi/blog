## 如何修改复制集的名称？
修改配置的复制集名称后，复制集不再工作，全部降级为 OTHER 节点，无法重新配置复制集。

答：关闭认证，通过修改 local.system.replset 中复制集名称（重新读取，修改，再插入，删除原值）。使得复制集名称与配置一致。重启实例，即可用`rs.reconfig(config, {force: true})`方法重新配置。其它节点以同样方式修改名称，重启示例后即可。参见：
-[Can I change the name of my replica set while mongod processes are running?](https://stackoverflow.com/questions/11265997/can-i-change-the-name-of-my-replica-set-while-mongod-processes-are-running)

所以，如果打算重新配置复制集，应该先修改实例中的配置，再修改配置文件。

## 命令行中使用 db.auth 授权，用户名和密码都没错，却授权失败？
答：管理员用户授权要在 admin 下运行