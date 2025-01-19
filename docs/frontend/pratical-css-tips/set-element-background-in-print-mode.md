---
title: 在打印模式下打印指定元素的背景色
date: 2022-12-20
---

黑白打印时，系统默认不打印元素背景色，对于需要保留背景色的元素，可加上下面 CSS 代码：

```css
@media print {
  .classA {
    background-color: #333 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```