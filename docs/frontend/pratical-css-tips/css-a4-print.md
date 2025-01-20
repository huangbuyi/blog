---
title: CSS A4 打印踩坑
date: 2023-01-30
---

A4 纸尺寸是 21cm x 29.7cm，CSS 中同样可以使用 cm 作为单位，将 Div 设置 A4 纸尺寸，可以在显示器上得到一个近似 A4 大小元素。
设置打印边距

```css
@page {
  margin: 2cm;
}
```

设置打印时的样式

```css
@media print {
  .example {
    display: none
  }
}
```

在开发者工具中启用“打印”模式。

![image](/images/poEysrgcfZkFmS3IdN0JFgsVCFWHaATvTTdkZ5fHtN4.jpg)

要实现屏幕上显示效果和打印效果一致，要注意边距的设置。因为打印时会自动为纸张加上边距，所以要让

内容宽度 = 纸张宽度 - 边距 \* 2

以 A4 纸，边距 2cm 为例

内容宽度 = 21cm - 2 \* 2cm = 17cm

容器 Div 设置 2cm padding 可以看起来像 A4 纸，但一定要在打印时去掉，否则打印区域会缩小。

```css
@media print {
  .page {
    padding: 0 !important;
  }
}
@page {
  margin: 2cm;
}
.page {
  width: 17cm;
  min-height: 25.3cm;
  padding: 2cm;
}
```
另外高度设置的略小一些，可以避免多出一页空白页。



