---
title: npm 报错 Class extends value undefined is not a constructor or null.md
date: 2024-11-02
---

更新 node-v22.11.0 后，执行 `npm install` 或 `npm init` 等几乎所有指令都报错：`Class extends value undefined is not a constructor or null`。

尝试修复：

- 卸载后重新安装 node-v22.11.0 - 无效
- 重启电脑 - 无效
- 手动删除 npm-cache - 无效
- **卸载 node-v22.11.0，安装 node-v18.20.4 - 问题解除，不再报错**