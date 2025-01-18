---
title: JavaScfript 键盘事件注意事项
date: 2021-09-04
---

键盘常用的监听器包括`keydown`、`keyup`、`keypress`，在回调函数中，我们能拿到键盘事件`KeyboardEvent`，那么如何根据事件属性来判断用户的按键呢？

首先，以前常用的`KeyboardEvent.keyCode`已经废弃，同样废弃的还有`KeyboardEvent.charCode`和`KeyboardEvent.keyIdentifier`，未来不可期，就不做研究了。现在有`KeyboardEvent.key`和`KeyboardEvent.code`可以使用。

`KeyboardEvent.code`返回物理键位的键值，可以理解为——它代表键帽的位置。

`KeyboardEvent.key`返回键位所代表的键值，可以理解为——它代表键帽上的字。

<kbd>Shift</kbd> 组合按键可能会改变`KeyboardEvent.key`返回值，比如：

<kbd>A</kbd> = `a`

<kbd>Shift</kbd> + <kbd>A</kbd> = `A`

<kbd>=</kbd> = `=`

<kbd>Shift</kbd> + <kbd>=</kbd> = `+`

但 <kbd>Shift</kbd> 不会改变 `KeyboardEvent.code` 返回值：

<kbd>A</kbd> = `KeyA`

<kbd>Shift</kbd> + <kbd>A</kbd> = `KeyA`

<kbd>=</kbd> = `Equal`

<kbd>Shift</kbd> + <kbd>=</kbd> = `Equal`

相同刻字，不同的键位，`KeyboardEvent.key`返回相同的值：

<kbd>Shift</kbd> = `Shift`

<kbd>ShiftRight</kbd> = `Shift`

<kbd>Enter</kbd> = `Enter`

<kbd>NumpadEnter</kbd> = `Enter`

而`KeyboardEvent.code`返回不同的值：

<kbd>Shift</kbd> = `ShiftLeft`

<kbd>ShiftRight</kbd> = `ShiftRight`

<kbd>Enter</kbd> = `Enter`

<kbd>NumpadEnter</kbd> = `NumpadEnter`

获取用户输入时，建议使用`KeyboardEvent.key`；获取固定键位时，建议使用`KeyboardEvent.code`。

