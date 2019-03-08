---
title: MongoDB 安装
date: 2017/8/8 00:00:00
---

## Linux
到 [mongoDB 官网](https://www.mongodb.com/download-center)找到最新压缩包链接，利用 Linux 下载工具获取安装包：
```
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-amazon-3.4.6.tgz
```

解压到自定义的路径下
```
tar -zvxf /path/to/mongoDB
```

### 将 mongoDB 命令添加到环境变量:
临时添加，在命令行输入指令：
```
export path=$path:/path/to/mongoDB/bin/
```

将下面命令添加到 ~/.bashrc 文件中：
```
export PATH="$PATH:/path/to/mongoDB/bin/"
```

将上述命令添加到 /etc/profile 文件中，对所有用户永久有效

记得修改完配置文件后，用 source 命令重新加载配置

## Mac OSX
同样到 [mongoDB 官网](https://www.mongodb.com/download-center)下载最新压缩包，解压到自定义的路径下。把命令所在文件夹添加到全局变量，如果 Mac 一般只用同一个账户，所以添加到当前用户的全局变量即可。在 ~/.bashrc 中添加命令：

```
export PATH="$PATH:/path/to/mongoDB/bin/"
```

修改后，重新加载配置文件：
```
source ~/.bashrc
```

## Windows

同样到 [mongoDB 官网](https://www.mongodb.com/download-center)下载最新 .msi 文件，按照步骤安装完成后，把安装目录中的 bin 目录添加到环境变量中，即可在命令提示符中使用相关命令。








