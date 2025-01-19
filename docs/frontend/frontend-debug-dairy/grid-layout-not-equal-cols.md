---
title: Grid 布局不等宽？
date: 2022-07-06
---

布局中 repeat(n, 1fr) 布局可能不等宽 。1fr 表示对可用空间进行分配，但是当其中的内容超出列宽度时，为了避免内容 overflow 会自动调整列的宽度，导致列不再等宽。可以写成：

```css
grid-template-columns: repeat(3, minmax(0, 1fr));
```
或

```css
grid-auto-columns: minmax(0, 1fr);
grid-auto-flow: column;
```