## npm 全局安装无效？
npm 全局命令会被添加到安装目录的 /bin 目录下，将 path/to/node/bin 路径添加到全局变量里去才能调用全局命令，修改全局可以用下面两种方法：

1. 使用 export 命令添加，但这是临时的，退出终端后就会失效
```
export PATH=$PATH:path/to/node/bin
```

2. 要永久生效，可以修改 /etc/profile 文件，在文件末尾天机
```
export PATH="$PATH:path/to/node/bin"
```
保存退出，然后运行：
```
source /etc/profile
```
不报错，则成功

## sudo node 报错：command not found？
将 node 命令软连接到 sudo 命令的目录下（whereis 查看命令所在目录）