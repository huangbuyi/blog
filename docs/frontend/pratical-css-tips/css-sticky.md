---
title: CSS 粘性布局
date: 2023-01-16
---

今天才发现 `position` 还有一个 `sticky` 属性。

前端开发中一个常见需求：当页面滚动某处时，让一部分内容固定在某处。以往必须要监听 `scroll` 事件，然后改变样式。这种方式有几个问题：

1. 每滚动一定距离后才会触发 scroll 事件，从滚动到固定过程会出现抖动，不够平滑。
2. 监听滚动事件消耗性能。
3. 增加代码复杂度。

`sticky` 定位的 Element 有两种表现，并且要配合 `top`、`right`、`bottom` 和 `left` 设置偏移值。

1. 在偏移值内，行为等同 `relative` 定位，按正常文档流定位。
2. 超过偏移值后，类似 `fix` 定位。

以 `top: 10px` 为例（假设仅页面滚动）：

1. 在 Element 距离 Viewport（可视范围内）顶部大于 `10px` 时，为相对定位。
2. 滚动页面后，Element  移动距离顶部小于 `10px` 时，固定到距离顶部 `10px` 位置。

与 `fix` 定位不同，`sticky` Element 不一定是相对 Viewport 定位，它的参考对象是祖先 Elemetn 中，最近的**，具有滚动机制**（`overflow` 等于 `hidden, scroll, auto` ，）或**能滚动**的 Element。如果祖先元素都不具有滚动机制，`sticky` Element 参考对象才是 Viewport。

由于机制特殊，相对 Viewport 定位要注意以下情况：

1. 父元素不能 `overflow: hidden` 或者 `overflow: auto` 属性。 
2. 必须指定 `top`、`bottom`、`left`、`right` 4个值之一，否则只会处于相对定位 
3. 父元素的高度不能低于 `sticky` 元素的高度 
4. `sticky` 元素仅在其父元素内生效

优先级 `top` 大于 `bottom`，`left` 大于 `right`。

`sticky` 优点：

1. 切换流畅，没有卡顿。
2. 性能好。
3. 方便在任意滚动元素内实现该机制。

`sticky` 缺点：

1. 机制复杂。
2. 对祖先元素有要求。
3. `top`、`bottom`、`left`、`right` 不能同时指定 Element 两侧偏移。
4. 兼容性稍差



