---
title: 可选链运算符（?.）
date: 2024-08-01
categories: [frontend, pratical-javascript-tips]
---

## 可选链运算符（?.）

```js
const bike = {};
// js error
const brakerBrand = bike.braker.name || 'unknow';
// ok
const brakerBrand = bike.braker?.name || 'unknow';
```

还能用于方法调用：

```js
// Uncaught TypeError: bike.ride is not a function
bike.ride()
// ok
bike.ride?.()
```