
ES6 引入了两个新关键字：let 和 const。用于声明变量，声明的变量具有块作用域。块作用域是 JavaScript 的第三种作用域类型，ES6 之前只有两种类型：全局作用域和函数作用域。

全局 var 声明的变量具有全局作用域，函数中 var 声明的变量具有函数作用局，用 let 和 const 声明的变量是块作用域，变量仅在大括号`{}`内的范围有效。

# var

## 作用域

用 var 声明的变量，作用域在当前的执行上下文(函数作用域内)，或所有函数外(全局作用域)

```
var x = 1  // 全局作用域
function foo () {
  var x = 2  // 函数作用域
  console.log(x)
}
console.log(x)  // 1
foo()  // 2
```

## 变量提升

用 var 声明变量，存在变量提升的行为，即无论在作用域那个位置声明的，都看做是在函数或全局开头声明了变量：

```
console.log(x)  // undefined
console.log(y)  // ReferenceError
var x = 1

// 等同于
var x
console.log(x)
console.log(y)
x = 1
```

## 重复声明

重复声明变量，并不会改变变量的值：

```
var x = 1
var x
console.log(x)  // 1
```

## var 最佳实践

1. 始终声明变量。无论在全局作用域，还是函数作用域，给未声明的变量赋值，会隐隐式地被创建为全局变量，污染全局命名空间：

```
function foo () {
  x = 1
}
foo()
console.log(x)  // 1
```

2. 在作用域开头声明变量。因为存在变量提升，所以在何处声明变量都是一样的，提前声明可以清楚知道哪些变量属于本地作用域，也能够避免声明的变量必定是 undefined 的误解：

```
let x = 1
let x = 2  // SyntaxError

var x = 1
if (ture) {
  var x = 2
}
console.log(x)  // 2


var a = function () {
  console.log(b)
}
var b = 1

var a = function () {
  console.log(b)
}
let b = 1


let x = 1
if (true) {
  let x = 2
}
console.log(x)  // 1

for (var i = 0; i < 3; i++) {}
console.log(i)  // 3

for (let i = 0; i < 3; i++) {}
console.log(i)  // undefined
```


```
for (var i = 0; i < 3; i++) {
  setTimeout(function () { 
    console.log(i) 
  })
}
// 3 3 3

for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i)
  })
}
// 0 1 2
```