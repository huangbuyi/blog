---
title: 创建和使用 npm 私有包
date: 2025-01-07
---

常见三种创建 npm 私有包的方法：npm 网站发布私有包；创建私有仓库；静态打包文件。

## 1. npm 网站发布私有包

npm 注册账号并在`package.json`添加私人声明，发布到 npm。

```json
{
    ...,
    "private": true,
    ...
}
```

## 2. 私人 npm 仓库

登录到仓库

```bash
npm login --registry=https://mysecretregistry.com
```

发布

```bash
npm publish --registry=https://mysecretregistry.com
```

安装

```bash
npm install legendary --registry=https://mysecretregistry.com
```

## 3. 静态打包文件

这是最简单的创建和安装私有包的方法，适合个人使用。生成一个 npm 能够使用的压缩文件：

```bash
npm pack
```

安装压缩文件：

```bash
npm install /some/dir/legendary-1.0.0.tgz
```
