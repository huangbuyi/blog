---
title: 获取元素位置
date: 2023-01-21
---

以下是获取三种元素位置的方法：

```javascript
// 获取相对 offsetParent 位置
el.offsetTop | el.offsetLeft

// 获取相对视窗（Viewport）位置
el.getClientRects()[0]

// 获取相对页面的位置
function getPosition( el ) {
  var x = 0;
  var y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
  x += el.offsetLeft - el.scrollLeft;
  y += el.offsetTop - el.scrollTop;
  el = el.offsetParent;
  }
  return { top: y, left: x };
}
```