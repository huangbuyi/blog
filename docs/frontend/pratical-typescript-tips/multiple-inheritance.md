---
title: 接口多重继承
date: 2024-10-09
---

#### 接口多重继承

类似 JS 或 TS 中 `class` 多重继承的写法，接口同样也能够使用多重继承，使用接口`interface`：

```ts
interface A extends B, C {
  foo: string;
}
```

类似的，可以用通过`type`达到相似的实现：

```ts
type A = B & C & {
  foo: string;
};
```