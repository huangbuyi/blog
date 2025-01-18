---
title: npm install 导致服务器卡死
date: 2025-01-14
---

执行`npm install`导致服务器卡死，Terminal 卡住停止，无法 Ctrl + C 退出，服务器无法 ssh 登录。只能重启服务器恢复 ssh 登录。

将 Node 版本从 18.20.4 升级为 20.18.1 解决了，之后执行`npm install`就正常了。