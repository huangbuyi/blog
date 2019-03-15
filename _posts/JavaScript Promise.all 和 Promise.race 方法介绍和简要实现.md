---
title: JavaScript Promise.all 和 Promise.race 方法介绍和简要实现
date: 2019/3/12 00:00:00
---

`Promise.all()` 方法接受一个包含 Promise 对象或普通值的数组(或其它可迭代对象)作为参数，并返回一个 Promise。当所有 Promise 对象都 resolve 后，将所有 resolve 值以数组形式作为 `Promise.all()` resolve 的结果。如果其中之一的 Promise 被 reject，立即以第一个 reject 的值作为 `Promise.all()` reject 结果。

在实际应用中，如果需要从几个接口获取数据，并且要在所有数据到达后才执行某些操作，就可以使用`Promise.all()`。

```
const p1 = new Promise(function (resolve) { setTimeout(resolve, 200, 1) })
const p2 = Promise.resolve(2)
const p3 = 3
Promise.all([p1, p2, p3]).then(function (res) { console.log(res) }) // [1,2,3]
```

以下是代码实现，需要一个计数器，来确认所有 promise 对象都已经 resolved，之后返回结果。需要一个数组，按顺序记录返回结果。如果使用类似 `for (var i = 0; i < iterable[i]; i++)` 的方式遍历，为避免闭包只能传入变量引用的问题，需要嵌套一层自执行函数。这里使用 `for ... in` 循环，使函数可以支持除数组外的其它可迭代对象，如数据结构 Set。

```
const all = function (iterable) {
  return new Promise(function (resolve, reject) {
    let count = 0, ans = new Array(count)
    for (const i in iterable) {
      const v = iterable[i]
      if (typeof v === 'object' && typeof v.then === 'function') {
        v.then(function (res) {
          ans[i] = res
          if (--count === 0) resolve(ans)
        }, reject)
        count++
      } else {
        ans[i] = v
      }
    }
  })
}

const p1 = new Promise(function (resolve) { setTimeout(resolve, 200, 1) })
const p2 = Promise.resolve(2)
const p3 = 3
all([p1, p2, p3]).then(function (res) { console.log(res) }) // [1,2,3]
```

同 `Promise.all()`，`Promise.race()` 方法接受一个包含 Promise 对象或普通值的数组(或其它可迭代对象)作为参数，并返回一个 Promise。一旦其中之一的 Promise 对象 resolve 以后，立即把 resolve 的值作为 `Promise.race()` resolve 的结果。如果其中之一的对象 reject，`Promise.race`也会立即 reject。

在实际应用中，如果可以从几个接口获取相同的数据，哪个接口数据先到就先用哪个，就可以使用`Promise.race()`，所需时间等于其中最快的那个接口。下面是代码：

```
const race = function (iterable) {
  return new Promise(function (resolve, reject) {
    for (const i in iterable) {
      const v = iterable[i]
      if (typeof v === 'object' && typeof v.then === 'function') {
        v.then(resolve, reject)
      } else {
        resolve(v)
      }
    }
  })
}

const p1 = new Promise(function (resolve) { setTimeout(resolve, 200, 1) })
const p2 = new Promise(function (resolve) { setTimeout(resolve, 100, 2) })
race([p1, p2]).then(function (res) { console.log(res) }) // 2
```