---
title: 使用 as 来避免编译器报错
date: 2020-09-17
---

JavaScript 本身语法非常灵活，可是一些很方便的语法在 JavaScript 中是合法的，到了 TypeScript 中会报错。灵活地使用`as`可以避免报错，省去修改数据结构的麻烦事。

比如在下面代码中，`bike.brake`有可能是字符串，也有可能是对象。用`bike.brake.name || bike.brake`的方式可以很轻松的得到`brakeName`，但 TypeScript 编译器会报错。可以确定只要类型正确，这句代码就不会有问题，这里使用`as`来绕过编译器报错。

``

```ts
interface Bike {
  brake: string | { name: string }
}
const bike: Bike = { brake: 'Shimano' };
// ts error 
const brakeName = bike.brake.name || bike.brake;
// ok
const brakeName = (bike.brake as { name: string }).name || bike.brake;
```

`as`虽很好，但切勿滥用。