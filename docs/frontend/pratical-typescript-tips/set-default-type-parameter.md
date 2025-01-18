---
title: 设置泛型参数的默认类型
date: 2024-08-09
---

类似 JavaScript 或 TypeScript 中设置函数参数的默认值，在 TypeScript 中也可以设置泛型参数的默认类型。

```ts
interface BikeStore {
  // 未指定泛型情况下，默认使用 NewBike 类型作为 T 的类型。
  orderBike<T extends Bike = NewBike>(sku: string): T;
};
interface Bike {};
interface NewBike extends Bike {};
interface OldBike extends Bike {};

// 未指定泛型，返回 NewBike 类型
bikeStore.orderBike('');
// 指定泛型未 OldBike，返回 OldBike 类型
bikeStore.orderBike<OldBike>('');
```