---
title: JavaScript 中 call、apply、bind 用法和区别
date: 2019/3/19 00:00:00
categories:
- JavaScript
tags:
- JavaScript
- NodeJS
---

JavaScript 中 call、apply、bind 用法和区别

# 简介

JavaScript 中有三个方法`Function.prototype.call()`、`Function.prototype.apply()`和`Function.prototype.bind()`可以用来指定函数 this 值。`call()` 和 `apply()` 类似，都是**调用**函数，并指定函数的 this 值`thisArg`和参数，区别在于`call()`传入参数是通过参数列表的形式`arg1, arg2, ...`，`apply()`传入参数是通过数组的形式`[arg1, arg2, ...]`：

```
function.call(thisArg, arg1, arg2, ...)
function.apply(thisArg, [arg1, arg2, ...])
```

`bind()`方法与前两个不同，它**创建**一个新的函数，在调用新函数时，会调用原函数，并指定原函数的 this 值和参数。`bind()` 执行的时候并没有调用函数。`bind()`传入参数的方式和`call()`一样，都是用参数列表：
```
fucntion.bind(thisArg, arg1, arg2, ...)
```

# 用法

## call()

使用`call()`调用父类构造函数来实现继承，也可以用`apply()`，只不过传参方式略有区别：

```
// 使用 call 实现继承
var Pet = function (name, age) {
  this.name = name
  this.age = age
}
var Cat = function (name, age, color) {
  Pet.call(this, name, age)
  this.color = color
}
var cat = new Cat('Garfield', 1, 'orange')
console.log(cat.name)  // Garfield
console.log(cat.age)  // 1
console.log(cat.color)  // orange

// 使用 apply 实现继承：
var Dog = function (name, age, size) {
  Pet.apply(this, [name, age])
  this.size = size
}
```

当调用一个对象的方法时，方法中 this 指向的是对象本身，用`call()`改变方法的 this 值：

```
var utils = {
  setName: function (name) {
    this.name = name
  }
}
// 使用 call 指定 setName 中的 this 指向自己
var Person = function (name) {
  utils.setName.call(this, name)
}
var p = new Person('John')
console.log(p.name)  // 'John'
```

## apply()

`apply()`方法除了用来指定函数 this 值，还可以用来传递参数。例如，`Math.max()`允许传入多个参数，求它们的最大值，可以用`apply()`方法将数组元素作为参数传递给`Math.max()`方法：

```
// 使用循环求最大值
var numbers = [1, 0, 0, 8, 6], max = -Infinity
for (var i = 0; i < numbers.length; i++) {
  max = Math.max(numbers[i], max)
}

// 使用 apply 求最大值，代码更简洁
var numbers = [1, 0, 0, 8, 6]
max = Math.max.apply(null, numbers)

// 使用 apply 给数组添加元素
var numbers = [1, 0, 0, 8, 6], arr = []
arr.push.apply(arr, numbers)
```

另外，因为 JS 引擎有参数长度的限制，如果参数数组太长，可能会造成程序异常。所以，对于超长参数数组，应切分成更小的尺寸，分多次调用该方法。


## bind()

在给`setTimeout`和`setInterval`传入函数时，函数中 this 指向的是全局 window 对象。使用`bind()`方法，重新指定 this 值：

```
var Person = function (name) {
  this.name = name
}
Person.prototype.say = function () {
  setTimeout(function () {
    console.log('My name is ' + this.name)
  }.bind(this))
}
var p = new Person('John')
p.say()  // My name is John
```

在给 Dom 对象添加监听函数时，监听函数作为 Dom 对象的一个方法，函数中 this 指向的是 Dom 对象。使用`bind()`方法，重新指定 this 值，使用箭头函数也可以达到同样的效果：

```
var fakeDom = { a: 'fakeDom' }
var addEvent = function () {
  this.a = 'addEvent'
  fakeDom.onClick = function () {
    console.log(this.a)
  }
  fakeDom.onClickBind = function () {
    console.log(this.a)
  }.bind(this)
  fakeDom.onClickArrow = () => {
    console.log(this.a)
  }
}
addEvent()
fakeDom.onClick()  // 'fakeDom'
fakeDom.onClickBind()  // 'addEvent'
fakeDom.onClickArrow()  // 'addEvent'
```

使用`bind()`绑定参数后，新函数只需要传入剩余参数：

```
var add = function (a, b) {
  return a + b
}
var add5 = add.bind(null, 5)
console.log(add5(3))  // 8
```