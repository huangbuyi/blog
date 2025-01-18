---
title: 空值合并赋值操作符（?==）
date: 2024-08-21
---


## 空值合并赋值操作符（?==）

仅当左侧的值为空（`null`或`undefined`）时，将右侧的值赋值给左侧：

```js
let myShoes = null
myShoes ??= 'Nike' // Nike
myShoes ??= 'Jordan' // Nike
myShoes = null
myShoes ??= 'Jordan' // Jordan
```

相当于：

```js
myShoes ??= 'Nike' // ===
myShoes = myShoes !== null && myShoes !== undefined ? myShoes : 'Nike'
```