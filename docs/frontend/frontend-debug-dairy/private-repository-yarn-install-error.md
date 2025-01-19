---
title: 内网私有库 Yarn 安装异常处理
date: 2023-03-06
---

由于每次 Yarn 执行安装组件都会检查整个组件树，即使只安装一个组件，如果整个依赖树存在私有库不存在的包，都会报错 Not Found。

首先，可以通过脚本，将 node_modules 中的组件发布到私有库，这个过程很慢，可能持续数个小时，并且可能仍有部分包没有上传成功。于是，在次执行 Yarn 安装，仍可能报错 Not Found。

```bash
error An unexpected error occurred: "http://ip:port/path/package/-/package-1.2.3.tgz: Request failed 
"404 Not Found"".
```

这里可以看到报错中的包名，前往包管理网站下载对应的 tgz 包，也可以从外网该项目的 lock 文件中搜索包名，其中就有 tgz 包下载地址。

```bash
https://registry.yarnpkg.com/string_decoder/-/string_decoder-1.1.1.tgz
```

将下载的 tgz 包转移到内网，上传到私有库。接下来，清理 Yarn 缓存后，继续执行安装命
令，如果再次报 Not Found，则重复以上操作。

```bash
yarn cache clean #清理缓存
yarn --update-checksums --skip-integrity-check  #忽略校验
```
