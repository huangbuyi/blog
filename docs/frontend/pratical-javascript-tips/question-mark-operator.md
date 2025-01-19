---
title: JS 中问号（?） 号其它用法
date: 2023-03-07
---

- **??**：算符左侧值为 undefined 或 null 时，返回右侧的值，否则
- **?.**：用作链式引用，如果左侧的值为 undefined 或 null，一般链式引用会报错，而问号+逗号的用法则不会报错，中断执行并返回 undefined

常见用法：

```javascript
const client = { name: 'ZhangSan', cat: { name: 'Kitty' } }
// 设置默认值
const gender = client.gender ?? 'Unknow' // 'Unknow'

// 属性不一定存在时，可以简化链式调用，比三元运算符?:，或者if else写法更简单
const cat = client.cat?.name // 'Kitty'
const dog = client.dog?.name // undefined
// 还可以重复链式调用
const dogChildName = client?.dog?.child?.name // undefined

// 组合使用，当读取值为undefined或null时，使用默认值
const father = client.father?.name ?? 'Unknow'
```
注意，区别于三目运算或 if else，?? 左侧为空字符串或 0 等“空”值时，返回仍然是左侧的值。

```javascript
'' ? 1 : 2 // 2
'' ?? 1 // ''
0 ? 1 : 2 // 2
0 ?? 1 // 0
```