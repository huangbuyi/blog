---
title: 记录一次性能排查
date: 2023-01-16
cover: /images/rJHZ7Q22-V7uKSdbTb7GQ5yxLkBfJdj3Mnfu7HYuEhg.png
---

滚动页面时发现，dom 更新存在明显的延迟，于是用开发者工具做了一次记录：

![image](/images/rJHZ7Q22-V7uKSdbTb7GQ5yxLkBfJdj3Mnfu7HYuEhg.png)

可以看出，仅一次 scroll event 调用中，JS 执行了3秒多，也然怪觉得卡顿明显。

JS 代码中 Vue 实例更新最占资源，其中 Unmount 占用了大多数时间，也就是说，销毁实例占用了大量时间。

这个页面会监听页面滚动，滚到一定位置时就不再显示某个组件，如上图所示，销毁组件占用了大量时间，期间页面卡顿，体验较差。

解决方法是用 v-show 替代 v-if 隐藏组件。

原来以为少渲染一些 Dom 能提升性能，没想到销毁实例才是大头。