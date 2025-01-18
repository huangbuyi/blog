---
title: 数组的函数式方法的第二个参数
date: 2024-04-07
categories: [frontend, pratical-javascript-tips]
---

## 数组的函数式方法的第二个参数

数组数据机构中存在一些方法，它们以函数作为参数，像`map`、`forEach`、`every`、`find`、`some`、`filter`等，它们可以传入第二个参数指定函数的执行环境。

作为参数传入的函数，如果不是箭头函数或绑定环境的情况下，其中`this`将指向全局变量（非严格环境）或`undefined`（严格环境），有时候我们希望它指向定义函数的环境，这时候就可以传入第二个参数。

一些情况下，比如将方法作为参数传入，方法中还需要访问`this`时特别好用：

```js
class Orders {
  fetchOrders() {
    const data = [{ id: 0, status: 0 }]
    return data.map(this.formatOrder, this)

    // return data.map(this.formatOrder)
    // Uncaught TypeError: Cannot read properties of undefined (reading 'formatStatus')
  }
  
  formatOrder(item) {
    return {
      id: item.id,
      status: this.formatStatus(item.status)
    }
  }

  formatStatus(status) {
    return status === 0 ? 'pending' : 'done'
  }
}
```