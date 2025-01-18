---
title: + 取 Date 时间戳
date: 2024-01-16
categories: [frontend, pratical-javascript-tips]
---

#### + 取 Date 时间戳

```js
// 返回时间戳
+new Date(); // 1737048797311
```

加号运算符（+）在这里被用作一元运算符，它试图将紧跟其后的表达式转换成数字。当应用于 Date 对象时，这会调用 Date 对象的 .getTime() 方法，返回自1970年1月1日午夜（UTC时间）以来的毫秒数（即时间戳）。因此，+new Date(...) 实际上是获取给定日期的时间戳。

Date 对象默认返回值：

```js
// 返回一个基于系统本地时区和语言环境格式化的日期时间字符串
new Date(); // Fri Jan 17 2025 01:33:14 GMT+0800 (中国标准时间)

```

VitePress 官网示例中的一段代码，根据日期进行数据排序：

```js
rawData.sort((a, b) => {
  return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
})
```