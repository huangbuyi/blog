---
title: 抽象类创建纯静态的类
date: 2024-07-27
---

TypeScript 可以很方便地用抽象类创建一个工具类，其中只含静态方法或属性，且限制了第三方实例化类（抽象类不能直接实例化）。

```ts
abstract class Utils {
  static add(a, b) { return a + b }
}

Utils.add(1, 2) // ok
const utils = new Utils() // ts error
```