---
title: JavaScript 中 Object.defineProperty 的用法
date: 2019/3/15 00:00:00
---

在 JavaScript 中，常通过下面方式，添加或修改对象的属性：

```
obj.name = 'John'
```

除此之外，还能通过 `Object.defineProperty()` 方法，添加或修改对象的属性。更重要的是，除了目标对象 obj，属性名称 prop 外，方法能传入属性描述符 descriptor，以实现更复杂的性质。属性描述符是一个对象，有两种形式：一种是**数据描述符**，另一种是**存取描述符**。

```
Object.defineProperty(obj, prop, descriptor)
```

## 数据描述符

数据描述符支持以下特性：

- **enumerable**：表示对象是否可以被枚举。默认为 false，表示不能被枚举，`for...in` 和 `Object.keys()`中无法枚举该属性，对`JSON.stringify()`也有影响。
- **configurable**：表示对象属性是否可以被删除，以及除`value`和`writable`特性外的其它特性能否被修改。默认为 false，表示属性不能删除，特性不能修改。
- **value**：属性对应的值，默认为 undefined。
- **writable**：默认为 false，表示只读，无法给该属性赋值。在严格模式中，给只读属性赋值会报错。宽松模式中，给只读属性赋值不会生效。


```
// 示例1，等同于 obj.name = 'John'
var obj = {}
Object.defineProperty(obj, 'name', { 
  value: 'John',
  writable: true,
  configerable: true,
  enumerable: true
})

// 示例2，将 name 属性设置为只读
'use strict'
var obj = {}
Object.defineProperty(obj, 'name', {
  value: 'John',
  writable: false,
  configerable: true,
  enumerable: true
})
obj.name = 'Joy'  // TypeError

// 示例3，将 name 属性设置为不可枚举
var obj = {}
Object.defineProperty(obj, 'name', { 
  value: 'John',
  writable: true,
  configerable: true,
  enumerable: false
})
console.log(obj.name)  // John
console.log(Object.keys(obj))  // []

// 示例4，将 name 属性设置不可配置(不可删除，除value和writable特性外的其它特性不可被修改)
var obj = {}
Object.defineProperty(obj, 'name', { 
  value: 'John',
  writable: true,
  configerable: false,
  enumerable: true
})
delete obj.name  // false
Object.defineProperty(obj, 'name', { enumerable: false })  // TypeError
```

## 存储描述符

存储描述符支持以下特性：

- **enumerable**：同上。
- **configurable**：同上。
- **set**：设置 setter 方法，当修改属性时，会执行该方法，新属性值作为参数。默认值为 undefined。
- **get**：设置 getter 方法，当访问属性时，会执行该方法。默认值为 undefined。

```
// 示例5，使用 get 和 set，计数属性读写的次数
var obj = {}, name = '', count1 = 0, count2 = 0
Object.defineProperty(obj, 'name', { 
  get: function () { 
    console.log('Read ' + (++count1) + ' times')
    return name
  },
  set: function (newVal) {
    console.log('Write ' + (++count2) + ' times')
    name = newVal
  }
})
obj.name  // Read 1 times
obj['name']  // Read 2 times
obj.name = 'Joy'  // Write 1 times
obj.name = 'Jack'  // Write 2 times
```

## 注意事项

另外要注意三点，一是两种描述符不同的属性不能共用；二是添加属性时，未传入的特性会被设置成默认值，而修改特性时，未传入的特性维持原样；三是如下：

```
Object.defineProperty(obj, 'name', { value: 'John' })
// 属性是只读，不可配置，且不可枚举的。等同于
Object.defineProperty(obj, 'name', { 
  value: 'John',
  writable: false,
  configerable: false,
  enumerable: false
})

obj.name = 'John'
// 属性可写的，可配置的，可枚举的。等同于
Object.defineProperty(obj, 'name', { 
  value: 'John',
  writable: true,
  configerable: true,
  enumerable: true
})
```

## 实际应用

例如有一个对象 `Student`，具有 name 和 age 两个属性，如果不希望将年龄被设置的太大或太小，该怎么做？我们可以添加一个 setter 和 getter 方法，每次要修改 age 时，通过 setter 方法来修改属性，通过 getter 方法读取属性：

```
function Student (name, age) {
  this.name = name
  this.setAge = function (val) { 
    age = val
    if (age < 0) age = 0
    if (age > 100) age = 100
  }
  this.getAge = function () { return age }
}

var s = new Student('John', 16)
s.setAge(25)
console.log(s.getAge())  // 25
s.setAge(-5)
console.log(s.getAge())  // 0
s.setAge(500)
console.log(s.getAge())  // 100
```

看似很美好，但每次读取或修改属性都有调用一次 setter 或 getter 方法，徒增了很多代码。使用 `Object.defineProperty`方法，不需要多余的代码，直接用最原始的方式读取和修改属性：

```
function Student (name, age) {
  this.name = name
  var _age = age
  Object.defineProperty(this, 'age', {
    get: function () { return _age },
    set: function (val) {
      _age = val
      if (_age < 0) _age = 0
      if (_age > 100) _age = 100
    }
  })
}

var s = new Student('John', 16)
s.age = 25
console.log(s.age)  // 25
s.age = -5
console.log(s.age)  // 0
s.age = 500
console.log(s.age)  // 100
```

## 批量处理

`Object.defineProperties()`方法可以批量添加或修改属性：
```
var obj = {}
Object.defineProperties(obj, {
  name: { value: 'John', emunerable: true },
  age: { value: 20, emunerable: true }
})
```

`Object.create()`方法可以在创建对象时，批量添加属性：
```
var obj = Object.create(Object.prototype, {
  name: { value: 'John', emunerable: true },
  age: { value: 20, emunerable: true } 
})
```

还可以通过字面量方式，创建包含 setter 和 getter 属性的对象：
```
var obj = {
  get name() {
    return 'John'
  },
  set name(val) {
    console.log(val)
  },
  get age() {
    return 18
  }
}
```

## 参考

- [MDN Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- 《深入理解 JavaScript》

