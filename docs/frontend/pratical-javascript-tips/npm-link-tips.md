---
title: 组件开发小技巧 npm link 链接本地库
date: 2023-04-01
---

本地组件开发时，可以使用 npm link 或 yarn link 命令，链接项目库与组件库。

组件库项目在`package.json`中配置好`name`、`main`、`version` 等属性后，打包组件库，在组件库根目录输入指令：

```bash
npm link
// or
yarn link
// 提示：success Registered "packageA"
// 其中 packageA 为包名
```
然后，在项目库根目录输入指令：

```bash
npm link packageA
// or
yarn link packageA
```

即可在项目中使用该包，即使该包没有安装到 node\_modules 中：

```javascript
import packageA from 'packageA'
```
