---
title: Vue2 和 Vue3 性能比较小实验
date: 2023-02-21
cover: /images/kVDuBtIDf7pE22n36-0DXNlzSD0NgD6TJfPTJYbFTro.png
---

分别使用 Vue2 和 Vue3 创建一个组件，用一个对象数组作为组件的状态，以它的长度作为变量，考察 Vue2 和 Vue3 性能。

## 内存占用
|数组长度|Vue2|Vue3|
| ----- | ----- | ----- |
|1|10.2 MB|11.1 MB|
|10 000|17.9 MB|12.1 MB|
|100 000|67.4 MB|14.4 MB|
|1 000 000|568 MB|36.0 MB|

## 初始化时间
|数组长度|Vue2|Vue3|
| ----- | ----- | ----- |
|1|7.2 ms|7.8 ms|
|10 000|110 ms|6.9 ms|
|100 000|803 ms|6.7 ms|
|1 000 000|2282 ms|7.0 ms|

## 测试代码
### Vue2
```typescript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
</head>
<body>
  <div id="app">{{ message }}</div>

  <script>
    const len = 1000000
    const arr = new Array(len)
    for (let i = 0; i < len; i++) {
      arr[i] = { id: i, name: 'test' }
    }
    
    console.time('vue2:')
    new Vue({
      el: '#app',
      data() {
        return {
          message: 'Hello Vue!',
          arr
        }
      },
      created() {
        console.timeEnd('vue2:')
      }
    })
  </script>
</body>
</html>
```
### Vue3
```typescript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">{{ message }}</div>

  <script>
    const { createApp } = Vue

    const len = 1000000
    const arr = new Array(len)
    for (let i = 0; i < len; i++) {
      arr[i] = { id: i, name: 'test' }
    }

    console.time('vue3:')
    createApp({
      data() {
        return {
          message: 'Hello Vue!',
          arr
        }
      },
      created() {
        console.timeEnd('vue3:')
      }
    }).mount('#app')
  </script>
</body>
</html>
```
## 推测
Vue2 使用`Object.defineProperty()`创建响应式属性，初始化时，除了遍历`props`和`data`的每个属性，还会深度遍历子对象和子数组，重新定义它们的属性，并创建如`Observer`和`Dep`实例，来观察属性变化，并且`Object.defineProperty()`重写的`get`和`set`方法也是挂载在实例上。深度遍历加上创建这些实例的花销远大于原始对象，于是，可以看到 Vue2 无论是内存，还是初始化时间随着数组长度增加猛涨，和 Vue3 产生了明显的差距。

当数组长度到达 100 万，Vue3 内存仅增加 25 MB，但 Vue2 内存暴增了 500+ MB，这些多出来的内存便是创建这些实例产生的额外开销。观察Vue2内存结构，发现Vue2创建了 100 万个`Observer`实例，相当于每个对象一个（另外三个`Observer`实例分别用于观察组件`props`、`data`和数组本身）。每个对象有两个属性，相应创建 200 万个`Dep`实例，100 万个`Observer`实例相应创建了100 万个`Dep`实例，共创建超过 300 万个`Dep`实例。

![image](/images/kVDuBtIDf7pE22n36-0DXNlzSD0NgD6TJfPTJYbFTro.png)

初始化时间来看，Vue3 几乎不受数组长度影响，而 Vue2 则随数组长度明显变长。这是因为 Vue3 使用`Proxy`类实现响应式，系统会代理响应式对象的操作，如组件的`props`和`data`，包括属性读取、赋值等，不会进行深度遍历。当读取响应式对象的属性时，才会创建`Dep`实例，如果读取的属性值也是对象时，再将这个对象响应式化，可以说 Vue3 是“懒”响应式。因此，初始化过程中 Vue3 运行时间几乎不变，如果不去操作这些属性，也几乎不会有太多内存消耗。

## 列表渲染
分别使用 Vue2 和 Vue3 渲染 50000 个元素：

```typescript
<ul>
  <li v-for="item in arr">{{ item.id }}</li>  
</ul>
```
可以看出，无论是内存占用或渲染完成时间，Vue3 更占优势：

| |Vue2|Vue3|
| ----- | ----- | ----- |
|内存|124 MB|53.1 MB|
|渲染完成时间|862ms|284 ms|

