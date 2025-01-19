---
title: HTML tabindex 属性是如何工作的？
date: 2024-10-10
---

HTML 元素设置`tabindex`属性后，可以触发聚焦（`focus`）和离焦（`blur`）事件，通过按下键盘上的 <kbd>Tab</kbd> 能够在可聚焦的元素间切换。`tabindex`值会改变 <kbd>Tab</kbd> 切换行为方式：

- 正值（1到32767）：按照从小到大顺序
- 0：默认顺序，即界面上显示的顺序
- -1：无法通过 <kbd>Tab</kbd>切换


### 用 \<kbd\> 标签表示键盘按键 ****

<kbd>Ctrl</kbd> + <kbd>C</kbd> 复制

```html
<kbd>Ctrl</kbd> + <kbd>C</kbd> 复制
```