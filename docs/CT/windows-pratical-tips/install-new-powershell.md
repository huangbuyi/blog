---
title: 通过命令行安装最新版 Powershell
date: 2023-07-02
cover: /images/ndi9gDZOASdTHYrVhLUH2gfB3FbyYwiOi5LYqUGKEjA.png
---

1. 打开命令行工具。输入`winget search PowerShell`, 可以看到软件版本列表。

![image](/images/ndi9gDZOASdTHYrVhLUH2gfB3FbyYwiOi5LYqUGKEjA.png)

2. 记住或复制想要软件版本的 ID，输入`winget install AppID`，开始安装。
3. 提示安装成功即完成。
4. 打开 PowerShell，输入`$PSVersionTable`查看版本，如果版本不对，系统内可能同时存在多个版本的 PowerShell。

题外话：新版本 PowerShell7.0 支持自动补全，键入命令，出现自动补全提示，按**→右箭**完成补全。

![image](/images/vVqV2wqZ3_2YOR7nAaIYETN95eYm1MoECbwhRz47JoQ.png)

