---
title: Nextjs + Prisma 生产环境 npm run start 各种报错
date: 2025-01-14
---

用的是 pnpm 安装依赖。

- 报错：大概意思是找不到 Prisma 模型。
- 执行`npx prisma generate`后报错：`bus error (core dumped)`。试过各种方法无效，猜测可能是操作系统版本和 Node 版本的问题。
- 一番搜索后，把 node 版本从 v18.20.4 切换至 v20.11.1 没有了`bus error (core dumped)`报错，又报错找不到`node_modules`中的某个模块。
- 以此推测是 pnpm 没有正确执行一些勾子函数，像`preinstall`、`postinstall`什么的。
- 删除`node_mdoules`和 lock 文件，重新用`npm install`，一切正常，没有报错。
