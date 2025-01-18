---
title: 废弃标注提示
date: 2024-10-07
---


备注中将废弃的方法、属性等标记为`@deprecated`，编辑器会在其它引用处将其标记为废弃，这有利于团队协作和代码重构。

```ts
interface Bike {
  readonly brand: string;
  /**
   * @deprecated 替代为 brand
   */
  getBikeBrand(): string;
}

function sellBike(bike: Bike) {
  // 标记为废弃
  const b1 = bike.getBikeBrand();
  // ok
  const b2 = bike.brand;
}
```